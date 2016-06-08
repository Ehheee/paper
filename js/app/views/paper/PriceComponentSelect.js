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
            this.listenToOnce(model, "templatePriceComponents:refreshed", this.renderSelect);
            model.getTemplatePriceComponents({labels: this.label ? [this.label] : []});
            return this;
        },
        renderSelect: function() {
            var suggests = [];
            if (this.label) {
                _.each(model.templatePriceComponentsByLabel[this.label], function(s) {
                    suggests.push(s);
                });
            } else {
                _.each(model.templatePriceComponentsById, function(s) {
                    suggests.push(s);
                });
            }
            this.componentSelect = new Input({element: this.$(".js_componentSelect"), value: this.component ? this.component.name : "", key: "componentType", showKey: "name", label: this.label, suggests: suggests, callback: this.onSelectNewPriceComponent.bind(this)});
            this.componentSelect.render();
        },
        onSelectNewPriceComponent: function(key, component) {
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
