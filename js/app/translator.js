define(["app/translations/translations"], function(translations) {
    var module = {};
    module.translate = function(arg) {
        if (module.language[arg]) {
            var tr = module.language[arg];
            return tr;
        }
        return arg;
    };
    module.reverse = function(arg) {
        if (module.reverseTranslations[arg]) {
            var tr = module.reverseTranslations[arg];
            return tr;
        }
        return arg;
    };
    module.setLanguage = function(language) {
        this.reverseTranslations = {};
        this.language = translations[language];
        _.each(this.language, function(value, key) {
            this.reverseTranslations[value] = key;
        }, this);
    };
    return module;
});
