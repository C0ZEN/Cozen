/**
 * @ngdoc directive
 * @name cozen-test-error
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope]
 * @param {boolean} cozenTestErrorBoolean = true    > Simulate the check of a boolean
 * @param {string}  cozenTestErrorType    = default > Simulate the check of a string with specific values (default, other) [shortcuts]
 *
 * [Attrs]
 * @param {string} cozenTestErrorName > Name of the directive for logs [required]
 *
 * [Shortcuts]
 * @param {null} cozenTestErrorTypeDefault
 * @param {null} cozenTestErrorTypeOther
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenTestError', cozenTestError);

    cozenTestError.$inject = [
        'cozenTestService',
        'cozenEnhancedLogs',
        'CONFIG'
    ];

    function cozenTestError(cozenTestService, cozenEnhancedLogs, CONFIG) {
        return {
            link      : link,
            restrict  : 'E',
            replace   : false,
            transclude: false,
            scope     : {
                cozenTestErrorBoolean: '=?',
                cozenTestErrorType   : '=?',
                cozenTestErrorName   : '@'
            }
        };

        function link(scope, element, attrs) {

            // Internal methods
            var methods = {
                init   : init,
                destroy: destroy
            };

            // Internal data
            var data   = {
                directive: 'cozenTestError',
                types    : [
                    'default',
                    'other'
                ]
            };
            var config = cozenTestService.getConfig(data.directive, scope, attrs);

            methods.init();

            function init() {
                cozenEnhancedLogs.info.customMessage(data.directive, 'initialing...');

                // Check that the cozenTestErrorName is correct [required]
                if (cozenTestService.error.isAttrString(config, 'cozenTestErrorName')) {
                    cozenEnhancedLogs.info.customMessage(data.directive, 'initialing started for ' + scope.cozenTestErrorName);
                }
                else {
                    cozenEnhancedLogs.info.customMessage(data.directive, 'initialing failed');
                    return;
                }

                // Set default values
                cozenTestService.setDefault(config, 'cozenTestErrorBoolean', true);
                cozenTestService.setDefault(config, 'cozenTestErrorType', 'default', data.types);

                // Init stuff
                element.on('$destroy', methods.destroy);
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);

