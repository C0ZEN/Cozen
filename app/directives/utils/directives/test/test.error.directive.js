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
 * @param {boolean} cozenTestErrorBoolean = true > Simulate the check of a boolean
 *
 * [Attrs]
 * @param {string} cozenTestErrorName > Name of the directive for logs [required]
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenTestError', cozenTestError);

    cozenTestError.$inject = [
        'cozenTestService',
        'cozenEnhancedLogs'
    ];

    function cozenTestError(cozenTestService, cozenEnhancedLogs) {
        return {
            link      : link,
            restrict  : 'E',
            replace   : false,
            transclude: false,
            scope     : {
                cozenTestErrorBoolean: '=?',
                cozenTestErrorName   : '@'
            }
        };

        function link(scope, element, attrs) {
            var methods = {
                init   : init,
                destroy: destroy
            };

            var data   = {
                directive: 'cozenTestError'
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

                // Set default value for cozenTestErrorBoolean
                cozenTestService.setDefault(config, 'cozenTestErrorBoolean', true);

                // Init stuff
                element.on('$destroy', methods.destroy);
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);

