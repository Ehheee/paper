define(["app/views/common/Canvas"], function(Canvas) {
    var module = Canvas.extend({
        render: function() {
            this.el.style.backgroundColor = 'rgba(125, 125, 125, 0.9)';
            if (this.rectangles) {
                this.renderRectangles();
            }
        },
        renderRectangles: function() {
            for (var i = 0; i < this.rectangles.length; i++) {
                var r = this.rectangles[i];
                if (r.type === "border" || r.type === "bleed") {
                    this.ctx.strokeStyle = "#AAA";
                    this.ctx.setLineDash([]);
                    if (this.ctx.setLineDash && r.type === "bleed") {
                        this.ctx.setLineDash([6, 3]);
                    }
                    this.ctx.strokeRect(r.x, r.y, r.width, r.height);
                } else if (r.type === "fill") {
                    this.ctx.fillStyle = "#000";
                    this.ctx.fillRect(r.x, r.y, r.width, r.height);
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
    return module;
});
