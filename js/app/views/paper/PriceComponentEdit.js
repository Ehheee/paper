define(["backbone", "app/data/ThingServer", "app/data/paperModel"], function(Backbone, ThingServer, paperModel) {
    var module = Backbone.View.extend({
        /*
         *  Possible options:
         *  priceComponent - priceComponent model to show
         *  
         */
        events: {
            "click .js_addField": "addField",
            "click .js_save": "save",
            "click .js_saveNew": "saveNew"
        },
        initialize: function(options) {
            _.extend(this, options);
            this.fieldInputs = [];
        },
        render: function() {
            
        },
        addField: function() {
            var fieldTypeInput = new Input({key: this.fieldInputs.length, values: paperModel.getRootPriceComponent().fields});
            var fieldValueInput = new Input({key: this.fieldInputs.length, value: 0});
            this.fieldInputs.push({fieldType: fieldTypeInput, fieldValue: fieldValueInput});
        },
        
    });
    return module;
});
