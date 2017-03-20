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
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
        }

        // Internal functions ///

        function _onClick() {

            // Broadcast an event
            $rootScope.$broadcast('cozenOnClick', {});

            // Trigger the broadcast
            _notify();
        }

        // Notify the send message when subscribe is on
        function _notify() {
            $rootScope.$emit('notifying-service-event');
        }
    }

})(window.angular);

