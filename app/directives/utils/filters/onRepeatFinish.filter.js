/**
 * Generated header by Cozen for cozen project
 * Generated file onRepeatFinish.filter on WebStorm
 *
 * Created by: Geoffrey "C0ZEN" Testelin
 * Date: 07/02/2017
 * Time: 12:47
 * Version: 1.0.0
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



