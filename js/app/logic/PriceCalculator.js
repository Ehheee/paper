define([], function() {
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
    var module = function(priceComponents) {
        this.priceComponents = priceComponents;
        return this;
    };
    module.prototype.setPriceComponents = function(priceComponents) {
        this.priceComponents = priceComponents;
        return this;
    };
    module.prototype.addPriceComponent = function(value) {
        this.priceComponents.push(value);
        return this;
    };
    module.prototype.calculatePrices = function(order) {
        _.each(order.priceComponents, function(component, i) {
            var amount = component.amount ? component.amount : order.amount * component.amountPerProduct;
            var componentTotal = 0;
            componentTotal += component.otherExpences ? component.otherExpences : 0;
            if (component.timePerOperation && component.pricePerTime) {
                componentTotal += component.timePerOperation * amount * component.pricePerTime;
            }
            if (component.pricePerOperation) {
                componentTotal += component.pricePerOperation * amount;
            }
            component.total = componentTotal;
        }, this);
    };
    return module;
});
