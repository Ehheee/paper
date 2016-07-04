define(["backbone"], function(Backbone) {
    var module = Backbone.View.extend({
        tagName: "div",
        className: "hoverContainer",
        render: function() {
            this.$el.css({"position": "absolute", "top": this.yPosition, "left": this.xPosition, "background-color": "#999"});
            $("body").append(this.$el);
            if (this.subView) {
                this.$el.html(this.subView.render().$el);
            }
            return this;
        },
        initialize: function(options) {
            if ($("div.hoverContainer").length) {
                this.remove();
                return;
            }
            this.xPosition = options.xPosition;
            this.yPosition = options.yPosition;
            this.subView = options.subView;
            this.render();
            var context = this;
            $("html").on("click", function(evt) {
                console.log($.contains(context.el, evt.target));
                if (!$.contains(context.el, evt.target)) {
                    context.remove();
                    $("html").off("click");
                }
            });

        }
    });
    return module;
});
