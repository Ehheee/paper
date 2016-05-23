define(["backbone", "jquery", "app/config"], function(Backbone, $, config) {
    var module = function() {
        Backbone.on("request:data", this.onDataRequest, this);
        this.requestCount = 0;
    };
    module.prototype.onDataRequest = function(options){
        if (this.requestCount < 1) {
            this.showSpinner();
        }
        console.log(options);
        var requestData = JSON.stringify(options.data);
        var context = this;
        $.ajax({
            data: requestData,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            url: config["server.url"] + (options.path ? options.path : "")
        }).done(function(data, state, r){
            console.log(data);
            Backbone.trigger(options.responseChannel, data);
        }).always(function(data, textStatus) {
            console.log(textStatus);
        });
    };
    module.prototype.reduceRequestCount = function() {
        this.requestCount--;
        if (this.requestCount < 1) {
            this.hideSpinner();
        }
    };
    module.prototype.showSpinner = function() {
        if (!this.spinner) {
            this.spinner = $(document.createElement("i"));
            this.spinner.addClass("fa").addClass("fa-spinner").addClass("fa-pulse");
            this.spinner.addClass("spinner");
        }
        if (!$.contains(document, this.spinner[0])) {
            $("body").append(this.spinner);
        }
        this.spinner.show();
    };
    module.prototype.hideSpinner = function() {
        this.spinner.hide();
    };

    return new module();
});
