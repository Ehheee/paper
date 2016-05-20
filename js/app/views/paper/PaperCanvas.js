define(["app/views/common/Canvas"], function(Canvas) {
    var module = Canvas.extend({
        render: function() {
            this.el.style.backgroundColor = 'rgba(125, 125, 125, 1.0)';
            if (this.rectangles) {
                this.renderRectangles();
            }
            return this;
        },
        renderRectangles: function() {
            for (var i = 0; i < this.rectangles.length; i++) {
                var r = this.rectangles[i];
                if (r.type === "border" ) {
                    this.ctx.strokeStyle = "#AAA";
                    this.ctx.setLineDash([]);
                    this.ctx.strokeRect(r.x*this.zoom, r.y*this.zoom, r.width*this.zoom, r.height*this.zoom);
                } else if (r.type === "bleed") {
                    /*
                    this.ctx.strokeStyle = "#FF0040";
                    this.ctx.setLineDash([3, 3]);
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(r.x*this.zoom, r.y*this.zoom, r.width*this.zoom, r.height*this.zoom);
                    */
                } else if (r.type === "bleed2") {
                    this.ctx.strokeStyle = "#FF0040";
                    this.ctx.setLineDash([1, 1]);
                    this.ctx.beginPath();
                    this.ctx.moveTo(r.start.x*this.zoom, r.start.y*this.zoom);
                    this.ctx.lineTo(r.end.x*this.zoom, r.end.y*this.zoom);
                    this.ctx.stroke();         
                } else if (r.type === "product") {
                    this.ctx.fillStyle = "#000";
                    this.ctx.strokeStyle = "#000";
                    this.ctx.setLineDash([]);
                    this.ctx.lineWidth = r.productStroke;
                    this.ctx.fillRect(r.x*this.zoom, r.y*this.zoom, r.width*this.zoom, r.height*this.zoom);
                    this.ctx.strokeRect(r.x*this.zoom, r.y*this.zoom, r.width*this.zoom, r.height*this.zoom);
                } else if (r.type === "fold") {
                    this.ctx.setLineDash([2, 2]);
                    this.ctx.moveTo(r.start.x*this.zoom, r.start.y*this.zoom);
                    this.ctx.lineTo(r.end.x*this.zoom, r.end.y*this.zoom);
                    this.ctx.stroke();
                } else if (r.type === "greifer") {
                    this.ctx.setLineDash([8, 4]);
                    this.ctx.strokeStyle = "#FFFF00";
                    this.ctx.beginPath();
                    this.ctx.moveTo(r.start.x*this.zoom, r.start.y*this.zoom);
                    this.ctx.lineTo(r.end.x*this.zoom, r.end.y*this.zoom);
                    this.ctx.stroke();
                }
            }
        },
        setGreifer: function(greifer) {
            this.greifer = greifer;
            this.render();
        },
        setRectangles: function(rectangles) {
            this.rectangles = rectangles;
            this.render();
        }
    });
    /*
    var c = document.createElement("canvas");
    c.width = 1600;
    c.height = 700;
    $("body").html(c);
    var ctx = c.getContext("2d");
    ctx.strokeStyle = "#AAA";
    ctx.moveTo(0, 40);
    ctx.lineTo(1600, 40);
    ctx.stroke();
    ctx.moveTo(0, 80);
    ctx.lineTo(1600, 80);
    ctx.stroke();
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(1, 40, 40, 40);
    */
    return module;
});
