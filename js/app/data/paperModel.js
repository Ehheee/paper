define(["backbone"], function(Backbone) {
    var module = function() {};
    var permanentPriceComponentGroupLabels = ["paper", "color", "folding"];
    module.prototype.getPriceComponentById = function(id) {
        for (var i = 0; i < this.priceComponents.length; i++) {
            var c = this.priceComponents[i];
            if (c.id === id) {
                return c;
            }
        }
    };
    module.prototype.saveThingType = function() {
        
    };
    module.prototype.belongsToPermanentPriceComponentGroup = function(priceComponent) {
        return priceComponent.labels.some(this.isPermanentPriceComponentGroupLabel, this);
    };
    module.prototype.isPermanentPriceComponentGroupLabel = function(label) {
        return permanentPriceComponentGroupLabels.indexOf(label) > -1;
    };
    module.prototype.getPermanentPriceComponentGroupLabel = function(priceComponent) {
        for (var i = 0; i < priceComponent.labels.length; i++) {
            var l = priceComponent.labels[i];
            if (this.isPermanentPriceComponentGroupLabel(l)) {
                return l;
            }
        }
    };
    module.prototype.getPriceComponentGroupNames = function() {
        
    };
    module.prototype.getTemplatePriceComponentNames = function(label) {
        
        return ["die", "plate"];
    };
    module.prototype.getTemplatePriceComponentByName = function(name) {
        for (var i = 0; i < this.templatePriceComponents.length; i++) {
            var c = this.templatePriceComponents[i];
            if (name === c.name) {
                return c;
            }
        }
    };
    module.prototype.getTemplatePriceComponents = function() {
        return this.templatePriceComponents;
    };
    module.prototype.getFoldingByName = function(name) {
        for (var i = 0; i < this.foldings.length; i++) {
            var f = this.foldings[i];
            if (name === f.name) {
                return f;
            }
        }
    };
    module.prototype.getFoldings = function() {
        return this.foldings;
    };
    _.extend(module.prototype, Backbone.Events);
    var m = new module();
    m.templatePriceComponents = [{name: "die", id: "1", otherExpences: 2000, timePerOperation: 1, pricePerTime: 0.25},
                                 {name: "plate", id: "2", amount: 4, pricePerOperation: 5000}];
    m.foldings = [{name: "verticalHalf", sizeDifference: 2, vertical: true}];
    return m;
});
