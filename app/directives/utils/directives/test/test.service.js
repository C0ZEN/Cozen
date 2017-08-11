(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenTestService', cozenTestService);

    cozenTestService.$inject = [
        'cozenTestErrorService',
        'cozenTestServiceMethods',
        'cozenEnhancedLogs'
    ];

    function cozenTestService(cozenTestErrorService, cozenTestServiceMethods, cozenEnhancedLogs) {
        return {
            error         : cozenTestErrorService,
            getConfig     : getConfig,
            setDefault    : setDefault,
            setDefaultAttr: setDefaultAttr
        };

        function getConfig($directive, $scope, $attrs) {
            return {
                directive: $directive,
                scope    : $scope,
                attrs    : $attrs
            };
        }

        function setDefault($config, $property, $defaultValue) {
            $setDefault($config, $property, $defaultValue, true);
        }

        function setDefaultAttr($config, $property, $defaultValue) {
            $setDefault($config, $property, $defaultValue, false);
        }

        // INTERNAL METHODS

        function $setDefault($config, $property, $defaultValue, $scope) {

            // Check if the value is undefined
            // If undefined, set the default value
            if (cozenTestServiceMethods.isUndefined($config, $property)) {
                set();
            }

            // Else, the value is defined, we must check that the value is correct
            else {
                var isCorrect, defaultValueType = typeof $defaultValue;
                switch (defaultValueType) {
                    case 'boolean':
                        isCorrect = $scope ? cozenTestServiceMethods.isBoolean($config, $property) : cozenTestServiceMethods.isAttrBoolean($config, $property);
                        break;
                    case 'number':
                        isCorrect = $scope ? cozenTestServiceMethods.isNumber($config, $property) : cozenTestServiceMethods.isAttrNumber($config, $property);
                        break;
                    case 'string':
                        isCorrect = $scope ? cozenTestServiceMethods.isString($config, $property) : cozenTestServiceMethods.isAttrString($config, $property);
                        break;
                }

                // If the type is not correct, set the default value instead
                if (!isCorrect) {
                    set();
                }
            }

            function set() {
                $config.scope[$property] = $defaultValue;
                cozenEnhancedLogs.info.setDefaultAttrValue($config.directive, $property, $defaultValue);
            }
        }
    }

})(window.angular);

