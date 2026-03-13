	exports.collectionName = "items"


	exports.properties = [

		new Property({
			name: 			"title",
			getErrors:		function(value){

							},	
			defaultValue:	"",
			min:			3,
			max:			100,
			searchable:		true,
			mandatory:		true
		}),		
		new Property({
			name: 			"titleAddOn",
			getErrors:		function(value){

							},	
			defaultValue:	{},
			min:			3,
			max:			100,
			searchable:		true,
			translatable:		true,
			autoTranslate:		true
		}),	
		new Property({
			name: 			"image",
			getErrors:		function(value){

							},	
			defaultValue:	"",
		}),	
		new Property({
			name: 			"state",
			getErrors:		function(value){
								if(this.options.indexOf(value) == -1) return {
									message:	"Invalid value: "+ value +". Valid values are: "+this.options.join(', ')+".",
									code:		"INVALID_VALUE"
								}

							},	
			defaultValue:	"draft",
			options:		[
								'public',
								'draft',
								'archived',
								'suggestion'
							],
			mandatory:		true
		}),
		new Property({
			name: 			"tags",
			getErrors:		function(values){
							},
			defaultValue:	[],
			searchable:		true	
		}),

		new Property({
			name: 			"primaryTopic",
			getErrors:		function(value, key){	
									
							},	
			defaultValue:	"",
			searchable:		true,
		}),
		new Property({
			name: 			"brief",
			getErrors:		function(obj, key){	
								

							},	
			defaultValue:	{},
			mandatory:		true,
			min:			3,
			max:			170,
			searchable:		true,
			translatable:	true,
			autoTranslate:	true
		}),

		new Property({
			name: 			"description",
			getErrors:		function(obj, key){		
							},	
			defaultValue:	{},
			searchable:		true,
			min:			0,
			max:			1500,
			translatable:	true,
			autoTranslate:	true
		}),

		new Property({
			name: 			"location_ref",
			getErrors:		function(value, key){	
							},	
			defaultValue:	"",
			searchable:		false,
		}),

		new Property({
			name: 			"location",
			getErrors:		function(value, key){	
							},	
			defaultValue:	"",
			searchable:		true,
			project:		"location_ref"
		}),

		new Property({
			name: 			"directions",
			getErrors:		function(value, key){	
							},	
			defaultValue:	{},
			searchable:		true,
			translatable:	true,
			autoTranslate:	true,
			project:		"location_ref"
		}),

		new Property({
			name: 			"address",
			getErrors:		function(value, key){		
								var min_length = 3,
									max_length = 30

								if(value.replace(/\s/, '').length < min_length) return {
									message: 	"Invalid length. Min length for "+ this.name +" is "+min_length+".",
									code:		"INVALID_LENGTH_MIN"
								}

								if(value.length > max_length) return {
									message: 	"Invalid length. Max length for "+ this.name +" is "+max_length+".",
									code:		"INVALID_LENGTH_MAX"
								}
							},	
			defaultValue:	"",
			searchable:		true,
			project:		"location_ref"
		}),

		new Property({
			name: 			"zip",
			getErrors:		function(value, key){		
								// var min_length = 5,
								// 	max_length = 5

								// if(value.length < min_length) return {
								// 	message: 	"Invalid length. Min length for "+ this.name +" is "+min_length+".",
								// 	code:		"INVALID_LENGTH_MIN"
								// }

								// if(value.length > max_length) return {
								// 	message: 	"Invalid length. Max length for "+ this.name +" is "+max_length+".",
								// 	code:		"INVALID_LENGTH_MAX"
								// }

								if(!value.match(/\d{5}/)) return {
									message:	"Invalid characters. Only digits allowed for "+ this.name,
									code:		"DIGITS_REQUIRED"
								}
							},
			min:			5,
			max:			5,					
			defaultValue:	"",
			searchable:		true,
			project:		"location_ref"
		}),

		new Property({
			name: 			"city",
			getErrors:		function(value, key){		
								var min_length = 3,
									max_length = 30

								if(value.replace(/\s/, '').length < min_length) return {
									message: 	"Invalid length. Min length for "+ this.name +" is "+min_length+".",
									code:		"INVALID_LENGTH_MIN"
								}

								if(value.length > max_length) return {
									message: 	"Invalid length. Max length for "+ this.name +" is "+max_length+".",
									code:		"INVALID_LENGTH_MAX"
								}
							},	
			defaultValue:	"",
			searchable:		true,
			project:		"location_ref"
		}),

		new Property({
			name: 			"latitude",
			getErrors:		function(value, key){	
								if(Math.abs(value) > 90) return {
									message:	"Out of range: latitude must be between -90.00 and + 90.00",
									code:		"OUT_OF_RANGE"
								} 	
							},	
			defaultValue:	0,
			project:		"location_ref"
		}),

		new Property({
			name: 			"longitude",
			getErrors:		function(value, key){	
								if(Math.abs(value) > 180) return {
									message:	"Out of range: longitude must be between -180.00 and + 180.00",
									code:		"OUT_OF_RANGE"
								} 	
							},	
			defaultValue:	0,
			project:		"location_ref"
		}),
		new Property({
			name: 			"recurring_event",
			getErrors:		function(value, key){	
			                    return null
							},	
			defaultValue:	""			
		}),
		new Property({
			name: 			"responsibleInstitution", //TODO replace with genric tags
			getErrors:		function(value, key){		
							},	
			defaultValue:	"",
			searchable:		true,
		}),

		new Property({
			name: 			"sponsors", //TODO replace with genric tags
			getErrors:		function(value, key){		
							},	
			defaultValue:	"",
			searchable:		true,
		}),


		new Property({
			name: 			"website",
			getErrors:		function(value, key){	

								if(!value)	return;
								
								if(!value.match(/^https?:\/\/.+/)) return {
									message:	"Website url must start with http(s).",
									code:		"INVALID_PROTOCOL"
								}
							},	
			defaultValue:	"",
			searchable:		true,
		}),

		new Property({
			name: 			"email",
			getErrors:		function(value, key){		
								var min_length = 3,
									max_length = 60

								if(!value.match(/^.+@.+\..+/)) return{
									message:	"Emails must have at least one '@' and one '.' .",
									code:		"INVALID_FORMAT"
								}

								if(value.replace(/\s/, '').length < min_length) return {
									message: 	"Invalid length. Min length for "+ this.name +" is "+min_length+".",
									code:		"INVALID_LENGTH_MIN"
								}

								if(value.length > max_length) return {
									message: 	"Invalid length. Max length for "+ this.name +" is "+max_length+".",
									code:		"INVALID_LENGTH_MAX"
								}
							},	
			defaultValue:	"",
			searchable:		true,
		}),

		new Property({
			name: 			"facebook",
			getErrors:		function(value, key){		

								
							},	
			defaultValue:	"",
			searchable:		true,
		}),


		new Property({
			name: 			"whatsapp",
			getErrors:		function(value, key){		
								
							},	
			defaultValue:	"",
			searchable:		true,
		}),

		new Property({
			name: 			"contact",
			getErrors:		function(value, key){		
								
							},	
			defaultValue:	"",
			searchable:		true,
		}),

		new Property({
			name: 			"phone",
			getErrors:		function(value, key){		
								
							},	
			defaultValue:	"",
			searchable:		true,
		}),

		new Property({
			name: 			"mobile",
			getErrors:		function(value, key){		
								
							},	
			defaultValue:	"",
			searchable:		true,
		}),

		new Property({
			name: 			"editingNote",
			getErrors:		function(value, key){	
									
							},	
			defaultValue:	"",
			searchable:		false,
		}),

		new Property({
			name: 			"hours",
			getErrors:		function(value, key){	
									
							},	
			defaultValue:	{},
			searchable:		false,
			translatable:	true,
			autoTranslate:	true
		}),


		new Property({
			name: 			"accessibility",
			getErrors:		function(value, key){	
									
							},	
			defaultValue:	{},
			searchable:		false,
			translatable:	true,
			autoTranslate:	true
		}),


		new Property({
			name: 			"charge",
			getErrors:		function(value, key){	
									
							},	
			defaultValue:	{},
			searchable:		false,
			translatable:	true,
			autoTranslate:	true
		}),



		new Property({
			name: 			"venue",
			getErrors:		function(value, key){	
									
							},	
			defaultValue:	{},
			searchable:		false,
			translatable:	true,
			autoTranslate:	true
		}),


		new Property({
			name: 			"resubmissionDate",
			getErrors:		function(value, key){	
								return 	isNaN(Date.parse(value))
										?	{
												message: 'Unable to convert string to date. Try YYYY-MM-DDTHH:MM',
												code:	 'INVALID_DATE_STRING'
											}
										:	null
							},	
			defaultValue:	"",
			searchable:		false,
		}),

		
		new Property({
			name:			"remoteItem",
			defaultValue:	null,
			type:			'object',
			searchable:		true,
			internal:		true
		}),
		

		new Property({
			name: 			"proposalFor",
			defaultValue:	"",
			internal:		true
		}),
		new Property({
			name: 			"creationDate",
			defaultValue:	0,
			internal:		true
		}),		
		new Property({
			name: 			"creator",
			defaultValue:	"",
			internal:		true
		}),
		new Property({
			name: 			"lastEditDate",
			defaultValue:	0,
			internal:		true
		}),
		new Property({
			name: 			"lastEditor",
			defaultValue:	"",
			internal:		true
		}),
		new Property({
			name:			"proposals",
			defaultValue:	[],
			internal:		true
		})

	]
