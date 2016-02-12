define(["backbone", "app/data/ThingServer"], function(Backbone, ThingServer) {
    var module = Backbone.View.extend({
        /*
         *  options.template - Order template which contains relevant PriceComponents
         */
        events: {
            "click .js_addComponent": "addPriceComponent"
        },
        initialize: function(options) {
            _.extend(this, options);
            this.priceComponents = [];
        },
        render: function() {
            
        },
        addPriceComponent: function() {
            
        },
        
    });
    return module;
});
