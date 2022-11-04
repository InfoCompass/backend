import fetch from 'node-fetch'

export class Nominatim {

	constructor(restrictions){

		this.defaultRestrictions = {
			city: undefined,					// Requests for different cities will be denied. Ignored if undefined.
			country :'Germany',					// Will be added to every search
			state: ['Berlin', 'Brandenburg']	// Will make a specific request for every state. Ignored if undefined.
		}

		this.restrictions = {
								...this.defaultRestrictions,
								restrictions
							}	

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

	async getCoordinates(request){

		console.log('RQUEST NOMINATIM', request)

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
									const base 		= 'https://nominatim.openstreetmap.org/search'
									const params 	= new URLSearchParams({...queries, state})
									const url		= `${base}?${params}`

									console.log(url)

									const response	= await fetch(url)
									

									if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

									return response.json()
								})

		const data 		= await Promise.all(searchResults)
		const results 	= data.flat().filter( result => result.address.postcode == request.postalcode) 

		console.log(results)

		return results
	}

}
