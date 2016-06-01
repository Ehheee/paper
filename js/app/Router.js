define([
    "backbone",
    "app/data/paperModel",
    "app/views/MainView",
    "app/views/paper/OrderEdit",
    "app/views/paper/PriceComponentEdit",
    "app/views/paper/PriceComponentList"
    ], function(
        Backbone,
        paperModel,
        MainView,
        OrderEdit,
        PriceComponentEdit,
        PriceComponentList
    ) {
    var module = Backbone.Router.extend({
        routes: {
            "orders/list/": "listOrders",
            "orders/edit/(:id)" : "editOrder",
            "pc/list/": "listPriceComponents",
            "pc/edit/(:id)/": "editPriceComponent"
        },
        initialize: function() {
            Backbone.on("router:navigate", this.navigate, this);
            this.mainView = new MainView();
            this.mainView.render();
        },
        listOrders: function() {
        },
        editOrder: function(id) {
            var view = new OrderEdit({});
            if (typeof id !== "undefined") {
                
            } else {
                this.mainView.setView(view);
            }
        },
        listPriceComponents: function() {
            var view = new PriceComponentList({});
            this.mainView.setView(view);
        },
        editPriceComponent: function(id) {
            var view = new PriceComponentEdit({componentId: id});
            this.mainView.setView(view);
            this.mainView.render();
        }
    });
    return module;
});
