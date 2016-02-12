define(["backbone", "app/views/common/Input", "app/views/paper/OrderInputs", "app/views/paper/PaperCanvas", "app/logic/productSizes", "app/logic/priceComponents", "app/templateLoader"], 
function(Backbone, Input, OrderInputs, PaperCanvas, productSizes, priceComponents, templateLoader) {
    var module = Backbone.View.extend({
        initialize: function() {
            this.productSizeInput = new Input({key: "productSize", values: productSizes, showKey: "label"});
            this.productAmountInput = new Input({key: "productAmount"});
            this.orderInputs = new OrderInputs({components: priceComponents, inputOrder: ["die", "design", "drilling", "spiral", "printPlates"]});
        },
        render: function() {
            this.$el.append(this.productSizeInput.render().$el);
            this.$el.append(this.productAmountInput.render().$el);
            this.$el.append(this.orderInputs.render().$el);
            return this;
        }
    });
    return module;
});
