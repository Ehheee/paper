define(["backbone", 
        "app/templateLoader",
        "app/views/common/Input",
        "app/views/common/HoverContainer",
        "app/views/paper/PriceComponentEdit",
        "app/data/paperModel"
        ], function(Backbone, 
                    templateLoader,
                    Input,
                    HoverContainer,
                    PriceComponentEdit,
                    model) {
    var module = Backbone.View.extend({
        template: templateLoader.get("priceComponentSelectTemplate"),
        events: {
            "click .js_remove": "remove",
            "click .js_componentTotal": "expandComponent"
        },
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
        expandComponent: function(evt) {
            evt.stopPropagation();
            if (this.component) {
                this.editView = new PriceComponentEdit({priceComponent: this.component, isOrderComponent: true});
                this.listenTo(this.editView, "priceComponent:save", this.componentChanged);
                var hoverContainer = new HoverContainer({subView: this.editView, xPosition: evt.pageX, yPosition: evt.pageY});
            }
        },
        componentChanged: function(component) {
            this.component = component;
            this.callback(this.key, component, this);
        },
        onSelectNewPriceComponent: function(key, component) {
            if (typeof component !== "undefined") {
                this.component = component;
                this.callback(this.key, component, this);
            }
        },
        remove: function() {
            this.trigger("component:remove", this.key);
            Backbone.View.prototype.remove.call(this);
        },
        setTotal: function(total) {
            if (_.isNumber(total) && !_.isNaN(total)) {
                this.$(".js_componentTotal").html(total);
            }
        }
    });
    return module;
});
