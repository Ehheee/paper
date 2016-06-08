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
    module.prototype.saveOrder = function(order) {
        order = utils.cloneJson(order);
        order.labels = ["order"];
        for (var i = 0; i < order.relationsOutGoing.hasPriceComponent.length; i++) {
            var c = order.relationsOutGoing.hasPriceComponent[i].to;
            var j = c.labels.indexOf("template");
            if (j > -1) {
                c.labels.splice(j, 1);
                delete c.id;
            }
        }
        Backbone.once("order:saved", this.processSavedOrder, this);
        Backbone.trigger("request:data", {responseChannel: "order:saved", data: order, path: "thing/json/update"});
    };
    module.prototype.getOrders = function(f, callback) {
        if (!f.labels) {
            f.labels = [];
        }
        f.labels = ["order"].concat(f.labels);
        Backbone.once("orders:get", this.processOrders.bind(this, callback));
        Backbone.trigger("request:data", {responseChannel: "orders:get", data: {labels: f.labels, properties: f.properties, responseFormat: "resultWrapper"}, path: "/thing/json/get"});
    };
    module.prototype.processOrders = function(callback, data) {
        var result = [];
        _.each(data.things, function(t) {
            var o = this.orderFromThing(t);
            if (o.labels.indexOf("order") > -1) {
                result.push(o);
            }
        }, this);
        if (callback) {
            callback(result);
        }
        this.trigger("orders:get", result);
    };
    module.prototype.processSavedOrder = function(data) {
        console.log(data);
    };
    module.prototype.belongsToPermanentPriceComponentGroup = function(priceComponent) {
        return priceComponent.labels.some(this.isPermanentPriceComponentGroupLabel, this);
    };
    module.prototype.isPermanentPriceComponentGroupLabel = function(label) {
        return _.keys(this.templatePriceComponentsByLabel).indexOf(label) > -1;
    };
    module.prototype.getPermanentPriceComponentGroupLabel = function(priceComponent) {
        for (var i = 0; i < priceComponent.labels.length; i++) {
            var l = priceComponent.labels[i];
            if (this.isPermanentPriceComponentGroupLabel(l)) {
                return l;
            }
        }
    };
    module.prototype.getTemplatePriceComponents = function(f) {
        if (f.labels) {
            if (f.labels.length < 2) {
                if (this.templatePriceComponentsByLabel[f.labels[0]]) {
                    this.trigger("templatePriceComponents:refreshed");
                    return;
                }
            }
        } else {
            f.labels = [];
        }
        f.labels = ["template", "priceComponent"].concat(f.labels);
        Backbone.trigger("request:data", {responseChannel: "get:templatePriceComponents", path: "thing/json/get", data: {labels: f.labels, properties: f.properties, responseFormat: "resultWrapper"}});
        Backbone.once("get:templatePriceComponents", this.processTemplatePriceComponents, this);
    };
    module.prototype.processTemplatePriceComponents = function(data) {
        if (_.keys(data.things).length > 0) {
            _.each(data.things, function(thing, id) {
                var component = this.priceComponentFromThing(thing);
                this.templatePriceComponentsById[id] = component;
                if (component.labels.length > 2) {
                    for (var i = 0; i < component.labels.length; i++) {
                        var l = component.labels[i];
                        if (l === "template" || l === "priceComponent") {
                            continue;
                        }
                        if (!this.templatePriceComponentsByLabel[l]) {
                            this.templatePriceComponentsByLabel[l] = {};
                        }
                        this.templatePriceComponentsByLabel[l][component.id] = component;
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
    module.prototype.orderFromThing = function(thing) {
        var order = {labels: thing.labels, relationsOutGoing: thing.relationsOutgoing};
        _.extend(order, thing.properties);
        return order;
    };
    _.extend(module.prototype, Backbone.Events);
    var m = new module();
    m.foldings = [{name: "verticalHalf", sizeDifference: 2, vertical: true}];
    return m;
});
