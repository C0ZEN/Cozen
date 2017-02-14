/**
 * @ngdoc directive
 * @name cozen-list
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 *
 * [Attributes params]
 * @param {number} cozenListId                    > Id of the list
 * @param {string} cozenListSize       = 'normal' > Size of the list
 * @param {string} cozenListSizeSmall             > Shortcut for small size
 * @param {string} cozenListSizeNormal            > Shortcut for normal size
 * @param {string} cozenListSizeLarge             > Shortcut for large size
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.list', [
            'cozenLib.list.simple',
            'cozenLib.list.media3'
        ])
        .directive('cozenList', cozenList);

    cozenList.$inject = [
        'Themes',
        'CONFIG',
        '$window',
        '$rootScope'
    ];

    function cozenList(Themes, CONFIG, $window, $rootScope) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : {},
            templateUrl: 'directives/list/list.template.html'
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
                directive: 'cozenList'
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenListSize)) {
                    if (angular.isDefined(attrs.cozenListSizeSmall)) {
                        scope._cozenListSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenListSizeNormal)) {
                        scope._cozenListSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenListSizeLarge)) {
                        scope._cozenListSize = 'large';
                    }
                    else {
                        scope._cozenListSize = 'normal';
                    }
                }
                else {
                    scope._cozenListSize = attrs.cozenListSize;
                }

                // Default values (attributes)
                scope._cozenListId = angular.isDefined(attrs.cozenListId) ? attrs.cozenListId : '';

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
                var classList = [scope._activeTheme,
                    scope._cozenListSize];
                return classList;
            }

            function onHover($event, state) {
                scope.isHover = state;
                if (!state) {
                    $rootScope.$broadcast('cozenListActive', {
                        uuid: null
                    });
                }
            }

            function onKeyDown(event) {
                if (!scope.isHover) {
                    return;
                }
                switch (event.keyCode) {

                    // Arrow up
                    case 38:
                        event.stopPropagation();
                        if (scope.activeChild > 1) {
                            scope.activeChild--;
                        }
                        else {
                            scope.activeChild = scope.childrenUuid.length;
                        }
                        $rootScope.$broadcast('cozenListActive', {
                            uuid: scope.childrenUuid[scope.activeChild - 1]
                        });
                        break;

                    // Arrow down
                    case 40:
                        event.stopPropagation();
                        if (scope.activeChild < scope.childrenUuid.length) {
                            scope.activeChild++;
                        }
                        else {
                            scope.activeChild = 1;
                        }
                        $rootScope.$broadcast('cozenListActive', {
                            uuid: scope.childrenUuid[scope.activeChild - 1]
                        });
                        break;
                }
            }
        }
    }

})(window.angular);

