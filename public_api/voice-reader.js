import 	mongodb 			from 'mongodb'
import	fetch				from 'node-fetch'
import	MarkdownIt			from 'markdown-it'


const { ObjectId } = mongodb

const md = new MarkdownIt()

export class VoiceReader {


	constructor({db, voiceReaderConfig, itemConfig}){

		if(!voiceReaderConfig)  					throw 'VoiceReader.constructor: missing voiceReaderConfig'
		if(!voiceReaderConfig.properties) 			throw 'VoiceReader.constructor: missing voiceReaderConfig.properties'	
		if(!voiceReaderConfig.properties.length) 	throw 'VoiceReader.constructor: voiceReaderConfig.properties must not be empty'	

		if(!voiceReaderConfig.baseUrl)				throw 'VoiceReader.constructor: missing voiceReaderConfig.baseUrl'

		this.db 				= db
		this.voiceReaderConfig 	= voiceReaderConfig
		this.itemConfig			= itemConfig


		this.voiceReaderConfig.properties = this.voiceReaderConfig.properties || ['description']



	}


	async getAudio(toReadUrl, lang){

		// check if content is available:

		const contentUrl = this.voiceReaderConfig.baseUrl+toReadUrl


		const content_response 	= await fetch(contentUrl)
		const text				= await content_response.text()

		if(!content_response.ok) 	throw `VoiceReader.getAudio() ${contentUrl}, status: ${content_response.status}.`
		if(!text) 					throw `VoiceReader.getAudio() ${contentUrl}, no content.`


		// content works, try read speaker:
	

		//LANG?? testen!!

		const customerId		= 	this.voiceReaderConfig.customerId

		const params			=	{
										lang: 			'de_de',
										url:			contentUrl,
										audioformat:	'mp3',
										customerid:		customerId,
										rsjs_ver:		'3.5.0_rev1632-wr',
										sync:			'wordsent',
										readclass:		'read-me'
									}
		const query_string		=	Object.entries(params)
									.map( ([key,value]) => `${key}=${encodeURI(value)}`)
									.join('&')
									


		const audio_url			= 	'http://app-eu.readspeaker.com/cgi-bin/rsent?'+query_string		
		const audio_response	= 	await fetch(audio_url)

		if(!audio_response.headers.get('content-type') ) 				throw "VoiceReader.getAudio() failed: "+audio_url+" "+(await audio_response.text() ) 
		if( audio_response.headers.get('content-type')!='audio/mpeg') 	throw "VoiceReader.getAudio() failed: "+audio_url+" "+(await audio_response.text() )

		return 	{	
					blob:		await audio_response.blob(),
					headers:	{
									'content-type': 'audio/mpeg',									
								}
				}

	}


	async getHtmlToRead(itemId, lang){


		const item =	await	this.db.collection('items')
								.findOne({_id: itemId})

		if(!item) throw `VoiceReader.getHtmlToRead() unable to find item: ${itemId}, ${lang}` 

		const text = 	this.itemConfig.properties.map( property => {

							if(!this.voiceReaderConfig.properties.includes(property.name) ) return null

							return 	property.translatable
									?	item[property.name][lang]
									:	item[property.name]
						})	
						.filter( x => !!x)				
						.join('\n\n')



		return	`<html><head></head><body class ="read-me"> \n${md.render(text)}\n</body></html>`


	}



}