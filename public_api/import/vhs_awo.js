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


export function getDistrict(course){

	const map	=	{
						'Mitte'							: 'bz_01',
						'Friedrichshain-Kreuzberg'		: 'bz_02',
						'Pankow'						: 'bz_03',
						'Charlottenburg-Wilmersdorf'	: 'bz_04',
						'Spandau'						: 'bz_05',
						'Steglitz-Zehlendorf'			: 'bz_06',
						'Tempelhof-Schöneberg'			: 'bz_07',
						'Neukölln'						: 'bz_08',
						'Treptow-Köpenick'				: 'bz_09',
						'Marzahn-Hellersdorf'			: 'bz_10',
						'Lichtenberg'					: 'bz_11',
						'Reinickendorf'					: 'bz_12'
					}


	return map[course.bezirk]
}

export function getAllCategories(tags = []){


	return Array.from( new Set(tags.map( tag => ({

		"3.02 Gymnastik, Bewegung etc.":		["exercise", "exercise_motor"],
		"4.04 Deutsch als Fremdsprache":		["intercultural", "intercultural_language_course", "german_as_a_foreign_language"],
		"Türkisch":								["intercultural", "intercultural_language_course"],
		"7.05 Deutsch als Femdsprache":			["intercultural", "intercultural_language_course", "german_as_a_foreign_language"],
		"4.41 Thai":							["intercultural", "intercultural_language_course"],
		"4.42 Vietnamesisch":					["intercultural", "intercultural_language_course"],
		"5.01 EDV / allg. Anwendungen":			["it", "it_courses"],
		"5.02 Kaufmännische EDV-Anwendungen":	["it", "it_courses"],
		"5.03 Technische EDV-Anwendungen":		["it", "it_courses"],
		"4.09 Italienisch":						["intercultural", "intercultural_language_course"],
		"4.10 Japanisch":						["intercultural", "intercultural_language_course"],
		"4.11 Latein":							["intercultural", "intercultural_language_course"],
		"4.12 Griechisch neu":					["intercultural", "intercultural_language_course"],
		"4.13 Hebräisch":						["intercultural", "intercultural_language_course"],
		"4.14 Niederländisch":					["intercultural", "intercultural_language_course"],
		"4.15 Norwegisch":						["intercultural", "intercultural_language_course"],
		"4.16 Persisch":						["intercultural", "intercultural_language_course"],
		"4.17 Polnisch":						["intercultural", "intercultural_language_course"],
		"4.18 Portugiesisch":					["intercultural", "intercultural_language_course"],
		"4.19 Russisch":						["intercultural", "intercultural_language_course"],
		"4.20 Schwedisch":						["intercultural", "intercultural_language_course"],
		"4.21 Serbokroatisch":					["intercultural", "intercultural_language_course"],
		"4.22 Spanisch":						["intercultural", "intercultural_language_course"],
		"4.23 Tschechisch":						["intercultural", "intercultural_language_course"],
		"4.24 Türkisch":						["intercultural", "intercultural_language_course"],
		"4.25 Ungarisch":						["intercultural", "intercultural_language_course"],
		"4.26 Andere Fremdsprachen":			["intercultural", "intercultural_language_course"],
		"4.27 Ägyptisch":						["intercultural", "intercultural_language_course"],
		"4.28 Bulgarisch":						["intercultural", "intercultural_language_course"],
		"4.29 Deutsch":							["intercultural", "intercultural_language_course"],
		"4.30 Indonesisch":						["intercultural", "intercultural_language_course"],
		"4.31 Jiddisch":						["intercultural", "intercultural_language_course"],
		"4.32 Katalanisch":						["intercultural", "intercultural_language_course"],
		"4.33 Koreanisch":						["intercultural", "intercultural_language_course"],
		"4.34 Kurdisch":						["intercultural", "intercultural_language_course"],
		"4.35 Lettisch":						["intercultural", "intercultural_language_course"],
		"4.36 Litauisch":						["intercultural", "intercultural_language_course"],
		"4.37 Marokkanisch":					["intercultural", "intercultural_language_course"],
		"4.38 Rumänisch":						["intercultural", "intercultural_language_course"],
		"4.39 Slowakisch":						["intercultural", "intercultural_language_course"],
		"4.40 Syrisch":							["intercultural", "intercultural_language_course"],
		"1.02 Politik":							["culture", "culture_politics"],
		"1.03 Soziologie":						["culture", "culture_politics"],
		"1.09 Religion /Theologie":				["culture", "culture_relegion"],
		"1.16 Verbraucherfragen":				["counseling"],
		"2.01 Literatur/Theater":				["arts"],
		"2.02 Theaterarbeit/Sprecherziehung":	["arts"],
		"2.03 Kunst/Kulturgeschichte":			["arts"],
		"2.04 Bildende Kunst":					["arts"],
		"2.05 Malen/Zeichnen/Drucktechniken":	["arts"],
		"2.06 Plastisches Gestalten":			["arts"],
		"2.07 Musik":							["arts"],
		"2.08 Musikalische Praxis":				["arts"],
		"2.09 Tanz":							["exercise", "exercise_dance"],
		"2.10 Medien":							["it", "it_courses"],
		"2.11 Medienpraxis":					["it", "it_courses"],
		"2.12 Werken":							["arts"],
		"2.13 Textiles Gestalten":				["arts"],
		"2.14 Textilkunde/Mode/Nähen":			["arts"],
		"3.01 Autogenes Training/Yoga etc.":	["exercise", "exercise_motor"],
		"3.02 Gymnastik, Bewegung etc.":		["exercise", "exercise_motor"],
		"3.03 Abhängigkeit/Psychosomatik":		["exercise"],
		"3.04 Erkrankungen/Heilmethoden":		["exercise"],
		"3.05 Gesundheits-/Krankenpflege":		["exercise"],
		"3.06 Gesundheitspolitik/-wesen":		["exercise"],
		"4.01 Arabisch":						["intercultural", "intercultural_language_course"],
		"4.02 Chinesich":						["intercultural", "intercultural_language_course"],
		"4.03 Dänisch":							["intercultural", "intercultural_language_course"],
		"4.04 Deutsch als Fremdsprache":		["intercultural", "intercultural_language_course"],
		"4.05 Deutsch als Muttersprache":		["intercultural", "intercultural_language_course"],
		"4.06 Englisch":						["intercultural", "intercultural_language_course"],
		"4.07 Finnisch":						["intercultural", "intercultural_language_course"],
		"4.08 Französisch":						["intercultural", "intercultural_language_course"],
		"Ich-beweg-mich":						["exercise", "exercise_motor"],
		"Gesundheitswoche":						["exercise"],
		"Kultursommer":							["culture"],
		"Politik aktuell":						["culture", "culture_politics"],
		"Zusammen in Vielfalt": 				["intercultural", "intercultural_encounters"], 
		"Ethik":								["culture", "culture_relegion"],
		"Philosophie":							["culture", "culture_relegion"],
		"Religion":								["culture", "culture_relegion"],
		"Religionen":							["culture", "culture_relegion"],
		"Berlin":								["culture", "culture_politics"],
		"Bezirke":								["culture", "culture_politics"],
		"Deutschland":							["culture", "culture_politics"],
		"Europa":								["culture", "culture_politics"],
		"POLITIK":								["culture", "culture_politics"],
		"Welt":									["culture", "culture_politics"],
		"Altersvorsorge":						["counseling"],
		"Geldanlage":							["counseling"],
		"Recht":								["counseling", "counseling_legal"],
		"Verbraucherschutz":					["counseling"],
		"Boden":								["culture", "culture_environment"],
		"Garten":								["culture", "culture_environment"],
		"Landschaftsgestaltung":				["culture", "culture_environment"],
		"Lebensräume":							["culture", "culture_environment"],
		"Naturschutz":							["culture", "culture_environment"],
		"Park":									["culture", "culture_environment"],
		"Pflanzen":								["culture", "culture_environment"],
		"Stadt":								["culture", "culture_environment"],
		"Tiere":								["culture", "culture_environment"],
		"Umweltschutz":							["culture", "culture_environment"],
		"Wald":									["culture", "culture_environment"],
		"Wasser":								["culture", "culture_environment"],
		"Wiese":								["culture", "culture_environment"],
		"UMWELT":								["culture", "culture_environment"],
		"Gender":								["culture", "culture_politics"],
		"Generationen":							["culture", "culture_culture"],
		"Interkulturelles":						["culture", "culture_culture"],
		"Soziale Gerechtigkeit":				["culture", "culture_politics"],
		"Diversität":							["culture", "culture_politics"],
		"FOTO":									["arts"],
		"FILM":									["arts"],
		"MEDIEN":								["arts"],
		"Digitale Fotografie":					["arts"],
		"Bildbearbeitung":						["arts"],
		"Farbfotografie":						["arts"],
		"Schwarz-Weiss-Fotografie":				["arts"],
		"Filmbesprechungen":					["arts"],
		"Video":								["arts"],
		"Mediendesign":							["arts"],
		"Printmedien":							["arts"],
		"Rundfunk":								["arts"],
		"Fernsehen":							["arts"],
		"Filmgeschichte":						["arts"],
		"Filmproduktion":						["arts"],
		"Filmschauspiel":						["arts"],
		"Thematische Fotografie":				["arts"],
		"KUNSTHANDWERK":						["arts"],
		"Holzgestaltung":						["arts"],
		"Goldschmieden":						["arts"],
		"Schmuck":								["arts"],
		"Papierkunst":							["arts"],
		"Restaurieren":							["arts"],
		"Floristik":							["arts"],
		"SCHREIBEN":							["arts"],
		"Autobiografie":						["arts"],
		"Drehbuch":								["arts"],
		"Hörspiel":								["arts"],
		"Journalismus":							["arts"],
		"Kreatives Schreiben":					["arts"],
		"Szenisches Schreiben":					["arts"],
		"Atelier":								["arts"],
		"Geschichte":							["arts"],
		"Kunsttheorie":							["arts"],
		"Museum":								["arts"],
		"LITERATUR":							["culture", "culture_literature"],
		"Autorenlesung":						["culture", "culture_literature"],
		"Buchbesprechung":						["culture", "culture_literature"],
		"Erzählwerkstatt":						["culture", "culture_literature"],
		"Lesekreis":							["culture", "culture_literature"],
		"Gesprächskreis":						["culture", "culture_literature"],
		"Vortragen":							["culture", "culture_literature"],
		"Vorlesen":								["culture", "culture_literature"],
		"MALEN":								["arts"],
		"ZEICHNEN":								["arts"],
		"Druckgrafik":							["arts"],
		"Figur":								["arts"],
		"Akt":									["arts"],								
		"Portrait":								["arts"],
		"Layout":								["arts"],								
		"Grafikdesign":							["arts"],
		"Maltechniken":							["arts"],
		"Zeichentechniken":						["arts"],
		"Stadt-Land-Natur":						["arts"],
		"Acrylmalerei":							["arts"],
		"Ölmalerei":							["arts"],
		"Aquarellmalerei":						["arts"],
		"Sonstige Maltechniken":				["arts"],
		"Vorbereitung Kunsthochschule":			["arts"],
		"MUSIK":								["arts"],
		"Gesang":								["arts", "arts_choir"],
		"Instrumentalunterricht":				["arts"],
		"Musikgeschichte":						["arts"],
		"Musiktheorie":							["arts"],
		"PLASTISCHES GESTALTEN":				["arts"],
		"Bildhauerei":							["arts"],
		"Keramik":								["arts"],
		"Metallplastik":						["arts"],
		"Raku":									["arts"],
		"SCHAUSPIEL":							["arts"],
		"Bewegungstheater":						["arts"],
		"Improvisationstheater":				["arts"],
		"Kleinkunst":							["arts"],
		"Puppentheater":						["arts"],
		"Stimmbildung":							["arts"],
		"Sprecherziehung":						["arts"],
		"Theatergewerke":						["arts"],
		"Vorbereitung Schauspielschule":		["arts"],
		"THEATER":								["arts"],
		"TANZ":									["arts"],
		"Afrikanischer Tanz":					["arts"],
		"Orientalischer Tanz":					["arts"],
		"Ballett":								["arts"],
		"Modern Dance":							["arts"],
		"Folkloretanz":							["arts"],
		"World Dance":							["arts"],
		"Gesellschaftstanz":					["arts"],
		"Historischer Tanz":					["arts"],
		"Jazz Dance":							["arts"],
		"Hip Hop":								["arts"],
		"Lateinamerikanischer Tanz":			["arts"],
		"Stepptanz":							["arts"],
		"Flamenco":								["arts"],
		"Tanzimprovisation":					["arts"],
		"Tanztheater":							["arts"],
		"Tango":								["arts"],
		"Salsa":								["arts"],
		"Mode":									["arts"],
		"Nähen":								["arts"],
		"Schneidern":							["arts"],
		"TEXTILGESTALTUNG":						["arts"],
		"Schnittkonstruktion":					["arts"],
		"Stricken Häkeln":						["arts", "arts_handicrafts"],
		"Konzertbesuch":						["culture", "culture_music_theatre_film"],
		"Opernbesuch":							["culture", "culture_music_theatre_film"],
		"Theaterbesuch":						["culture", "culture_music_theatre_film"],
		"Fitnessgymnastik":						["exercise", "exercise_motor"],
		"GYMNASTIK":							["exercise", "exercise_motor"],
		"Pilates":								["exercise", "exercise_motor"],
		"Rückentraining":						["exercise", "exercise_motor"],
		"Sanfte Gymnastik":						["exercise", "exercise_motor"],
		"Spezialgymnastik":						["exercise", "exercise_motor"],
		"Walking":								["exercise", "exercise_motor"],
		"Wassergymnastik":						["exercise", "exercise_motor"],
		"Wirbelsäulengymnastik":				["exercise", "exercise_motor"],
		"Nordic Walking":						["exercise", "exercise_motor"],
		"Rückenschule":							["exercise", "exercise_motor"],
		"Atemarbeit":							["exercise"],
		"Autogenes Training":					["exercise"],
		"ENTSPANNUNG":							["exercise"],
		"Feldenkrais":							["exercise"],
		"Massage":								["exercise"],
		"Muskelentspannung":					["exercise"],
		"Qi Gong":								["exercise"],
		"Tai Ji Quan":							["exercise"],
		"Yoga":									["exercise"],
		"Stimme":								["exercise"],
		"Alexandertechnik":						["exercise"],
		"Meditation":							["exercise"],
		"Achtsamkeit":							["exercise"],
		"Backen":								["exercise"],
		"ERNÄHRUNG":							["exercise"],
		"Kochen":								["exercise"],
		"Ernährungsberatung":					["exercise"],
		"Gesundheitspflege":					["exercise"],
		"Krankenpflege":						["exercise"],
		"Erkrankungen":							["exercise"],
		"Heilmethoden":							["exercise"],
		"Arbisch":								["intercultural", "intercultural_language_course"],
		"Bulgarisch":							["intercultural", "intercultural_language_course"],
		"Chinesisch":							["intercultural", "intercultural_language_course"],
		"Türkisch":								["intercultural", "intercultural_language_course"],
		"Rumänisch":							["intercultural", "intercultural_language_course"],
		"Russisch":								["intercultural", "intercultural_language_course"],
		"Schwedisch":							["intercultural", "intercultural_language_course"],
		"Spanisch":								["intercultural", "intercultural_language_course"],
		"Thai":									["intercultural", "intercultural_language_course"],
		"Tschechisch":							["intercultural", "intercultural_language_course"],
		"Ungarisch":							["intercultural", "intercultural_language_course"],
		"Vietnamesisch":						["intercultural", "intercultural_language_course"],
		"Gebärdensprache":						["intercultural", "intercultural_language_course"],
		"Deutsch Fremdsprache":					["intercultural", "intercultural_language_course"],
		"Deutsch":								["intercultural", "intercultural_language_course"],
		"Swahili":								["intercultural", "intercultural_language_course"],
		"Kroatisch":							["intercultural", "intercultural_language_course"],
		"Dänisch":								["intercultural", "intercultural_language_course"],
		"Englisch":								["intercultural", "intercultural_language_course"],
		"Finnisch":								["intercultural", "intercultural_language_course"],
		"Französisch":							["intercultural", "intercultural_language_course"],
		"Neugriechisch":						["intercultural", "intercultural_language_course"],
		"Altgriechisch":						["intercultural", "intercultural_language_course"],
		"Hebräisch":							["intercultural", "intercultural_language_course"],
		"Indonesisch":							["intercultural", "intercultural_language_course"],
		"Italienisch":							["intercultural", "intercultural_language_course"],
		"Japanisch":							["intercultural", "intercultural_language_course"],
		"Koreanisch":							["intercultural", "intercultural_language_course"],
		"Latein":								["intercultural", "intercultural_language_course"],
		"Litauisch":							["intercultural", "intercultural_language_course"],
		"Niederländisch":						["intercultural", "intercultural_language_course"],
		"Norwegisch":							["intercultural", "intercultural_language_course"],
		"Persisch":								["intercultural", "intercultural_language_course"],
		"Polnisch":								["intercultural", "intercultural_language_course"],
		"Portugiesisch":						["intercultural", "intercultural_language_course"],
		"Lettisch":								["intercultural", "intercultural_language_course"],
		"Isländisch":							["intercultural", "intercultural_language_course"],
		"Estnisch":								["intercultural", "intercultural_language_course"],
		"Slowakisch":							["intercultural", "intercultural_language_course"],
		"Serbisch":								["intercultural", "intercultural_language_course"],
		"Katalanisch":							["intercultural", "intercultural_language_course"],
		"Kurdisch":								["intercultural", "intercultural_language_course"],
		"Aserbaidschanisch":					["intercultural", "intercultural_language_course"],
		"Amharisch":							["intercultural", "intercultural_language_course"],
		"Ukrainisch":							["intercultural", "intercultural_language_course"],
		"Hindi":								["intercultural", "intercultural_language_course"],
		"Deutsch Leichte Sprache":				["intercultural", "intercultural_language_course"],
		"Baskisch":								["intercultural", "intercultural_language_course"],
		"Jiddisch":								["intercultural", "intercultural_language_course"],
		"Sorbisch":								["intercultural", "intercultural_language_course"],
		"Auffrischung":							["intercultural", "intercultural_language_course"],
		"Film":									["intercultural", "intercultural_language_course"],
		"Grammatik":							["intercultural", "intercultural_language_course"],
		"Kochen":								["intercultural", "intercultural_language_course"],
		"Konversation":							["intercultural", "intercultural_language_course"],
		"Kunst- und Kulturgeschichte":			["intercultural", "intercultural_language_course"],
		"Landeskunde":							["intercultural", "intercultural_language_course"],
		"Literatur":							["intercultural", "intercultural_language_course"],
		"Medien":								["intercultural", "intercultural_language_course"],
		"Musik":								["intercultural", "intercultural_language_course"],
		"Rechtschreibung":						["intercultural", "intercultural_language_course"],
		"Sprachreise":							["intercultural", "intercultural_language_course"],
		"Übersetzen":							["intercultural", "intercultural_language_course"],
		"Urlaub":								["intercultural", "intercultural_language_course"],
		"Video":								["intercultural", "intercultural_language_course"],
		"Wortschatz":							["intercultural", "intercultural_language_course"],
		"Phonetik":								["intercultural", "intercultural_language_course"],
		"Sprachtest":							["intercultural", "intercultural_language_course"],
		"Ausdruck":								["intercultural", "intercultural_language_course"],
		"Fachsprache":							["intercultural", "intercultural_language_course"],
		"Formulieren":							["intercultural", "intercultural_language_course"],
		"Rhetorik":								["intercultural", "intercultural_language_course"],
		"Schreiben":							["intercultural", "intercultural_language_course"],
		"Zeichensetzung":						["intercultural", "intercultural_language_course"],
		"Orientierungskurs":					["intercultural", "intercultural_language_course"],
		"Einbürgerungstest":					["intercultural", "intercultural_language_course"],
		"Superlearning":						["intercultural", "intercultural_language_course"],
		"Dolmetschen":							["intercultural", "intercultural_language_course"],
		"Hörverstehen":							["intercultural", "intercultural_language_course"],
		"Leseverstehen":						["intercultural", "intercultural_language_course"],
		"Zweitschriftlernerkurs":				["intercultural", "intercultural_language_course"],
		"TELC":									["intercultural", "intercultural_language_course"],
		"DELF":									["intercultural", "intercultural_language_course"],
		"IELTS":								["intercultural", "intercultural_language_course"],
		"TOEFL":								["intercultural", "intercultural_language_course"],
		"Cambridge PET":						["intercultural", "intercultural_language_course"],
		"Cambridge FCE":						["intercultural", "intercultural_language_course"],
		"Cambridge CAE":						["intercultural", "intercultural_language_course"],
		"Cambridge CPE":						["intercultural", "intercultural_language_course"],
		"TELC Business":						["intercultural", "intercultural_language_course"],
		"TELC Hotel":							["intercultural", "intercultural_language_course"],
		"LCCI":									["intercultural", "intercultural_language_course"],
		"TOEIC":								["intercultural", "intercultural_language_course"],
		"Cambridge BEC":						["intercultural", "intercultural_language_course"],
		"TELC Profession":						["intercultural", "intercultural_language_course"],
		"JLPTN3":								["intercultural", "intercultural_language_course"],
		"JLPTN4":								["intercultural", "intercultural_language_course"],
		"Diploma Intermedio":					["intercultural", "intercultural_language_course"],
		"Diploma Superior":						["intercultural", "intercultural_language_course"],
		"TELC Technic":							["intercultural", "intercultural_language_course"],
		"Zertifikat Deutsch":					["intercultural", "intercultural_language_course"],
		"PaF":									["intercultural", "intercultural_language_course"],
		"Wirtschaftsübersetzer IHK":			["intercultural", "intercultural_language_course"],
		"JLPTN2":								["intercultural", "intercultural_language_course"],
		"DTZ":									["intercultural", "intercultural_language_course"],
		"TestDaF":								["intercultural", "intercultural_language_course"],
		"Leben in Deutschland":					["intercultural", "intercultural_language_course"],
		"DELE":									["intercultural", "intercultural_language_course"],
		"A1":									["intercultural", "intercultural_language_course"],
		"A2":									["intercultural", "intercultural_language_course"],
		"B1":									["intercultural", "intercultural_language_course"],
		"B2":									["intercultural", "intercultural_language_course"],
		"C1":									["intercultural", "intercultural_language_course"],
		"C2":									["intercultural", "intercultural_language_course"],
		"EDV":									["it", "it_courses"],
		"Computer-Einführungskurs":				["it", "it_courses"],
		"Internet":								["it", "it_courses"],
		"Recherche":							["it", "it_courses"],
		"eBay":									["it", "it_courses"],
		"Bildbearbeitung":						["it", "it_courses"],
		"Videobearbeitung":						["it", "it_courses"],
		"Multimedia":							["it", "it_courses"],
		"C":									["it", "it_courses"],
		"C#":									["it", "it_courses"],
		"C++":									["it", "it_courses"],
		"Java":									["it", "it_courses"],
		"Programmierung":						["it", "it_courses"],
		"Visual Basic":							["it", "it_courses"],
		"Vba":									["it", "it_courses"],
		"Webseiten":							["it", "it_courses"],
		"Html":									["it", "it_courses"],
		"Css":									["it", "it_courses"],
		"Webeditoren":							["it", "it_courses"],
		"Webdesign":							["it", "it_courses"],
		"Internethandel":						["it", "it_courses"],
		"Datensicherheit":						["it", "it_courses"],
		"Hardware":								["it", "it_courses"],
		"Linux":								["it", "it_courses"],
		"Unix":									["it", "it_courses"],
		"Netzwerke":							["it", "it_courses"],
		"Server":								["it", "it_courses"],
		"Mac OS":								["it", "it_courses"],
		"Webserver":							["it", "it_courses"],
		"Windows":								["it", "it_courses"],
		"Datenbankverwaltung":					["it", "it_courses"],
		"Access":								["it", "it_courses"],
		"Tabellenkalkulation":					["it", "it_courses"],
		"Excel":								["it", "it_courses"],
		"Outlook":								["it", "it_courses"],
		"Präsentation":							["it", "it_courses"],
		"Powerpoint":							["it", "it_courses"],
		"Textverarbeitung":						["it", "it_courses"],
		"Word":									["it", "it_courses"],
		"Office":								["it", "it_courses"],
		"Cad":									["it", "it_courses"],
		"Dtp":									["it", "it_courses"],
		"Grafik":								["it", "it_courses"],
		"Arztpraxen":							["it", "it_courses"],
		"Sap":									["it", "it_courses"],
		"Audiobearbeitung":						["it", "it_courses"],
		"Web 2.0":								["it", "it_courses"],
		"Cms":									["it", "it_courses"],
		"Webgrafik":							["it", "it_courses"],
		"Webseiten-Konzeption":					["it", "it_courses"],
		"WEBSEITENGESTALTUNG":					["it", "it_courses"],
		"Stenografie":							["it", "it_courses"],
		"Tastschreiben":						["it", "it_courses"],

		//ALT, Fallback:		
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
					"housing",
					"misc_category"
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

	const combined 	= 	course.ortetermine 
						||
						{
							termin:{
								beginn_datum:	course.beginn_datum,
								ende_datum:		course.ende_datum
							}
						}

	const locationData 	= 	Array.isArray(combined.adresse)
							?	combined.adresse || {}
							:	[combined.adresse || {}]

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

								const timeLine		=	[date.beginn_uhrzeit, date.ende_uhrzeit]
														.filter(x => !!x)					
														.join(' – ')

								const location		=	locationData[index]

								const locationLine	=	location
														?	[location.lehrstaette, location.raum, location.strasse]
															.filter( x => !!x)
															.join(', ')
														:	''

								const locationBracs	=	locationLine
														?	`(${locationLine})`
														:	''

								return `${dateLine}, ${timeLine} ${locationBracs}`
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

		if(allCategories.length == 0) {
			console.log('No categories found for:', 		String(course.schlagwort), 'adding misc_category')
			allCategories.push('misc_category')
		}
		if(mainCategories.length == 0) 	console.log('No main categories found for:', 	String(course.schlagwort) )
		if(modes.length == 0) 			console.log('No modes found for:', 				String(course.schlagwort) )

	})

	const items				=	relevantCourses.map( course => {

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

									const district			=	getDistrict(course)

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
																	),
																	...(
																		district
																		?	[district]
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

									return 	locations.map( (loc,index) => ({
												id:			`${course.guid}${course.nummer}${index}`.replace(/[^a-zA-Z0-9]/g,'_'), 
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

