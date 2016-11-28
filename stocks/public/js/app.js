"use strict"

const ENTER_KEY = 13;
// Stock Model
const Stock = Backbone.Model.extend({
    defaults: {
        id: -1,
        status: 'up',
        price: -1,
        name: 'NaN'
    }
});

// A List of stocks
const StocksCollection = Backbone.Collection.extend({
    model: Stock
});

// The View for a Stock
const StockView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#stock-template').html()),
    initialize: function(){
        this.model.bind("change", this.render, this);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.css("color", this.model.get("status") === "up" ? "green" : "red");
        return this;
    },
    toggleVisible: function (){
        this.$el.toggleClass('hidden', this.isHidden());
    },
    isHidden: function () {
        return this.model.get('filtered');
    },
});

// View for all stocks
const StocksView = Backbone.View.extend({
    el: '.stock-table',
    initialize: function(){
        this.collection.on("add", this.addStockView, this);
    },
    addStockView: function (person){
        var stockView = new StockView({ model: person });
        this.$el.append(stockView.render().el);
    },
    render: function() {
        this.collection.each(this.addStockView, this);

        return this;
    }
});

let app = {};
app.stocks = new StocksCollection();
app.stocksView = new StocksView({
    collection: app.stocks
});

const AppView = Backbone.View.extend({
    el: '.container',

    events: {
        'keypress #filterById': 'filterOnEnter'
    },

    initialize: function () {
        this.allCheckbox = this.$('.toggle-all')[0];
        this.$input = this.$('#filterById');


        // this.listenTo(app.todos, 'add', this.addOne);
        // this.listenTo(app.todos, 'reset', this.addAll);
        // this.listenTo(app.todos, 'change:completed', this.filterOne);
        // this.listenTo(app.todos, 'filter', this.filterAll);
        // this.listenTo(app.todos, 'all', _.debounce(this.render, 0));
    },
    getFilteredStocks: function() {
        let values = this.$input.val().trim();
        if (!values) {
            return [];
        }

        return values.split(',').map((v) => v.trim());
    },
    filterOnEnter: function (e) {
        if (e.which === ENTER_KEY) {
            let values = this.getFilteredStocks();

            app.stocks.each((stock) => {
                stock.set('filtered', values.length > 0 && (values.indexOf(stock.get("id")) < 0));
                stock.trigger('visible');
            });
        }
    }

});
new AppView();
let socket = io();
socket.on('connect', function(){
    console.log('Connected to server !');
    socket.emit('initial_connect', {}, function (stocksData){
        stocksData.forEach( (stock) => {
            let child = app.stocks.findWhere({id: stock.id});
            if (!child) {
                app.stocks.add(stock);
                return;
            }
            child.set(stock);
        });
        socket.on('new_data', function(newData, ackFunction) {
            newData.forEach((data) => {
                let child = app.stocks.findWhere({id: data.id});
                child.set(data);
            });
        });
    });

});
