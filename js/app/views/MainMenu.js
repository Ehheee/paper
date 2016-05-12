define(["backbone", "app/templateLoader"], function(Backbone, templateLoader) {
    var module = Backbone.View.extend({
        events: {
            "click a": "linkClick"
        },
        //tagName: "div",
        //className: "js_mainMenu",
        itemTemplate: templateLoader.get("mainMenuItem"),
        template: templateLoader.get("mainMenu"),
        render: function() {
            this.setElement(this.template({}));
            _.each(this.routes, function(value, prop) {
                var menuItemLink;
                if (_.isString(value)) {
                    menuItemLink = value;
                } else if (_.isObject(value)) {
                    menuItemLink = "/";
                }
                var itemTemplate = $(this.itemTemplate({appRoot: appRootUrl, menuItemLink: menuItemLink, menuItemName: prop}));
                this.$(".js_mainMenuItems").append(itemTemplate);
            },this);
            return this;
        },
        initialize: function(options) {
            console.log("mainmenu");
            if (options && options.routes) {
                this.routes = options.routes;
            }
        },
        linkClick: function(evt) {
            evt.preventDefault();
            var routeKey = evt.target.innerHTML;
            var action = this.routes[routeKey];
            if (action) {
                if (_.isString(action)) {
                    Backbone.trigger("router:navigate", evt.currentTarget.pathname.replace(appRootUrl, ""), {trigger: true});
                } else if (_.isObject(action)) {
                    var constructor = this.constructor;
                    var child = new constructor({routes: action});
                    this.$(".js_subMenu").html(child.render().$el);
                }
            }
        },
        routes: {
            "Home": "/",
            "Orders": "/orders/",
            "Log out": "/logout/"
        }
    });
    return module;
});
