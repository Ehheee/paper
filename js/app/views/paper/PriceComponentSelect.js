define(["backbone", 
        "app/templateLoader",
        "app/views/common/Input",
        "app/data/paperModel"
        ], function(Backbone, 
                    templateLoader,
                    Input,
                    model) {
    var module = Backbone.View.extend({
        template: templateLoader.get("priceComponentSelectTemplate"),
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.template({total: this.component ? this.component.total : 0}));
            var suggests = model.getTemplatePriceComponentNames(this.label);
            this.componentSelect = new Input({element: this.$(".js_componentSelect"), value: this.component ? this.component.name : "", key: "componentType", label: this.label, suggests: suggests, callback: this.onSelectNewPriceComponent.bind(this)});
            this.componentSelect.render();
            return this;
        },
        onSelectNewPriceComponent: function(key, value) {
            var component = model.getTemplatePriceComponentByName(value);
            if (typeof component !== "undefined") {
                this.callback(this.key, component, this);
            }
        },
        setTotal: function(total) {
            this.$(".js_componentTotal").html(total);
        }
    });
    return module;
});
