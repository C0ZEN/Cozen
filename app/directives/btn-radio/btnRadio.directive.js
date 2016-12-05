/**
 * @ngdoc directive
 * @name cozen-btn-radio
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnRadioOnChange         > Callback function called on change
 * @param {boolean}  cozenBtnRadioDisabled = false > Disable the button radio
 * @param {boolean}  cozenBtnRadioModel            > Model (ak ng-model) which is edited by this directive [required]
 *
 * [Attributes params]
 * @param {number}  cozenBtnRadioId                      > Id of the button radio
 * @param {string}  cozenBtnRadioSize         = 'normal' > Size of the button radio
 * @param {string}  cozenBtnRadioSizeSmall               > Shortcut for small size
 * @param {string}  cozenBtnRadioSizeNormal              > Shortcut for normal size
 * @param {string}  cozenBtnRadioSizeLarge               > Shortcut for large size
 * @param {boolean} cozenBtnRadioAnimationIn  = true     > Add an animation on show
 * @param {boolean} cozenBtnRadioAnimationOut = true     > Add an animation on hide
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .directive('cozenBtnRadio', cozenBtnRadio);

    cozenBtnRadio.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenBtnRadio(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnRadioOnChange: '&',
                cozenBtnRadioDisabled: '=?',
                cozenBtnRadioModel   : '=?'
            },
            templateUrl: 'directives/btn-radio/btnRadio.template.html'
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
                directive: 'cozenBtnRadio'
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
                if (angular.isUndefined(attrs.cozenBtnRadioSize)) {
                    if (angular.isDefined(attrs.cozenBtnRadioSizeSmall)) scope._cozenBtnRadioSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeNormal)) scope._cozenBtnRadioSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeLarge)) scope._cozenBtnRadioSize = 'large';
                    else scope._cozenBtnRadioSize = 'normal';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnRadioDisabled)) scope.cozenBtnRadioDisabled = false;

                // Default values (attributes)
                scope._cozenBtnRadioId           = angular.isDefined(attrs.cozenBtnRadioId) ? attrs.cozenBtnRadioId : '';
                scope._cozenBtnRadioAnimationIn  = angular.isDefined(attrs.cozenBtnRadioAnimationIn) ? JSON.parse(attrs.cozenBtnRadioAnimationIn) : true;
                scope._cozenBtnRadioAnimationOut = angular.isDefined(attrs.cozenBtnRadioAnimationOut) ? JSON.parse(attrs.cozenBtnRadioAnimationOut) : true;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnRadioModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnRadioModel != 'boolean') {
                    Methods.directiveErrorBoolean(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenBtnRadioSize];
                if (scope.cozenBtnRadioDisabled) classList.push('disabled');
                if (scope.cozenBtnRadioModel) classList.push('active');
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnRadioDisabled) return;
                scope.cozenBtnRadioModel = !scope.cozenBtnRadioModel;
                if (Methods.isFunction(scope.cozenBtnRadioOnChange)) scope.cozenBtnRadioOnChange();
                if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
            }

            function getTabIndex() {
                var tabIndex = 0;
                return tabIndex;
            }
        }
    }

})(window.angular);

