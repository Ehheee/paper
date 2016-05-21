/*
 * All measures are in millimeters(mm);
 */
define([], function() {
    var module = function(options) {
        this.productSize = {};
        this.realProductSize = {};
        this.realPaperSize = {};
    };
    module.prototype.setOptions = function(order, folding, paperSize) {
        this.order = order;
        this.productSize.height = order.productHeight;
        this.productSize.width = order.productWidth;
        this.folding = folding;
        this.paperSize = paperSize;
    };
    module.prototype.calculateFolding = function() {
        if (this.folding && this.folding.vertical) {
            this.productSize.width = this.order.productWidth * this.folding.sizeDifference;
        }
        if (this.folding && this.folding.horizontal) {
            this.productSize.height = this.order.productHeight * this.folding.sizeDifference;
        }
    };
    module.prototype.calculateRealSizes = function() {
        this.calculateFolding();
        this.realProductSize.height = this.productSize.height + this.order.cuttingGap;
        this.realProductSize.width = this.productSize.width + this.order.cuttingGap;
        this.realPaperSize.height = this.paperSize.height - (this.order.greiferTop ? this.order.greiferTop: 0) - (this.order.greiferBottom ? this.order.greiferBottom : 0) - (this.order.bleedTop + this.order.bleedBottom - this.order.cuttingGap);
        this.realPaperSize.width = this.paperSize.width - (this.order.greiferLeft ? this.order.greiferLeft: 0) - (this.order.greiferRight ? this.order.greiferRight : 0) - (this.order.bleedLeft + this.order.bleedRight - this.order.cuttingGap);
    };
    module.prototype.switchProduct = function() {
        var height = this.realProductSize.height;
        var width = this.realProductSize.width;
        this.realProductSize = {height: width, width: height};
        this.switchBleed();
    };
    module.prototype.switchBleed = function() {
        var bleed = {top: this.bleedLeft, right: this.bleedTop, bottom: this.bleedRight, left: this.bleedBottom};
        this.bleedTop = bleed.top;
        this.bleedRight = bleed.right;
        this.bleedBottom = bleed.bottom;
        this.bleedLeft = bleed.left;
    };
    module.prototype.productPlacement = function() {
        this.calculateRealSizes();
        var a1 = Math.floor(this.realPaperSize.height / this.realProductSize.height) * Math.floor(this.realPaperSize.width / this.realProductSize.width);
        var a = a1 + this.checkRemainingArea();
        this.switchProduct();
        var b1 = Math.floor(this.realPaperSize.height / this.realProductSize.height) * Math.floor(this.realPaperSize.width / this.realProductSize.width);
        var b = b1 + this.checkRemainingArea();
        console.log(a, b);
        this.total = b;
        if (b < a) {
            this.total = a;
            this.switchProduct();
        }
        if (a == b) {
            if (b1 < a1) {
                this.switchProduct();
            }
        }
        this.checkRemainingArea();
    };
    module.prototype.checkRemainingArea = function() {
        var byHeight = Math.floor(this.realPaperSize.height / this.realProductSize.height);
        var byWidth = Math.floor(this.realPaperSize.width / this.realProductSize.width);
        var result = 0;
        this.hasExtraHeight = false;
        this.hasExtraWidth = false;
        var r2 = Math.floor((this.realPaperSize.height - byHeight * this.realProductSize.height) / this.realProductSize.width);
        if (r2 >= 1) {
            var r = Math.floor(this.realPaperSize.width / this.realProductSize.height);
            this.hasExtraHeight = {x: r, y: r2};
            result = r * r2;
        } 
        r2 = Math.floor((this.realPaperSize.width - byWidth * this.realProductSize.width) / this.realProductSize.height);
        if (r2 >= 1) {
            r = Math.floor(this.realPaperSize.height / this.realProductSize.width);
            this.hasExtraWidth = {x: r2, y: r};
            result = r * r2;
        }
        console.log(result);
        return result;
    };
    module.prototype.getResult = function() {
        this.productPlacement();
        return {rectangles: this.getRectangles(), printPlatesAmount: this.getPrintPlatesAmount(), paperAmount: this.getPaperAmount()};
    };
    module.prototype.getPagesPerPaper = function() {
        var byHeight = Math.floor(this.realPaperSize.height / this.realProductSize.height);
        var byWidth = Math.floor(this.realPaperSize.width / this.realProductSize.width);
        return byHeight * byWidth * (this.folding ? this.folding.sizeDifference : 1);
    };
    module.prototype.getPrintPlatesAmount = function() {
        var pagesPerPlate = this.getPagesPerPaper();
        return Math.ceil(this.order.numPages / pagesPerPlate)*this.order.numColors;
    };
    module.prototype.getPaperAmount = function() {
        var pagesPerPaper = this.getPagesPerPaper();
        return Math.ceil(this.order.amount * (this.order.numPages / pagesPerPaper) / (this.order.twoSided ? 2 : 1));
    };
    module.prototype.getRectangles = function(rectangles, byWidth, byHeight, startPosition) {
        var rectangles = rectangles || [];
        var byHeight = byHeight || Math.floor(this.realPaperSize.height / this.realProductSize.height);
        var byWidth = byWidth || Math.floor(this.realPaperSize.width / this.realProductSize.width);
        var startPosition = startPosition || {x: 0, y: 0};
        for (var x = 0; x < byWidth; x++) {
            for (var y = 0; y < byHeight; y++) {
                var r = {type: "product"};
                r.x = x * this.realProductSize.width + (this.order.greiferLeft && startPosition.x == 0 ? this.order.greiferLeft : 0) +1 + (startPosition.x);
                r.y = y * this.realProductSize.height + (this.order.greiferTop && startPosition.y == 0 ? this.order.greiferTop : 0) +1 + (startPosition.y);
                r.width = this.realProductSize.width - 1  + (x == 0 ? this.order. bleedLeft - this.order.cuttingGap/2: 0) + (x == (byWidth-1) && (!this.hasExtraWidth || startPosition.x != 0) ? this.order.bleedRight - this.order.cuttingGap/2 : 0);
                r.height = this.realProductSize.height - 1 + (y == 0 ? this.order.bleedTop - this.order.cuttingGap/2 : 0) + (y == (byHeight -1) && (!this.hasExtraHeight || startPosition.y != 0) ? this.order.bleedBottom - this.order.cuttingGap/2 : 0);
                
                if (x != 0) {
                    r.x = r.x + this.order.bleedLeft - this.order.cuttingGap/2;
                }
                if (y != 0) {
                    r.y = r.y + this.order.bleedTop - this.order.cuttingGap/2;
                }
                rectangles.push(r);
                if (x == byWidth -1 && y == 0) {
                    if (this. hasExtraWidth && startPosition.x == 0) {
                        var s = {x: r.x + r.width + this.order.cuttingGap/2 - this.order.bleedLeft, y: 0};
                        this.switchProduct();
                        rectangles = this.getRectangles(rectangles, this.hasExtraWidth.x, this.hasExtraWidth.y, s);
                        this.switchProduct();
                    }
                }
                if (y == byHeight -1 && x == 0) {
                    if (this.hasExtraHeight && startPosition.y == 0) {
                        var s = {x: 0, y: r.y + r.height + this.order.cuttingGap/2 - this.order.bleedTop};
                        this.switchProduct();
                        rectangles = this.getRectangles(rectangles, this.hasExtraHeight.x, this.hasExtraHeight.y, s);
                        this.switchProduct();
                    }
                }
                if (y == 0 && startPosition.y == 0) {
                    var b = {type: "bleed2", start: {}, end: {}};
                    b.start.x = r.x;
                    b.end.x = r.x + r.width;
                    b.start.y = r.y + this.order.bleedTop;
                    b.end.y = r.y + this.order.bleedTop;
                    rectangles.push(b);
                }
                if (x == 0 && startPosition.x == 0) {
                    var b = {type: "bleed2", start: {}, end: {}};
                    b.start.y = r.y;
                    b.end.y = r.y + r.height;
                    b.start.x = r.x + this.order.bleedLeft;
                    b.end.x = r.x + this.order.bleedLeft;
                    rectangles.push(b);
                }
                if (x == byWidth - 1 && (!this.hasExtraWidth || startPosition.x != 0)) {
                    var b = {type: "bleed2", start: {}, end: {}};
                    b.start.x = r.x + r.width - this.order.bleedRight;
                    b.start.y = r.y;
                    b.end.x = r.x + r.width - this.order.bleedRight;
                    b.end.y = r.y + r.height;
                    rectangles.push(b);
                }
                if (y == byHeight -1 && (!this.hasExtraHeight || startPosition.y !=0)) {
                    var b = {type: "bleed2", start: {}, end: {}};
                    b.start.x = r.x;
                    b.end.x = r.x + r.width;
                    b.start.y = r.y + r.height - this.order.bleedBottom;
                    b.end.y = r.y + r.height - this.order.bleedBottom;
                    rectangles.push(b);
                }
                if (x != byWidth -1 && y != byHeight -1) {
                    var b = {type: "cutting", start: {}, end: {}};
                    b.start.x = r.x;
                    b.end.x = r.x + r.width;
                    b.start.y = r.y + r.height;
                    b.end.y = r.y + r.height;
                }
                if (this.folding) {
                    for (var i = 0; i < this.folding.cutPoints; i++) {
                        var c = this.folding.cutPoints[i];
                        var r = {type: "fold", start: {}, end: {}};
                        r.start.x = x*this.realProductSize.width + this.order.bleedLeft + (this.folding.vertical ? c * this.productSize.width : 0);
                        r.start.y = y*this.realProductSize.height + this.order.bleedTop + (this.folding.horizontal ? c * this.productSize.height : 0);
                        r.end.x = r.start.x + (this.folding.horizontal ? this.productSize.width : 0);
                        r.end.y = r.start.y + (this.folding.vertical ? this.productSize.height : 0);
                        rectangles.push(r);
                    }
                    
                }
            }
        }
        rectangles.push(this.getGreiferLine());
        return rectangles;
    };
    module.prototype.getGreiferLine = function() {
        var r = {type: "greifer", start: {}, end: {}};
        if (this.order.greiferTop) {
            r.start.x = 0;
            r.end.x = this.paperSize.width;
            r.start.y = this.order.greiferTop;
            r.end.y = this.order.greiferTop;
        }
        if (this.order.greiferLeft) {
            r.start.x = this.order.greiferLeft;
            r.end.x = this.order.greiferLeft;
            r.start.y = 0;
            r.end.y = this.paperSize.height;
        }
        if (this.order.greiferRight) {
            r.start.x = this.paperSize.width - this.order.greiferRight;
            r.end.x = this.paperSize.width - this.order.greiferRight;
            r.start.y = 0;
            r.end.y = this.paperSize.height;
        }
        if (this.order.greiferBottom) {
            r.start.x = 0;
            r.end.x = this.paperSize.width;
            r.start.y = this.paperSize.height - this.order.greiferBottom;
            r.end.y = this.paperSize.height - this.order.greiferBottom;
        }
        return r;
    };
    return module;
});