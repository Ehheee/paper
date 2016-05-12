define(["backbone",
        "app/data/thingServer",
        "app/data/paperModel",
        "app/templateLoader",
        "app/utils",
        "app/views/common/Input",
        "app/views/common/InputGroup",
        "app/views/paper/PaperCanvas",
        "app/logic/PriceCalculator"
       ],function(Backbone, 
                  thingServer,
                  model,
                  templateLoader,
                  utils,
                  Input,
                  InputGroup,
                  PaperCanvas,
                  PriceCalculator) {
    var module = Backbone.View.extend({
        template: templateLoader.get("orderEditTemplate"),
        events: {
            "click .js_addComponent": "addPriceComponentSelect",
            "click .js_saveOrder": "saveOrder"
        },
        initialize: function(options) {
            _.extend(this, options);
            this.$el.html(this.template({}));
            this.$priceComponents = this.$(".js_priceComponents");
            this.checkOrCreateOrder();
            this.priceCalculator = new PriceCalculator(this.order.priceComponents);
        },
        render: function() {
            this.renderUserInputs();
            this.renderPriceComponents();
        },
        renderUserInputs: function() {
            this.amountInput = new Input({key: "amount", value: this.order.amount, callback: this.onUserInputChange.bind(this)});
            this.productHeightInput = new Input({key: "productHeight", value: this.order.height,  callback: this.onUserInputChange.bind(this)});
            this.productWidthInput = new Input({key: "productWidth", value: this.order.width,  callback: this.onUserInputChange.bind(this)});
            this.bleedsInput = new InputGroup({keys: ["bleedTop", "bleedRight", "bleedBottom", "bleedLeft"], model: this.order, callback: this.onUserInputChange.bind(this)});
            this.$(".userInputs").append(this.amountInput.render().$el).append(this.productHeightInput.render().$el).append(this.productWidthInput.render().$el);
            this.$(".userInputs").append(this.bleedsInput.render().$el);
        },
        renderPriceComponents: function() {
            this.priceComponentViews = [];
            for (var i = 0; i < this.order.priceComponents.length; i++) {
                var component = this.order.priceComponents[i];
                this.$priceComponents.append(this.simplePriceComponentTemplate({name: component.name, sum: component.sum}));
            }
        },
        addPriceComponentSelect: function() {
            var componentTypeInput = new Input({key: "componentType", showKey: "name", valueKey: "id", values: model.getTemplatePriceComponents(), callback: this.onSelectNewPriceComponent.bind(this)});
            this.$priceComponents.append(componentTypeInput.$el);
        },
        onSelectNewPriceComponent: function(key, componentId) {
            var component = model.getPriceComponentById(componentId);
            this.order.priceComponents.push(component);
            this.priceCalculator.addPriceComponent(component);
            this.addSave();
            this.$priceComponents.append(this.simplePriceComponentTemplate({name: component.name, sum: component.sum}));
            
        },
        addSave: function() {
            this.$("js_saveOrder").show();
        },
        saveOrder: function() {
            console.log(save);
        },
        onUserInputChange: function(key, value) {
            this.order[key] = utils.stringToType(value);
            console.log(this.order);
            this.priceCalculator.calculatePrices(this.order);
            
        },
        checkOrCreateOrder: function() {
            if (!this.order) {
                this.order = {name: "", bleedTop: 3, bleedRight: 3, bleedBottom: 3, bleedLeft: 3, height: 152, width: 102, amount: 1, priceComponents: []};
            }
        }
    });
    return module;
});
