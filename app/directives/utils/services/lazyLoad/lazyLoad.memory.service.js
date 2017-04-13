(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.memoryService', [])
        .factory('cozenLazyLoadMemory', cozenLazyLoadMemory);

    cozenLazyLoadMemory.$inject = [
        'cozenLazyLoadConstant',
        'cozenLazyLoadInternal',
        'cozenEnhancedLogs'
    ];

    function cozenLazyLoadMemory(cozenLazyLoadConstant, cozenLazyLoadInternal, cozenEnhancedLogs) {
        return {
            getMemoryEmail: getMemoryEmail
        };

        /// MEMORY METHODS (use saved data) ///

        /**
         * Return an email address as <firstname.lastname@domain> by fetching the last data available
         * @returns {string} email address
         */
        function getMemoryEmail() {
            var firstName                    = cozenLazyLoadInternal.getLastFirstName();
            var lastName                     = cozenLazyLoadInternal.getLastLastName();
            var domain                       = cozenLazyLoadInternal.getLastDomain();
            cozenLazyLoadConstant.last.email = (firstName + '.' + lastName + '@' + domain).toLowerCase();
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadMemory', 'getMemoryEmail', cozenLazyLoadConstant.last.email);
            return cozenLazyLoadConstant.last.email;
        }
    }

})(window.angular);