define(["backbone", "app/templateLoader", "app/data/paperModel"], function(Backbone, templateLoader, paperModel) {
    var module = Backbone.View.extend({
        template: templateLoader.get("priceComponentListTemplate"),
        initialize: function(options) {
            this.createFilter(options.filter);
            this.requestData();
        },
        render: function() {
            this.$el.html(this.template({}));
            this.renderList();
        },
        renderList: function() {
            _.each(this.paperModel.templatePriceComponentsById, function(component, id) {
                
            }, this);
        },
        triggerRender: function() {
            this.trigger("view:render");
        },
        createFilter: function(f) {
            this.filter = {};
            _.extend(this.filter, f);
            if (!this.filter.labels) {
                this.filter.labels = [];
            }
            this.filter.labels.push("template", "priceComponent");
        },
        requestData: function() {
            paperModel.getTemplatePriceComponents(this.filter);
            this.listenToOnce(paperModel, "templatePriceComponents:refreshed", this.triggerRender);
        },
        
    });
    return module;
});
