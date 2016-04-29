define(["backbone", "app/views/common/Input"], function(Backbone, Input) {
    var module = Backbone.View.extend({
        template: templateLoader.get("priceComponentFieldEditTemplate"),
        render: function() {
            this.$el.html(this.template({}));
            this.fieldTypeInput = new Input({element: this.$(".js_fieldType"), values: paperModel.getRootPriceComponent().fields});
            this.fieldValueInput = new Input({element: this.$(".js_fieldValue")});
        },
        initialize: function() {
            
            
        }
    });
    return module;
});
