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
        .module('cozenLibApp.list', [
            'cozenLibApp.list.simple',
            'cozenLibApp.list.media3'
        ])
        .directive('cozenList', cozenList)
        .directive('cozenListTransclude', cozenListTransclude);

    cozenList.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenList(Themes, CONFIG) {
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
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenList'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenListSize)) {
                    if (angular.isDefined(attrs.cozenListSizeSmall)) scope._cozenListSize = 'small';
                    else if (angular.isDefined(attrs.cozenListSizeNormal)) scope._cozenListSize = 'normal';
                    else if (angular.isDefined(attrs.cozenListSizeLarge)) scope._cozenListSize = 'large';
                    else scope._cozenListSize = 'normal';
                }

                // Default values (attributes)
                scope._cozenListId = angular.isDefined(attrs.cozenListId) ? attrs.cozenListId : '';

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
                var classList = [scope._activeTheme, scope._cozenListSize];
                return classList;
            }
        }
    }

    function cozenListTransclude() {
        return {
            link: function (scope, element, attr, ctrl, transclude) {
                transclude(function (clone, scope) {
                    element.append(clone);
                });
            }
        };
    }

})(window.angular);

