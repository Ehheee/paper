define([
    "backbone",
    "app/data/paperModel",
    "app/views/MainView",
    "app/views/paper/OrderEdit",
    "app/views/paper/OrderList",
    "app/views/paper/PriceComponentEdit",
    "app/views/paper/PriceComponentList"
    ], function(
        Backbone,
        paperModel,
        MainView,
        OrderEdit,
        OrderList,
        PriceComponentEdit,
        PriceComponentList
    ) {
    var module = Backbone.Router.extend({
        routes: {
            "order/list/": "listOrders",
            "order/edit/(:id/)" : "editOrder",
            "pc/list/": "listPriceComponents",
            "pc/edit/(:id/)": "editPriceComponent"
        },
        initialize: function() {
            Backbone.on("router:navigate", this.navigate, this);
            this.mainView = new MainView();
            this.mainView.render();
        },
        listOrders: function() {
            var view = new OrderList({});
            this.mainView.setView(view);
        },
        editOrder: function(id) {
            if (typeof id !== "undefined" && id !== null) {
                this.listenToOnce(paperModel, "orders:get", this.showEditOrder);
                paperModel.getOrders({properties: {id: id}});
            } else {
                this.showEditOrder();
            }
        },
        showEditOrder: function(order) {
            console.log(order);
            var view = new OrderEdit({order: order ? order[0] : undefined});
            this.mainView.setView(view);
            this.mainView.render();
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
