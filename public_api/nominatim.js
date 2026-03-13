import fetch from 'node-fetch'


export class Nominatim {

	constructor(restrictions, referer){

		this.defaultRestrictions = {
			city: undefined,					// Requests for different cities will be denied. Ignored if undefined.
			country :'Germany',					// Will be added to every search
			state: ['Berlin', 'Brandenburg']	// Will make a specific request for every state. Ignored if undefined.
		}

		this.lastRequest	= 	Date.now()-1500 // for throttling requests; at most one request per second

		this.restrictions 	= 	{
									...this.defaultRestrictions,
									restrictions
								}	

		if(!referer) throw new Error("Nominatim.constructor: missing referer.")

		this.referer		= 	referer						



		if(!this.restrictions.state) 		throw new Error("missing state restrictions")
		if(!this.restrictions.state.length) throw new Error("missing state restrictions")

		if(!this.restrictions.country) 		throw new Error("missing country restrictions")

	}


	// check if a request is within the restrictions
	async validateRequest(request){
		// if(!request.city) 			throw new Error("missing city")
		// if(!request.street) 		throw new Error("missing street")
		if(!request.postalcode) 	throw new Error("missing postalcode")
		if(this.restrictions.city && !this.restrictions.citytoUpperCase != request.city.toUpperCase() ) throw new Error("city restrictions unmet")
	}

	async nominatimRequest(params){

		const now			= Date.now()


		if(now-this.lastRequest < 1000){
			await new Promise( resolve => setTimeout(resolve, 1501) )
			return await this.nominatimRequest(params)
		}

		this.lastRequest 	= now	


		const base 			= 'https://nominatim.openstreetmap.org/search'
		const url			= `${base}?${params}`
		const headers		= {Referer: this.referer}

		const response	= await fetch(url, {headers})

		try {
			return response.json()	
		} catch(cause) {			
			console.log("Nominatim response:", reponse)
			throw new Error("Unable to read Nominatim response. Params:" +JSON.stringify(params), {cause}) 
		}

		
	}

	async getCoordinates(query){
		if("street" 	in query)	return await this.getCoordinatesFromAddress(query)
		if("postalcode" in query)	return await this.getCoordinatesFromPostalCode(query)

		throw Error("bad request")
	}

	async getCoordinatesFromAddress(query, state = undefined){


		await this.validateRequest(query)

		const fullQuery		=	{
									city: 			query.city,
									postalcode:		query.postalcode,
									street:			query.street,
									country:		this.restrictions.country,
									format:			'jsonv2',
									addressdetails:	1
								}

		const searchResults = 	(this.restrictions.state || [undefined]).map( async state => {

									const params = new URLSearchParams({...fullQuery, state})

									console.log({params})						

									return await this.nominatimRequest(params)
									
								})

		const data 			= 	await Promise.all(searchResults)

		const results 		= 	data.flat()
								.filter( result => result.address.postcode == query.postalcode) 
								.map( ({lat, lon, display_name }) => ({lat,lon, display_name}))

		return results
	}

	async getCoordinatesFromPostalCode(query){		

		const fullQuery			=	{
										postalcode: query.postalcode,
										country:	this.restrictions.country,
										format: 	"jsonv2",
									}
		
		const params 		= new URLSearchParams(fullQuery)

		const [result] 		= await this.nominatimRequest(params)


		const { lat, lon, display_name } = result


		return { lat, lon, display_name }
	}

}
