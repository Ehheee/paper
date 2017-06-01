define([
    "backbone",
    "app/data/thingServer",
    "app/data/paperModel",
    "app/templateLoader",
    "app/utils",
    "app/views/common/Input",
    "app/views/common/InputGroup",
    "app/views/paper/PaperCanvas",
    "app/views/paper/PriceComponentSelect",
    "app/logic/PriceCalculator",
    "app/logic/PaperPlacementCalculator"
    ],
    function(
        Backbone, 
        thingServer,
        model,
        templateLoader,
        utils,
        Input,
        InputGroup,
        PaperCanvas,
        PriceComponentSelect,
        PriceCalculator,
        PaperPlacementCalculator
    ) {
    var defaultOrder = {
        name: "",
        numColors: 1,
        bleedTop: 3,
        bleedRight: 3,
        bleedBottom: 3,
        bleedLeft: 3,
        cuttingGap: 2,
        greiferTop: 20,
        productHeight: 152,
        productWidth: 102,
        amount: 1,
        numPages: 1,
        relationsOutGoing: {hasPriceComponent: [
            {to: {labels: ["priceComponent", "paper"], pricePerOperation: 5, name: "A4", width: 320, height: 450}},
            {to: {labels: ["priceComponent", "color"], pricePerOperation: 6, name: "cmyk", amountPerProduct: 4}},
            {to: {labels: ["priceComponent", "color"], pricePerOperation: 10, name: "pantone", amountPerProduct: 5}},
            //{labels: ["priceComponent", "folding"], amountPerProduct: 1, pricePerOperation: 7, name: "ajaleht", sizeDifference: 2, vertical: true, cutPoints: [0.5]},
        ]},
    };
    var module = Backbone.View.extend({
        template: templateLoader.get("orderEditTemplate"),
        events: {
            "click .js_addComponent": "addPriceComponentSelect",
            "click .js_saveOrder": "saveOrder",
            "click .js_saveTemplate": "saveAsTemplate"
        },
        initialize: function(options) {
            _.extend(this, options);
            this.paperCanvas = new PaperCanvas();
            this.priceCalculator = new PriceCalculator();
            this.priceComponentViews = [];
            this.checkOrCreateOrder();
        },
        render: function() {
            this.$el.html(this.template({}));
            this.$priceComponents = this.$(".js_priceComponents");
            this.renderUserInputs();
            this.listenToOnce(model, "templatePriceComponents:refreshed", this.renderPriceComponents);
            model.getTemplatePriceComponents({});
            this.renderPaperCanvas();
        },
        renderUserInputs: function() {
            this.nameInput = new Input({key: "name", value: this.order.name, callback: this.onUserInputChange.bind(this)});
            this.$(".userInputs").append(this.nameInput.render().$el);
            this.amountInput = new Input({key: "amount", value: this.order.amount, callback: this.onUserInputChange.bind(this)});
            this.numPagesInput = new Input({key: "numPages", value: this.order.numPages, callback: this.onUserInputChange.bind(this)});
            this.productHeightInput = new Input({key: "productHeight", value: this.order.productHeight,  callback: this.onUserInputChange.bind(this)});
            this.productWidthInput = new Input({key: "productWidth", value: this.order.productWidth,  callback: this.onUserInputChange.bind(this)});
            //this.bleedsInput = new InputGroup({keys: ["bleedTop", "bleedRight", "bleedBottom", "bleedLeft"], model: this.order, callback: this.onUserInputChange.bind(this)});
            this.cuttingGapInput = new Input({key: "cuttingGap", value: this.order.cuttingGap, callback: this.onUserInputChange.bind(this)});
            this.twoSidedInput = new Input({key: "twoSided", checkbox: true, checked: this.order.twoSided, callback: this.onUserInputChange.bind(this)});
            this.$(".userInputs").append(this.amountInput.render().$el).append(this.productHeightInput.render().$el).append(this.productWidthInput.render().$el);
            this.$(".userInputs").append(this.numPagesInput.render().$el).append(this.cuttingGapInput.render().$el);
            this.$(".userInputs").append(this.twoSidedInput.render().$el);
        },
        renderPriceComponents: function() {
            if (!this.order.relationsOutGoing) {
                return;
            }
            for (var i = 0; i < this.order.relationsOutGoing.hasPriceComponent.length; i++) {
                var component = this.order.relationsOutGoing.hasPriceComponent[i].to;
                var priceComponentSelect;
                if (model.belongsToPermanentPriceComponentGroup(component)) {
                    var label = model.getPermanentPriceComponentGroupLabel(component);
                    priceComponentSelect = new PriceComponentSelect({component: component, key: i, label: label, callback: this.onComponentSelected.bind(this)});
                    this.$priceComponents.prepend(priceComponentSelect.render().$el);
                } else {
                    priceComponentSelect = new PriceComponentSelect({component: component, key: i, callback: this.onComponentSelected.bind(this)});
                    this.$priceComponents.append(priceComponentSelect.render().$el);
                }
                this.listenToOnce(priceComponentSelect, "component:remove", this.onComponentRemove);
                this.priceComponentViews.push(priceComponentSelect);
            }
        },
        renderPaperCanvas: function() {
            this.$(".js_canvasContainer").append(this.paperCanvas.render().$el);
        },
        addPriceComponentSelect: function() {
            var sel = new PriceComponentSelect({callback: this.onComponentSelected.bind(this), key: this.priceComponentViews.length});
            this.listenToOnce(sel, "component:remove", this.onComponentRemove);
            this.$priceComponents.append(sel.render().$el);
            this.order.relationsOutGoing.hasPriceComponent.push({});
            this.priceComponentViews.push(sel);
        },
        onComponentRemove: function(key) {
            this.priceComponentViews.splice(key, 1);
            this.order.relationsOutGoing.hasPriceComponent.splice(key, 1);
            this.reCalculate();
        },
        onComponentSelected: function(key, component, selectView) {
            console.log(component);
            if (typeof key !== "undefined") {
                this.order.relationsOutGoing.hasPriceComponent[key].to = component;
            } else {
                this.order.relationsOutGoing.hasPriceComponent.push({to: component});
                selectView.key = this.order.relationsOutGoing.hasPriceComponent.length - 1;
            }
            var printer = this.getComponentByLabel("printer");
            if (printer)  {
                _.each(printer, function(value, key) {
                    if (key.indexOf("greifer") > -1) {
                        this.order[key] = value;
                    }
                }, this);
            }
            this.reCalculate();
        },
        reCalculate: function() {
            if (this.order.relationsOutGoing.hasPriceComponent.length < 1) {
                return;
            }
            if (!this.paperPlacementCalc) {
                this.paperPlacementCalc = new PaperPlacementCalculator();
            }
            var paper = this.getComponentByLabel("paper");
            var printPlates = this.getComponentByLabel("printPlates");
            var printer = this.getComponentByLabel("printer");
            if (paper) {
                this.paperPlacementCalc.setOptions(this.order, this.getComponentByLabel("folding"), {width: paper.width, height: paper.height}, printPlates || []);
                var res = this.paperPlacementCalc.getResult();
                this.paperPlacementCalc.setPrintPlatesAmount();
                paper.amount = res.paperAmount;
                if (printer) {
                    printer.amount = res.paperAmount * (this.order.twoSided ? 2 : 1);
                }
                this.paperCanvas.setSize(paper.width*2, paper.height*2);
                this.paperCanvas.setRectangles(res.rectangles);
            }
            this.priceCalculator.calculatePrices(this.order);
            this.setTotals();
            console.log(this.order);
            console.log(res);
            /*
             * calculate how much products per paper
             * calculate how much paper is needed
             * calculate how many printplates are needed
             * calculate priceComponents new cost
             */
        },
        setTotals: function() {
            for (var i = 0; i < this.priceComponentViews.length; i++) {
                var v = this.priceComponentViews[i];
                var c = this.order.relationsOutGoing.hasPriceComponent[i].to;
                if (!c) continue;
                v.setTotal(c.total);
            }
            this.$(".js_grandTotal").html(this.order.total);
        },
        addSave: function() {
            this.$(".js_saveOrder").show();
        },
        saveOrder: function() {
            model.saveOrder(this.order);
        },
        saveAsTemplate: function() {
            if (this.order.labels.indexOf("template") > -1) {
                this.order.labels.push("template");
            }
            this.saveOrder();
        },
        onUserInputChange: function(key, value) {
            this.order[key] = utils.stringToType(value);
            console.log(this.order);
            this.reCalculate();
        },
        checkOrCreateOrder: function() {
            if (!this.order) {
                this.order = {cuttingGap: 2, relationsOutGoing: {hasPriceComponent: []}, bleedTop: 3, bleedBottom: 3, bleedLeft: 3, bleedRight: 3};
            }
        },
        getComponentByLabel: function(label) {
            var results = [];
            for (var i = 0; i < this.order.relationsOutGoing.hasPriceComponent.length; i++) {
                var c = this.order.relationsOutGoing.hasPriceComponent[i].to;
                if (!c || !c.labels) continue;
                var k = c.labels.indexOf(label);
                if (k > -1) {
                    results.push(c);
                }
            }
            if (results.length > 1) {
                return results;
            } else if (results.length == 1) {
                return results[0];
            }
        }
    });
    return module;
});
