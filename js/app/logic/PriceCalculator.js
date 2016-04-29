define([], function() {
    /*
     * Price in cents
     * Time in minutes
     * pricePerProduct - how much this opetion costs per one product
     * timePerProduct - how much time is spent per product
     * pricePerTime - if each time unit spent also costs in addition to pricePerProduct
     * prepareTime -how much time it takes to start the operation - this might cost money
     * amountPerProduct - how many time this operation has to be carried out on a product
     * 
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
    module.prototype.calculatePrice = function(productAmount) {
        _.each(this.priceComponents, function(c, key) {
            var a = o.amount ? o.amount : productAmount;
            var operationPrice = 0;
            operationPrice += o.pricePerProduct ? o.pricePerProduct*a : 0;
            operationPrice += o.price || 0;
            operationPrice += o.prepareTimeCost ? o.prepareTimeCost*o.prepareTime: 0;
            operationPrice += o.pricePerTime ? o.timePerProduct * a * o.pricePerTime : 0;
            o.operationPrice = operationPrice;
            
        }, this);
        return this;
    };
    return module;
});
