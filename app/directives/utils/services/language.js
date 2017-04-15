(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenLanguage', cozenLanguage);

    cozenLanguage.$inject = [
        'CONFIG',
        'cozenEnhancedLogs',
        '$translate',
        'tmhDynamicLocale'
    ];

    function cozenLanguage(CONFIG, cozenEnhancedLogs, $translate, tmhDynamicLocale) {
        return {
            getCurrentLanguage   : getCurrentLanguage,
            updateCurrentLanguage: updateCurrentLanguage,
            getAvailableLanguages: getAvailableLanguages,
            isLanguageAvailable  : isLanguageAvailable
        };

        /**
         * Return the current language
         * @return {string}
         */
        function getCurrentLanguage() {
            if (CONFIG.dev) {
                cozenEnhancedLogs.info.customMessageEnhanced('cozenLanguage', 'The current language is', CONFIG.currentLanguage);
                cozenEnhancedLogs.explodeObject(languages);
            }
            return CONFIG.currentLanguage;
        }

        /**
         * Update the current language
         * This will update the provider used by the cozen-lib to handle the new lang
         * @param {string} language > Key that correspond to the new language (e.g: en)
         */
        function updateCurrentLanguage(language) {
            if (isLanguageAvailable(language)) {
                CONFIG.currentLanguage = language;
                $translate.use(CONFIG.currentLanguage);
                tmhDynamicLocale.set(CONFIG.currentLanguage);
                moment.locale(CONFIG.currentLanguage);
                cozenEnhancedLogs.info.customMessageEnhanced('cozenLanguage', 'The new active language is', CONFIG.currentLanguage);
            }
            else {
                cozenEnhancedLogs.error.valueNotInList('updateCurrentLanguage', language, CONFIG.currentLanguage);
            }
        }

        /**
         * Return the list of available languages (e.g: [fr, en, ...]
         * @param {boolean} verbose = false > If set to true, the list return is an array of objects (e.g: {key: fr, label: Français}
         * @return {Array} Array of string or objects depending of verbose mod
         */
        function getAvailableLanguages(verbose) {
            var languages = [];
            if (verbose) {
                CONFIG.languages.forEach(function (language, index) {
                    languages.push({
                        key  : language,
                        label: CONFIG.languagesExtended[index]
                    });
                });
            }
            else {
                languages = CONFIG.languages;
            }
            if (CONFIG.dev) {
                cozenEnhancedLogs.info.functionCalled('cozenLanguage', 'getAvailableLanguages');
                cozenEnhancedLogs.explodeObject(languages);
            }
            return languages;
        }

        /**
         * Check if the language is available (in the list of languages from the config)
         * @param {string} language > Key that correspond to the new language (e.g: en)
         * @return {boolean}
         */
        function isLanguageAvailable(language) {
            return Methods.isInList(CONFIG.languages, language);
        }
    }

})(window.angular);

