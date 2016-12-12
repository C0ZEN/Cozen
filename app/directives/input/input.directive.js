/**
 * @ngdoc directive
 * @name cozen-input
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {string} cozenInputModel > Value edited by the input [required]
 *
 * [Attributes params]
 * @param {number} cozenInputId                              > Id of the input
 * @param {string} cozenInputTooltip                         > Text of the tooltip
 * @param {string} cozenInputTooltipTrigger = 'outsideClick' > Type of trigger to show the tooltip
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .directive('cozenInput', cozenInput);

    cozenInput.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenInput(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenInputModel: '=?'
            },
            templateUrl: 'directives/input/input.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenInput'
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


                // Default values (scope)

                // Default values (attributes)
                scope._cozenInputId             = angular.isDefined(attrs.cozenInputId) ? attrs.cozenInputId : '';
                scope._cozenInputTooltip        = angular.isDefined(attrs.cozenInputTooltip) ? attrs.cozenInputTooltip : '';
                scope._cozenInputTooltipTrigger = angular.isDefined(attrs.cozenInputTooltipTrigger) ? attrs.cozenInputTooltipTrigger : 'outsideClick';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenInputModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme];
                return classList;
            }
        }
    }

})(window.angular);

