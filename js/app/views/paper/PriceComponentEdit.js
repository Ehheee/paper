define(["backbone", "app/data/ThingServer"], function(Backbone, ThingServer) {
    var module = Backbone.View.extend({
        /*
         *  options.priceComponent
         */
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            
        },
        addField: function() {
            var fieldTypeInput = new Input({key: "WHAT????", values: paperModel.getRootPriceComponent().fields});
        }
    });
    return module;
});
