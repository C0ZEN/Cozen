(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.memoryService', [])
        .factory('cozenLazyLoadMemory', cozenLazyLoadMemory);

    cozenLazyLoadMemory.$inject = [
        'cozenLazyLoadConstant'
    ];

    function cozenLazyLoadMemory(cozenLazyLoadConstant) {
        return {
            getEmail: getEmail
        };

        /// MEMORY METHODS (use saved data) ///

        function getEmail() {
            return cozenLazyLoadConstant.last.email;
        }
    }

})(window.angular);