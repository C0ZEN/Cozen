/**
 * @ngdoc directive
 * @name cozen-dropdown
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 * @param {string}   cozenDropdownModel            > Value edited by the dropdown [required]
 * @param {boolean}  cozenDropdownDisabled = false > Disable the dropdown
 * @param {function} cozenDropdownOnChange         > Callback function called on change
 *
 * [Attributes params]
 * @param {number}  cozenDropdownId                               > Id of the dropdown
 * @param {string}  cozenDropdownSize             = 'normal'      > Size of the dropdown
 * @param {string}  cozenDropdownSizeSmall                        > Shortcut for small size
 * @param {string}  cozenDropdownSizeNormal                       > Shortcut for normal size
 * @param {string}  cozenDropdownSizeLarge                        > Shortcut for large size
 * @param {boolean} cozenDropdownRequired         = false         > Required input
 * @param {boolean} cozenDropdownErrorDesign      = true          > Add style when error
 * @param {boolean} cozenDropdownSuccessDesign    = true          > Add style when success
 * @param {string}  cozenDropdownPlaceholder                      > Text for the placeholder
 * @param {string}  cozenDropdownIconLeft                         > Text for the icon left (font)
 * @param {string}  cozenDropdownName             = uuid          > Name of the input
 * @param {boolean} cozenDropdownValidator        = 'dirty'       > Define after what type of event the input must add more ui color
 * @param {boolean} cozenDropdownValidatorAll                     > Shortcut for all type
 * @param {boolean} cozenDropdownValidatorTouched                 > Shortcut for touched type
 * @param {boolean} cozenDropdownValidatorDirty                   > Shortcut for dirty type
 * @param {boolean} cozenDropdownValidatorEmpty   = true          > Display ui color even if input empty
 * @param {boolean} cozenDropdownEasyNavigation   = true          > Allow to navigate with arrows even if the pointer is out of the dropdown
 * @param {boolean} cozenDropdownMultiple         = false         > Allow to select multiple data
 * @param {boolean} cozenDropdownAutoClose        = true          > Close the dropdown after had selected a data (only for single)
 * @param {boolean} cozenDropdownEasyClose        = true          > Auto close the dropdown when a click is outside
 * @param {boolean} cozenDropdownShowTick         = true          > Display an icon to the right when a data is selected
 * @param {boolean} cozenDropdownTickIcon         = 'fa fa-check' > Define what type of icon should it be
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp.dropdown', [
            'cozenLibApp.dropdown.group',
            'cozenLibApp.dropdown.simple'
        ])
        .directive('cozenDropdown', cozenDropdown);

    cozenDropdown.$inject = [
        'Themes',
        'CONFIG',
        '$window',
        '$rootScope',
        'rfc4122'
    ];

    function cozenDropdown(Themes, CONFIG, $window, $rootScope, rfc4122) {
        return {
            link            : link,
            restrict        : 'E',
            replace         : false,
            transclude      : true,
            scope           : {
                cozenDropdownModel   : '=?',
                cozenDropdownDisabled: '=?',
                cozenDropdownOnChange: '&'
            },
            templateUrl     : 'directives/dropdown/dropdown.template.html',
            bindToController: true,
            controller      : cozenDropdownCtrl,
            controllerAs    : 'vm'
        };

        function link(scope, element, attrs) {
            var methods = {
                init             : init,
                hasError         : hasError,
                destroy          : destroy,
                getMainClass     : getMainClass,
                onHover          : onHover,
                onKeyDown        : onKeyDown,
                onChange         : onChange,
                getDesignClass   : getDesignClass,
                getForm          : getForm,
                onClick          : onClick,
                onAutoCloseOthers: onAutoCloseOthers,
                onWindowClick    : onWindowClick,
                onChildSelected  : onChildSelected
            };

            var data = {
                directive: 'cozenDropdown',
                uuid     : rfc4122.v4()
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onHover     : onHover,
                    onChange    : onChange,
                    onClick     : onClick
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenDropdownSize)) {
                    if (angular.isDefined(attrs.cozenDropdownSizeSmall)) scope._cozenDropdownSize = 'small';
                    else if (angular.isDefined(attrs.cozenDropdownSizeNormal)) scope._cozenDropdownSize = 'normal';
                    else if (angular.isDefined(attrs.cozenDropdownSizeLarge)) scope._cozenDropdownSize = 'large';
                    else scope._cozenDropdownSize = 'normal';
                }

                // Shortcut values (validator)
                if (angular.isUndefined(attrs.cozenDropdownValidator)) {
                    if (angular.isDefined(attrs.cozenDropdownValidatorAll)) scope._cozenDropdownValidator = 'all';
                    if (angular.isDefined(attrs.cozenDropdownValidatorTouched)) scope._cozenDropdownValidator = 'touched';
                    else if (angular.isDefined(attrs.cozenDropdownValidatorDirty)) scope._cozenDropdownValidator = 'dirty';
                    else scope._cozenDropdownValidator = 'dirty';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenDropdownDisabled)) scope.vm.cozenDropdownDisabled = false;

                // Default values (attributes)
                scope._cozenDropdownId             = angular.isDefined(attrs.cozenDropdownId) ? attrs.cozenDropdownId : '';
                scope._cozenDropdownRequired       = angular.isDefined(attrs.cozenDropdownRequired) ? JSON.parse(attrs.cozenDropdownRequired) : false;
                scope._cozenDropdownErrorDesign    = angular.isDefined(attrs.cozenDropdownErrorDesign) ? JSON.parse(attrs.cozenDropdownErrorDesign) : true;
                scope._cozenDropdownSuccessDesign  = angular.isDefined(attrs.cozenDropdownSuccessDesign) ? JSON.parse(attrs.cozenDropdownSuccessDesign) : true;
                scope._cozenDropdownPlaceholder    = angular.isDefined(attrs.cozenDropdownPlaceholder) ? attrs.cozenDropdownPlaceholder : '';
                scope._cozenDropdownIconLeft       = angular.isDefined(attrs.cozenDropdownIconLeft) ? attrs.cozenDropdownIconLeft : '';
                scope._cozenDropdownName           = angular.isDefined(attrs.cozenDropdownName) ? attrs.cozenDropdownName : data.uuid;
                scope._cozenDropdownValidatorEmpty = angular.isDefined(attrs.cozenDropdownValidatorEmpty) ? JSON.parse(attrs.cozenDropdownValidatorEmpty) : true;
                scope._cozenDropdownEasyNavigation = angular.isDefined(attrs.cozenDropdownEasyNavigation) ? JSON.parse(attrs.cozenDropdownEasyNavigation) : true;
                scope._cozenDropdownMultiple       = angular.isDefined(attrs.cozenDropdownMultiple) ? JSON.parse(attrs.cozenDropdownMultiple) : false;
                scope._cozenDropdownAutoClose      = angular.isDefined(attrs.cozenDropdownAutoClose) ? JSON.parse(attrs.cozenDropdownAutoClose) : true;
                scope._cozenDropdownEasyClose      = angular.isDefined(attrs.cozenDropdownEasyClose) ? JSON.parse(attrs.cozenDropdownEasyClose) : true;
                scope._cozenDropdownShowTick       = angular.isDefined(attrs.cozenDropdownShowTick) ? JSON.parse(attrs.cozenDropdownShowTick) : true;
                scope._cozenDropdownTickIcon       = angular.isDefined(attrs.cozenDropdownTickIcon) ? attrs.cozenDropdownTickIcon : 'fa fa-check';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme           = Themes.getActiveTheme();
                scope.isHover                = false;
                scope.childrenUuid           = [];
                scope.activeChild            = 0;
                scope._cozenDropdownCollapse = false;

                // To get the name of the form
                scope.$on('cozenFormName', function (event, eventData) {
                    scope._cozenDropdownForm = eventData.name;
                });

                // Watch the up/down key to navigate
                $window.addEventListener('keydown', methods.onKeyDown);

                // To auto close when a drop down is show
                scope.$on('cozenDropdownAutoCloseOthers', methods.onAutoCloseOthers);

                // When a child is toggle
                scope.$on('cozenDropdownSelected', methods.onChildSelected);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenDropdownModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                if (angular.isDefined(attrs.cozenDropdownName)) {
                    if (Methods.isNullOrEmpty(attrs.cozenDropdownName)) {
                        Methods.directiveErrorEmpty(data.directive, 'Name');
                        return true;
                    }
                }
                return false;
            }

            function destroy() {
                $window.removeEventListener('keydown', methods.onKeyDown);
                $window.removeEventListener('click', methods.onWindowClick);
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                if (!Methods.isNullOrEmpty(scope._cozenDropdownForm)) {
                    var classList = [scope._activeTheme, scope._cozenDropdownSize, 'icon-right'];
                    var input     = methods.getForm()[scope._cozenDropdownName];
                    if (!Methods.isNullOrEmpty(input)) {
                        if (scope._cozenDropdownValidatorEmpty || (!scope._cozenDropdownValidatorEmpty && !Methods.isNullOrEmpty(scope.vm.cozenDropdownModel))) {
                            switch (scope._cozenDropdownValidator) {
                                case 'touched':
                                    if (input.$touched) classList.push(methods.getDesignClass(input));
                                    break;
                                case 'dirty':
                                    if (input.$dirty) classList.push(methods.getDesignClass(input));
                                    break;
                                case 'all':
                                    classList.push(methods.getDesignClass(input));
                                    break;
                            }
                        }
                    }
                    if (scope.vm.cozenDropdownDisabled) classList.push('disabled');
                    if (scope._cozenDropdownIconLeft) classList.push('icon-left');
                    return classList;
                }
            }

            function onHover($event, state) {
                scope.isHover = state;
                if (!scope._cozenDropdownEasyNavigation) {
                    if (!scope.isHover) {
                        $rootScope.$broadcast('cozenDropdownActive', {
                            uuid: null
                        });
                    }
                }
            }

            function onKeyDown(event) {
                event.stopPropagation();
                if (!scope._cozenDropdownCollapse) return;
                if (!scope._cozenDropdownEasyNavigation) {
                    if (!scope.isHover) return;
                }
                if (event.keyCode == 38 || event.keyCode == 40) {
                    
                    // Search for a new active child (escape disabled ones)
                    var length = scope.childrenUuid.length, i = 0;
                    var value  = angular.copy(scope.activeChild);
                    do {
                        if (event.keyCode == 38) value = decrease(value, length);
                        else if (event.keyCode == 40) value = increase(value, length);
                        if (!scope.childrenUuid[value].disabled) break;
                        i++;
                    } while (i < length);

                    scope.activeChild = value;
                    $rootScope.$broadcast('cozenDropdownActive', {
                        uuid: scope.childrenUuid[scope.activeChild].uuid
                    });
                }

                function decrease(value, max) {
                    if (value > 0) value--;
                    else value = max - 1;
                    return value;
                }

                function increase(value, max) {
                    if (value < max - 1) value++;
                    else value = 0;
                    return value;
                }
            }

            function onChange($event) {
                if (scope.vm.cozenDropdownDisabled) return;
                if (Methods.isFunction(scope.cozenDropdownOnChange)) scope.cozenDropdownOnChange();
                if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
            }

            function getDesignClass(input) {
                if (scope._cozenDropdownErrorDesign) {
                    if (input.$invalid) {
                        scope._cozenDropdownHasFeedback = 'error';
                        return 'error-design';
                    }
                }
                if (scope._cozenDropdownSuccessDesign) {
                    if (input.$valid) {
                        scope._cozenDropdownHasFeedback = 'success';
                        return 'success-design';
                    }
                }
                scope._cozenDropdownHasFeedback = false;
                return '';
            }

            function getForm() {
                var form = scope.$parent.$parent[scope._cozenDropdownForm];
                if (Methods.isNullOrEmpty(form)) {
                    form = scope.$parent.$parent.$parent[scope._cozenDropdownForm];
                    if (Methods.isNullOrEmpty(form)) {
                        form = scope.$parent.$parent.$parent.$parent[scope._cozenDropdownForm];
                        if (Methods.isNullOrEmpty(form)) {
                            form = scope.$parent.$parent.$parent.$parent.$parent[scope._cozenDropdownForm];
                            if (Methods.isNullOrEmpty(form)) {
                                form = scope.$parent.$parent.$parent.$parent.$parent.$parent[scope._cozenDropdownForm];
                                if (Methods.isNullOrEmpty(form)) {
                                    return form;
                                } else return form;
                            } else return form;
                        } else return form;
                    } else return form;
                } else return form;
            }

            function onClick($event) {
                if (!Methods.isNullOrEmpty($event)) $event.stopPropagation();
                if (!scope.cozenDropdownDisabled) {
                    scope._cozenDropdownCollapse = !scope._cozenDropdownCollapse;
                    scope.$broadcast('cozenDropdownCollapse', {
                        collapse: scope._cozenDropdownCollapse
                    });

                    if (scope._cozenDropdownCollapse) {

                        // Auto close all other dropdown
                        if (CONFIG.config.dropdown.autoCloseOthers) {
                            $rootScope.$broadcast('cozenDropdownAutoCloseOthers', {
                                name: scope._cozenDropdownName
                            });
                        }

                        // Watch the click
                        if (scope._cozenDropdownEasyClose) {
                            $window.addEventListener('click', methods.onWindowClick);
                        }
                    } else {
                        $window.removeEventListener('click', methods.onWindowClick);
                    }
                }
            }

            function onAutoCloseOthers(event, data) {
                if (scope._cozenDropdownCollapse) {
                    if (scope._cozenDropdownName != data.name) {
                        methods.onClick();
                    }
                }
            }

            // Listener call it only if the dropdown is open and easy close at true
            function onWindowClick() {

                // If not hover the dropdown, close it
                if (!scope.isHover) {
                    methods.onClick();

                    // Required to refresh the DOM and see the change
                    Methods.safeApply(scope);
                }
            }

            function onChildSelected(event, data) {
                if (data.dropdown == scope._cozenDropdownName) {
                    if (scope._cozenDropdownMultiple) {

                        // Update the array and forge the model
                        scope.vm.cozenDropdownModel = [];
                        scope.childrenUuid.forEach(function (child) {
                            if (child.uuid == data.uuid) {
                                child.selected = data.selected;
                                child.value    = data.value;
                            }
                            if (!child.disabled && child.selected) scope.vm.cozenDropdownModel.push(child.value);
                        });
                        if (scope.vm.cozenDropdownModel.length == 0) scope.vm.cozenDropdownModel = '';
                    } else {

                        // Change the model
                        if (data.selected) {
                            scope.vm.cozenDropdownModel = data.value;

                            // Deselect the other children
                            scope.$broadcast('cozenDropdownDeselect', {
                                uuid: data.uuid
                            });
                        }
                        else scope.vm.cozenDropdownModel = '';
                    }
                }
            }
        }
    }

    cozenDropdownCtrl.$inject = [];

    function cozenDropdownCtrl() {
        var vm = this;
    }

})(window.angular);

