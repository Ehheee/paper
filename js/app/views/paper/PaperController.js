define(["backbone", "app/views/paper/OrderInputs", "app/views/paper/PaperCanvas", "app/logic/priceComponents", "app/templateLoader"], 
function(Backbone, OrderInputs, PaperCanvas, priceComponents, templateLoader) {
    var module = Backbone.View.extend({
        initialize: function() {
            this.orderInputs = new OrderInputs({components: priceComponents, inputOrder: ["die", "design", "drilling", "spiral", "printPlates"]});
        },
        render: function() {
            this.$el.append(this.orderInputs.render().$el);
            return this;
        }
    });
    return module;
});
