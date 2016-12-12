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
 * @param {function} cozenBtnToggleOnChange         > Callback function called on change
 * @param {boolean}  cozenBtnToggleDisabled = false > Disable the button toggle
 * @param {boolean}  cozenBtnToggleModel            > Model (ak ng-model) which is edited by this directive [required]
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
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
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
                cozenBtnToggleOnChange: '&',
                cozenBtnToggleDisabled: '=?',
                cozenBtnToggleModel   : '=?'
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

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Toggleing required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnToggleSize)) {
                    if (angular.isDefined(attrs.cozenBtnToggleSizeSmall)) scope._cozenBtnToggleSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeNormal)) scope._cozenBtnToggleSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeLarge)) scope._cozenBtnToggleSize = 'large';
                    else scope._cozenBtnToggleSize = 'normal';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnToggleDisabled)) scope.cozenBtnToggleDisabled = false;

                // Default values (attributes)
                scope._cozenBtnToggleId        = angular.isDefined(attrs.cozenBtnToggleId) ? attrs.cozenBtnToggleId : '';
                scope._cozenBtnToggleAnimation = angular.isDefined(attrs.cozenBtnToggleAnimation) ? JSON.parse(attrs.cozenBtnToggleAnimation) : true;
                scope._cozenBtnToggleLabel     = angular.isDefined(attrs.cozenBtnToggleLabel) ? attrs.cozenBtnToggleLabel : '';
                scope._cozenBtnToggleTooltip   = angular.isDefined(attrs.cozenBtnToggleTooltip) ? attrs.cozenBtnToggleTooltip : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnToggleModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnToggleModel != 'boolean') {
                    Methods.directiveErrorBoolean(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenBtnToggleSize];
                if (scope.cozenBtnToggleDisabled) classList.push('disabled');
                if (scope.cozenBtnToggleModel) classList.push('active');
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnToggleDisabled) return;
                scope.cozenBtnToggleModel = !scope.cozenBtnToggleModel;
                if (Methods.isFunction(scope.cozenBtnToggleOnChange)) scope.cozenBtnToggleOnChange();
                if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnToggleDisabled) tabIndex = -1;
                return tabIndex;
            }
        }
    }

})(window.angular);

