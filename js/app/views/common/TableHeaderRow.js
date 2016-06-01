define(["backbone", "jquery", "underscore", "app/views/common/BaseTableRow", "app/views/common/Input"], function(Backbone, $, _, BaseTableRow, Input) {
	var module = BaseTableRow.extend({
		events: {
			"click .js_sort": "onClick"
		},
		createCells: function() {
			_.each(this.columnDefinitions, function(value, prop) {
				var cell = this.createCell().attr({"data-columnIndex": prop}).addClass("headerCell");
				if (value.suggests) {
					var input = new Input({suggests: value.suggests, value: value.value});
					this.listenTo(input, "input:changed", this.trigger.bind(this, "table:columnSelected", prop));
					cell.append(input.render().$el);
				}
				
				else {
					if (value.title) {
						cell.text(value.title);
					} else {
						cell.text(value.keyList[0]);
					}
				}
				this.$el.append(cell);
			}, this);
		},
		onClick: function(evt) {
			var target = $(evt.target);
			var column = this.columnDefinitions[target.attr("data-columnIndex")];
			var title = column.title;
			if (!title) {
				title = column.keyList[0];
			}
			this.trigger("table:sort", column, title);
		}
	});
	return module;
});
