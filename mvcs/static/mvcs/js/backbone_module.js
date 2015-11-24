$(document).ready(function() {
    var ItemModel = Backbone.Model.extend({
        defaults: {
            id: null,
            name: null,
            quantity: null,
            purchased:  null
        },

        toggle: function() {
            this.save({
                purchased: !this.get('purchased')
            },
            {
                headers: {'X-CSRFToken': form.getCookie('csrftoken')},
            });
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

    var FormView = Backbone.View.extend({
        el: '.form-container',
        template: _.template($('#shopping-list-form').html()),
        events: {
            'click #addItemBtn': 'onAdd'
        },

        initialize: function() {
            this.render();
        },
        render: function() {
            var html = this.template();
            this.$el.html(html);
            return this;
        },
        getCookie: function(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
        onAdd: function(event) {
            event.preventDefault();
            var self = this;
            var itemName = $('#itemName').val();
            var itemQuantity = $('#itemQuantity').val();
            $.ajax({
                url: items.url,
                method: 'POST',
                headers: {'X-CSRFToken': this.getCookie('csrftoken')},
                data: {
                    'name': itemName,
                    'quantity': itemQuantity
                },
                error: function(err) {
                    console.log('Error status: ' + err.status + ' statusText: ' + err.statusText);
                },
                success: function(resp) {
                    console.log(resp);
                    items.fetch();
                    self.render();
                }
            });
        }
    });

    var ItemsView = Backbone.View.extend({
        el: '.table-container',
        template: _.template($('#shopping-list').html()),

        initialize: function() {
            this.listenTo(this.collection, 'sync', this.render);

        },
        render: function() {
            if(this.collection.models.length > 0) {
                var html = this.template();
                this.$el.html(html);
            }

            var $tableBody = $('.table-body');
            $tableBody.empty();

            this.collection.each(function(model) {
                var itemView = new ItemView({model: model});
                $tableBody.append(itemView.$el);
            }, this);

            return this;
        }
    });

    var ItemView = Backbone.View.extend({
        tagName: 'tr',
        className: 'table-item',
        template: _.template($('#item-tmpl').html()),
        events: {
            'click .item-delete': 'onDelete',
            'click .item-purchase': 'togglePurchased'
        },

        initialize: function() {
            this.listenTo(this.model, 'sync change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.render();
        },
        render: function() {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.$el.find('input.item-purchase').attr('checked', this.model.get('purchased', null));
            return this;
        },
        onDelete: function(event) {
            this.model.destroy({
                headers: {'X-CSRFToken': form.getCookie('csrftoken')}
            });
        },
        togglePurchased: function(event) {
            this.model.toggle();
        }
    });

    var form = new FormView();
    var items = new ItemCollection();
    var itemsView = new ItemsView({collection: items});
});