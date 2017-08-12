(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenTestServiceMethods', cozenTestServiceMethods);

    cozenTestServiceMethods.$inject = [
        'cozenEnhancedLogs',
        'CONFIG'
    ];

    function cozenTestServiceMethods(cozenEnhancedLogs, CONFIG) {
        return {
            isUndefined  : $isUndefined,
            isString     : $isString,
            isBoolean    : $isBoolean,
            isNumber     : $isNumber,
            isAttrString : $isAttrString,
            isAttrBoolean: $isAttrBoolean,
            isAttrNumber : $isAttrNumber
        };

        function $isUndefined($config, $property) {
            if (angular.isUndefined($config.attrs[$property])) {
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.error.attributeIsEmpty($config.directive, $property);
                }
                return true;
            }
            return false;
        }

        function $isString($config, $property) {
            if (!Methods.isString($config.scope[$property]) || Methods.isNullOrEmpty($config.scope[$property])) {
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.error.attributeIsNotString($config.directive, $property);
                }
                return false;
            }
            return true;
        }

        function $isBoolean($config, $property) {
            if (!Methods.isBoolean(($config.scope[$property])) || Methods.isNullOrEmpty($config.scope[$property])) {
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.error.attributeIsNotBoolean($config.directive, $property);
                }
                return false;
            }
            return true;
        }

        function $isNumber($config, $property) {
            if (!angular.isNumber($config.scope[$property]) || Methods.isNullOrEmpty($config.scope[$property])) {
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.error.attributeIsNotNumber($config.directive, $property);
                }
                return false;
            }
            return true;
        }

        function $isAttrString($config, $property) {
            if (!Methods.isString($config.attrs[$property]) || Methods.isNullOrEmpty($config.attrs[$property])) {
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.error.attributeIsNotString($config.directive, $property);
                }
                return false;
            }
            return true;
        }

        function $isAttrBoolean($config, $property) {
            if (!Methods.isBoolean(($config.attrs[$property])) || Methods.isNullOrEmpty($config.attrs[$property])) {
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.error.attributeIsNotBoolean($config.directive, $property);
                }
                return false;
            }
            return true;
        }

        function $isAttrNumber($config, $property) {
            if (!angular.isNumber($config.attrs[$property]) || Methods.isNullOrEmpty($config.attrs[$property])) {
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.error.attributeIsNotNumber($config.directive, $property);
                }
                return false;
            }
            return true;
        }
    }

})(window.angular);

