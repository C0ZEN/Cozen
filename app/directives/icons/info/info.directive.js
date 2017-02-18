/**
 * @ngdoc directive
 * @name cozen-icon-info
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {boolean} cozenIconInfoDisplay         = true          > Hide or show the info icon
 * @param {string}  cozenIconInfoTooltipLabel                    > Label of the tooltip [required]
 * @param {string}  cozenIconInfoTooltipMaxWidth = max-width-200 > Max width of the tooltip
 *
 * [Attribute params]
 * @param {string} cozenIconInfoTooltipType = default > Type of the tooltip
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.icons.info', [])
        .directive('cozenIconInfo', cozenIconInfo);

    cozenIconInfo.$inject = [
        '$filter',
        'Themes'
    ];

    function cozenIconInfo($filter, Themes) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenIconInfoDisplay        : '=?',
                cozenIconInfoTooltipLabel   : '=?',
                cozenIconInfoTooltipMaxWidth: '=?'
            },
            templateUrl: 'directives/icons/info/info.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init    : init,
                destroy : destroy,
                hasError: hasError
            };

            var data = {
                directive: 'cozenIconInfo'
            };

            methods.init();

            function init() {

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenIconInfoDisplay) ? scope.cozenIconInfoDisplay = true : null;
                angular.isUndefined(attrs.cozenIconInfoTooltipLabel) ? scope.cozenIconInfoTooltipLabel = '' : null;
                angular.isUndefined(attrs.cozenIconInfoTooltipMaxWidth) ? scope.cozenIconInfoTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attribute)
                scope._cozenIconInfoTooltipType = angular.isDefined(attrs.cozenIconInfoTooltipType) ? attrs.cozenIconInfoTooltipType : 'default';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenIconInfoTooltipLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);


