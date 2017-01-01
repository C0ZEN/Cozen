/**
 * @ngdoc directive
 * @name cozen-dropdown-item-group
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number} cozenDropdownItemGroupId       > Id of the item
 * @param {string} cozenDropdownItemGroupLabel    > Text of the item [required]
 * @param {string} cozenDropdownItemGroupIconLeft > Icon left (name of the icon)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.dropdown.group', [])
        .directive('cozenDropdownItemGroup', cozenDropdownItemGroup);

    cozenDropdownItemGroup.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        '$timeout'
    ];

    function cozenDropdownItemGroup(CONFIG, rfc4122, $rootScope, $window, $timeout) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : false,
            templateUrl: 'directives/dropdown/items/group/group.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenDropdownItemGroup',
                uuid     : rfc4122.v4()
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (attributes)
                scope._cozenDropdownItemGroupId       = angular.isDefined(attrs.cozenDropdownItemGroupId) ? attrs.cozenDropdownItemGroupId : '';
                scope._cozenDropdownItemGroupLabel    = attrs.cozenDropdownItemGroupLabel;
                scope._cozenDropdownItemGroupIconLeft = angular.isDefined(attrs.cozenDropdownItemGroupIconLeft) ? attrs.cozenDropdownItemGroupIconLeft : '';

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenDropdownItemGroupLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [];
                return classList;
            }
        }
    }

})(window.angular);

