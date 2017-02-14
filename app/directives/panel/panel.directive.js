/**
 * @ngdoc directive
 * @name cozen-panel
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 * @param {function} cozenPanelOnClick                        > Callback function called on click
 * @param {boolean}  cozenPanelDisabled            = false    > Disable the panel
 * @param {boolean}  cozenPanelOpen                = true     > Close/Open the panel
 * @param {function} cozenPanelOnToggle                       > Callback function called on toggle (open/close)
 * @param {function} cozenPanelOnClickBigIconLeft             > Callback function called on click on the left big icon
 * @param {function} cozenPanelOnClickBigIconRight            > Callback function called on click on the right big icon
 *
 * [Attributes params]
 * @param {number}  cozenPanelId                              > Id of the panel
 * @param {string}  cozenPanelLabel                           > Text of the panel
 * @param {string}  cozenPanelSize                = 'normal'  > Size of the panel
 * @param {string}  cozenPanelSizeSmall                       > Shortcut for small size
 * @param {string}  cozenPanelSizeNormal                      > Shortcut for normal size
 * @param {string}  cozenPanelSizeLarge                       > Shortcut for large size
 * @param {string}  cozenPanelType                = 'default' > Type of the panel (change the color)
 * @param {string}  cozenPanelTypeDefault                     > Shortcut for default type
 * @param {string}  cozenPanelTypeInfo                        > Shortcut for info type
 * @param {string}  cozenPanelTypeSuccess                     > Shortcut for success type
 * @param {string}  cozenPanelTypeWarning                     > Shortcut for warning type
 * @param {string}  cozenPanelTypeError                       > Shortcut for error type
 * @param {string}  cozenPanelIconLeft                        > Add an icon the to left (write the class)
 * @param {string}  cozenPanelIconRight                       > Add an icon the to right (write the class)
 * @param {string}  cozenPanelBigIconLeft                     > Add a big icon the to left (write the class)
 * @param {string}  cozenPanelBigIconRight                    > Add a big icon the to right (write the class)
 * @param {boolean} cozenPanelBigIconLeftTooltip              > Text of the tooltip for the big icon left
 * @param {boolean} cozenPanelBigIconRightTooltip             > Text of the tooltip for the big icon right
 * @param {boolean} cozenPanelFrozen              = false     > Shortcut to freeze the panel (avoid open/close)
 * @param {string}  cozenPanelSubLabel                        > Text of the sub label (smaller than label)
 * @param {string}  cozenPanelMaxHeight                       > Max height of the body
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.panel', [])
        .directive('cozenPanel', cozenPanel);

    cozenPanel.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenPanel(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : {
                cozenPanelOnClick            : '&',
                cozenPanelDisabled           : '=?',
                cozenPanelOpen               : '=?',
                cozenPanelOnToggle           : '&',
                cozenPanelOnClickBigIconLeft : '&',
                cozenPanelOnClickBigIconRight: '&'
            },
            templateUrl: 'directives/panel/panel.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init               : init,
                hasError           : hasError,
                destroy            : destroy,
                getMainClass       : getMainClass,
                onClickHeader      : onClickHeader,
                startWatching      : startWatching,
                onClickBigIconLeft : onClickBigIconLeft,
                onClickBigIconRight: onClickBigIconRight,
                bigIconHover       : bigIconHover,
                getTabIndex        : getTabIndex,
                getBodyStyles      : getBodyStyles
            };

            var data = {
                directive: 'cozenPanel'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass : getMainClass,
                    onClick      : {
                        header      : onClickHeader,
                        bigIconLeft : onClickBigIconLeft,
                        bigIconRight: onClickBigIconRight
                    },
                    bigIconHover : bigIconHover,
                    getTabIndex  : getTabIndex,
                    getBodyStyles: getBodyStyles
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenPanelSize)) {
                    if (angular.isDefined(attrs.cozenPanelSizeSmall)) {
                        scope._cozenPanelSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenPanelSizeNormal)) {
                        scope._cozenPanelSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenPanelSizeLarge)) {
                        scope._cozenPanelSize = 'large';
                    }
                    else {
                        scope._cozenPanelSize = 'normal';
                    }
                }
                else {
                    scope._cozenPanelSize = attrs.cozenPanelSize;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenPanelType)) {
                    if (angular.isDefined(attrs.cozenPanelTypeDefault)) {
                        scope._cozenPanelType = 'default';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeInfo)) {
                        scope._cozenPanelType = 'info';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeSuccess)) {
                        scope._cozenPanelType = 'success';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeWarning)) {
                        scope._cozenPanelType = 'warning';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeError)) {
                        scope._cozenPanelType = 'error';
                    }
                    else {
                        scope._cozenPanelType = 'default';
                    }
                }
                else {
                    scope._cozenPanelType = attrs.cozenPanelType;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenPanelDisabled)) {
                    scope.cozenPanelDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenPanelOpen)) {
                    scope.cozenPanelOpen = true;
                }

                // Default values (attributes)
                scope._cozenPanelId                  = angular.isDefined(attrs.cozenPanelId) ? attrs.cozenPanelId : '';
                scope._cozenPanelLabel               = attrs.cozenPanelLabel;
                scope._cozenPanelIconLeft            = angular.isDefined(attrs.cozenPanelIconLeft) ? attrs.cozenPanelIconLeft : '';
                scope._cozenPanelIconRight           = angular.isDefined(attrs.cozenPanelIconRight) ? attrs.cozenPanelIconRight : '';
                scope._cozenPanelBigIconLeft         = angular.isDefined(attrs.cozenPanelBigIconLeft) ? attrs.cozenPanelBigIconLeft : '';
                scope._cozenPanelBigIconRight        = angular.isDefined(attrs.cozenPanelBigIconRight) ? attrs.cozenPanelBigIconRight : '';
                scope._bigIconHover                  = false;
                scope._cozenPanelFrozen              = angular.isDefined(attrs.cozenPanelFrozen);
                scope._cozenPanelBigIconLeftTooltip  = angular.isDefined(attrs.cozenPanelBigIconLeftTooltip) ? attrs.cozenPanelBigIconLeftTooltip : '';
                scope._cozenPanelBigIconRightTooltip = angular.isDefined(attrs.cozenPanelBigIconRightTooltip) ? attrs.cozenPanelBigIconRightTooltip : '';
                scope._cozenPanelSubLabel            = angular.isDefined(attrs.cozenPanelSubLabel) ? attrs.cozenPanelSubLabel : '';
                scope._cozenPanelMaxHeight           = angular.isDefined(attrs.cozenPanelMaxHeight) ? attrs.cozenPanelMaxHeight : 'auto';

                // ScrollBar
                scope._cozenScrollBar       = CONFIG.scrollsBar && scope._cozenPanelMaxHeight != 'auto';
                scope._cozenScrollBarConfig = CONFIG.scrollsBarConfig;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
                methods.startWatching();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenPanelLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme,
                    scope._cozenPanelSize,
                    scope._cozenPanelType];
                if (scope.cozenPanelDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenPanelOpen || scope._cozenPanelFrozen) {
                    classList.push('open');
                }
                if (scope._bigIconHover) {
                    classList.push('no-hover');
                }
                return classList;
            }

            function onClickHeader($event) {
                if (scope.cozenPanelDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPanelOnClick)) {
                    scope.cozenPanelOnClick();
                }
                if (Methods.isFunction(scope.cozenPanelOnToggle) && !scope._cozenPanelFrozen) {
                    scope.cozenPanelOnToggle();
                }
                if (!scope._cozenPanelFrozen) {
                    scope.cozenPanelOpen = !scope.cozenPanelOpen;
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickHeader');
                }
            }

            function startWatching() {
                scope.$watch('cozenPanelDisabled', function (newValue, oldValue) {
                    if (newValue && scope.cozenPanelOpen && !scope._cozenPanelFrozen) {
                        scope.cozenPanelOpen = false;
                        if (Methods.isFunction(scope.cozenPanelOnToggle)) {
                            scope.cozenPanelOnToggle();
                        }
                    }
                });
            }

            function onClickBigIconLeft($event) {
                $event.stopPropagation();
                if (scope.cozenPanelDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPanelOnClickBigIconLeft)) {
                    scope.cozenPanelOnClickBigIconLeft();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickBigIconLeft');
                }
            }

            function onClickBigIconRight($event) {
                $event.stopPropagation();
                if (scope.cozenPanelDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPanelOnClickBigIconRight)) {
                    scope.cozenPanelOnClickBigIconRight();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickBigIconRight');
                }
            }

            function bigIconHover(hover) {
                scope._bigIconHover = hover;
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenPanelDisabled) {
                    tabIndex = -1;
                }
                else if (scope._cozenPanelFrozen) {
                    tabIndex = -1;
                }
                return tabIndex;
            }

            function getBodyStyles() {
                return {
                    'max-height': scope._cozenPanelMaxHeight
                };
            }
        }
    }

})(window.angular);

