define(["backbone", "app/utils"], function(Backbone, utils) {
    var module = function() {
        this.templatePriceComponentsById = {};
        this.templatePriceComponentsByLabel = {};
        this.priceComponentsById = {};
    };
    var permanentPriceComponentGroupLabels = ["paper", "color", "folding"];
    
    module.prototype.getPriceComponentById = function(id, callback) {
        if (!this.templatePriceComponentsById[id] && !this.priceComponentsById[id]) {
            Backbone.trigger("request:data", {responseChannel: "priceComponent:get", data: {labels: ["priceComponent"], properties: {id: id}, responseFormat: "resultWrapper"}, path: "/thing/json/get"});
            Backbone.once("priceComponent:get", this.receivePriceComponent.bind(this, id));
        } else {
            var c = this.templatePriceComponentsById[id] || this.priceComponentsById[id];
            this.trigger("component:"+component.id, component);
        }
    };
    module.prototype.receivePriceComponent = function(id, data) {
        if (data.things[id] || data.things[parseInt(id)]) {
            var component = this.priceComponentFromThing(data.things[id] || data.things[parseInt(id)]);
            this.trigger("component:"+component.id, component);
        }
    };
    module.prototype.savePriceComponent = function(priceComponent, callback) {
        Backbone.trigger("request:data", {responseChannel: "priceComponent:saved", data: priceComponent, path: "thing/json/update"});
        if (callback) {
            Backbone.once("priceComponent:saved", callback);
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
    module.prototype.getTemplatePriceComponents = function(f) {
        Backbone.trigger("request:data", {responseChannel: "get:templatePriceComponents", path: "thing/json/get", data: {labels: f.labels, properties: f.properties, responseFormat: "resultWrapper"}});
        Backbone.once("get:templatePriceComponents", this.processTemplatePriceComponents, this);
    };
    module.prototype.processTemplatePriceComponents = function(data) {
        if (_.keys(data.things).length > 0) {
            _.each(data.things, function(thing, id) {
                var component = this.priceComponentFromThing(thing);
                this.templatePriceComponentsById[id] = component;
                if (component.labels.length > 2) {
                    for (var i = 0; i < component.labels; i++) {
                        if (component.label === "template" || component.label === "priceComponent") {
                            continue;
                        }
                        this.templatePriceComponentsByLabel[componen.id] = component;
                    }
                }
            }, this);
        }
        this.trigger("templatePriceComponents:refreshed");
    };
    module.prototype.priceComponentFromThing = function(thing) {
        var component = {labels: thing.labels};
        _.extend(component, thing.properties);
        return component;
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
