define(["backbone"], function(Backbone) {
    var module = Backbone.View.extend({
        tagName: "canvas",
        initialize: function() {
            this.ctx = this.el.getContext('2d');
        },
        setSize: function(width, height) {
            this.el.width = width;
            this.el.height = height;
        }
    });
    return module;
});
