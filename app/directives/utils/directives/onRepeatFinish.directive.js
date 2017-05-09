/**
 * Generated header by Cozen for cozen project
 * Generated file onRepeatFinish.directive on WebStorm
 *
 * Created by: Geoffrey "C0ZEN" Testelin
 * Date: 07/02/2017
 * Time: 12:29
 * Version: 1.0.0
 *
 * @ngdoc directive
 * @name cozen-on-repeat-finish
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {string} cozenOnRepeatFinish > Name of the event sent when the ng-repeat has finished
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenOnRepeatFinish', cozenOnRepeatFinish);

    cozenOnRepeatFinish.$inject = [
        '$timeout'
    ];

    function cozenOnRepeatFinish($timeout) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {

            // Default values (attributes)
            scope._cozenOnRepeatFinish = Methods.isNullOrEmpty(attrs.cozenOnRepeatFinish) ? 'cozenRepeatFinished' : attrs.cozenOnRepeatFinish;

            // Check if the current is the last
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(scope._cozenOnRepeatFinish);
                });
            }
        }
    }

})(window.angular);

