/**
 * @ngdoc directive
 * @name cozen-pills-item-simple
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenPillsItemSimpleOnClick          > Callback function called on click
 * @param {boolean}  cozenPillsItemSimpleDisabled = false > Disable the item
 * @param {boolean}  cozenPillsItemSimpleSelected = false > Select the item (edit the models and styles)
 *
 * [Attributes params]
 * @param {number} cozenPillsItemSimpleId        > Id of the item
 * @param {string} cozenPillsItemSimpleLabel     > Text of the item [required]
 * @param {string} cozenPillsItemSimpleIconLeft  > Icon left (name of the icon)
 * @param {string} cozenPillsItemSimpleIconRight > Icon right (name of the icon)
 * @param {string} cozenPillsItemSimpleName      > Name of the pill (only for factory use)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.pills.simple', [])
        .directive('cozenPillsItemSimple', cozenPillsItemSimple);

    cozenPillsItemSimple.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        '$timeout',
        '$filter'
    ];

    function cozenPillsItemSimple(CONFIG, rfc4122, $rootScope, $window, $timeout, $filter) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenPillsItemSimpleOnClick : '&',
                cozenPillsItemSimpleDisabled: '=?',
                cozenPillsItemSimpleSelected: '=?'
            },
            templateUrl: 'directives/pills/items/simple/pills.simple.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex,
                onActive    : onActive
            };

            var data = {
                directive: 'cozenPillsItemSimple',
                uuid     : rfc4122.v4()
            };

            scope._isReady = true;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenPillsItemSimpleDisabled)) scope.cozenPillsItemSimpleDisabled = false;
                if (angular.isUndefined(attrs.cozenPillsItemSimpleSelected)) {
                    scope.cozenPillsItemSimpleSelected = false;
                }
                else if (typeof scope.cozenPillsItemSimpleSelected != "boolean") {
                    scope.cozenPillsItemSimpleSelected = false;
                }

                // Default values (attributes)
                scope._cozenPillsItemSimpleId        = angular.isDefined(attrs.cozenPillsItemSimpleId) ? attrs.cozenPillsItemSimpleId : '';
                scope._cozenPillsItemSimpleLabel     = attrs.cozenPillsItemSimpleLabel;
                scope._cozenPillsItemSimpleIconLeft  = angular.isDefined(attrs.cozenPillsItemSimpleIconLeft) ? attrs.cozenPillsItemSimpleIconLeft : '';
                scope._cozenPillsItemSimpleIconRight = angular.isDefined(attrs.cozenPillsItemSimpleIconRight) ? attrs.cozenPillsItemSimpleIconRight : '';
                scope._cozenPillsItemSimpleName      = angular.isDefined(attrs.cozenPillsItemSimpleName) ? attrs.cozenPillsItemSimpleName : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope.cozenPillsItemSimpleActive = false;

                // From the factory, to toggle the active state
                scope.$on('cozenPillsActive', methods.onActive);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenPillsItemSimpleLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                return false;
            }

            function destroy() {
                $window.removeEventListener('keydown', methods.onKeyDown);
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [];
                if (scope.cozenPillsItemSimpleDisabled) classList.push('disabled');
                if (scope.cozenPillsItemSimpleSelected) classList.push('selected');
                return classList;
            }

            function onClick($event) {
                $event.stopPropagation();
                if (scope.cozenPillsItemSimpleDisabled) return;
                if (Methods.isFunction(scope.cozenPillsItemSimpleOnClick)) scope.cozenPillsItemSimpleOnClick();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClick');
                scope.cozenPillsItemSimpleSelected = !scope.cozenPillsItemSimpleSelected;
                Methods.safeApply(scope);
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenPillsItemSimpleDisabled) tabIndex = -1;
                return tabIndex;
            }

            function onActive(event, data) {
                scope.cozenPillsItemSimpleSelected = scope._cozenPillsItemSimpleName == data.name;
            }
        }
    }

})(window.angular);

