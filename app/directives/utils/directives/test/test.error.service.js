(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenTestErrorService', cozenTestErrorService);

    cozenTestErrorService.$inject = [
        'cozenEnhancedLogs',
        'cozenTestServiceMethods'
    ];

    function cozenTestErrorService(cozenEnhancedLogs, cozenTestServiceMethods) {
        return {
            isAttrString: isAttrString
        };

        /**
         * Check if the value is set and is a string
         * Send log messages if not
         * Use it when the value is required
         * @param $config
         * @param $property
         * @return {boolean}
         */
        function isAttrString($config, $property) {
            if (cozenTestServiceMethods.isUndefined($config, $property)) {
                return false;
            }
            else if (!cozenTestServiceMethods.isAttrString($config, $property)) {
                return false;
            }
            return true;
        }
    }

})(window.angular);

