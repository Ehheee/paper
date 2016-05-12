define(["backbone", "app/views/MainView", "app/views/paper/OrderEdit"], function(Backbone, MainView, OrderEdit) {
    var module = Backbone.Router.extend({
        routes: {
            "orders/": "showOrders"
        },
        initialize: function() {
            Backbone.on("router:navigate", this.navigate, this);
            this.mainView = new MainView();
            this.mainView.render();
        },
        showOrders: function() {
            var view = new OrderEdit({});
            this.mainView.setView(view);
            this.mainView.render();
        },
    });
    return module;
});
