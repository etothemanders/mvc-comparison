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
            $('.error-msg-container').empty();

            var self = this;
            var itemName = $('#itemName').val();
            var itemQuantity = $('#itemQuantity').val();
            if (this.formIsValid()) {
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
                        items.fetch();
                        self.render();
                    }
                });
            }
        },
        formIsValid: function() {
            var itemName = $('#itemName').val().trim();
            var itemQuantity = $('#itemQuantity').val().trim();
            var isValid = true;

            if (itemName === '') {
                var emptyName = new ErrorView('Please enter an item name.');
                isValid = false;
            }
            if (itemQuantity === '') {
                var emptyQuantity = new ErrorView('Please enter a quantity.');
                isValid = false;
            }
            if (/[^\d]+/.test(itemQuantity)) {
                var illegalQuantity = new ErrorView('Only whole numbers can be used for item quantities.');
                isValid = false;
            }
            return isValid;
        }
    });

    var ItemsView = Backbone.View.extend({
        el: '.table-container',
        template: _.template($('#shopping-list').html()),

        initialize: function() {
            this.listenTo(this.collection, 'sync change', this.render);

        },
        render: function() {
            this.$el.empty();

            if(this.collection.models.length > 0) {
                var html = this.template();
                this.$el.html(html);
            }

            var $tableBody = $('.table-body');

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
                headers: {'X-CSRFToken': form.getCookie('csrftoken')},
                success: function(resp) {
                    items.fetch();
                }
            });
        },
        togglePurchased: function(event) {
            this.model.toggle();
        }
    });

    var ErrorView = Backbone.View.extend({
        tagName: 'p',
        className: 'bg-warning',

        initialize: function(text) {
            this.render(text);
        },
        render: function(text) {
            this.$el.html(text);
            $('.error-msg-container').append(this.$el);
        }
    });

    var form = new FormView();
    var items = new ItemCollection();
    var itemsView = new ItemsView({collection: items});
});