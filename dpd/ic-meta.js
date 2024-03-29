'use strict'

var Resource	= require('deployd/lib/resource'),
	util		= require('util'),
	fs			= require('fs'),
	ejs			= require('ejs'),
	path 		= require('path'),
	{marked}	= require('marked'),
	icUtils		= require(path.resolve('../ic-utils.js'))


function Meta(name, options) {
	Resource.apply(this, arguments);
}

util.inherits(Meta, Resource);
module.exports = Meta;


Meta.basicDashboard = {
	settings: [
		{
			name: 			'linkedCollection',
			type: 			'text',
			description: 	'Metadata for items of this collections.'
		},
		{
			name: 			'defaultLanguageCode',
			type: 			'text',
			description: 	'Default language code if none is provided.'
		}
	]
}

Meta.prototype.handle = function (ctx, next) {

	if(ctx.req && ctx.req.method !== 'GET') return ctx.done("Only GET allowed.");

	const self		= this

	const parts 	= ctx.url.split('/').filter(function(p) { return p })

	const isPage	= parts && parts[0] == 'page'
	const isItem	= parts && !isPage

	const id		= 	isItem
						?	parts[0]
						:	parts[1]

	const page		=	isPage && parts[1] || ''

	const lang		=	isItem
						?	(parts[1] || icUtils.config.defaultLanguageCode || 'en')					
						:	(parts[2] || icUtils.config.defaultLanguageCode || 'en')

		const languages	=	icUtils.getAvailableLanguages()


	try {
		if(isItem && this.config.linkedCollection && ctx.dpd[this.config.linkedCollection]){
			ctx.dpd[this.config.linkedCollection].get(id)
			.then(
				function(data){
					fs.readFile(self.options.configPath+'/template_item.html', {encoding: 'utf-8'}, function(error, template) {
						if(error){
							ctx.res.statusCode = 500
							console.trace(error)
							return ctx.done('internal server error')
						}

						const description 	= marked( (data.description && data.description[lang] || '').replace('"', "'"))
						const url			= icUtils.config.frontendUrl+'/item/' + id

						const html = ejs.render(template, {
										title:			(data.title	|| '').replace('"', "'"),
										image:			(data.image	|| '').replace('"', "'"),
										twitter:		data.twitter,
										site: {
											title:		(icUtils.config.title	|| '').replace('"', "'"),
											twitter:	(icUtils.config.twitter	|| '').replace('"', "'"),
										},
										languages,
										url,
										description,
										lang
									});
						ctx.done(null, html)
					})
				},
				function(e){
					ctx.res.statusCode = 404
					ctx.done('not found')
				}
			)

			return;			
		}

		if(isPage){

			const title		=	icUtils.getInterfaceTranslation('INTERFACE.TITLE', lang)
			const content	=	marked(icUtils.getInterfaceTranslation(`CONTENT.${page}`, lang)||'')
			const url		= 	page == 'home'
								?	icUtils.config.frontendUrl
								:	icUtils.config.frontendUrl + '/page/' + page

			fs.readFile(self.options.configPath+'/template_page.html', {encoding: 'utf-8'}, function(error, template) {

				const html = 	ejs.render(template, {
									title,
									content,
									languages,
									lang,
									url
								})

				ctx.done(null, html)

			},
			function(e){
					ctx.res.statusCode = 404
					ctx.done('not found')
				}
			)

			return;
		}

		console.log('Meta: bad config.')
		ctx.done()

	} catch (ex) {
		console.log(ex);
	}
}