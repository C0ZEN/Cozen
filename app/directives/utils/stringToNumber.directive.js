/**
 * @ngdoc directive
 * @name cozen-string-to-number
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {boolean} cozenStringToNumberDisabled = false > Disable the behavior
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenStringToNumber', cozenStringToNumber);

    cozenStringToNumber.$inject = [];

    function cozenStringToNumber() {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false,
            require   : 'ngModel'
        };

        function link(scope, element, attrs, ngModel) {
            var methods = {
                init   : init,
                destroy: destroy
            };

            var data = {
                directive: 'cozenStringToNumber'
            };

            methods.init();

            function init() {

                // Disabled check
                if (angular.isDefined(attrs.cozenStringToNumberDisabled)) {
                    if (JSON.parse(attrs.cozenStringToNumberDisabled)) return;
                }

                // Behavior
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value);
                });
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);
