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
    var module = function() {
        return this;
    };
    module.prototype.setOperations = function(operations) {
        this.operations = operations;
        return this;
    };
    module.prototype.setOperation = function(key, value) {
        this.operations[key] = value;
        return this;
    };
    module.prototype.calculatePrice = function(productAmount) {
        _.each(this.operations, function(o, key) {
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
