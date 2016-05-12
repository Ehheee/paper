define(["jquery", "backbone", "underscore", "app/views/MainMenu", "app/templateLoader"], function($, Backbone, _, MainMenu, templateLoader) {
    var module = Backbone.View.extend({
        tagName: "div",
        className: "mainContainer",
        template: templateLoader.get("mainViewTemplate"),
        render: function() {
            if (this.subView) {
                this.subView.render();
                if (!this.subView.attached) {
                    this.$(".js_mainContent").html(this.subView.$el);
                    this.subView.attached = true;
                }
            }
            return this;
        },
        initialize: function(options) {
            $("body").html(this.$el);
            this.mainMenu = new MainMenu();
            if (options && options.subView) {
                this.subView = options.subView;
            }
            this.$el.html(this.template({}));
            this.$(".js_mainMenu").html(this.mainMenu.render().el);
        },
        setView: function(view) {
            if (this.subView) {
                this.subView.remove();
            }
            this.subView = view;
            this.listenTo(this.subView, "view:render", this.render);
        }
    });
    return module;
});
