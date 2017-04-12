/**
 * @description
 * Transform the text as lowercase and then add uppercase
 * Note: You should use yourText.trim() before calling the filter to avoid unexpected behavior
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .filter('cozenCapitalize', cozenCapitalize);

    function cozenCapitalize() {
        return cozenCapitalizeFilter;

        /**
         * @param {string}  text                  > The text you want to convert
         * @param {boolean} all           = false > Check for the whole text
         * @param {boolean} firstCharOnly = false > Capitalize only the first letter
         */
        function cozenCapitalizeFilter(text, all, firstCharOnly) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            if (!Methods.isNullOrEmpty(text)) {
                if (firstCharOnly) {
                    text = text.toLowerCase();
                    text = text[0].toUpperCase() + text.slice(1);
                }
                else {

                    // For the case of '-', save each index of the '-' in an array
                    var indexArray = [];
                    for (var i = 0, length = text.length; i < length; i++) {
                        if (text[i] == '-') {
                            indexArray.push(i);
                        }
                    }

                    // Transform the text with all letters capitalized
                    var tmpText = '';
                    text.replace(reg, function (txt) {
                        tmpText += txt[0].toUpperCase() + txt.substr(1).toLowerCase();
                    });
                    text = tmpText;

                    // Add the '-'
                    indexArray.forEach(function (index) {
                        text = PublicMethods.insertIntoString(text, index, '-');
                    });
                }
                return text;
            }
            else {
                return '';
            }
        }
    }

})(window.angular);



