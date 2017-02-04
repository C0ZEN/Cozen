/**
 * @ngdoc directive
 * @name cozen-dropdown-item-simple
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenDropdownItemSimpleOnClick          > Callback function called on click
 * @param {boolean}  cozenDropdownItemSimpleDisabled = false > Disable the item
 * @param {boolean}  cozenDropdownItemSimpleSelected = false > Select the item (edit the models and styles)
 * @param {boolean}  cozenDropdownItemSimpleValue            > Use this value instead of label for parent model
 *
 * [Attributes params]
 * @param {number} cozenDropdownItemSimpleId        > Id of the item
 * @param {string} cozenDropdownItemSimpleLabel     > Text of the item [required]
 * @param {string} cozenDropdownItemSimpleSubLabel  > Text of the item
 * @param {string} cozenDropdownItemSimpleIconLeft  > Icon left (name of the icon)
 * @param {string} cozenDropdownItemSimpleIconRight > Icon right (name of the icon)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.dropdown.simple', [])
        .directive('cozenDropdownItemSimple', cozenDropdownItemSimple);

    cozenDropdownItemSimple.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        '$timeout',
        '$filter'
    ];

    function cozenDropdownItemSimple(CONFIG, rfc4122, $rootScope, $window, $timeout, $filter) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenDropdownItemSimpleOnClick : '&',
                cozenDropdownItemSimpleDisabled: '=?',
                cozenDropdownItemSimpleSelected: '=?',
                cozenDropdownItemSimpleValue   : '=?'
            },
            templateUrl: 'directives/dropdown/items/simple/dropdown.simple.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init             : init,
                hasError         : hasError,
                destroy          : destroy,
                getMainClass     : getMainClass,
                onClickItem      : onClickItem,
                getTabIndex      : getTabIndex,
                onActive         : onActive,
                onKeyDown        : onKeyDown,
                onHover          : onHover,
                onCollapse       : onCollapse,
                getDropdown      : getDropdown,
                updateParentModel: updateParentModel,
                deselect         : deselect,
                search           : search
            };

            var data = {
                directive: 'cozenDropdownItemSimple',
                uuid     : rfc4122.v4(),
                dropdown : {
                    name: null
                }
            };

            scope._isReady = true;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : {
                        item: onClickItem
                    },
                    getTabIndex : getTabIndex,
                    onHover     : onHover
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenDropdownItemSimpleDisabled)) scope.cozenDropdownItemSimpleDisabled = false;
                if (angular.isUndefined(attrs.cozenDropdownItemSimpleSelected)) {
                    scope.cozenDropdownItemSimpleSelected = false;
                }
                else if (typeof scope.cozenDropdownItemSimpleSelected != "boolean") {
                    scope.cozenDropdownItemSimpleSelected = false;
                }

                // Default values (attributes)
                scope._cozenDropdownItemSimpleId        = angular.isDefined(attrs.cozenDropdownItemSimpleId) ? attrs.cozenDropdownItemSimpleId : '';
                scope._cozenDropdownItemSimpleLabel     = attrs.cozenDropdownItemSimpleLabel;
                scope._cozenDropdownItemSimpleSubLabel  = angular.isDefined(attrs.cozenDropdownItemSimpleSubLabel) ? attrs.cozenDropdownItemSimpleSubLabel : '';
                scope._cozenDropdownItemSimpleIconLeft  = angular.isDefined(attrs.cozenDropdownItemSimpleIconLeft) ? attrs.cozenDropdownItemSimpleIconLeft : '';
                scope._cozenDropdownItemSimpleIconRight = angular.isDefined(attrs.cozenDropdownItemSimpleIconRight) ? attrs.cozenDropdownItemSimpleIconRight : '';
                scope._cozenDropdownItemSimpleShowTick  = methods.getDropdown()._cozenDropdownShowTick;
                scope._cozenDropdownItemSimpleTickIcon  = methods.getDropdown()._cozenDropdownTickIcon;
                scope._cozenDropdownSearch              = [scope._cozenDropdownItemSimpleLabel, scope._cozenDropdownItemSimpleSubLabel];

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope.cozenDropdownItemSimpleActive = false;

                // Register data into the parent
                var dropdown = methods.getDropdown();
                dropdown.childrenUuid.push({
                    uuid    : data.uuid,
                    disabled: scope.cozenDropdownItemSimpleDisabled,
                    label   : $filter('translate')(scope._cozenDropdownItemSimpleLabel)
                });
                data.dropdown.name = dropdown._cozenDropdownName;
                methods.updateParentModel();

                // If attr selected is set, look at the change (for out of the box change) and update the parent
                if (angular.isDefined(attrs.cozenDropdownItemSimpleSelected)) {
                    scope.$watch('cozenDropdownItemSimpleSelected', function (newValue) {
                        methods.updateParentModel();
                    });
                }

                $rootScope.$on('cozenDropdownActive', methods.onActive);
                scope.$on('cozenDropdownCollapse', methods.onCollapse);
                scope.$on('cozenDropdownDeselect', methods.deselect);
                scope.$on('cozenDropdownSearch', methods.search);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenDropdownItemSimpleLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
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
                if (scope.cozenDropdownItemSimpleDisabled) classList.push('disabled');
                else if (scope.cozenDropdownItemSimpleActive) classList.push('active');
                if (scope.cozenDropdownItemSimpleSelected) classList.push('selected');
                return classList;
            }

            function onClickItem($event) {
                $event.stopPropagation();
                var dropdown = methods.getDropdown();
                if (!dropdown._cozenDropdownCollapse) return;
                if (scope.cozenDropdownItemSimpleDisabled) return;
                if (Methods.isFunction(scope.cozenDropdownItemSimpleOnClick)) scope.cozenDropdownItemSimpleOnClick();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickItem');
                if (!dropdown._cozenDropdownMultiple && dropdown._cozenDropdownAutoClose) dropdown._methods.onClick();

                // Toggle and inform the parent
                scope.cozenDropdownItemSimpleSelected = !scope.cozenDropdownItemSimpleSelected;
                methods.updateParentModel();
                Methods.safeApply(scope);
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenDropdownItemSimpleDisabled) tabIndex = -1;
                return tabIndex;
            }

            function onActive(event, eventData) {
                if (scope.cozenDropdownItemSimpleDisabled) return;
                scope.cozenDropdownItemSimpleActive = eventData.uuid == data.uuid;
                Methods.safeApply(scope);
            }

            function onKeyDown(event) {
                if (scope.cozenDropdownItemSimpleDisabled) return;
                if (!scope.cozenDropdownItemSimpleActive) return;
                event.stopPropagation();
                switch (event.keyCode) {

                    // Enter
                    case 13:
                        methods.onClickItem(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenDropdownItemSimpleActive) return;

                // Search the active child
                var activeChild = 0;
                for (var i = 0, length = methods.getDropdown().childrenUuid.length; i < length; i++) {
                    if (methods.getDropdown().childrenUuid[i].uuid == data.uuid) {
                        activeChild = i;
                        break;
                    }
                }

                // Tell the parent about the new active child
                $rootScope.$broadcast('cozenDropdownActiveChild', {
                    dropdown   : data.dropdown.name,
                    activeChild: activeChild
                });

                $rootScope.$broadcast('cozenDropdownActive', {
                    uuid: data.uuid
                });
            }

            function onCollapse(event, data) {
                if (data.collapse) {
                    $window.addEventListener('keydown', methods.onKeyDown);
                } else {
                    $window.removeEventListener('keydown', methods.onKeyDown);
                }
            }

            function getDropdown() {
                var dropdown = scope.$parent.$parent;
                if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                    dropdown = scope.$parent.$parent.$parent;
                    if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                        dropdown = scope.$parent.$parent.$parent.$parent;
                        if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                            dropdown = scope.$parent.$parent.$parent.$parent.$parent;
                            if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                                dropdown = scope.$parent.$parent.$parent.$parent.$parent.$parent;
                                if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                                    return dropdown;
                                } else return dropdown;
                            } else return dropdown;
                        } else return dropdown;
                    } else return dropdown;
                } else return dropdown;
            }

            function updateParentModel() {
                $rootScope.$broadcast('cozenDropdownSelected', {
                    uuid    : data.uuid,
                    selected: scope.cozenDropdownItemSimpleSelected,
                    dropdown: data.dropdown.name,
                    value   : Methods.isNullOrEmpty(scope.cozenDropdownItemSimpleValue) ? scope._cozenDropdownItemSimpleLabel : scope.cozenDropdownItemSimpleValue,
                    label   : scope._cozenDropdownItemSimpleLabel
                });
            }

            function deselect(event, params) {
                if (params.uuid != data.uuid) {
                    scope.cozenDropdownItemSimpleSelected = false;
                }
            }

            function search(event, params) {
                if (data.dropdown.name == params.dropdown) {
                    scope._cozenDropdownSearch = $filter('filter')([scope._cozenDropdownItemSimpleLabel, scope._cozenDropdownItemSimpleSubLabel], params.value);
                    $rootScope.$broadcast('cozenDropdownItemDisabled', {
                        uuid    : data.uuid,
                        disabled: scope._cozenDropdownSearch.length == 0,
                        dropdown: data.dropdown.name
                    });
                }
            }
        }
    }

})(window.angular);

