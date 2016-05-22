define(["backbone", "app/data/ThingServer", "app/data/paperModel", "app/views/paper/PriceComponentFieldEdit"], function(Backbone, ThingServer, paperModel, PriceComponentFieldEdit) {
    var fields = ["amountPerProduct", "amount", "pricePerOperation", "timePerOperation", "pricePerTime", "otherExpences"];
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
        renderFields: function() {
            for (var i = 0; i < fields.length; i++) {
                if (typeof this.priceComponent[fields[i]] !== "undefined") {
                    this.renderField(fields[i]);
                }
            }
            var keys = _.keys(this.priceComponent);
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (fields.indexOf(k) < 0) {
                    this.renderField(k);
                }
            }
        },
        renderField: function(key) {
            var fieldView = new PriceComponentFieldEdit({type: key, value: this.priceComponent[key], fields: fields});
            this.listenTo(fieldView, "field:changed", this.onFieldChange);
            this.$(".js_fields").append(fieldView);
        },
        addField: function() {
            var fieldTypeInput = new Input({key: this.fieldInputs.length, values: paperModel.getRootPriceComponent().fields});
            var fieldValueInput = new Input({key: this.fieldInputs.length, value: 0});
            this.fieldInputs.push({fieldType: fieldTypeInput, fieldValue: fieldValueInput});
        },
        
    });
    return module;
});
