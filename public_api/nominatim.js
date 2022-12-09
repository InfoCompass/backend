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
		if(!request.city) 			throw new Error("missing city")
		if(!request.street) 		throw new Error("missing street")
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

		return response.json()
	}

	async getCoordinates(request, state = undefined){


		await this.validateRequest(request)

		const queries 		=	{
									city: 			request.city,
									postalcode:		request.postalcode,
									street:			request.street,
									country:		this.restrictions.country,
									format:			'json',
									addressdetails:	1
								}

		const searchResults = 	(this.restrictions.state || [undefined]).map( async state => {

									const params = new URLSearchParams({...queries, state})

									return await this.nominatimRequest(params)
									
								})

		const data 		= 	await Promise.all(searchResults)
		const results 	= 	data.flat()
							.filter( result => result.address.postcode == request.postalcode) 
							.map( ({lat, lon, display_name }) => ({lat,lon, display_name}))

		return results
	}

}
