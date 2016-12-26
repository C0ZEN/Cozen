/**
 * @ngdoc directive
 * @name cozen-dropdown-item-search
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {string} cozenDropdownItemSearchModel > Value edited by the search
 *
 * [Attributes params]
 * @param {number} cozenDropdownItemSearchId                           > Id of the item
 * @param {string} cozenDropdownItemSearchPlaceholder                  > Text for the placeholder
 * @param {string} cozenDropdownItemSearchIconRight   = 'fa fa-search' > Icon right (name of the icon)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp.dropdown.search', [])
        .directive('cozenDropdownItemSearch', cozenDropdownItemSearch);

    cozenDropdownItemSearch.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        '$timeout'
    ];

    function cozenDropdownItemSearch(CONFIG, rfc4122, $rootScope, $window, $timeout) {
        return {
            link            : link,
            restrict        : 'E',
            replace         : false,
            transclude      : false,
            scope           : {
                cozenDropdownItemSearchModel: '=?'
            },
            templateUrl     : 'directives/dropdown/items/search/search.template.html',
            bindToController: true,
            controller      : cozenDropdownItemSearchCtrl,
            controllerAs    : 'vm'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                getDropdown : getDropdown,
                onChange    : onChange
            };

            var data = {
                directive: 'cozenDropdownItemSearch',
                uuid     : rfc4122.v4(),
                dropdown : {
                    name: null
                }
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onChange    : onChange
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (attributes)
                scope._cozenDropdownItemSearchId          = angular.isDefined(attrs.cozenDropdownItemSearchId) ? attrs.cozenDropdownItemSearchId : '';
                scope._cozenDropdownItemSearchPlaceholder = angular.isDefined(attrs.cozenDropdownItemSearchPlaceholder) ? attrs.cozenDropdownItemSearchPlaceholder : '';
                scope._cozenDropdownItemSearchIconRight   = angular.isDefined(attrs.cozenDropdownItemSearchIconRight) ? attrs.cozenDropdownItemSearchIconRight : 'fa fa-search';

                // Init stuff
                element.on('$destroy', methods.destroy);
                data.dropdown.name = methods.getDropdown()._cozenDropdownName;

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
                var classList = [];
                return classList;
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

            function onChange($event) {
                $rootScope.$broadcast('cozenDropdownSearch', {
                    dropdown: data.dropdown.name,
                    value   : scope.vm.cozenDropdownItemSearchModel
                });
            }
        }
    }

    cozenDropdownItemSearchCtrl.$inject = [];

    function cozenDropdownItemSearchCtrl() {
        var vm = this;
    }

})(window.angular);

