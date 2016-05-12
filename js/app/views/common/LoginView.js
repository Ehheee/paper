define(["backbone", "jquery", "underscore", "app/templateLoader"], function(Backbone, $, _, templateLoader) {
	var module = Backbone.View.extend({
		className: "login",
		template: templateLoader.get("loginView"),
		events: {
			"click .js_submit": "onSubmit",
			"keyup input": "onKeyUp"
		},
		render: function() {
			this.$el.html(this.template());
			$("body").append(this.$el);
			this.$("input.username").focus();
			return this;
		},
		onKeyUp: function(evt) {
			if (evt.keyCode === 13) {
				this.onSubmit();
			}
		},
		onSubmit: function() {
			var username = this.$("input.username").val();
			var password = this.$("input.password").val();
			if (!!username && !!password) {
				Backbone.trigger("request:data", {method: "login", params:{username: username, password: password}}, "response:login");
				this.$el.hide();
				Backbone.once("response:login", this.handleLoginResponse, this);
			}
		},
		handleLoginResponse: function(response) {
			if (response["error"]) {
				this.showError(response["error"]["message"]);
				this.$el.show();
			} else if (response["result"]["authenticatedUser"]) {
				this.trigger("login:success");
			}
		},
		showError: function(message) {
			this.$(".error").text(message);
		}
	});
	return module;
});
