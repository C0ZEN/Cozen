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
 * @param {string}   cozenOnRepeatFinish         > Name of the event sent when the ng-repeat has finished
 * @param {object}   cozenOnRepeatFinishData     > Data to add in the finish and in the callback
 * @param {function} cozenOnRepeatFinishCallback > Callback function called on finish
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
            scope._cozenOnRepeatFinish     = Methods.isNullOrEmpty(attrs.cozenOnRepeatFinish) ? 'cozenRepeatFinished' : attrs.cozenOnRepeatFinish;
            scope._cozenOnRepeatFinishData = scope.$eval(attrs.cozenOnRepeatFinishData);

            // Check if the current element is the last
            if (scope.$last === true) {
                $timeout(function () {

                    // Notify parents of the complete process
                    scope.$emit(scope._cozenOnRepeatFinish, {
                        data: scope._cozenOnRepeatFinishData
                    });

                    // Execute the callback method
                    scope._cozenOnRepeatFinishCallback = scope.$eval(attrs.cozenOnRepeatFinishCallback);
                    if (Methods.isFunction(scope._cozenOnRepeatFinishCallback)) {
                        scope._cozenOnRepeatFinishCallback({
                            data: scope._cozenOnRepeatFinishData
                        });
                    }
                });
            }
        }
    }

})(window.angular);

