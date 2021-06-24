cancelUnless(internal || me && ( me.id == this.id) && me.privileges.includes('edit_options'), "Unauthorized", 401)



$addCallback()

dpd.options.get({tag: this.tag})
.then( 

	options => {
		if(options.length > 0) cancel("Duplicate tag "+this.tag, 400)
		$finishCallback()	
	},

	$finishCallback
)