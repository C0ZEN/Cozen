(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenTestService', cozenTestService);

    cozenTestService.$inject = [
        'cozenTestErrorService',
        'cozenTestServiceMethods',
        'cozenEnhancedLogs',
        'CONFIG'
    ];

    function cozenTestService(cozenTestErrorService, cozenTestServiceMethods, cozenEnhancedLogs, CONFIG) {
        var methods = {
            setDefault             : $$setDefault,
            setDefaultWithShortcuts: $$setDefaultWithShortcuts
        };

        return {
            error         : cozenTestErrorService,
            getConfig     : $getConfig,
            setDefault    : $setDefault,
            setDefaultAttr: $setDefaultAttr
        };

        function $getConfig($directive, $scope, $attrs) {
            console.log('--- NEW TEST ---');
            return {
                directive: $directive,
                scope    : $scope,
                attrs    : $attrs
            };
        }

        function $setDefault($config, $property, $defaultValue, $shortcuts) {
            if (angular.isDefined($shortcuts)) {
                methods.setDefaultWithShortcuts($config, $property, $defaultValue, $shortcuts);
            }
            else {
                methods.setDefault($config, $property, $defaultValue, true);
            }
        }

        function $setDefaultAttr($config, $property, $defaultValue) {
            methods.setDefault($config, $property, $defaultValue, false);
        }

        // INTERNAL METHODS

        function $$setDefault($config, $property, $defaultValue, $scope) {

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
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.info.setDefaultAttrValue($config.directive, $property, $defaultValue);
                }
            }
        }

        function $$setDefaultWithShortcuts($config, $property, $defaultValue, $shortcuts) {

            // Check if the value is undefined
            // If undefined, check if a shortcut is set
            var i, length;
            if (cozenTestServiceMethods.isUndefined($config, $property) && angular.isArray($shortcuts)) {

                // Loop through shortcuts
                for (i = 0, length = $shortcuts.length; i < length; i++) {

                    // If one is set
                    if (angular.isDefined($config.attrs[$property + Methods.capitalizeFirstLetter($shortcuts[i])])) {

                        // Update the scope property
                        $config.scope[$property] = $defaultValue;
                        return;
                    }
                }

                // Else, there is no shortcuts, set the default value
                set();
            }

            // Else, the value is defined, we must check that the value is correct
            else {

                // If the type is not correct, set the default value instead
                if (!cozenTestServiceMethods.isString($config, $property)) {
                    set();
                }
                else {

                    // Loop through shortcuts
                    for (i = 0, length = $shortcuts.length; i < length; i++) {

                        // Check if the value is in list of shortcuts
                        // To make sure that it's possible
                        if ($config.scope[$property] == $shortcuts[i]) {
                            return;
                        }
                    }

                    // If not correct, set the default value
                    if (CONFIG.logs.test) {
                        cozenEnhancedLogs.error.valueNotInList($config.directive, $property, $shortcuts);
                    }
                    set();
                }
            }

            function set() {
                $config.scope[$property] = $defaultValue;
                if (CONFIG.logs.test) {
                    cozenEnhancedLogs.info.setDefaultAttrValue($config.directive, $property, $defaultValue);
                }
            }
        }
    }

})(window.angular);

