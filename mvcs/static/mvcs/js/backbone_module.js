var ItemModel = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null,
        quantity: null,
        purchased:  null
    }
});

var ItemCollection = Backbone.Collection.extend({
    url: '/items/',
    model: ItemModel,

    initialize: function() {
        this.fetch()
    },
    parse: function(data) {
        return data.items;
    }
});

$(document).ready(function() {
    var items = new ItemCollection();

    console.log(items);
});