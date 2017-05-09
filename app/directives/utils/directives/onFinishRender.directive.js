/**
 * @ngdoc directive
 * @name cozen-on-finish-render
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * @param {string} cozenOnFinishRender = cozenFinishedRender > Name of the emitted event
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenOnFinishRender', cozenOnFinishRender);

    cozenOnFinishRender.$inject = [
        '$timeout'
    ];

    function cozenOnFinishRender($timeout) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {

            // Default values (attributes)
            scope._cozenOnFinishRender = Methods.isNullOrEmpty(attrs.cozenOnFinishRender) ? 'cozenFinishedRender' : attrs.cozenOnFinishRender;

            // Check if the current is the last
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(scope._cozenOnFinishRender);
                });
            }
        }
    }

})(window.angular);
