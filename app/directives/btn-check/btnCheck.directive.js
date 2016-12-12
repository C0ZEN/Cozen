/**
 * @ngdoc directive
 * @name cozen-btn-check
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnCheckOnChange         > Callback function called on change
 * @param {boolean}  cozenBtnCheckDisabled = false > Disable the button check
 * @param {boolean}  cozenBtnCheckModel            > Model (ak ng-model) which is edited by this directive [required]
 *
 * [Attributes params]
 * @param {number}  cozenBtnCheckId                      > Id of the button check
 * @param {string}  cozenBtnCheckSize         = 'normal' > Size of the button check
 * @param {string}  cozenBtnCheckSizeSmall               > Shortcut for small size
 * @param {string}  cozenBtnCheckSizeNormal              > Shortcut for normal size
 * @param {string}  cozenBtnCheckSizeLarge               > Shortcut for large size
 * @param {boolean} cozenBtnCheckAnimationIn  = true     > Add an animation on show
 * @param {boolean} cozenBtnCheckAnimationOut = true     > Add an animation on hide
 * @param {string}  cozenBtnCheckLabel                   > Text added with the button check
 * @param {string}  cozenBtnCheckTooltip                 > Text of the tooltip
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .directive('cozenBtnCheck', cozenBtnCheck);

    cozenBtnCheck.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenBtnCheck(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnCheckOnChange: '&',
                cozenBtnCheckDisabled: '=?',
                cozenBtnCheckModel   : '=?'
            },
            templateUrl: 'directives/btn-check/btnCheck.template.html'
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
                directive: 'cozenBtnCheck'
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

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnCheckSize)) {
                    if (angular.isDefined(attrs.cozenBtnCheckSizeSmall)) scope._cozenBtnCheckSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnCheckSizeNormal)) scope._cozenBtnCheckSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnCheckSizeLarge)) scope._cozenBtnCheckSize = 'large';
                    else scope._cozenBtnCheckSize = 'normal';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnCheckDisabled)) scope.cozenBtnCheckDisabled = false;

                // Default values (attributes)
                scope._cozenBtnCheckId           = angular.isDefined(attrs.cozenBtnCheckId) ? attrs.cozenBtnCheckId : '';
                scope._cozenBtnCheckAnimationIn  = angular.isDefined(attrs.cozenBtnCheckAnimationIn) ? JSON.parse(attrs.cozenBtnCheckAnimationIn) : true;
                scope._cozenBtnCheckAnimationOut = angular.isDefined(attrs.cozenBtnCheckAnimationOut) ? JSON.parse(attrs.cozenBtnCheckAnimationOut) : true;
                scope._cozenBtnCheckLabel        = angular.isDefined(attrs.cozenBtnCheckLabel) ? attrs.cozenBtnCheckLabel : '';
                scope._cozenBtnCheckTooltip      = angular.isDefined(attrs.cozenBtnCheckTooltip) ? attrs.cozenBtnCheckTooltip : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnCheckModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnCheckModel != 'boolean') {
                    Methods.directiveErrorBoolean(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenBtnCheckSize];
                if (scope.cozenBtnCheckDisabled) classList.push('disabled');
                if (scope.cozenBtnCheckModel) classList.push('active');
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnCheckDisabled) return;
                scope.cozenBtnCheckModel = !scope.cozenBtnCheckModel;
                if (Methods.isFunction(scope.cozenBtnCheckOnChange)) scope.cozenBtnCheckOnChange();
                if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnCheckDisabled) tabIndex = -1;
                return tabIndex;
            }
        }
    }

})(window.angular);

