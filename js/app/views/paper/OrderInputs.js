define(["backbone", "app/views/common/Input"], function(Backbone, Input) {
    var module = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
            this.inputs = {};
        },
        render: function() {
            _.each(this.components, function(component, key) {
                this.renderComponent(key, component);
            }, this);
            for (var i = 0; i < this.inputOrder.length; i++) {
                var k = this.inputOrder[i];
                this.$el.append(this.inputs[k].render().$el);
            }
            return this;
        },
        renderComponent: function(key, c) {
            if (c.hidden || this.inputs[key]) {
                return;
            }
            var input;
            if (_.isArray(c)){
                input = new Input({key: key, showKey: "label", values: c});
            } else {
                if (typeof c.active !== "undefined") {
                    input = new Input({key: key, checkbox: true, checked: c.active ? "checked": false});
                } else {
                    input = new Input({key: key, value: c.amount ? c.amount : c.amountPerProduct});
                }
            }
            this.inputs[key] = input;
        },
    });
    return module;
});
