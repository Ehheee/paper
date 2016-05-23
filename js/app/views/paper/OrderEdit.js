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
        priceComponents: [
            {labels: ["priceComponent", "paper"], pricePerOperation: 5, name: "A4", width: 210, height: 297},
            {labels: ["priceComponent", "color"], pricePerOperation: 6, name: "cmyk", amountPerProduct: 4},
            {labels: ["priceComponent", "color"], pricePerOperation: 10, name: "pantone", amountPerProduct: 5},
            //{labels: ["priceComponent", "folding"], amountPerProduct: 1, pricePerOperation: 7, name: "ajaleht", sizeDifference: 2, vertical: true, cutPoints: [0.5]},
        ],
    };
    var module = Backbone.View.extend({
        template: templateLoader.get("orderEditTemplate"),
        events: {
            "click .js_addComponent": "addPriceComponentSelect",
            "click .js_saveOrder": "saveOrder"
        },
        initialize: function(options) {
            _.extend(this, options);
            this.$priceComponents = this.$(".js_priceComponents");
            this.paperCanvas = new PaperCanvas();
            this.priceCalculator = new PriceCalculator();
            this.priceComponentViews = [];
            this.checkOrCreateOrder();
            this.reCalculate();
        },
        render: function() {
            this.$el.html(this.template({}));
            this.renderUserInputs();
            this.renderPriceComponents();
            this.renderPaperCanvas();
        },
        renderUserInputs: function() {
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
            for (var i = 0; i < this.order.priceComponents.length; i++) {
                var component = this.order.priceComponents[i];
                var priceComponentSelect;
                if (model.belongsToPermanentPriceComponentGroup(component)) {
                    var label = model.getPermanentPriceComponentGroupLabel(component);
                    priceComponentSelect = new PriceComponentSelect({component: component, key: i, label: label});
                    this.$priceComponents.prepend(priceComponentSelect.render().$el);
                } else {
                    priceComponentSelect = new PriceComponentSelect({component: component, key: i});
                    this.$priceComponents.append(priceComponentSelect.render().$el);
                }
                this.priceComponentViews.push(priceComponentSelect);
            }
        },
        renderPaperCanvas: function() {
            this.$(".js_canvasContainer").append(this.paperCanvas.render().$el);
        },
        addPriceComponentSelect: function() {
            var sel = new PriceComponentSelect({callback: this.onComponentSelected.bind(this)});
            this.$priceComponents.append(sel.render().$el);
        },
        onComponentSelected: function(key, component, selectView) {
            if (typeof key !== "undefined") {
                this.order.priceComponents[key] = component;
            } else {
                this.order.priceComponents.push(component);
                selectView.key = this.order.priceComponents.length - 1;
            }
            
        },
        reCalculate: function() {
            if (!this.paperPlacementCalc) {
                this.paperPlacementCalc = new PaperPlacementCalculator();
            }
            var paper = this.getComponentByLabel("paper");
            var printPlates = this.getComponentByLabel("printPlates");
            this.paperPlacementCalc.setOptions(this.order, this.getComponentByLabel("folding"), {width: paper.width, height: paper.height});
            var res = this.paperPlacementCalc.getResult();
            paper.amount = res.paperAmount;
            if (printPlates) {
                printPlates.amount = res.printPlatesAmount;
            }
            this.priceCalculator.calculatePrices(this.order);
            this.setTotals();
            this.paperCanvas.setSize(paper.width*2, paper.height*2);
            this.paperCanvas.setRectangles(res.rectangles);
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
                var c = this.order.priceComponents[i];
                v.setTotal(c.total);
            }
        },
        addSave: function() {
            this.$(".js_saveOrder").show();
        },
        saveOrder: function() {
            console.log(save);
        },
        onUserInputChange: function(key, value) {
            this.order[key] = utils.stringToType(value);
            console.log(this.order);
            this.reCalculate();
            
        },
        checkOrCreateOrder: function() {
            if (!this.order) {
                this.order = defaultOrder;
            }
            this.folding = this.getComponentByLabel("folding");
            this.paper = this.getComponentByLabel("paper");
        },
        getComponentByLabel: function(label) {
            var results = [];
            for (var i = 0; i < this.order.priceComponents.length; i++) {
                var c = this.order.priceComponents[i];
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
