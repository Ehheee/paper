define([
    "backbone",
    "app/templateLoader",
    "app/data/paperModel",
    "app/views/common/BaseTable"
    ], function(
        Backbone,
        templateLoader,
        paperModel,
        BaseTable
    ) {
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
            this.components = [];
            _.each(paperModel.templatePriceComponentsById, function(component, id) {
                this.components.push(component);
            }, this);
            var table = new BaseTable({
                columnDefinitions: [
                    {keyList: ["id"], title: "id", cellFormat: this.resultCellFormat},
                    {keyList: ["name"], title: "name",cellFormat: this.resultCellFormat}
                ]
            });
            table.setData(this.components);
            this.$(".js_list").html(table.$el);
        },
        resultCellFormat: function(cell, value) {
            var href = $(document.createElement("a"));
            href.attr("href", "/paper/pc/edit/" + this.model.id + "/").text(value);
            cell.html(href);
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
