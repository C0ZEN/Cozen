(function (angular) {
    'use strict';

    angular
        .module('cozenLib.pills.factory', [])
        .factory('cozenPillsFactory', cozenPillsFactory);

    cozenPillsFactory.$inject = [
        '$rootScope'
    ];

    function cozenPillsFactory($rootScope) {
        return {
            active: active
        };

        function active(name) {
            $rootScope.$broadcast('cozenPillsActive', {
                name: name
            });
        }
    }

})(window.angular);

