cancelUnless(internal || me , "Unauthorized", 401)

this.items = this.items || []

emit("lists:update", this.id) //only sending id, because of access restrctions