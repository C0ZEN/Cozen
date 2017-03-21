/**
 * @ngdoc directive
 * @name cozen-btn-toggle
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnToggleOnChange                        > Callback function called on change
 * @param {boolean}  cozenBtnToggleDisabled        = false         > Disable the button toggle
 * @param {boolean}  cozenBtnToggleModel                           > Model (ak ng-model) which is edited by this directive [required]
 * @param {string}   cozenBtnToggleTooltipMaxWidth = max-width-200 > Max width of the tooltip (must be a class custom or predefined) [ex: max-width-[100-450])
 *
 * [Attributes params]
 * @param {number}  cozenBtnToggleId                    > Id of the button toggle
 * @param {string}  cozenBtnToggleSize       = 'normal' > Size of the button toggle
 * @param {string}  cozenBtnToggleSizeSmall             > Shortcut for small size
 * @param {string}  cozenBtnToggleSizeNormal            > Shortcut for normal size
 * @param {string}  cozenBtnToggleSizeLarge             > Shortcut for large size
 * @param {boolean} cozenBtnToggleAnimation  = true     > Add an animation on toggle
 * @param {string}  cozenBtnToggleLabel                 > Text added with the button toggle
 * @param {string}  cozenBtnToggleTooltip               > Text of the tooltip
 * @param {string}  cozenBtnToggleTooltipType           > Type of the tooltip
 * @param {boolean} cozenBtnToggleStartRight = true     > Display the toggle on the right of the label
 * @param {string}  cozenBtnToggleClass                 > Custom class
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btnToggle', [])
        .directive('cozenBtnToggle', cozenBtnToggle);

    cozenBtnToggle.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenBtnToggle(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnToggleOnChange       : '&',
                cozenBtnToggleDisabled       : '=?',
                cozenBtnToggleModel          : '=?',
                cozenBtnToggleTooltipMaxWidth: '=?'
            },
            templateUrl: 'directives/btn-toggle/btnToggle.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex
            };

            var data = {
                directive: 'cozenBtnToggle'
            };

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Toggleing required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnToggleSize)) {
                    if (angular.isDefined(attrs.cozenBtnToggleSizeSmall)) {
                        scope._cozenBtnToggleSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeNormal)) {
                        scope._cozenBtnToggleSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeLarge)) {
                        scope._cozenBtnToggleSize = 'large';
                    }
                    else {
                        scope._cozenBtnToggleSize = 'normal';
                    }
                }
                else {
                    scope._cozenBtnToggleSize = attrs.cozenBtnToggleSize;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenBtnToggleDisabled) ? scope.cozenBtnToggleDisabled = false : null;
                angular.isUndefined(attrs.cozenBtnToggleTooltipMaxWidth) ? scope.cozenBtnToggleTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attributes)
                scope._cozenBtnToggleId          = angular.isDefined(attrs.cozenBtnToggleId) ? attrs.cozenBtnToggleId : '';
                scope._cozenBtnToggleAnimation   = angular.isDefined(attrs.cozenBtnToggleAnimation) ? JSON.parse(attrs.cozenBtnToggleAnimation) : CONFIG.btnToggle.animation;
                scope._cozenBtnToggleLabel       = angular.isDefined(attrs.cozenBtnToggleLabel) ? attrs.cozenBtnToggleLabel : '';
                scope._cozenBtnToggleTooltip     = angular.isDefined(attrs.cozenBtnToggleTooltip) ? attrs.cozenBtnToggleTooltip : '';
                scope._cozenBtnToggleTooltipType = angular.isDefined(attrs.cozenBtnToggleTooltipType) ? attrs.cozenBtnToggleTooltipType : CONFIG.btnToggle.tooltipType;
                scope._cozenBtnToggleStartRight  = angular.isDefined(attrs.cozenBtnToggleStartRight) ? JSON.parse(attrs.cozenBtnToggleStartRight) : CONFIG.btnToggle.startRight;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnToggleModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [
                    scope._activeTheme,
                    scope._cozenBtnToggleSize,
                    attrs.cozenBtnToggleClass
                ];
                if (scope.cozenBtnToggleDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenBtnToggleModel) {
                    classList.push('active');
                }
                if (scope._cozenBtnToggleStartRight) {
                    classList.push('switch-right');
                }
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnToggleDisabled) {
                    return;
                }
                scope.cozenBtnToggleModel = !scope.cozenBtnToggleModel;
                if (Methods.isFunction(scope.cozenBtnToggleOnChange)) {
                    scope.cozenBtnToggleOnChange();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onChange');
                }
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnToggleDisabled) {
                    tabIndex = -1;
                }
                return tabIndex;
            }
        }
    }

})(window.angular);

