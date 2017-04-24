/**
 * @ngdoc directive
 * @name cozen-date-now
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenDateNow', cozenDateNow);

    cozenDateNow.$inject = [
        '$filter'
    ];

    function cozenDateNow($filter) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            element.text($filter('cozenCapitalize')($filter('date')(new Date(), attrs.dateNow), true, true));
        }
    }
})(window.angular);
