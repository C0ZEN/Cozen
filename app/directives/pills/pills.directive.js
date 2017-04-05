/**
 * @ngdoc directive
 * @name cozen-pills
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number}  cozenPillsId                          > Id of the pills
 * @param {string}  cozenPillsSize            = 'normal'  > Size of the pills
 * @param {string}  cozenPillsSizeSmall                   > Shortcut for small size
 * @param {string}  cozenPillsSizeNormal                  > Shortcut for normal size
 * @param {string}  cozenPillsSizeLarge                   > Shortcut for large size
 * @param {string}  cozenPillsClass                       > Custom class
 * @param {boolean} cozenPillsAutoUpdateModel = true      > Auto update the ng-model on click
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.pills', [
            'cozenLib.pills.factory',
            'cozenLib.pills.simple'
        ])
        .directive('cozenPills', cozenPills);

    cozenPills.$inject = [
        'Themes',
        'CONFIG',
        'cozenEnhancedLogs'
    ];

    function cozenPills(Themes, CONFIG, cozenEnhancedLogs) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : true,
            templateUrl: 'directives/pills/pills.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenPills'
            };

            // After some test, wait too long for the load make things crappy
            // So, I set it to true for now
            scope._isReady = true;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenPillsSize)) {
                    if (angular.isDefined(attrs.cozenPillsSizeSmall)) {
                        scope._cozenPillsSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenPillsSizeNormal)) {
                        scope._cozenPillsSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenPillsSizeLarge)) {
                        scope._cozenPillsSize = 'large';
                    }
                    else {
                        scope._cozenPillsSize = 'normal';
                    }
                }
                else {
                    scope._cozenPillsSize = attrs.cozenPillsSize;
                }

                // Default values (attributes)
                scope._cozenPillsId              = angular.isDefined(attrs.cozenPillsId) ? attrs.cozenPillsId : '';
                scope._cozenPillsAutoUpdateModel = angular.isDefined(attrs.cozenPillsAutoUpdateModel) ? JSON.parse(attrs.cozenPillsAutoUpdateModel) : true;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme,
                    scope._cozenPillsSize,
                    attrs.cozenPillsClass];
                return classList;
            }
        }
    }

})(window.angular);

