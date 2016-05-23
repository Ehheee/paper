define(["backbone", "underscore", "jquery", "app/templateLoader", "jquery.datetimepicker"], function(Backbone, _, $, templateLoader, dateTimePicker) {
	var dateFormat = "d-m-Y H:i";
	var module = Backbone.View.extend({
		template: _.template(templateLoader.get("filterViewTemplate")),
		inputTemplate: _.template(templateLoader.get("filterInputTemplate2")),
		checkBoxTemplate: _.template(templateLoader.get("filterCheckBoxTemplate")),
		addButtonTemplate: _.template(templateLoader.get("addButtonTemplate")),
		className: "filterView",
		events: {
			"click .filterCloseButton": "remove",
			"click .filterApplyButton": "apply",
			"click .addButton": "addField"
		},
		initialize: function(options) {
			if (!options.depth) {
				this.depth = 0;
			} else {
				this.depth = options.depth;
			}
			this.filter = options.filter;
			this.fields = this.filter.getParameters();
			if (!options.xPosition && !options.yPosition) {
				this.position = "relative";
			} else {
				this.xPosition = options.xPosition - 375;
				this.yPosition = options.yPosition + 20;
				this.position = "absolute";
			}
		},
		render: function() {
			var template = $(this.template({}));
			this.$el.html(template);
			this.$(".filterInputs").append(this.renderInputs());
			if (this.filter.getSubFilters) {
				this.$(".subFilters").append(this.renderSubFilters());
			}
			if (this.filter.canAdd) {
				this.$(".filterInputs").after(this.addButtonTemplate({}));
			}
			this.$el.css({"position": this.position, "margin-left": (this.depth*10)+"px"});
			if (this.position === "absolute") {
				this.$el.css({"top": this.yPosition, "left": this.xPosition});
				$("body").append(this.$el);
			}
			$(".js_dateInput").datetimepicker({"format": dateFormat, "closeOnDateSelect": true});
			if (this.depth > 0) {
				this.$(".filterCloseButton,.filterApplyButton").addClass("hidden");
			}
			return this;
		},
		renderInputs: function() {
			var result = [];
			_.each(this.fields, function(data, key) {
				var value;
				if (_.isObject(data)) {
					value = data.value;
				} else {
					value = data;
				}
				if (data.type === "date" && value) {
					var d = new Date(value);
					value = d.dateFormat(dateFormat);
				}
				var input = $(this.inputTemplate({key: key, value:value, type:data.type}));
				if (data.type === "select") {
					input.children(".filterValue").remove();
					var container = $(document.createElement("div")).addClass("selectContainer");
					var select = $(document.createElement("select")).addClass("filterValue").attr({"multiple": "multiple", "size": "6"});
					container.append(select);
					input.append(container);
					for (var i = 0; i < data.value.length; i++) {
						var value = data.value[i];
						var option = $(document.createElement("option")).html(value);
						if (data.selected.indexOf(value) > -1) {
							option.attr("selected", "selected");
						}
						select.append(option);
					}
				}
				if (data.keyEditable === false) {
					input.children(".filterKey").attr("readonly", "readonly");
				}
				result.push(input);
			}, this);
			return result;
		},
		renderSubFilters: function() {
			var result = [];
			var subFilters = this.filter.getSubFilters();
			for (var i = 0; i < subFilters.length; i++) {
				var filter = subFilters[i];
				var subView =  new this.constructor({filter: filter, depth: this.depth + 1});
				result.push(subView.render().$el);
			}
			return result;
		},
		apply: function() {
			var params = {};
			this.$(".filterInput").each(function(index, element) {
				var valueInput = $(element).find(".filterValue");
				var key = $(element).children(".filterKey").val();
				var value = valueInput.val();
				if (valueInput.hasClass("js_dateInput") && value) {
					console.log(value, dateFormat);
					value = Date.parseDate(value, dateFormat).getTime();
				}
				params[key] = value;
			});
			console.log(params);
			this.filter.setParameters(params);
			this.remove();
		},
		remove: function() {
			this.$(".js_dateInput").datetimepicker("destroy");
			this.trigger("view:remove", this.key);
			Backbone.View.prototype.remove.call(this);
		},
		addField: function(evt) {
			evt.stopPropagation();
			this.$(".filterInputs").append(this.inputTemplate({key: "", type: "", value: ""}));
		}
	});
	return module;
});