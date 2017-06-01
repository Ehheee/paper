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
                var input = new Input({label: "group", key: this.priceComponent.labels.length, callback: this.onLabelInput.bind(this), suggests: ["paper", "printer", "printPlates", "folding"]});
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
        renderField: function(key, keyIndex) {
            var v;
            if (_.isArray(this.priceComponent[key]) && (typeof keyIndex === "undefined")) {
                var arr = this.priceComponent[key];
                for (var i = 0; i < arr.length; i++) {
                    this.renderField(key, i);
                }
                return;
            }
            var fieldView = new PriceComponentFieldEdit({type: key, value: this.priceComponent[key], keyIndex: keyIndex, fields: fields});
            this.listenTo(fieldView, "field:changed", this.onFieldChange);
            this.listenToOnce(fieldView, "remove", this.removeField);
            this.$(".js_fields").append(fieldView.render().$el);
            if (typeof keyIndex !== "undefined") {
                if (!this.fieldViews[key]) {
                    this.fieldViews[key] = [];
                }
                this.fieldViews[key][keyIndex] = fieldView;
            } else {
                this.fieldViews[key] = fieldView;
            }
            return fieldView;
        },
        addField: function() {
            var fieldView = new PriceComponentFieldEdit({fields: fields});
            this.listenTo(fieldView, "field:changed", this.onFieldChange);
            this.listenToOnce(fieldView, "remove", this.removeField);
            this.$(".js_fields").append(fieldView.render().$el);
        },
        removeField: function(key, view) {
            this.removeKey(key, view);
        },
        onLabelInput: function(key, value) {
            this.checkPaperLabel(value);
            this.checkFoldingLabel(value);
            this.priceComponent.labels[key] = value;
        },
        checkPaperLabel: function(value) {
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
        },
        checkFoldingLabel: function(value) {
            if (value === "folding" && !this.fieldViews.sizeDifference) {
                this.renderField("sizeDifference");
                this.renderField("orientation");
            }
            if (value !== "folding" && this.fieldViews.sizeDifference) {
                this.removeKey("sizeDifference");
                this.removeKey("orientation");
                //this.fieldViews.sizeDifference.remove();
                //delete this.fieldViews.sizeDifference;
            }
        },
        onFieldChange: function(oldKey, key, value, view) {
            if (value) {
                if (!this.priceComponent[key] || !_.isArray(this.fieldViews[key])) {
                    this.priceComponent[key] = value;
                }
                if (_.isArray(this.fieldViews[key])) {
                    if (!_.isArray(this.priceComponent[key])) {
                        this.priceComponent[key] = [];
                        for (var i = 0; i < this.fieldViews[key].length; i++) {
                            var v = this.fieldViews[key][i];
                            this.priceComponent[key][v.keyIndex] = v.value;
                        }
                    }
                    this.priceComponent[key][view.keyIndex] = value;
                }
            }
            if (oldKey) {
                if (oldKey !== key) {
                    this.removeKey(oldKey, view);
                    if (this.fieldViews[key] && !_.isArray(this.fieldViews[key])) {
                        this.fieldViews[key] = [this.fieldViews[key]];
                        this.fieldViews[key].push(view);
                    } else if (this.fieldViews[key] && _.isArray(this.fieldViews[key])) {
                        this.fieldViews[key].push(view);
                    } else if (!this.fieldViews[key]) {
                        this.fieldViews[key] = view;
                    }
                    for (var i = 0; i < this.fieldViews[key].length; i ++) {
                        this.fieldViews[key][i].keyIndex = i;
                    }
                    this.onFieldChange(undefined, key, value, view);
                }
            }
        },
        removeKey: function(oldKey, view) {
            if (_.isArray(this.priceComponent[oldKey])) {
                this.priceComponent[oldKey].splice(view.keyIndex, 1);
                this.fieldViews[oldKey].splice(view.keyIndex, 1);
                if (this.fieldViews[oldKey].length < 2) {
                    if (this.fieldViews[oldKey].length === 0) {
                        delete this.fieldViews[oldKey];
                        delete this.priceComponent[oldKey];
                    } else {
                        this.fieldViews[oldKey] = this.fieldViews[oldKey][0];
                        this.priceComponent[oldKey] = this.priceComponent[oldKey][0];
                    }
                }
            } else {
                delete this.priceComponent[oldKey];
                delete this.fieldViews[oldKey];
            }
        },
        save: function() {
            console.log(this.priceComponent);
            console.log(this.fieldViews);
            
            if (!this.isOrderComponent) {
                paperModel.savePriceComponent(this.priceComponent, this.saved.bind(this));
            } else {
                this.trigger("priceComponent:save", this.priceComponent);
            }
            
        },
        saved: function(data) {
            Backbone.trigger("router:navigate", "/pc/edit/" + data.thing.id + "/");
            this.priceComponent.id = data.thing.id;
            this.$(".js_id").html(data.thing.id);
        },
    });
    return module;
});
