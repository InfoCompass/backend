import fetch 				from 'node-fetch'

import {	Translator	}	from '../translations.js'



export async function getRemoteVersion(config){

	//return some value to identify the version of the remote content

	const response 	= await fetch( config.url, { method:'HEAD' } )	
	const headers	= response.headers

	return headers.get('Last-Modified')
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



export async function getRemoteItems(config){	

	function cleanString(x){
		return String(x||'').trim() || undefined
	}


	const data 				= 	await fetch( config.url )
								.then( response => { console.log('Fetched VHS data'); return response })
								.then( response => response.json() )
	
	const courses 			= 	data && data.veranstaltungen && data.veranstaltungen.veranstaltung
	const relevantCourses 	= 	courses.filter( course => {

									const schlagwort 	= Array.isArray(course.schlagwort) && course.schlagwort.some( tag => tag.match(/Senior/i) ) 
									const zielgruppe	= course.zielgruppe && course.zielgruppe.match(/(Senior)|(Ältere)/i)

									return schlagwort || zielgruppe	
								})

	const locations			=	relevantCourses
								.map( course => course.veranstaltungsort.adresse)
								.map( ort => `${ort.strasse} ${ort.plz} ${ort.ort}`)


	console.log('Number of relevant courses:', relevantCourses.length )			


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

									const type				=	'service'

									const title 			= 	cleanString(course.name)
									const brief				= 	{ de:"Kurs an der Volkshochschule (VHS)" }
									const description		= 	{ 
																	de: (course.text || [])
																		.map( t => cleanString(t.text) || '' ) 
																		.join( '\n\n')
																}
									const location_ref		=	undefined
									const location			=	cleanString(course.veranstaltungsort && course.veranstaltungsort.name) 		|| undefined
									const address			=	cleanString(course.veranstaltungsort && course.veranstaltungsort.adresse && course.veranstaltungsort.adresse.strasse) 	|| undefined
									const city				=	cleanString(course.veranstaltungsort && course.veranstaltungsort.adresse && course.veranstaltungsort.adresse.ort) 		|| undefined
									const zip				=	cleanString(course.veranstaltungsort && course.veranstaltungsort.adresse && course.veranstaltungsort.adresse.plz) 		|| undefined	
									
									const website			= 	cleanString(course.webadresse && course.webadresse.uri) || undefined	

									const remoteItem		=	{
																	original:	website
																}

									const allCategories 	= 	getAllCategories(course.schlagwort)
									const mainCategories	= 	getMainCategories(course.schlagwort)						


									const tags				=	allCategories.length > 0
																?	allCategories
																:	['misc_category']

									const primaryTopic		=	mainCategories[0] || 'misc_category'
									
									if(!tags.includes(primaryTopic) ) tags.push(primaryTopic)

									const modes				=	getModes(course.schlagwort)

									if(modes.length > 0) tags.push(...modes)

									const targetGroup		=	getTargetGroup(course)

									if(targetGroup) tags.push(targetGroup)

									const charge			=	{de: getCharge(course)}


									return 	{
												id, 
												type,
												title, 
												tags, 
												primaryTopic, 
												brief, 
												description, 
												location, 
												address, 
												city, 
												zip, 
												website, 
												remoteItem, 
												tags, 
												primaryTopic,
												charge

											}
								})




	
	return items 
}