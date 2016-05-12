define(["backbone", "app/views/common/Input"], function(Backbone, Input) {
    var module = Backbone.View.extend({
        initialize: function(options) {
            _.extend(this, options);
            return this;
        },
        render: function() {
            for (var i = 0; i < this.keys.length; i++) {
                var key = this.keys[i];
                var input = new Input({key: key, value: this.model[key], callback: this.callback});
                this.$el.append(input.render().$el);
            }
            return this;
        },
    });
    return module;
});
