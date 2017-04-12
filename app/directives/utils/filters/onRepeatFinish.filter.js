/**
 * @description
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .filter('cozenOnRepeatFinish', cozenOnRepeatFinish);

    cozenOnRepeatFinish.$inject = [
        '$timeout',
        '$rootScope'
    ];

    function cozenOnRepeatFinish($timeout, $rootScope) {
        return cozenOnRepeatFinishFilter;

        function cozenOnRepeatFinishFilter(data, eventName) {
            var flagProperty = '__finishedRendering__';
            if (!data[flagProperty]) {
                Object.defineProperty(
                    data,
                    flagProperty,
                    {
                        enumerable  : false,
                        configurable: true,
                        writable    : false,
                        value       : {}
                    });
                $timeout(function () {
                    delete data[flagProperty];
                    $rootScope.$emit(eventName);
                }, 0, false);
            }
            return data;
        }
    }

})(window.angular);



