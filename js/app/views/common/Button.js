define(["backbone"], function(Backbone) {
    var module = Backbone.View.extend({
        tagName: "input",
        className: "button",
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            this.$el.html(this.name);
            return this;
        },
    });
    return module;
});
