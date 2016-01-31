define(["app/views/paper/PaperController", "app/logic/PaperPlacementCalculator", "app/logic/PriceCalculator"], function(PaperController, Calculator, PriceCalc) {
    var module = function() {
        
    };
    module.prototype.run = function() {
        var p = new PaperController();
        $("body").html(p.render().$el);
    };
    return new module();
});
