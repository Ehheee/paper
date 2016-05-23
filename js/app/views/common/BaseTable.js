define([
    "backbone",
    "app/templateLoader",
    "app/utils",
    //"app/views/common/FilterView",
    "app/views/tabular/BaseTableRow",
    "app/views/tabular/TableHeaderRow"
    ], function(
        Backbone,
        templateLoader,
        utils,
        //FilterView,
        BaseTableRow,
        TableHeaderRow
    ) {
	var module = Backbone.View.extend({
		events: {
			"dblclick table": "handleDomEvent",
			"click table": "handleDomEvent",
			"contextmenu": "handleDomEvent",
			"mousedown": "handleDomEvent",
			"click .js_filterButton": "showFilter"
		},
		className: "tableContainer",
		template: _.template(templateLoader.get("baseTableTemplate")),
		render: function() {
			this.$el.html(this.template({title: this.name}));
			this.createHeaderRow();
			this.createRows();
			if (this.filterButton) {
				this.$(".js_filterButton").removeClass("hidden");
			}
			if (this.parent) {
				this.parent.render();
			}
			this.delegateEvents();
			return this;
		},
		initialize: function(options) {
			this.model = [];
			this.rows = {};
			this.filter = options.filter;
			this.filterButton = options.filterButton;
			this.setFilter();
			this.name = options.name;
			this.subEvents = options.subEvents;
			this.columnDefinitions = options.columnDefinitions;
			this.parent = options.parent;
			this.filter.requestData();
		},
		setFilter: function() {
			this.listenTo(this.filter, "filter:newData", this.setData);
		},
		setData: function(data) {
			this.model = data;
			this.render();
		},
		createHeaderRow: function() {
			this.headerRow = new TableHeaderRow({columnDefinitions: this.columnDefinitions, parent: this});
			this.listenTo(this.headerRow, "table:sort", this.sort);
			this.listenTo(this.headerRow, "table:columnSelected", this.trigger.bind(this, "table:columnSelected"));
			this.$("thead").append(this.headerRow.render().$el);
		},
		createRows: function() {
			for (var i = 0; i < this.model.length; i++) {
				this.rows[i] = this.createRow(i);
				this.$("tbody").append(this.rows[i].render().$el);
			}
		},
		createRow: function(index) {
			var row =  new BaseTableRow({columnDefinitions: this.columnDefinitions, model: this.model[index], rowIndex: index});
			return row;
		},
		handleDomEvent: function(evt) {
			var target = $(evt.target);
			if (target.parents(".headerCell").length > 0 || target.hasClass("headerCell")) {
				return;
			}
			var column = this.columnDefinitions[target.attr("data-columnIndex")];
			var row = this.rows[target.attr("data-rowIndex")];
			if (column && column.events && column.events[evt.type]) {
				column.events[evt.type].call(row, evt);
				return;
			}
			if (this.subEvents && this.subEvents[evt.type]) {
				this.subEvents[evt.type].call(row, evt);
			}
		},
		showFilter: function(evt) {
			if (!this.filterView) {
				this.filterView = new FilterView({filter: this.filter, xPosition: evt.pageX, yPosition: evt.pageY});
				this.filterView.render();
				this.listenToOnce(this.filterView, "view:remove", this.removeFilter);
			}
		},
		removeFilter: function() {
			this.filterView = false;
		},
		sort: function(column, title) {
			this.model.sort(function(itemA, itemB) {
				var valueA = utils.getFromJson(itemA, column.keyList);
				var valueB = utils.getFromJson(itemB, column.keyList);
				if (!valueA) {
					return -1;
				} else if (!valueB) {
					return 1;
				}
				if (valueA.localeCompare && valueB.localeCompare) {
					return valueA.localeCompare(valueB);
				}
				if (valueA > valueB) {
					return 1;
				} else if (valueA < valueB) {
					return -1;
				} 
				return 0;
			});
			if (this.sortField === title) {
				this.model.reverse();
				delete this.sortField;
			} else {
				this.sortField = title;
			}
			console.log(this.model);
			this.render();
		}
	});
	return module;
});
