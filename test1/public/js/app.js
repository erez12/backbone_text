var MyModel = Backbone.Model.extend({
    initialize: function(options) {
        this.on('change:id', this.notifyEachIdChange, this);

        let socket = io("http://127.0.0.1:3000");
        socket.on('connect', function(){
            console.log('Connected to server !');
        });
        socket.on('new_data', function(message, ackFunction) {
           console.log("data", message.data);
        });

    },
    notifyEachIdChange: function() {
        console.log('id was changed')
    }
})

var MyView = Backbone.View.extend({
    el: '#my-view-container',
    events: {
        'click button': 'clickButton',
        'change input': 'changeInput'
    },
    initialize: function(options) {
        this.model = new MyModel()
        console.log('view initialized')
    },
    clickButton: function() {
        var id = this.model.get('id')
        this.$el.find('i').text(id)
    },
    changeInput: function() {
        var value = this.$el.find('input').val()
        this.model.set('id', value)
    }
})

var view = new MyView()
