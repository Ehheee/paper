define(["backbone", "app/templateLoader", "app/utils", "app/translator"], function(Backbone, templateLoader, utils, translator) {
    /*
     * Possible options:
     * key - used as label and added in change trigger for recognizing input
     * value - preinserted value for basic input
     * values - Possible values to be used in a SELECT.
     * selected - the currently selected value when using multiple values for a SELECT.
     * suggests - Used for displaying suggestions.
     * suggests.range - Used for displaying a range of numbers as suggestions.
     * showKey - Used for displaying a property of element in a SELECT if it should be different than KEY
     * valueKey - Used for specifying, which property of a SELECT list item should be used as input value.
     * callback - Function to call after changed input
     */
    var uniqueId = 0;
    var getId = function() {
        uniqueId++;
        return uniqueId;
    };
    var module = Backbone.View.extend({
        events : {
            "blur" : "afterInput",
            "change" : "afterInput",
            "input" : "afterInput"
        },
        template : templateLoader.get("genericInputTemplate"),
        initialize : function(options) {
            _.extend(this, options);
        },
        render : function() {
            if (this.element) {
                this.setElement(this.element);
                this.$el.html($(this.template({
                    label : this.label ? this.label : this.key,
                    key : this.key,
                    value : this.value,
                    translate : translator.translate
                })).html());
            } else {
                this.setElement(this.template({
                    label : this.label ? this.label : this.key,
                    key : this.key,
                    value : this.value,
                    translate: translator.translate
                }));
            }
            if (this.suggests) {
                this.renderSuggests();
            }
            if (this.values) {
                if (this.values.range) {
                    this.createRange("values");
                }
                this.renderSelect();
            }
            if (this.checkbox) {
                this.$("input").attr("type", "checkbox");
                if (this.checked) {
                    this.$("input").attr("checked", "checked");
                }
            }
            if (this.disabled) {
                this.$("input").attr("disabled", "disabled");
            }
            return this;
        },
        renderSuggests : function() {
            if (this.suggests.range) {
                this.createRange("suggests");
            }
            var i = getId();
            var dataList = $(document.createElement("datalist")).attr("id", "suggests" + i);
            this.$el.find("input").attr("list", "suggests" + i).after(dataList);
            this.suggestMap = {};
            for (var i = 0; i < this.suggests.length; i++) {
                var s = this.suggests[i];
                if (_.isObject(s)) {
                    this.suggestMap[s[this.showKey]] = s;
                }
                dataList.append($(document.createElement("option")).attr("value", _.isObject(s) ? translator.translate(s[this.showKey]) : translator.translate(s)));
            }
        },
        renderSelect : function() {
            select = $(document.createElement("select")).attr("name", this.key);
            for (var i = 0; i < this.values.length; i++) {
                var value = this.values[i];
                if (!this.showKey && !this.valueKey) {
                    select.append($(document.createElement("option")).html(value).val(value).attr("selected", this.selected === value ? "selected" : false));
                } else {
                    select.append($(document.createElement("option")).html(value[this.showKey ? this.showKey : this.key] || value).val(value[this.valueKey] || value).attr("selected", this.selected === value[this.valueKey] ? "selected" : false));
                }
            }
            this.$("input").remove();
            this.$el.append(select);
        },
        afterInput : function() {
            console.log("!!!");
            var value = this.getValue();
            if (value === this.oldValue) {
                return;
            }
            this.oldValue === value;
            this.trigger("input:changed", this.key, value);
            if (this.callback) {
                this.callback(this.key, value);
            }
            this.changed = true;
        },
        getValue : function() {
            var r;
            if (this.$(":selected").length > 0) {
                r = utils.stringToType(this.$(":selected").val());
            } else if (this.$("[type=checkbox]").length > 0) {
                r = this.$(":checked").length > 0;
            } else {
                if (this.suggests && _.isObject(this.suggests[0])) {
                    var v = this.$("input").val();
                    r =  this.suggestMap[v];
                } else {
                    r = utils.stringToType(this.$("input").val());
                }
                return translator.reverse(r);
            }
        },
        createRange : function(field) {
            var start = this[field].range.start;
            var end = this[field].range.end;
            this[field] = [];
            while (start <= end) {
                this[field].push(start);
                start++;
            }
        }
    });
    return module;
});
