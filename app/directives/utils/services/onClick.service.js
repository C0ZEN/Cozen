(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenOnClickService', cozenOnClickService);

    cozenOnClickService.$inject = [
        '$window',
        '$rootScope'
    ];

    function cozenOnClickService($window, $rootScope) {

        // Listen for a click
        $window.addEventListener('click', _onClick);

        return {
            subscribe: subscribe
        };

        /// Public functions ///

        function subscribe(scope, callback) {
            var handler = $rootScope.$on('cozenOnClickServiceTriggered', callback);
            scope.$on('$destroy', handler);
        }

        // Internal functions ///

        // Notify the send message when subscribe is on
        function _notify() {
            $rootScope.$emit('cozenOnClickServiceTriggered');
        }

        function _onClick() {
            _notify();
        }
    }

})(window.angular);

