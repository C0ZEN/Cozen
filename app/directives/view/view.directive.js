/**
 * @ngdoc directive
 * @name cozen-view
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number} cozenViewScrollBarHeight > When using default config, define the height of the body
 *
 */
(function (angular, window) {
    'use strict';

    angular
        .module('cozenLib.view', [])
        .directive('cozenView', cozenView);

    cozenView.$inject = [
        'CONFIG'
    ];

    function cozenView(CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            templateUrl: 'directives/view/view.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init    : init,
                hasError: hasError,
                destroy : destroy
            };

            var data = {
                directive: 'cozenView'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (attributes)
                scope._cozenScrollBar       = CONFIG.scrollsBar;
                scope._cozenScrollBarConfig = CONFIG.scrollsBarConfig;

                // Scrollbar config for the height
                scope._cozenScrollBarConfig.setHeight = angular.isDefined(attrs.cozenViewScrollBarHeight) ? parseInt(attrs.cozenViewScrollBarHeight) : window.innerHeight;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (angular.isUndefined(attrs.cozenViewScrollBarHeight)) {
                    Methods.directiveErrorRequired(data.directive, 'cozenViewScrollBarHeight');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular, window);

