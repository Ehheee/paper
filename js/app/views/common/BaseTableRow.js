define(["backbone", "jquery", "underscore", "app/templateLoader", "app/utils"], function(Backbone, $, _, templateLoader, utils) {
	var module = Backbone.View.extend({
		tagName: "tr",
		render: function() {
			this.$el.empty();
			this.createCells();
			this.delegateEvents();
			return this;
		},
		initialize: function(options) {
			this.cells = {};
			this.columnDefinitions = options.columnDefinitions;
			this.rowIndex = options.rowIndex;
			this.isHeader = options.isHeader;
		},
		createCells: function() {
			_.each(this.columnDefinitions, function(definition, column) {
				var value = this.getValue(definition, column);
				var cell  = this.createCell().attr({"data-columnIndex": column, "data-rowIndex": this.rowIndex});
				if (definition.cellFormat) {
					definition.cellFormat.call(this, cell, value);
				} else {
					cell.text(value);
				}
				if (definition.func) {
					definition.func.call(this, value);
				}
				this.$el.append(cell);
				this.cells[column] = cell;
			}, this);
		},
		setCellValue: function(column, value) {
			this.cells[column].text(value);
		},
		getValue: function(definition, column) {
			if (definition.valueFunction) {
				definition.valueFunction(this.model, this.setCellValue.bind(this, column));
			}
			if (definition.keyList) {
				var value = utils.getFromJson(this.model, definition.keyList);
				if (!value && typeof definition.defaultValue !== "undefined") {
					value = definition.defaultValue;
				} else if (typeof value === "undefined") {
					value = "";
				}
				return value;
			}
			return definition.defaultValue ? definition.defaultValue : "";
		},
		createCell: function() {
			return $(document.createElement("td"));
		}
	});
	return module;
});
