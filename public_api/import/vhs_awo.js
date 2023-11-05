import fetch 				from 'node-fetch'

function cleanString(x){
	return String(x||'').trim() || undefined
}

export async function getRemoteVersion(config){

	//return some value to identify the version of the remote content

	const response 	= await fetch( config.url, { method:'HEAD' } )	
	const headers	= response.headers

	return headers.get('Last-Modified')
}

export function getType(course){

	if(course.veranstaltungsart === 'Kurs')								return 'service'
	if(course.veranstaltungsart === 'Bildungsurlaub/Vortrag') 			return 'service'
	if(course.veranstaltungsart === 'Einzelveranstaltung/Vortrag') 		return 'event'

	const fallback = 'service'

	if(!course.ortetermine)							return fallback
	if(!course.ortetermine.termin)					return fallback	
	if(Array.isArray(course.ortetermine.termin))	return 'service'	
	if(Array.isArray(course.ortetermine.adresse))	return 'service'	

	return fallback	

}

export function getAllCategories(tags = []){


	return Array.from( new Set(tags.map( tag => ({
		"POLITIK-GESELLSCHAFT-UMWELT":	["culture"],
		"GESUNDHEIT":					["exercise"],
		"SPRACHEN":						["intercultural"],
		"ARBEIT-BERUF-EDV":				[],
		"EDV":							["it"],
		"BERUF":						[],
		"GRUNDBILDUNG":					[],
		"PÄDAGOGIK":					[],
		"DDR":							[],
		"GESCHICHTE":					[],
		"LÄNDERKUNDE":					[],
		"POLITIK":						["culture", "culture_politics"],
		"NLP":							[],
		"PSYCHOLOGIE":					[],
		"UMWELT":						["culture", "culture_environment"],
		"FOTO":							["arts", "arts_misc"],
		"FILM":							["arts", "arts_misc"],
		"MEDIEN":						["arts", "arts_misc"],
		"KUNSTHANDWERK":				["arts"],
		"SCHREIBEN":					["arts", "arts_misc"],
		"LITERATUR":					["culture", "culture_literature"],
		"MALEN":						["arts", "arts_paint_craft"],
		"ZEICHNEN":						["arts", "arts_paint_craft"],
		"MUSIK":						["arts", "arts_misc"],
		"PLASTISCHES GESTALTEN":		["arts", "arts_misc"],
		"SCHAUSPIEL":					["arts", "arts_misc"],
		"THEATER":						["arts", "arts_misc"],
		"TANZ":							["exercise", "exercise_dance"],
		"TEXTILGESTALTUNG":				["arts", "arts_handicrafts"],
		"GYMNASTIK":					["exercise", "exercise_motor"],
		"ENTSPANNUNG":					[],
		"ERNÄHRUNG":					[],
		"Computer-Einführungskurs":		["it", "it_courses"], 
		"Digitale Grundbildung":		["it", "it_courses"],
		"Datensicherheit":				["it", "it_courses"],		
		//"KULTUR":						["culture", "culture_culture"], // removed because people tend to put this tag in odd places

	}[tag]))
	.flat()))
	.filter( tag => !!tag)

}

export function getMainCategories(tags = []){

	const allCategories = getAllCategories(tags)
	
	return allCategories.filter( cat => {
		return 	[
					"encounters",
					"arts",
					"culture",
					"exercise",
					"intercultural",
					"it",
					"support",
					"counseling",
					"care",
					"medical",
					"housing"
				]
				.includes(cat)
	})

}


export function getAccesibility(tags = []){
	// Tags werden von der VHS noch nicht richtig vergeben
}

export function getModes(tags=[]){
	return 	Array.from(new Set(tags.map( tag =>({
				"Präsenzkurs": 				["on_site"],
				"Flexikurs":				["on_site", "online"],
				"Blended Learning":			["on_site"], 
				"Blended-Learning-Kurs":	["on_site"], 
				"Hybridkurs":				["on_site", "online"],
				"Onlinekurs":				["online"],
				"Selbstlernkurs":			["online"],
				"Webinar":					["online"],
				"Online-Vortrag":			["online"],
				"ELearning":				["online"],
				"Online Learning":			["online"],
				"vhs.cloud":				["online"],
				"vhs-Lernportal":			["online"],
				"Moodle":					["online"],
				"BigBlueButton":			["online"],
			}[tag]))
			.flat()))
			.filter( x => !!x)	
}

export function getTargetGroup(course){

	if(typeof course.zielgruppe !== 'string') return undefined

	if(course.zielgruppe.match(/migra/i))	return 'migrants'
}


export function getCharge(course){
	if(!course.preis) return undefined

	const preis = course.preis

	return 	[
				preis.betrag + ' EUR', 
				preis.rabatt_moeglich && 'Rabatt möglich',
				preis.zusatz
			]
			.filter(x => !!x)	
			.join(', ')
}


// one course can have multiple locations for various dates!
export function getLocations(course){

	const combined 			= 	course.ortetermine

	if(!combined) return [undefined]

	const locationData 		= 	Array.isArray(combined.adresse)
								?	combined.adresse
								:	[combined.adresse]

	const locations			=	locationData.map( loc => ({
									location:		loc.lehrstaette,
									zip: 			loc.plz,
									city:			loc.ort,
									address:		loc.strasse,
									longitude:		loc.laengengrad,
									latitude:		loc.breitengrad,
									accessibility:	loc.behindertenzugang
													?	{de: 'Behindertenzugang'}
													:	undefined
								}))					

	const uniqueLocations	= []

	locations.forEach( loc => {
		const existingLoc = 	uniqueLocations.find( uLoc => {

									if(uLoc.address 	!= loc.address) 	return false
									if(uLoc.zip 		!= loc.zip) 		return false
									if(uLoc.city 		!= loc.city) 		return false

									return true
								})

		if(!existingLoc) uniqueLocations.push(loc)
	})

	return uniqueLocations
}

