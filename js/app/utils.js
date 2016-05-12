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
    return new module();
});
