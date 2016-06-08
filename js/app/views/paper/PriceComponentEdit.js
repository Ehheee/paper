define([
    "backbone",
    "app/templateLoader",
    "app/data/paperModel",
    "app/views/common/Input",
    "app/views/paper/PriceComponentFieldEdit"
    ], function(
        Backbone,
        templateLoader,
        paperModel,
        Input,
        PriceComponentFieldEdit) {
    var fields = ["amountPerProduct", "amount", "pricePerOperation", "timePerOperation", "pricePerTime", "otherExpences"];
    var preRenderedFields = ["id", "labels", "name"];
    var module = Backbone.View.extend({
        template: templateLoader.get("priceComponentEditTemplate"),
        events: {
            "click .js_addField": "addField",
            "click .js_save": "save",
            "click .js_saveAs": "saveAs"
        },
        initialize: function(options) {
            this.priceComponent = {labels: ["template", "priceComponent"]};
            this.fieldViews = {};
            _.extend(this, options);
            if (this.componentId) {
                this.listenToOnce(paperModel, "component:"+this.componentId, this.setComponent);
                paperModel.getPriceComponentById(this.componentId);
            }
        },
        setComponent: function(component) {
            this.priceComponent = component;
            this.trigger("view:render");
        },
        render: function() {
            this.$el.html(this.template({id: this.priceComponent.id || "-"}));
            this.renderLabels();
            this.renderFields();
            return this;
        },
        renderLabels: function() {
            var labelsDiv = this.$(".js_labels");
            if (this.priceComponent.labels.length < 3) {
                var input = new Input({label: "group", key: this.priceComponent.labels.length, callback: this.onLabelInput.bind(this)});
                labelsDiv.append(input.render().$el);
            }
            for (var i = 0; i < this.priceComponent.labels.length; i++) {
                var l = this.priceComponent.labels[i];
                if (l !== "template" && l !== "priceComponent") {
                    var input = new Input({label: "group", key: i, value: l, callback: this.onLabelInput.bind(this)}); 
                    labelsDiv.append(input.render().$el);
                }
            }
        },
        renderFields: function() {
            this.renderField("name");
            for (var i = 0; i < fields.length; i++) {
                var f = fields[i];
                if (typeof this.priceComponent[f] !== "undefined") {
                    this.renderField(f);
                }
            }
            var keys = _.keys(this.priceComponent);
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                if (fields.indexOf(k) < 0 && preRenderedFields.indexOf(k) < 0) {
                    this.renderField(k);
                }
            }
        },
        renderField: function(key) {
            var fieldView = new PriceComponentFieldEdit({type: key, value: this.priceComponent[key], fields: fields});
            this.listenTo(fieldView, "field:changed", this.onFieldChange);
            this.listenToOnce(fieldView, "remove", this.removeField);
            this.$(".js_fields").append(fieldView.render().$el);
            this.fieldViews[key] = fieldView;
            return fieldView;
        },
        addField: function() {
            var fieldView = new PriceComponentFieldEdit({fields: fields});
            this.listenTo(fieldView, "field:changed", this.onFieldChange);
            this.listenToOnce(fieldView, "remove", this.removeField);
            this.$(".js_fields").append(fieldView.render().$el);
        },
        removeField: function(key, view) {
            delete this.fieldViews[key];
            delete this.priceComponent[key];
        },
        onLabelInput: function(key, value) {
            if (value === "paper" && !this.fieldViews.height) {
                this.renderField("width");
                this.renderField("height");
            }
            if (value !== "paper" && this.fieldViews.height) {
                this.fieldViews.width.remove();
                this.fieldViews.height.remove();
                delete this.fieldViews.width;
                delete this.fieldViews.height;
            }
            this.priceComponent.labels[key] = value;
        },
        onFieldChange: function(oldKey, key, value) {
            this.fieldViews[key] = this.fieldViews[oldKey];
            delete this.fieldViews[oldKey];
            delete this.priceComponent[oldKey];
            this.priceComponent[key] = value;
        },
        save: function() {
            paperModel.savePriceComponent(this.priceComponent, this.saved.bind(this));
        },
        saved: function(data) {
            this.$(".js_id").html(data.thing.id);
        },
    });
    return module;
});
