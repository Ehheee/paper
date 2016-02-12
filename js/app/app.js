define(["app/views/paper/PaperController", "app/logic/PaperPlacementCalculator", "app/logic/PriceCalculator"], function(PaperController, Calculator, PriceCalc) {
    var module = function() {
        
    };
    module.prototype.run = function() {
        /*
        var p = new PaperController();
        $("body").html(p.render().$el);
        */
        var c = document.createElement("canvas");
        c.width = 1920;
        c.height = 880;
        $("body").html(c);
        var ctx = c.getContext("2d");
        //ctx.strokeRect(550, 100, 400, 400);
        ctx.translate(960, 440);
        var d = 0.05;
        var i = 1;
        setInterval(function() {
                ctx.strokeStyle = "rgba(" + ((130 + i*10) % 255) +"," + ((130 + i*10) % 255) + "," + ((130 + i*10) % 255) + "," + 1+ ")";
                ctx.strokeRect(-283, -283, 566, 566);
                ctx.strokeStyle = "rgba(" + ((110 + i*10) % 255) +"," + ((110 + i*10) % 255) + "," + ((110 + i*10) % 255) + "," + 1+ ")";
                ctx.strokeRect(-200, -200, 400, 400);
                ctx.strokeRect(-140, -140, 280, 280);
                ctx.strokeStyle = "rgba(" + ((90 + i*10) % 255) +"," + ((90 + i*10) % 255) + "," + ((90 + i*10) % 255) + "," + 1+ ")";
                ctx.strokeRect(-100, -100, 200, 200);
                ctx.strokeRect(-75, -75, 150, 150);
                ctx.strokeStyle = "rgba(" + ((70 + i*10) % 255) +"," + ((70 + i*10) % 255) + "," + ((70 + i*10) % 255) + "," + 1+ ")";
                ctx.rotate(d);
                i += 1;
        }, 100); 
    };
    return new module();
});
