// This module guesses geo locations for a given address. 
// It makes use of nominatim.js and adds caching. 

import	crypto							from 'crypto'	
import	{ Nominatim					}	from './nominatim.js'



export class Locator {
	constructor(
		db,
	){


		this.db 			= 	db
		this.requests		= 	{}
	}

	get collection(){
		return this.db.collection('geo-locations')
	}




	hash(address){

		const addressLine = `${address.street} ${address.postalcode} ${address.city}`

		const hash 	=  	crypto
						.createHash('md5')
						.update(addressLine)
						.digest('base64')

		return 	hash.length < addressLine.length
				? hash
				: addressLine
	}


	async requestGeoCoordinates(address){

		const addressLine = `${address.street} ${address.postalcode} ${address.city}`

		//const results 	= await this.nominatim.getCoordinates(address)

		const coords = {
			"Ahrenshooper Str. 5 13051 Berlin":							[52.5666053,		13.5045729],
			"Alt-Rudow 60 12355 Berlin":								[52.4175979,		13.4954824],
			"Am Borsigturm 6 13507 Berlin":								[52.58444859999990,	13.2873114],
			"Antonstr. 37 13347 Berlin":								[52.54734819999990,	13.3636193],
			"Auguste-Viktoria-Allee 99 13403 Berlin":					[52.5684249,		13.3281831],
			"Barbarossaplatz 5 10781 Berlin":							[52.49235119999990,	13.3497706],
			"Bat-Yam-Platz 1 12353 Berlin":								[52.4256906,		13.4627589],
			"Baumschulenstraße 79-81 12437 Berlin":						[52.4644728,		13.4852108],
			"Bizetstraße 27 13088 Berlin":								[52.5476253,		13.4520639],
			"Bizetstraße 41 13088 Berlin":								[52.54770300000000,	13.452539],
			"Bruchwitzstraße 37 12247 Berlin":							[52.4361117,		13.3505846],
			"Carl-Schurz-Str. 17 13597 Berlin":							[52.536362,			13.201728],
			"Dahmestraße 33 12526 Berlin":								[52.401623,			13.5708666],
			"Fasanerie 10 13469 Berlin":								[52.6079321,		13.3679417],
			"Frankfurter Allee 37 10247 Berlin":						[52.5155514,		13.4619704],
			"Goethestr. 9-11 (Lichterfelde) 12207 Berlin-Lichterfelde":	[52.4292125,		13.316115],
			"Heidenheimer Straße 53-55 13467 Berlin":					[52.6156367,		13.2988034],
			"Hermsdorfer Damm 146 13467 Berlin":						[52.6161451,		13.3013312],
			"John-F.-Kennedy-Platz 10825 Berlin":						[52.4847846,		13.3450119],
			"Karlsgartenstr. 6 12049 Berlin":							[52.4822073,		13.4225687],
			"Königshorster Str. 6 13439 Berlin":						[52.5981944,		13.3504892],
			"Lessingstraße 5-8 12169 Berlin":							[52.4559313,		13.3355507],
			"Linienstr. 162 10115 Berlin":								[52.5280144,		13.3961435],
			"Maratstraße 182 12683 Berlin":								[52.53212670000000,	13.5519297],
			"Mark-Twain-Str. 27 12627 Berlin":							[52.5360179,		13.6110379],
			"Michael Brückner-Straße 9 12439 Berlin":					[52.4540327,		13.5139523],
			"Onkel-Tom-Str. 14 14169 Berlin":							[52.4368793,		13.2572863],
			"Paul-Junius-Str. 71 10369 Berlin":							[52.5281514,		13.4779502],
			"Pestalozzistr. 40/41 10627 Berlin":						[52.5081326,		13.3034287],
			"Schulstraße 29 13187 Berlin":								[52.5688697,		13.4098093],
			"Singerstr. 87 10243 Berlin":								[52.5156522,		13.4303499],
			"Stargardtstraße 11-13 13407 Berlin":						[52.5658859,		13.3598157],
			"Steinstraße 41 12307 Berlin":								[52.38787860000000,	13.3972298],
			"Treskowstr. 26-31 13507 Berlin":							[52.58814539999990,	13.2829928],
			"Turmstr. 75 10551 Berlin":									[52.5263851,		13.3346884],
			"Wassersportallee 34 12527 Berlin":							[52.4157781,		13.5781411],
			"Mauerstr. 6 13597 Berlin":									[52.53553,			13.20227],
			"Prinzregentenstr. 33-34 10715 Berlin":						[52.48062,			13.33310],
			"Prenzlauer Allee 227 10405 Berlin":						[52.53332,			13.42024],
			"Hermannstr. 158 A (Eingang Arztpraxen) 12051 Berlin":		[51.324,			14.304],
			"Alt-Mariendorf 43 (Hofeingang) 12107 Berlin":				[52.43957,			13.38548],
			"Nehringstraße 8 14059 Berlin":								[52.51518,			13.29394],
			"Ella-Barowsky-Str. 62, 10829 Berlin 10829 Berlin":			[52.47840,			13.35747],
			"Geßlerstraße 11 10829 Berlin":								[52.48623,			13.36771],
			"Hönower Str. 30a 10318 Berlin":							[52.48983,			13.52172],
			"Bruno-Wille-Str. 37-45 12587 Berlin":						[52.4511,			13.6326],
			"Wendenschloßstr. 404 12557 Berlin":						[52.42088,			13.58722],
			"Fuchssteiner Weg 13 - 19, Hofeingang 13465 Berlin":		[52.63553,			13.29584],
			"Romain-Rolland-Straße 112 13089 Berlin":					[52.57202,			13.43791],
			"Martha-Arendsee-Str. 15 12681 Berlin":						[52.53668,			13.53880],
			"Wiltbergstraße 19-23 13125 Berlin":						[52.63590,			13.49405],
			"Belziger Straße 43-51 10823 Berlin":						[52.48551,			13.35034],
			"Edgarstraße 2 13053 Berlin":								[52.55405,			13.51883],
			"Barfussstraße 22-24 13349 Berlin":							[52.55847,			13.35288],
			"Friedenstraße 23-25 12107 Berlin":							[52.43899,			13.38462],
			"Barnetstraße 11 12305 Berlin":								[52.39436,			13.40584],
			"Nürnberger Straße 63 (durch Toreinfahrt) 10787 Berlin":	[52.50339,			13.34111],
			"Ringstraße 103-106 12105 Berlin":							[52.44719,			13.36497],
			"Murtzaner Ring 35-37 12681 Berlin":						[52.52971,			13.54247],
			"Hofeingang gegenüber Stolbergstr 5L 12103 Berlin":			[52.46527,			13.37995],
			"Mehringdamm 59 10961 Berlin":								[52.49091,			13.38728],
			"Mörikestraße 15 12437 Berlin":								[52.46501,			13.48417],
			"Markgrafenstr. 19-24 12105 Berlin":						[52.45005,			13.38183],
			"Alt-Hermsdorf 35 13467 Berlin":							[52.61546,			13.31868],
			"Brandenburgische Str. 51 10707 Berlin":					[52.49400,			13.30910]

		}

		// const firstHit 	= results[0]

		// if(!firstHit) throw new Error('Unable to find geo coordinates.')

		if(!coords[addressLine]) throw new Error(`Unable to find geo coordinates: ${addressLine}`)

		const latitude	= coords[addressLine][0]//firstHit.lat
		const longitude	= coords[addressLine][1]//firstHit.lon

		return {latitude, longitude}	
		
	}


