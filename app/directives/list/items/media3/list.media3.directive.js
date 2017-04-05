/**
 * @ngdoc directive
 * @name cozen-list-item-media3
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenListItemMedia3OnClick          > Callback function called on click
 * @param {boolean}  cozenListItemMedia3Disabled = false > Disable the item
 *
 * [Attributes params]
 * @param {number} cozenListItemMedia3Id       > Id of the item
 * @param {string} cozenListItemMedia3Header   > Text for the header [required]
 * @param {string} cozenListItemMedia3Label    > Text for the label [required]
 * @param {string} cozenListItemMedia3SubLabel > Text for the sub label [required]
 * @param {string} cozenListItemMedia3Media    > URL of the media
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.list.media3', [])
        .directive('cozenListItemMedia3', cozenListItemMedia3);

    cozenListItemMedia3.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        'cozenEnhancedLogs'
    ];

    function cozenListItemMedia3(CONFIG, rfc4122, $rootScope, $window, cozenEnhancedLogs) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenListItemMedia3OnClick : '&',
                cozenListItemMedia3Disabled: '=?'
            },
            templateUrl: 'directives/list/items/media3/list.media3.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex,
                onActive    : onActive,
                onKeyDown   : onKeyDown,
                onHover     : onHover
            };

            var data = {
                directive: 'cozenListItemMedia3',
                uuid     : rfc4122.v4()
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex,
                    onHover     : onHover
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenListItemMedia3Disabled)) {
                    scope.cozenListItemMedia3Disabled = false;
                }

                // Default values (attributes)
                scope._cozenLisItemMedia3Id        = angular.isDefined(attrs.cozenLisItemMedia3Id) ? attrs.cozenLisItemMedia3Id : '';
                scope._cozenListItemMedia3Header   = attrs.cozenListItemMedia3Header;
                scope._cozenListItemMedia3Label    = attrs.cozenListItemMedia3Label;
                scope._cozenListItemMedia3SubLabel = attrs.cozenListItemMedia3SubLabel;
                scope._cozenListItemMedia3Media    = angular.isDefined(attrs.cozenListItemMedia3Media) ? attrs.cozenListItemMedia3Media : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope.cozenListItemMedia3Active = false;
                scope.$parent.$parent.$parent.childrenUuid.push(data.uuid);
                $rootScope.$on('cozenListActive', methods.onActive);
                $window.addEventListener('keydown', methods.onKeyDown);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3Header)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Header');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3Label)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3SubLabel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'SubLabel');
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
                if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) {
                    classList.push('no-action');
                }
                if (scope.cozenListItemMedia3Disabled) {
                    classList.push('disabled');
                }
                else if (scope.cozenListItemMedia3Active) {
                    classList.push('active');
                }
                if (scope.$id % 2 != 0) {
                    classList.push('odd');
                }
                return classList;
            }

            function onClick($event) {
                if (scope.cozenListItemMedia3Disabled) {
                    return;
                }
                if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) {
                    return;
                }
                if (Methods.isFunction(scope.cozenListItemMedia3OnClick)) {
                    scope.cozenListItemMedia3OnClick();
                }
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickItem');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenListItemMedia3Disabled) {
                    tabIndex = -1;
                }
                else if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) {
                    tabIndex = -1;
                }
                return tabIndex;
            }

            function onActive(event, eventData) {
                if (scope.cozenListItemMedia3Disabled) {
                    return;
                }
                scope.cozenListItemMedia3Active = eventData.uuid == data.uuid;
                Methods.safeApply(scope);
            }

            function onKeyDown(event) {
                if (scope.cozenListItemMedia3Disabled) {
                    return;
                }
                if (!scope.cozenListItemMedia3Active) {
                    return;
                }
                event.preventDefault();
                switch (event.keyCode) {

                    // Enter
                    case 13:
                        methods.onClick(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenListItemMedia3Active) {
                    return;
                }
                scope.$parent.$parent.$parent.$parent.activeChild = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
                $rootScope.$broadcast('cozenListActive', {
                    uuid: data.uuid
                });
            }
        }
    }

})(window.angular);

