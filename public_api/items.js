import	sanitizeHtml 				from 'sanitize-html'
import	icUtils						from '../ic-utils.js'

const { mailToAdmin }	=	icUtils


export class ItemImporter {

	constructor({db, publicApiConfig, translator, locator, itemConfig}){
		this.db 				= db
		this.publicApiConfig 	= publicApiConfig
		this.translator			= translator
		this.locator			= locator
		this.itemConfig			= itemConfig
	}


	get localItems(){
		return this.db.collection('items')
	}

	get remoteMeta(){
		return this.db.collection('remote-meta')
	}


	wrapResult(key, status, message, items = []){
		return {key, status, message, items}
	}


	wrapSuccess(key){
		return	items	=> this.wrapResult(key, 'ok', null, items)
	}


	wrapFailure(key){
		return	reason	=> {
					console.error(reason)
					return this.wrapResult(key, 'failed', String(reason), [])
				}
	}


	async getLocalItems(){

		const items = 	await 	this.localItems
								.find({
									state:'public',
									proposalFor:null,
								})
								.toArray()
		
		// START: this is just to get an overview of how many tags are used:

		var tags 	= new Set()
		var re		= /<([a-zA-Z\-]+)/gi

		items.forEach( item => {
			
			var m;

			for(var key in item.description){
				do {
					m = re.exec(item.description[key]);
					if (m) {
						tags.add(m[1].toUpperCase())
					}
				} while (m)
			}
				
		})

		console.log('HTML tags in item properties: ')
		console.log(Array.from(tags).join(', '))

		//END




		return 	items.map( ({_id, ...item}) => ({
					...item,
					id: _id						
				}))			
	}

	sanatizeProperty(property){

		if(typeof property == 'object' && !Array.isArray(property)){

			const result = {}

			Object.entries(property).forEach( ([key, value]) => { result[key] =  this.sanatizeProperty(value) })

			return result
		}

		if(typeof property != 'string') return property

		return	sanitizeHtml(property, {
					allowedTags: ['p', 'em', 'strong', 'br', 'ul', 'ol', 'li', 'b', 'i'],
					allowedAttributes: {}
				}).replace('&amp;', '&') 

		 
	}

	getFinalId(preliminary_id, key, index){
		return 	preliminary_id
				?	'r-'+key+'_'+preliminary_id
				:	'r-'+key+'_'+Date.now()+index+Math.random()
	}

	async invokeImportScript(key, force_update_items){

		console.log("Public item config for:", key, this.publicApiConfig.remoteItems[key])

		const config			=	this.publicApiConfig.remoteItems[key]
		const importModule 		= 	await import(`./import/${config.script}`)
		const remoteVersion		= 	await importModule.getRemoteVersion(config)
		const localVersion		= 	await this.remoteMeta.findOne({ key }).then( doc => doc && doc.version )
		const noUpdateNeeded	=	!force_update_items && localVersion === remoteVersion


		if(noUpdateNeeded) return await this.db.collection(`remote-items-${key}`).find().toArray()

		console.log('\n')

		if(force_update_items) console.log('Update forced:')

		console.log('Update needed for ', key)	


		const items				= 	await importModule.getRemoteItems(config, this.translator)

		const id_tracks			=	{}

		const extendedItems		=	items.map( (item, index) => {

										this.itemConfig.properties.forEach( property => {
											let buf = this.sanatizeProperty(item[property.name]) || null
											if( buf !== null || item[property.name] !== undefined ) item[property.name] = buf
										})	

										const preliminary_id = item.id 

										item.id = this.getFinalId(preliminary_id, key, index)

										id_tracks[preliminary_id] = item.id

										item.state = 'public'

										item.remoteItem = 	{
																...item.remoteItem,
																key,
																...config
															}

										return item

									})
									.filter( item => !!item)


		const projectedItems	=	extendedItems.map( (item, index) => {
										if(item.location_ref){
											item.location_ref = id_tracks[item.location_ref]
										}
										return item
									})							
		
		await this.db.collection(`remote-items-${key}`).drop().catch( error => error.code == 26 ? Promise.resolve : Promise.reject(error)) //ignore error if collection does not yet exists
		
		if(projectedItems.length > 0) await this.db.collection(`remote-items-${key}`).insertMany(projectedItems)

		this.remoteMeta.updateOne({ key }, {$set: { version: remoteVersion } }, { upsert: true })									

		return projectedItems
	}


	mergeResults(results){

		return 	{
					results: 	results
								.map( ({items, ...meta }) => meta.results || meta )
								.flat(),

					items:		results.map( ({items}) => items || [])
								.flat()
				}
	}

	async translateItem(item, key){

		const { baseLanguage, targetLanguages } = this.publicApiConfig.remoteItems[key]

		if(!baseLanguage) 		return item
		if(!targetLanguages)	return item

		return await this.translator.translateItem(item, baseLanguage, targetLanguages, key)
	}

	async translateItems(items, key){
		return await Promise.all(  items.map( item => this.translateItem(item, key) ) ) 
	}

	async locateItem(item, key){
		return await this.locator.locateItem(item, key)
	}

	async locateItems(items, key){

		// Locate as many items as possible until timeout.

		const timeout		= 8 * 1000
		const start			= Date.now()

		const errors		= []

		await items.reduce( (last, item, index) => {


			return last.then( () => {

				const now = Date.now()

				if(now-start > timeout) return null

				return this.locateItem(item, key).catch( e => errors.push(e) )

			})


		}, Promise.resolve())
		
		if(errors.length){

			const messages 			= errors.map(e => e.message)
			const uniqueMessages 	= Array.from ( new Set(messages) )
			const combinded			= uniqueMessages.join('\n')

			console.log(combinded)
			mailToAdmin(combinded)
		}
	
		return items	
	}

	async getRemoteItems(force_update_items){

		const remoteItemsConfig = this.publicApiConfig.remoteItems		

		if(!remoteItemsConfig) return this.wrapResult('unknown', 'failed', 'missing remote item config', [])



		const results	= 	await	Promise.all(
										Object.entries(remoteItemsConfig)
										.map( 
											([key, config]) =>	this.invokeImportScript(key, force_update_items) 
																.then( items => this.translateItems(items, key) )
																.then( items => this.locateItems(items, key) )
																.then( this.wrapSuccess(key) )
																.catch( this.wrapFailure(key) )
										)				
									)		


		return this.mergeResults(results)
	}

	async getItems(force_update_items){

		const results	=  	await	Promise.all([
										this.getLocalItems()
										.then(
											this.wrapSuccess('local'),
											this.wrapFailure('local')
										),
										this.getRemoteItems(force_update_items)
									])
				
		return this.mergeResults(results)

	}

}