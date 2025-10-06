cancelUnless(
        internal
    ||  this.state == 'public' 
    || (me && me.privileges && me.privileges.indexOf('edit_items') != -1) 
)

var icItemConfig    = require (process.cwd()+'/public/ic-item-config.js')
var self            = this


// cancelIf(!internal && this.proposalFor)




// This is a generic property, 
// its values are not supposed to be stored in the data base.
// Alas that happened in the past, and might happen again, 
// that's why we reset them here:
this.proposals = []


if(internal || (me && me.privileges.indexOf('edit_items') != -1 )) {

    if(this.lastEditor){
        $addCallback()
        dpd.users.get(this.lastEditor)
        .then(
            function(lastEditor){
                self.lastEditor = lastEditor.displayName
                $finishCallback()
            },
            function(){
                $finishCallback()
            }
        )
    }
    
    if(this.creator){
        $addCallback()
        dpd.users.get(this.creator)
        .then(
            function(creator){
                self.creator = creator.displayName
                $finishCallback()
            },function(){
                $finishCallback()   
            }
        )
    }

    if(query.id){
        
        this.proposals = []

        $addCallback()
        dpd.items.get({proposalFor: this.id})
        .then(
            proposals => { 
                this.proposals.push(...proposals)
                $finishCallback()
            },

            $finishCallback()
        )
    }

} else {
    this.editingNote    = undefined
    this.lastEditor     = undefined
    //this.lastEditDate   = undefined
    this.creator        = undefined
    this.creationDate   = undefined
}

icItemConfig.properties.forEach(function(property){
    if(this[property.name] === undefined)   delete this[property.name]
    if(this[property.name] === null)        delete this[property.name]
})
