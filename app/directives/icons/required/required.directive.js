/**
 * @ngdoc directive
 * @name cozen-icon-required
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {boolean} cozenIconRequiredDisplay         = true                   > Hide or show the required icon
 * @param {string}  cozenIconRequiredTooltipLabel    = input_required_tooltip > Label of the tooltip
 * @param {string}  cozenIconRequiredTooltipMaxWidth = max-width-200          > Max width of the tooltip
 *
 * [Attribute params]
 * @param {string} cozenIconRequiredTooltipType = default > Type of the tooltip
 * @param {string} cozenIconRequiredStyle                 > Custom style
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.icons.required', [])
        .directive('cozenIconRequired', cozenIconRequired);

    cozenIconRequired.$inject = [
        'Themes',
        'cozenEnhancedLogs'
    ];

    function cozenIconRequired(Themes, cozenEnhancedLogs) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenIconRequiredDisplay        : '=?',
                cozenIconRequiredTooltipLabel   : '=?',
                cozenIconRequiredTooltipMaxWidth: '=?'
            },
            templateUrl: 'directives/icons/required/required.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init   : init,
                destroy: destroy
            };

            var data = {
                directive: 'cozenIconRequired'
            };

            methods.init();

            function init() {

                // Default values (scope)
                angular.isUndefined(attrs.cozenIconRequiredDisplay) ? scope.cozenIconRequiredDisplay = true : null;
                angular.isUndefined(attrs.cozenIconRequiredTooltipLabel) ? scope.cozenIconRequiredTooltipLabel = 'input_required_tooltip' : null;
                angular.isUndefined(attrs.cozenIconRequiredTooltipMaxWidth) ? scope.cozenIconRequiredTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attribute)
                scope._cozenIconRequiredTooltipType = angular.isDefined(attrs.cozenIconRequiredTooltipType) ? attrs.cozenIconRequiredTooltipType : 'default';
                scope._cozenIconRequiredStyle       = angular.isDefined(attrs.cozenIconRequiredStyle) ? attrs.cozenIconRequiredStyle : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);


