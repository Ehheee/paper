/*
 * All measures are in millimeters(mm);
 */
define([], function() {
    var module = function(options) {
        this.realProductSize = {};
        this.realPaperSize = {};
    };
    module.prototype.setOption = function(key, value) {
        this[key] = value;
        if (this.productSize && this.paperSize) {
            this.calculateRealSizes();
        }
    };
    module.prototype.calculateRealSizes = function() {
        this.bleed = this.bleed ? this.bleed: {};
        this.greifer = this.greifer ? this.greifer: {};
        this.realProductSize.height = this.productSize.height + (this.bleed.top ? this.bleed.top: 0) + (this.bleed.bottom ? this.bleed.bottom : 0);
        this.realProductSize.width = this.productSize.width + (this.bleed.left ? this.bleed.left : 0) + (this.bleed.right ? this.bleed.right : 0);
        this.realPaperSize.height = this.paperSize.height - (this.greifer.top ? this.bleed.top: 0) - (this.greifer.bottom ? this.greifer.bottom : 0);
        this.realPaperSize.width = this.paperSize.width - (this.greifer.left ? this.greifer.left: 0) - (this.greifer.right ? this.greifer.right : 0);
    };
    module.prototype.switchProduct = function() {
        var height = this.realProductSize.height;
        var width = this.realProductSize.width;
        this.realProductSize = {height: width, width: height};
        var bleed = {top: this.bleed.left, right: this.bleed.top, bottom: this.bleed.right, left: this.bleed.bottom};
        this.bleed = bleed;
    };
    module.prototype.productPlacement = function() {
        var a = Math.floor(this.realPaperSize.height / this.realProductSize.height) * Math.floor(this.realPaperSize.width / this.realProductSize.width);
        var b = Math.floor(this.realPaperSize.height / this.realProductSize.width) * Math.floor(this.realPaperSize.width / this.realProductSize.height);
        console.log(a, b);
        if (a < b) {
            this.switchProduct();
        }
        
    };
    module.prototype.getRectangles = function() {
        var rectangles = [];
        var byHeight = Math.floor(this.realPaperSize.height / this.realProductSize.height);
        var byWidth = Math.floor(this.realPaperSize.width / this.realProductSize.width);
        for (var x = 0; x < byWidth; x++) {
            for (var y = 0; y < byHeight; y++) {
                //Product rectangle
                rectangles.push({x: x*this.realProductSize.width,
                                 y: y*this.realProductSize.height,
                                 width: this.realProductSize.width,
                                 height: this.realProductSize.height,
                                 type: "border"
                                 });
                rectangles.push({x: x*this.realProductSize.width +1,
                                 y: y*this.realProductSize.height +1,
                                 width: this.realProductSize.width -1,
                                 height: this.realProductSize.height -1,
                                 type: "fill"
                                 });
                if (_.keys(this.bleed).length < 1) {
                    continue;
                }
                rectangles.push({x: x*this.realProductSize.width + this.bleed.left,
                                 y: y*this.realProductSize.height + this.bleed.top,
                                 width: this.realProductSize.width - (this.bleed.right + this.bleed.left),
                                 height: this.realProductSize.height - (this.bleed.bottom + this.bleed.top),
                                 type: "bleed"
                                 });
            }
        }
        return rectangles;
    };
    return module;
});