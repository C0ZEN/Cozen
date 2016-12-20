/**
 * @ngdoc directive
 * @name cozen-dropdown
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 *
 * [Attributes params]
 * @param {number} cozenDropdownId                    > Id of the dropdown
 * @param {string} cozenDropdownSize       = 'normal' > Size of the dropdown
 * @param {string} cozenDropdownSizeSmall             > Shortcut for small size
 * @param {string} cozenDropdownSizeNormal            > Shortcut for normal size
 * @param {string} cozenDropdownSizeLarge             > Shortcut for large size
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp.dropdown', [
            'cozenLibApp.dropdown.simple'
        ])
        .directive('cozenDropdown', cozenDropdown);

    cozenDropdown.$inject = [
        'Themes',
        'CONFIG',
        '$window',
        '$rootScope'
    ];

    function cozenDropdown(Themes, CONFIG, $window, $rootScope) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : {},
            templateUrl: 'directives/dropdown/dropdown.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onHover     : onHover,
                onKeyDown   : onKeyDown
            };

            var data = {
                directive: 'cozenDropdown'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onHover     : onHover
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenDropdownSize)) {
                    if (angular.isDefined(attrs.cozenDropdownSizeSmall)) scope._cozenDropdownSize = 'small';
                    else if (angular.isDefined(attrs.cozenDropdownSizeNormal)) scope._cozenDropdownSize = 'normal';
                    else if (angular.isDefined(attrs.cozenDropdownSizeLarge)) scope._cozenDropdownSize = 'large';
                    else scope._cozenDropdownSize = 'normal';
                }

                // Default values (attributes)
                scope._cozenDropdownId = angular.isDefined(attrs.cozenDropdownId) ? attrs.cozenDropdownId : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
                scope.isHover      = false;
                $window.addEventListener('keydown', methods.onKeyDown);
                scope.childrenUuid = [];
                scope.activeChild  = 0;

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                return false;
            }

            function destroy() {
                $window.removeEventListener('keydown', methods.onKeyDown);
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classDropdown = [scope._activeTheme, scope._cozenDropdownSize];
                return classDropdown;
            }

            function onHover($event, state) {
                scope.isHover = state;
                if (!state) {
                    $rootScope.$broadcast('cozenDropdownActive', {
                        uuid: null
                    });
                }
            }

            function onKeyDown(event) {
                if (!scope.isHover) return;
                event.stopPropagation();
                switch (event.keyCode) {

                    // Arrow up
                    case 38:
                        if (scope.activeChild > 1) scope.activeChild--;
                        else scope.activeChild = scope.childrenUuid.length;
                        $rootScope.$broadcast('cozenDropdownActive', {
                            uuid: scope.childrenUuid[scope.activeChild - 1]
                        });
                        break;

                    // Arrow down
                    case 40:
                        if (scope.activeChild < scope.childrenUuid.length) scope.activeChild++;
                        else scope.activeChild = 1;
                        $rootScope.$broadcast('cozenDropdownActive', {
                            uuid: scope.childrenUuid[scope.activeChild - 1]
                        });
                        break;
                }
            }
        }
    }

})(window.angular);