	async getStoredGeoLocation(hash, key){

		const result = 	await 	this.collection
								.findOneAndUpdate(
									{ hash },
									{ 
										$set:		{ lastRequest: Date.now() }, 
										$addToSet:	{ tags: key } 
									},
									{ upsert:	false }
								)

		return result.value || undefined
	}




	async getNewGeoLocation(address, hash, key){

		console.log("Getting new coordinates for:", address)

		hash = hash || this.hash(address)

		this.requests[hash] 	= this.requests[hash] || this.requestGeoCoordinates(address).finally( () => delete this.requests[hash])


		const coordinates		= await this.requests[hash]

		const latitude			= coordinates.latitude
		const longitude			= coordinates.longitude
		const lastRequest		= Date.now()

		this.collection.updateOne(
			{ hash }, 
			{ 
				$set:		{ hash, latitude, longitude, lastRequest}, 
				$addToSet: 	{ tags: key } 
			}, 
			{ upsert:true }
		)

		return {latitude, longitude}
	}



	async locate(address, key){

		const hash					= await this.hash(address)
		const stored_location		= await this.getStoredGeoLocation(hash)
		const result				= {}

		return stored_location ||await this.getNewGeoLocation(address, hash, key)

	}

	async locateItem(item, key){

		if(item.location_ref)	return item
		if(item.longitude)		return item
		if(item.latitude)		return item

		if(!item.city) 			return item
		if(!item.address)		return item
		if(!item.zip)			return item	

		const address 	=  	{
								street: 		item.address, 
								postalcode:		item.zip,
								city:			item.city
							}

		const coords	=	await this.locate(address, key)

		item.latitude	=	coords.latitude 
		item.longitude	=	coords.longitude 


		return item

	}
}