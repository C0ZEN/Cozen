(function (angular) {
    'use strict';

    angular
        .module('cozenLib.alert.floatingFeedFactory', [])
        .factory('cozenFloatingFeedFactory', cozenFloatingFeedFactory);

    cozenFloatingFeedFactory.$inject = [
        '$rootScope'
    ];

    function cozenFloatingFeedFactory($rootScope) {
        return {
            addAlert : addAlert,
            removeAll: removeAll
        };

        function addAlert(alert) {
            $rootScope.$broadcast('cozenFloatingFeedAdd', alert);
        }

        function removeAll() {
            $rootScope.$broadcast('cozenFloatingFeedRemoveAll');
        }
    }

})(window.angular);

