define([], function() {
    var module = function() {};
    module.prototype.stringToType = function(value) {
        var result = value;
        if (_.isString(value)) {
            value = value.toLowerCase();
            result = value === 'true' || (value === 'false' ? false : result);
            if ($.isNumeric(value)) {
                result = parseInt(value);
            }
        }
        return result;
    };
    module.prototype.mapItemsByField = function(objectArray, key) {
        var result = {};
        for (var i = 0; i < objectArray.length; i++) {
            var object = objectArray[i];
            var values = this.findByKey(object, key);
            if (values.length > 0) {
                for (var v = 0; v < values.length; v++) {
                    var value = values[v];
                    if (!result[value]) {
                        result[value] = [];
                    }
                    result[value].push(object);
                }
            }
        }
        return result;
    };
    module.prototype.cloneJson = function(tree) {
        return JSON.parse(JSON.stringify(tree));
    };
    module.prototype.getFromJson = function(tree, keyList) {
        return this.getFromJsonRecursive(tree, keyList.slice());
    };
    module.prototype.getFromJsonRecursive = function(tree, keyList) {
        if (keyList.length > 1) {
            return this.getFromJson(tree[keyList.shift()], keyList);
        } else if (keyList.length < 2 && tree) {
            return tree[keyList[0]];
        }
    };
    return new module();
});
