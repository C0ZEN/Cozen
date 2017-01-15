/**
 * @ngdoc directive
 * @name cozen-string-to-number
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
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
            require: 'ngModel',
            link   : function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value);
                });
            }
        };
    }

})(window.angular);
