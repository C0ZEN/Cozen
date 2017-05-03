/*
 * @ngdoc directive
 * @name cozen-when-height-greater-than
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {string}  cozenWhenHeightGreaterThan         = 100   > The height you want to be check in pixels
 * @param {string}  cozenWhenHeightGreaterThanClass            > The class you which to toggle if the height is greater than
 * @param {boolean} cozenWhenHeightGreaterThanDisabled = false > Enable/disable the check (to improve performances)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenWhenHeightGreaterThan', cozenWhenHeightGreaterThan);

    cozenWhenHeightGreaterThan.$inject = [];

    function cozenWhenHeightGreaterThan() {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            scope.disabled = angular.isDefined(attrs.cozenWhenHeightGreaterThanDisabled) ? JSON.parse(attrs.cozenWhenHeightGreaterThanDisabled) : false;
            if (!scope.disabled && !Methods.isNullOrEmpty(attrs.cozenWhenHeightGreaterThanClass)) {

                // Watch every digest and update the height
                scope.$watch(function () {
                    scope.__height = element.height();
                });

                // Watch for the height property and get called when it change
                scope.$watch('__height', function (newHeight, oldHeight) {
                    if (newHeight > attrs.cozenWhenHeightGreaterThan) {
                        element.addClass(attrs.cozenWhenHeightGreaterThanClass);
                    }
                    else {
                        element.removeClass(attrs.cozenWhenHeightGreaterThanClass);
                    }
                });
            }
        }
    }
})(window.angular);
