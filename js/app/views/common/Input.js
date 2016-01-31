define(["backbone", "app/templateLoader"], function(Backbone, templateLoader) {
    var uniqueId = 0;
    var getId = function() {
        uniqueId++;
        return uniqueId;
    };
    var module = Backbone.View.extend({
        events: {
            "blur": "afterInput",
            "change": "afterInput",
            "input": "afterInput"
        },
        template: templateLoader.get("genericInputTemplate"),
        initialize: function(options) {
            _.extend(this, options);
        },
        render: function() {
            if (this.element) {
                this.setElement(this.element);
                this.$el.html($(this.template({label: this.label ? this.label : this.key, key: this.key, value: this.value})).html());
            } else {
                this.setElement(this.template({label: this.label ? this.label : this.key, key: this.key, value: this.value}));
            }
            if (this.suggests) {
                if (this.suggests.range) {
                    this.createRange("suggests");
                }
                var i = getId();
                var dataList = $(document.createElement("datalist")).attr("id", "suggests" + i);
                this.$el.find("input").attr("list", "suggests" + i).after(dataList);
                for (var i = 0; i < this.suggests.length; i++) {
                    dataList.append($(document.createElement("option")).attr("value", this.suggests[i]));
                }
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
            return this;
        },
        renderSelect: function() {
            select = $(document.createElement("select"));
            for (var i = 0; i < this.values.length; i++) {
                var value = this.values[i];
                if (!this.showKey && !this.valueKey) {
                    select.append($(document.createElement("option")).html(value).val(value).attr("selected", this.selected === value ? "selected": false));
                } else {
                    select.append($(document.createElement("option")).html(value[this.showKey ? this.showKey: this.key] || value).val(value[this.valueKey] || value).attr("selected", this.selected === value[this.valueKey] ? "selected": false));
                }
            }
            this.$("input").remove();
            this.$el.append(select);
        },
        afterInput: function() {
            console.log("!!!");
            this.trigger("input:changed", this.getValue());
            this.changed = true;
        },
        getValue: function() {
            if (this.$(":selected").length > 0) {
                return this.$(":selected").val();
            } else if (this.$("[type=checkbox]").length > 0) {
                return this.$(":checked").length > 0;
            } else {
                return this.$("input").val();
            }
        },
        createRange: function(field) {
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
