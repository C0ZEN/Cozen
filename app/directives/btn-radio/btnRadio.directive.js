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
 * @param {string}  cozenBtnRadioLabel                   > Text added with the button radio
 * @param {string}  cozenBtnRadioGroup                   > Group to link radio together [required]
 * @param {string}  cozenBtnRadioTooltip                 > Text of the tooltip
 * @param {boolean} cozenBtnRadioStartRight   = true     > Display the bubble on the right of the label
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btnRadio', [])
        .directive('cozenBtnRadio', cozenBtnRadio);

    cozenBtnRadio.$inject = [
        'Themes',
        'CONFIG',
        '$rootScope',
        'rfc4122'
    ];

    function cozenBtnRadio(Themes, CONFIG, $rootScope, rfc4122) {
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
                init          : init,
                hasError      : hasError,
                destroy       : destroy,
                getMainClass  : getMainClass,
                onClick       : onClick,
                getTabIndex   : getTabIndex,
                onGroupChanged: onGroupChanged
            };

            var data = {
                directive : 'cozenBtnRadio',
                groupEvent: {
                    onChange: 'cozenBtnRadioOnChange' + Methods.capitalizeFirstLetter(attrs.cozenBtnRadioGroup)
                },
                group     : attrs.cozenBtnRadioGroup,
                uuid      : rfc4122.v4()
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnRadioSize)) {
                    if (angular.isDefined(attrs.cozenBtnRadioSizeSmall)) {
                        scope._cozenBtnRadioSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeNormal)) {
                        scope._cozenBtnRadioSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeLarge)) {
                        scope._cozenBtnRadioSize = 'large';
                    }
                    else {
                        scope._cozenBtnRadioSize = 'normal';
                    }
                }
                else {
                    scope._cozenBtnRadioSize = attrs.cozenBtnRadioSize;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnRadioDisabled)) {
                    scope.cozenBtnRadioDisabled = false;
                }

                // Default values (attributes)
                scope._cozenBtnRadioId           = angular.isDefined(attrs.cozenBtnRadioId) ? attrs.cozenBtnRadioId : '';
                scope._cozenBtnRadioAnimationIn  = angular.isDefined(attrs.cozenBtnRadioAnimationIn) ? JSON.parse(attrs.cozenBtnRadioAnimationIn) : true;
                scope._cozenBtnRadioAnimationOut = angular.isDefined(attrs.cozenBtnRadioAnimationOut) ? JSON.parse(attrs.cozenBtnRadioAnimationOut) : true;
                scope._cozenBtnRadioLabel        = angular.isDefined(attrs.cozenBtnRadioLabel) ? attrs.cozenBtnRadioLabel : '';
                scope._cozenBtnRadioTooltip      = angular.isDefined(attrs.cozenBtnRadioTooltip) ? attrs.cozenBtnRadioTooltip : '';
                scope._cozenBtnRadioStartRight   = angular.isDefined(attrs.cozenBtnRadioStartRight) ? JSON.parse(attrs.cozenBtnRadioStartRight) : true;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
                $rootScope.$on(data.groupEvent.onChange, methods.onGroupChanged);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnRadioModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnRadioModel != 'boolean') {
                    cozenEnhancedLogs.error.attributeIsNotBoolean(data.directive, 'Model');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenBtnRadioGroup)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Group');
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
                    scope._cozenBtnRadioSize
                ];
                if (scope.cozenBtnRadioDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenBtnRadioModel) {
                    classList.push('active');
                }
                if (scope._cozenBtnRadioStartRight) {
                    classList.push('bubble-right');
                }
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnRadioDisabled) {
                    return;
                }
                if (scope.cozenBtnRadioModel) {
                    return;
                }
                scope.cozenBtnRadioModel = true;
                if (Methods.isFunction(scope.cozenBtnRadioOnChange)) {
                    scope.cozenBtnRadioOnChange();
                }
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
                $rootScope.$broadcast(data.groupEvent.onChange, data);
            }

            function getTabIndex() {
                var tabIndex = 0;
                return tabIndex;
            }

            function onGroupChanged(event, eventData) {
                if (eventData.group == data.group) {
                    if (eventData.uuid != data.uuid) {
                        if (!scope.cozenBtnRadioModel) {
                            return;
                        }
                        scope.cozenBtnRadioModel = false;
                        if (Methods.isFunction(scope.cozenBtnRadioOnChange)) {
                            scope.cozenBtnRadioOnChange();
                        }
                        cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
                    }
                }
            }
        }
    }

})(window.angular);