export function getDescription(course){

	const locations	=	 getLocations(course)

	const de 		= 	(course.text || [])
						.map( t => cleanString(t.text) || '' ) 
						.join( '\n\n')					


	return { de }
}

export function getHours(course){
	const combined 	= course.ortetermine

	if(!combined) return ''

	const locationData 	= 	Array.isArray(combined.adresse)
							?	combined.adresse
							:	[combined.adresse]

	const dates 		= 	Array.isArray(combined.termin)
							?	combined.termin
							:	[combined.termin]

	const lines			=	dates.map( (date, index) => {

								if(!date) console.log(combined)

								const dateObj		= 	new Date(date.beginn_datum)

								const dateLine		= 	isNaN(dateObj)
														?	`${date.wochentag}, ${date.beginn_datum}`
														:	new Intl.DateTimeFormat('de',{
																weekday: 'short',
																year: 'numeric',
																month: 'numeric',
																day: 'numeric',
															}).format(dateObj)

								const timeLine		=	`${date.beginn_uhrzeit} – ${date.ende_uhrzeit}`					

								const location		=	locationData[index]

								const locationLine	=	location
														?	[location.lehrstaette, location.raum, location.strasse]
															.filter( x => !!x)
															.join(', ')
														:	''


								return `${dateLine}, ${timeLine} (${locationLine})`
							})
	return { de: lines.join('\n') }
}

export async function getRemoteItems(config){	

	


	const data 				= 	await fetch( config.url )
								.then( response => { console.log('Fetched VHS data'); return response })
								.then( response => response.json() )
	
	// data is huge! > 45 mb

	const courses 			= 	data && data.veranstaltungen && data.veranstaltungen.veranstaltung

	const relevantCourses 	= 	courses.filter( course => {

									const schlagwort 	= Array.isArray(course.schlagwort) && course.schlagwort.some( tag => tag.match(/Senior/i) ) 
									const zielgruppe	= typeof course.zielgruppe === 'string' && course.zielgruppe.match(/(Senior)|(Ältere)/i)

									return schlagwort || zielgruppe	
								})


	console.log('Number of relevant courses:', relevantCourses.length )			

	const locations 			= 	relevantCourses
									.map( course => getLocations(course) )
									.flat()
	


	//check for categories:
	relevantCourses.forEach(course => {
		const allCategories 	= getAllCategories(course.schlagwort)
		const mainCategories	= getMainCategories(course.schlagwort)
		const modes				= getModes(course.schlagwort)

		if(allCategories.length == 0) 	console.log('No categories found for:', 		String(course.schlagwort) )
		if(mainCategories.length == 0) 	console.log('No main categories found for:', 	String(course.schlagwort) )
		if(modes.length == 0) 			console.log('No modes found for:', 				String(course.schlagwort) )

	})

	const items				=	relevantCourses.map( course => {

									const id				=	`${course.guid}${course.nummer}`.replace(/[^a-zA-Z0-9]/g,'_')

									const title 			= 	cleanString(course.name)
									const brief				= 	{ de:"Kurs an der Volkshochschule (VHS)" }
									const description		= 	getDescription(course)
									const location_ref		=	undefined
									const location			=	cleanString(course.veranstaltungsort && course.veranstaltungsort.name) 		|| undefined
									const address			=	cleanString(course.veranstaltungsort && course.veranstaltungsort.adresse && course.veranstaltungsort.adresse.strasse) 	|| undefined
									const city				=	cleanString(course.veranstaltungsort && course.veranstaltungsort.adresse && course.veranstaltungsort.adresse.ort) 		|| undefined
									const zip				=	cleanString(course.veranstaltungsort && course.veranstaltungsort.adresse && course.veranstaltungsort.adresse.plz) 		|| undefined	
									
									const hours				=	getHours(course)

									const website			= 	cleanString(course.webadresse && course.webadresse.uri) || undefined	

									const remoteItem		=	{
																	original:	website
																}

									const allCategories 	= 	getAllCategories(course.schlagwort)
									const mainCategories	= 	getMainCategories(course.schlagwort)						

									const type				=	getType(course)

									const tags				=	[
																	...(	
																		allCategories.length > 0
																		?	allCategories
																		:	['misc_category']
																	),
																	...(
																		type
																		?	[type]
																		:	[]
																	)
																]

									const primaryTopic		=	mainCategories[0] || 'misc_category'
									
									if(!tags.includes(primaryTopic) ) tags.push(primaryTopic)

									const modes				=	getModes(course.schlagwort)

									if(modes.length > 0) tags.push(...modes)

									const targetGroup		=	getTargetGroup(course)

									if(targetGroup) tags.push(targetGroup)

									const charge			=	{de: getCharge(course)}

									const locations			=	getLocations(course)

									return 	locations.map( loc => ({
												id, 
												title, 
												tags, 
												primaryTopic, 
												brief, 
												description, 												 
												website, 
												remoteItem, 
												tags, 
												primaryTopic,
												charge,
												hours,
												...(loc||{})
											}))
								}).flat()




	
	return items 
}


// const config = 	{
// 						"sourceName":   "Volkshochschule",
// 						"sourceUrl":    "https://www.vhsit.berlin.de/VHSKURSE/OpenData/Kurse.json",
// 						"url":          "https://www.vhsit.berlin.de/VHSKURSE/OpenData/Kurse.json",
// 						"baseLanguage": "de",
// 						"targetLanguages": [],
// 						"script":       "vhs_awo.js"
// 				}


// getRemoteItems(config).then( items => {

// 	console.log(items.slice(0,10))

// })