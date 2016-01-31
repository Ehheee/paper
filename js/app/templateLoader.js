define(["backbone", "app/config"], function(Backbone, config) {
	var templateFiles = ["/html/common.html"];
	var module = {
		get: function(id) {
			return this[id];
		}
	};
	var loaded = 0;
	for (var i = 0; i < templateFiles.length; i++) {
		$.ajax({
			url: "/" + config.appRootUrl + templateFiles[i],
			
		}).done(function(html) {
			html = $(html);
			html.each(function(i, element) {
				if (element.type === "text/template") {
					module[element.id] = _.template(element.innerHTML);
				}
			});
			loaded++;
			if (loaded === templateFiles.length) {
			    console.log(module);
				Backbone.trigger("templates:loaded");
			}
		});
	}
	
	return module;
});