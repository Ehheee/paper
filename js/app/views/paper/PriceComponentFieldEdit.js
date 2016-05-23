define(["backbone", "app/templateLoader", "app/views/common/Input"], function(Backbone, templateLoader, Input) {
    /*
     * Price in cents
     * Time in minutes
     * amountPerProduct - how much times this component is "activated" per single product. For example paper can be 1/6 and making a die 2.
     * amount - how much times this component is "activated" overall. If set, then amountPerProduct is not used.
     * pricePerOperation - price per each "activation" of this component. For example materials
     * timePerOperation - how much time is spent on each "activation"
     * pricePerTime - if each unit of time costs something extra. For example wages and electricity.
     * otherExpences - for specyfing other random costs that are only payed once per component.
     */
    var valueSuggestions = ["100", "50", "25", "10", "5", "4", "3", "2", "1", "0" , "1/2", "1/3", "1/4", "1/5", "1/6", "1/7", "1/8", "1/9", "1/10", "1/15", "1/25", "1/50", "1/100"];
    var module = Backbone.View.extend({
        template: templateLoader.get("priceComponentFieldEditTemplate"),
        render: function() {
            this.$el.html(this.template({}));
            this.fieldTypeInput = new Input({key: "fieldType", element: this.$(".js_fieldType"), suggests: this.fields, value: this.type || ""});
            this.fieldTypeInput.render();
            this.listenTo(this.fieldTypeInput, "input:changed", this.onChange);
            this.fieldValueInput = new Input({key: "fieldValue", element: this.$(".js_fieldValue"), suggests: valueSuggestions, value: this.value || ""});
            this.fieldValueInput.render();
            this.listenTo(this.fieldValueInput, "input:changed", this.onChange);
            return this;
        },
        initialize: function(options) {
            _.extend(this, options);
        },
        onChange: function(key, value) {
            if (key === "fieldValue") {
                if (value.indexOf("/") > -1){
                    var s = value.indexOf("/");
                    var numerator = s === 0 ? 1 : value.slice(0, s);
                    var denominator = value.slice(s + 1);
                    value = numerator / denominator;
                }
                this.value = value;
            } else {
                this.type = value;
            }
            this.trigger("field:changed", this.type, this.value);
        },
    });
    return module;
});
