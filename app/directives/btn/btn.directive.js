/**
 * @ngdoc directive
 * @name cozen-btn
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnOnClick          > Callback function called on click
 * @param {boolean}  cozenBtnActive   = false > Active the button (hover state)
 * @param {boolean}  cozenBtnDisabled = false > Disable the button
 * @param {boolean}  cozenBtnLoader   = false > Active a loader (replace all the content and disable visual state)
 *
 * [Attributes params]
 * @param {number}  cozenBtnId                      > Id of the button
 * @param {string}  cozenBtnLabel                   > Text of the button
 * @param {string}  cozenBtnSize        = 'normal'  > Size of the button
 * @param {string}  cozenBtnSizeSmall               > Shortcut for small size
 * @param {string}  cozenBtnSizeNormal              > Shortcut for normal size
 * @param {string}  cozenBtnSizeLarge               > Shortcut for large size
 * @param {string}  cozenBtnType        = 'default' > Type of the button (change the color)
 * @param {string}  cozenBtnTypePrimary             > Shortcut for primary type
 * @param {string}  cozenBtnTypeTransparent         > Shortcut for transparent type
 * @param {string}  cozenBtnTypeCold                > Shortcut for cold type
 * @param {string}  cozenBtnTypePurple              > Shortcut for purple type
 * @param {string}  cozenBtnTypeGreen               > Shortcut for green type
 * @param {string}  cozenBtnTypeGoogle              > Shortcut for google type
 * @param {string}  cozenBtnTypeFacebook            > Shortcut for facebook type
 * @param {string}  cozenBtnTypeDefault             > Shortcut for default type
 * @param {string}  cozenBtnTypeInfo                > Shortcut for info type
 * @param {string}  cozenBtnTypeSuccess             > Shortcut for success type
 * @param {string}  cozenBtnTypeWarning             > Shortcut for warning type
 * @param {string}  cozenBtnTypeError               > Shortcut for error type
 * @param {string}  cozenBtnIconLeft                > Add an icon the to left (write the class)
 * @param {string}  cozenBtnIconRight               > Add an icon the to right (write the class)
 * @param {boolean} cozenBtnAutoSizing  = false     > Shortcut to activate the auto sizing (instead of 100% width)
 * @param {string}  class                           > Custom class
 * @param {string}  cozenBtnImgLeft                 > URL/path to the left img
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btn', [])
        .directive('cozenBtn', cozenBtn);

    cozenBtn.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenBtn(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnOnClick : '&',
                cozenBtnActive  : '=?',
                cozenBtnDisabled: '=?',
                cozenBtnLoader  : '=?'
            },
            templateUrl: 'directives/btn/btn.template.html'
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
                directive: 'cozenBtn'
            };

            // After some test, wait too long for the load make things crappy
            // So, I set it to true for now
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

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnSize)) {
                    if (angular.isDefined(attrs.cozenBtnSizeSmall)) scope._cozenBtnSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnSizeNormal)) scope._cozenBtnSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnSizeLarge)) scope._cozenBtnSize = 'large';
                    else scope._cozenBtnSize = 'normal';
                } else scope._cozenBtnSize = attrs.cozenBtnSize;

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenBtnType)) {
                    if (angular.isDefined(attrs.cozenBtnTypeDefault)) scope._cozenBtnType = 'default';
                    else if (angular.isDefined(attrs.cozenBtnTypePrimary)) scope._cozenBtnType = 'primary';
                    else if (angular.isDefined(attrs.cozenBtnTypeTransparent)) scope._cozenBtnType = 'transparent';
                    else if (angular.isDefined(attrs.cozenBtnTypeCold)) scope._cozenBtnType = 'cold';
                    else if (angular.isDefined(attrs.cozenBtnTypePurple)) scope._cozenBtnType = 'purple';
                    else if (angular.isDefined(attrs.cozenBtnTypeGreen)) scope._cozenBtnType = 'green';
                    else if (angular.isDefined(attrs.cozenBtnTypeGoogle)) scope._cozenBtnType = 'google';
                    else if (angular.isDefined(attrs.cozenBtnTypeFacebook)) scope._cozenBtnType = 'facebook';
                    else if (angular.isDefined(attrs.cozenBtnTypeInfo)) scope._cozenBtnType = 'info';
                    else if (angular.isDefined(attrs.cozenBtnTypeSuccess)) scope._cozenBtnType = 'success';
                    else if (angular.isDefined(attrs.cozenBtnTypeWarning)) scope._cozenBtnType = 'warning';
                    else if (angular.isDefined(attrs.cozenBtnTypeError)) scope._cozenBtnType = 'error';
                    else scope._cozenBtnType = 'default';
                } else scope._cozenBtnType = attrs.cozenBtnType;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnActive)) scope.cozenBtnActive = false;
                if (angular.isUndefined(attrs.cozenBtnDisabled)) scope.cozenBtnDisabled = false;
                if (angular.isUndefined(attrs.cozenBtnLoader)) scope.cozenBtnLoader = false;

                // Default values (attributes)
                scope._cozenBtnId        = angular.isDefined(attrs.cozenBtnId) ? attrs.cozenBtnId : '';
                scope._cozenBtnLabel     = attrs.cozenBtnLabel;
                scope._cozenBtnIconLeft  = angular.isDefined(attrs.cozenBtnIconLeft) ? attrs.cozenBtnIconLeft : '';
                scope._cozenBtnIconRight = angular.isDefined(attrs.cozenBtnIconRight) ? attrs.cozenBtnIconRight : '';
                scope._cozenBtnImgLeft   = angular.isDefined(attrs.cozenBtnImgLeft) ? attrs.cozenBtnImgLeft : '';

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
                var classList = [scope._activeTheme, scope._cozenBtnSize, scope._cozenBtnType, attrs.class];
                if (scope.cozenBtnActive) classList.push('active');
                if (scope.cozenBtnDisabled) classList.push('disabled');
                if (scope.cozenBtnLoader) classList.push('loading');
                if (angular.isDefined(attrs.cozenBtnAutoSizing)) classList.push('auto');
                return classList;
            }

            function onClick($event) {
                $event.stopPropagation();
                if (scope.cozenBtnDisabled) return;
                if (scope.cozenBtnLoader) return;
                if (Methods.isFunction(scope.cozenBtnOnClick)) scope.cozenBtnOnClick();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'OnClick');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnDisabled) tabIndex = -1;
                else if (scope.cozenBtnLoader) tabIndex = -1;
                return tabIndex;
            }
        }
    }

})(window.angular);

