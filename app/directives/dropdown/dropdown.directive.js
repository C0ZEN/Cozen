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
 * @param {number}  cozenDropdownId                                             > Id of the dropdown
 * @param {string}  cozenDropdownSize                       = 'normal'                    > Size of the dropdown
 * @param {string}  cozenDropdownSizeSmall                                                > Shortcut for small size
 * @param {string}  cozenDropdownSizeNormal                                               > Shortcut for normal size
 * @param {string}  cozenDropdownSizeLarge                                                > Shortcut for large size
 * @param {boolean} cozenDropdownRequired                   = false                       > Required input
 * @param {boolean} cozenDropdownErrorDesign                = true                        > Add style when error
 * @param {boolean} cozenDropdownSuccessDesign              = true                        > Add style when success
 * @param {string}  cozenDropdownPlaceholder                                              > Text for the placeholder
 * @param {string}  cozenDropdownIconLeft                                                 > Text for the icon left (font)
 * @param {string}  cozenDropdownName                       = uuid                        > Name of the input
 * @param {boolean} cozenDropdownValidator                  = 'touched'                   > Define after what type of event the input must add more ui color
 * @param {boolean} cozenDropdownValidatorAll                                             > Shortcut for all type
 * @param {boolean} cozenDropdownValidatorTouched                                         > Shortcut for touched type
 * @param {boolean} cozenDropdownEasyNavigation             = true                        > Allow to navigate with arrows even if the pointer is out of the dropdown
 * @param {boolean} cozenDropdownMultiple                   = false                       > Allow to select multiple data
 * @param {boolean} cozenDropdownAutoClose                  = true                        > Close the dropdown after had selected a data (only for single)
 * @param {boolean} cozenDropdownEasyClose                  = true                        > Auto close the dropdown when a click is outside
 * @param {boolean} cozenDropdownShowTick                   = true                        > Display an icon to the right when a data is selected
 * @param {boolean} cozenDropdownTickIcon                   = 'fa fa-check'               > Define what type of icon should it be
 * @param {string}  cozenDropdownModelEnhanced              = 'last'                      > Choose the way of display the selected data text in the input [last, all, count, number (value expected)]
 * @param {number}  cozenDropdownMaxHeight                  = 200                         > Max-height of the dropdown
 * @param {string}  cozenDropdownLabel                                                    > Add a label on the top of the dropdown
 * @param {string}  cozenDropdownRequiredTooltip            = 'dropdown_required_tooltip' > Text to display for the tooltip of the required element
 * @param {string}  cozenDropdownClass                                                    > Custom class
 * @param {string}  cozenDropdownAllSelectedText            = 'dropdown_count_all'        > Text to display when all elements are selected
 * @param {string}  cozenDropdownSingleDisplaySelectedLabel = false                       > Display the label instead of the value (if the value was set - the model still have the value)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.dropdown', [
            'cozenLib.dropdown.group',
            'cozenLib.dropdown.search',
            'cozenLib.dropdown.simple'
        ])
        .directive('cozenDropdown', cozenDropdown);

    cozenDropdown.$inject = [
        'Themes',
        'CONFIG',
        '$window',
        '$rootScope',
        'rfc4122',
        '$filter',
        '$timeout'
    ];

    function cozenDropdown(Themes, CONFIG, $window, $rootScope, rfc4122, $filter, $timeout) {
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
                init                     : init,
                hasError                 : hasError,
                destroy                  : destroy,
                getMainClass             : getMainClass,
                onHover                  : onHover,
                onKeyDown                : onKeyDown,
                onChange                 : onChange,
                getForm                  : getForm,
                onClick                  : onClick,
                onAutoCloseOthers        : onAutoCloseOthers,
                onWindowClick            : onWindowClick,
                onChildSelected          : onChildSelected,
                onChildSearched          : onChildSearched,
                setScrollBarHeight       : setScrollBarHeight,
                onActiveChild            : onActiveChild,
                defineTranscludeDirection: defineTranscludeDirection,
                getArrowClass            : getArrowClass,
                getTranscludeStyle       : getTranscludeStyle
            };

            var data = {
                directive       : 'cozenDropdown',
                uuid            : rfc4122.v4(),
                transcludeHeight: 0,
                touched         : false
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass      : getMainClass,
                    onHover           : onHover,
                    onChange          : onChange,
                    onClick           : onClick,
                    getArrowClass     : getArrowClass,
                    getTranscludeStyle: getTranscludeStyle
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenDropdownSize)) {
                    if (angular.isDefined(attrs.cozenDropdownSizeSmall)) scope._cozenDropdownSize = 'small';
                    else if (angular.isDefined(attrs.cozenDropdownSizeNormal)) scope._cozenDropdownSize = 'normal';
                    else if (angular.isDefined(attrs.cozenDropdownSizeLarge)) scope._cozenDropdownSize = 'large';
                    else scope._cozenDropdownSize = 'normal';
                } else scope._cozenDropdownSize = attrs.cozenDropdownSize;

                // Shortcut values (validator)
                if (angular.isUndefined(attrs.cozenDropdownValidator)) {
                    if (angular.isDefined(attrs.cozenDropdownValidatorAll)) scope._cozenDropdownValidator = 'all';
                    else if (angular.isDefined(attrs.cozenDropdownValidatorTouched)) scope._cozenDropdownValidator = 'touched';
                    else scope._cozenDropdownValidator = 'touched';
                } else scope._cozenDropdownValidator = attrs.cozenDropdownValidator;

                // Check the model enhanced mod
                if (angular.isUndefined(attrs.cozenDropdownModelEnhanced)) scope._cozenDropdownModelEnhanced = 'last';
                else {
                    if (attrs.cozenDropdownModelEnhanced == 'last') scope._cozenDropdownModelEnhanced = 'last';
                    else if (attrs.cozenDropdownModelEnhanced == 'count') scope._cozenDropdownModelEnhanced = 'count';
                    else if (attrs.cozenDropdownModelEnhanced == 'all') scope._cozenDropdownModelEnhanced = 'all';
                    else if (!isNaN(attrs.cozenDropdownModelEnhanced)) scope._cozenDropdownModelEnhanced = parseInt(attrs.cozenDropdownModelEnhanced);
                    else {
                        scope._cozenDropdownModelEnhanced = 'last';
                        Methods.directiveWarningUnmatched(data.directive, 'ModelEnhanced', 'last');
                    }
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenDropdownDisabled)) scope.vm.cozenDropdownDisabled = false;
                scope.vm.cozenDropdownModelEnhanced = '';

                // Default values (attributes)
                scope._cozenDropdownId                         = angular.isDefined(attrs.cozenDropdownId) ? attrs.cozenDropdownId : '';
                scope._cozenDropdownRequired                   = angular.isDefined(attrs.cozenDropdownRequired) ? JSON.parse(attrs.cozenDropdownRequired) : false;
                scope._cozenDropdownErrorDesign                = angular.isDefined(attrs.cozenDropdownErrorDesign) ? JSON.parse(attrs.cozenDropdownErrorDesign) : true;
                scope._cozenDropdownSuccessDesign              = angular.isDefined(attrs.cozenDropdownSuccessDesign) ? JSON.parse(attrs.cozenDropdownSuccessDesign) : true;
                scope._cozenDropdownPlaceholder                = angular.isDefined(attrs.cozenDropdownPlaceholder) ? attrs.cozenDropdownPlaceholder : '';
                scope._cozenDropdownIconLeft                   = angular.isDefined(attrs.cozenDropdownIconLeft) ? attrs.cozenDropdownIconLeft : '';
                scope._cozenDropdownName                       = angular.isDefined(attrs.cozenDropdownName) ? attrs.cozenDropdownName : data.uuid;
                scope._cozenDropdownEasyNavigation             = angular.isDefined(attrs.cozenDropdownEasyNavigation) ? JSON.parse(attrs.cozenDropdownEasyNavigation) : true;
                scope._cozenDropdownMultiple                   = angular.isDefined(attrs.cozenDropdownMultiple) ? JSON.parse(attrs.cozenDropdownMultiple) : false;
                scope._cozenDropdownAutoClose                  = angular.isDefined(attrs.cozenDropdownAutoClose) ? JSON.parse(attrs.cozenDropdownAutoClose) : true;
                scope._cozenDropdownEasyClose                  = angular.isDefined(attrs.cozenDropdownEasyClose) ? JSON.parse(attrs.cozenDropdownEasyClose) : true;
                scope._cozenDropdownShowTick                   = angular.isDefined(attrs.cozenDropdownShowTick) ? JSON.parse(attrs.cozenDropdownShowTick) : true;
                scope._cozenDropdownTickIcon                   = angular.isDefined(attrs.cozenDropdownTickIcon) ? attrs.cozenDropdownTickIcon : 'fa fa-check';
                scope._cozenDropdownMaxHeight                  = angular.isDefined(attrs.cozenDropdownMaxHeight) ? JSON.parse(attrs.cozenDropdownMaxHeight) : 200;
                scope._cozenDropdownDirection                  = 'down';
                scope._cozenDropdownLabel                      = angular.isDefined(attrs.cozenDropdownLabel) ? attrs.cozenDropdownLabel : '';
                scope._cozenDropdownRequiredConfig             = CONFIG.required;
                scope._cozenDropdownRequiredTooltip            = angular.isDefined(attrs.cozenDropdownRequiredTooltip) ? attrs.cozenDropdownRequiredTooltip : 'dropdown_required_tooltip';
                scope._cozenDropdownUuid                       = data.uuid;
                scope._cozenDropdownAllSelectedText            = angular.isDefined(attrs.cozenDropdownAllSelectedText) ? attrs.cozenDropdownAllSelectedText : 'dropdown_count_all';
                scope._cozenDropdownSingleDisplaySelectedLabel = angular.isDefined(attrs.cozenDropdownSingleDisplaySelectedLabel) ? JSON.parse(attrs.cozenDropdownSingleDisplaySelectedLabel) : false;

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

                // When the search change (from each child)
                scope.$on('cozenDropdownItemDisabled', methods.onChildSearched);

                // Update the active child when a change occur in a child
                scope.$on('cozenDropdownActiveChild', methods.onActiveChild);

                // Define the transclude position
                $window.addEventListener('scroll', methods.defineTranscludeDirection);

                // ScrollBar
                scope._cozenScrollBar            = CONFIG.scrollsBar;
                scope._cozenScrollBarConfig      = CONFIG.scrollsBarConfig;
                scope._cozenScrollBarConfig.axis = 'y';
                methods.setScrollBarHeight();

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
                $window.removeEventListener('scroll', methods.onScroll);
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                if (!Methods.isNullOrEmpty(scope._cozenDropdownForm)) {
                    var classList = [scope._activeTheme, scope._cozenDropdownSize, 'icon-right', scope._cozenDropdownDirection, attrs.cozenDropdownClass];
                    switch (scope._cozenDropdownValidator) {
                        case 'touched':
                            if (data.touched) {
                                if (!Methods.isNullOrEmpty(scope.vm.cozenDropdownModelEnhanced)) classList.push('success-design');
                                else if (scope._cozenDropdownRequired) classList.push('error-design');
                            }
                            break;
                        case 'all':
                            if (!Methods.isNullOrEmpty(scope.vm.cozenDropdownModelEnhanced)) classList.push('success-design');
                            else if (scope._cozenDropdownRequired) classList.push('error-design');
                            break;
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
                if (scope.vm.cozenDropdownDisabled) return;
                if (!scope._cozenDropdownCollapse) return;
                if (!scope._cozenDropdownEasyNavigation) {
                    if (!scope.isHover) return;
                }
                if (event.keyCode == 38 || event.keyCode == 40) {

                    event.stopPropagation();
                    event.preventDefault();

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
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
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
                data.touched = true;
                if (!Methods.isNullOrEmpty($event)) $event.stopPropagation();
                if (!scope.vm.cozenDropdownDisabled) {
                    scope._cozenDropdownCollapse = !scope._cozenDropdownCollapse;
                    scope.$broadcast('cozenDropdownCollapse', {
                        collapse: scope._cozenDropdownCollapse
                    });

                    if (scope._cozenDropdownCollapse) {

                        // Auto close all other dropdown
                        if (CONFIG.dropdown.autoCloseOthers) {
                            $rootScope.$broadcast('cozenDropdownAutoCloseOthers', {
                                name: scope._cozenDropdownName
                            });
                        }

                        // Watch the click
                        if (scope._cozenDropdownEasyClose) {
                            $window.addEventListener('click', methods.onWindowClick);
                        }

                        $timeout(function () {
                            data.transcludeHeight = element.find('.cozen-dropdown-transclude .ng-transclude')[0].offsetHeight;
                            methods.defineTranscludeDirection();
                        }, 1);
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

                    // ModelEnhanced stuff
                    if (data.selected && scope._cozenDropdownModelEnhanced == 'last') scope.vm.cozenDropdownModelEnhanced = data.label;
                    else if (scope._cozenDropdownModelEnhanced != 'last') scope.vm.cozenDropdownModelEnhanced = '';

                    if (scope._cozenDropdownMultiple) {

                        // Update the array and forge the model
                        var selectedValues          = 0;
                        scope.vm.cozenDropdownModel = [];
                        scope.childrenUuid.forEach(function (child) {

                            // Updaye the new value
                            if (child.uuid == data.uuid) {
                                child.selected = data.selected;
                                child.value    = data.value;
                            }

                            // Update the model
                            if (!child.disabled && child.selected) {
                                scope.vm.cozenDropdownModel.push(child.value);

                                // ModelEnhanced : all & number
                                if (scope._cozenDropdownModelEnhanced == 'all' || typeof scope._cozenDropdownModelEnhanced == 'number') {
                                    if (selectedValues > 0) scope.vm.cozenDropdownModelEnhanced += ', ';
                                    scope.vm.cozenDropdownModelEnhanced += child.label;
                                    selectedValues++;
                                }

                                // ModelEnhanced : count (first result)
                                else if (scope._cozenDropdownModelEnhanced == 'count') {
                                    scope.vm.cozenDropdownModelEnhanced = child.label;
                                    selectedValues++;
                                }

                                // ModelEnhanced : last
                                else if (scope._cozenDropdownModelEnhanced == 'last') selectedValues++;
                            }
                        });

                        // ModelEnhanced : number
                        var useCount = false;
                        if (typeof scope._cozenDropdownModelEnhanced == 'number') {
                            if (selectedValues > scope._cozenDropdownModelEnhanced) {
                                useCount = true;
                            }
                        }

                        // ModelEnhanced : count (if more than one result)
                        if ((scope._cozenDropdownModelEnhanced == 'count' && selectedValues > 1) || useCount) {
                            scope.vm.cozenDropdownModelEnhanced = $filter('translate')('dropdown_count', {
                                selected: selectedValues,
                                total   : scope.childrenUuid.length
                            });
                        }

                        // ModelEnhanced : count (if all selected)
                        if ((scope._cozenDropdownModelEnhanced == 'count' || useCount) && selectedValues == scope.childrenUuid.length) {
                            scope.vm.cozenDropdownModelEnhanced = $filter('translate')(scope._cozenDropdownAllSelectedText);
                        }

                        // No data selected
                        if (selectedValues == 0) {
                            scope.vm.cozenDropdownModel         = '';
                            scope.vm.cozenDropdownModelEnhanced = '';
                        }
                    } else {

                        // Change the model
                        if (data.selected) {
                            scope.vm.cozenDropdownModel = data.value;

                            // Display the label instead of the value
                            if (scope._cozenDropdownSingleDisplaySelectedLabel) scope.vm.cozenDropdownModelEnhanced = $filter('translate')(data.label);
                            else scope.vm.cozenDropdownModelEnhanced = data.value;

                            // Deselect the other children
                            scope.$broadcast('cozenDropdownDeselect', {
                                uuid: data.uuid
                            });
                        } else scope.vm.cozenDropdownModel = '';
                        scope.vm.cozenDropdownModelEnhanced = scope.vm.cozenDropdownModel;
                    }
                }
            }

            function onChildSearched(event, params) {
                if (scope._cozenDropdownName == params.dropdown) {
                    var disabled = 0, length = scope.childrenUuid.length;
                    for (var i = 0; i < length; i++) {
                        if (scope.childrenUuid[i].uuid == params.uuid) {
                            scope.childrenUuid[i].disabled = params.disabled;
                        }
                        if (scope.childrenUuid[i].disabled) disabled++;
                    }

                    // To show or hide the empty text
                    scope.$broadcast('cozenDropdownEmpty', {
                        empty   : disabled == length,
                        dropdown: data.uuid
                    });
                }
            }

            function setScrollBarHeight() {
                $timeout(function () {
                    var body       = element.find('.cozen-dropdown-transclude')[0];
                    var transclude = element.find('.cozen-dropdown-transclude .ng-transclude')[0];
                    if (transclude.offsetHeight > 0) body.style.height = transclude.offsetHeight + Methods.getElementPaddingTopBottom(body) + 'px';
                    Methods.safeApply(scope);
                });
            }

            function onActiveChild(event, params) {
                if (scope._cozenDropdownName == params.dropdown) {
                    scope.activeChild = params.activeChild;
                }
            }

            function defineTranscludeDirection() {
                var inputViewport = element.find('.cozen-dropdown-content')[0].getBoundingClientRect();
                var windowHeight  = window.innerHeight;
                var maxHeight     = data.transcludeHeight;
                if (data.transcludeHeight > scope._cozenDropdownMaxHeight) maxHeight = scope._cozenDropdownMaxHeight + 8;
                if (windowHeight - inputViewport.bottom < maxHeight) scope._cozenDropdownDirection = 'up';
                else scope._cozenDropdownDirection = 'down';
                Methods.safeApply(scope);
            }

            function getArrowClass() {
                var classList = ['fa', 'fa-caret-down'];
                if (scope._cozenDropdownDirection == 'down' && scope._cozenDropdownCollapse) classList.push('fa-rotate-90');
                else if (scope._cozenDropdownDirection == 'up' && scope._cozenDropdownCollapse) classList.push('fa-rotate-90');
                else if (scope._cozenDropdownDirection == 'up' && !scope._cozenDropdownCollapse) classList.push('fa-rotate-180');
                return classList;
            }

            function getTranscludeStyle() {
                var styleList = {
                    'max-height': scope._cozenDropdownMaxHeight + 'px'
                };
                if (scope._cozenDropdownDirection == 'down') styleList.top = '100%';
                else styleList.bottom = '100%';
                return styleList;
            }
        }
    }

    cozenDropdownCtrl.$inject = [];

    function cozenDropdownCtrl() {
        var vm = this;
    }

})(window.angular);

