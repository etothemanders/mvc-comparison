$(document).ready(function() {
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

    var ItemsView = Backbone.View.extend({
        el: '.table-body',

        initialize: function() {
            this.listenTo(this.collection, 'sync', this.render);
        },
        render: function() {
            var $list = this.$('tr.table-item').empty();

            this.collection.each(function(model) {
                var itemView = new ItemView({model: model});
                $list.append(itemView.render().$el);
            }, this);

            return this;
        }
    });

    var ItemView = Backbone.View.extend({
        el: 'tr.table-item',
        template: _.template($('#item-tmpl').html()),

        render: function() {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            return this;
        }

    });

    var items = new ItemCollection();
    var itemsView = new ItemsView({collection: items});
});