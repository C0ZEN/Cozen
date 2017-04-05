/**
 * @ngdoc directive
 * @name cozen-tooltip
 * @scope
 * @restrict AE
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 * @param {string}  cozenTooltipLabel                    > Text of the tooltip (could be html as well) [required]
 * @param {boolean} cozenTooltipDisabled = false         > Disable the tooltip (allow empty label)
 * @param {string}  cozenTooltipMaxWidth = max-width-200 > Max width of the tooltip (must be a class custom or predefined) [ex: max-width-[100-450])
 *
 * [Attributes params]
 * @param {string}  cozenTooltipPlacement   = auto right > Position of the tooltip (ui-tooltip placement)
 * @param {boolean} cozenTooltipBody        = true       > Tooltip append to body
 * @param {number}  cozenTooltipCloseDelay  = 100        > Delay before hide
 * @param {number}  cozenTooltipDelay       = 250        > Delay before show
 * @param {string}  cozenTooltipTrigger     = mouseenter > Define what trigger the tooltip (mouseenter, click, outsideClick, focus, none)
 * @param {string}  cozenTooltipType        = default    > Define what type of tooltip is required
 * @param {string}  cozenTooltipTypeDefault              > Shortcut for default type
 * @param {string}  cozenTooltipTypeHtml                 > Shortcut for html type
 * @param {string}  cozenTooltipDisplay                  > Change the display (only when there are problem)
 * @param {string}  cozenTooltipDisplayChild             > Change the display for the child (only when there are problem)
 * @param {string}  cozenTooltipClass                    > Add a custom class on the tooltip
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.tooltip', [])
        .directive('cozenTooltip', cozenTooltip);

    cozenTooltip.$inject = [
        'Themes'
    ];

    function cozenTooltip(Themes) {
        return {
            link       : link,
            restrict   : 'AE',
            replace    : false,
            transclude : true,
            scope      : {
                cozenTooltipLabel   : '=?',
                cozenTooltipDisabled: '=?',
                cozenTooltipMaxWidth: '=?'
            },
            templateUrl: 'directives/tooltip/tooltip.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenTooltip'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {};

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenTooltipType)) {
                    if (angular.isDefined(attrs.cozenTooltipTypeDefault)) {
                        scope._cozenTooltipType = 'default';
                    }
                    else if (angular.isDefined(attrs.cozenTooltipTypeHtml)) {
                        scope._cozenTooltipType = 'html';
                    }
                    else {
                        scope._cozenTooltipType = 'default';
                    }
                }
                else {
                    scope._cozenTooltipType = attrs.cozenTooltipType;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenTooltipDisabled) ? scope.cozenTooltipDisabled = false : null;
                angular.isUndefined(attrs.cozenTooltipMaxWidth) ? scope.cozenTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attributes)
                scope._cozenTooltipPlacement    = angular.isDefined(attrs.cozenTooltipPlacement) ? attrs.cozenTooltipPlacement : 'auto right';
                scope._cozenTooltipBody         = angular.isDefined(attrs.cozenTooltipBody) ? JSON.parse(attrs.cozenTooltipBody) : true;
                scope._cozenTooltipCloseDelay   = angular.isDefined(attrs.cozenTooltipCloseDelay) ? JSON.parse(attrs.cozenTooltipCloseDelay) : 100;
                scope._cozenTooltipDelay        = angular.isDefined(attrs.cozenTooltipDelay) ? JSON.parse(attrs.cozenTooltipDelay) : 250;
                scope._cozenTooltipTrigger      = angular.isDefined(attrs.cozenTooltipTrigger) ? attrs.cozenTooltipTrigger : 'mouseenter';
                scope._cozenTooltipDisplay      = angular.isDefined(attrs.cozenTooltipDisplay) ? attrs.cozenTooltipDisplay : '';
                scope._cozenTooltipDisplayChild = angular.isDefined(attrs.cozenTooltipDisplayChild) ? attrs.cozenTooltipDisplayChild : '';
                scope._cozenTooltipClass        = angular.isDefined(attrs.cozenTooltipClass) ? attrs.cozenTooltipClass : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenTooltipLabel)) {
                    if (!scope.cozenTooltipDisabled) {
                        cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'cozenTooltipLabel');
                        return true;
                    }
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

