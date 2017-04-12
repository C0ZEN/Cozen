/**
 * @ngdoc directive
 * @name cozen-btn-lazy-test
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnLazyTestOnClick > Callback function called on click
 *
 * [Attributes params]
 * @param {string} cozenBtnLazyTestId    = uuid      > Id of the button
 * @param {string} cozenBtnLazyTestLabel = Lazy test > Label on the button
 * @param {string} cozenBtnLazyTestTop               > Override the position on the top
 * @param {string} cozenBtnLazyTestLeft              > Override the position on the left
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btnLazyTest', [])
        .directive('cozenBtnLazyTest', cozenBtnLazyTest);

    cozenBtnLazyTest.$inject = [
        'Themes',
        'CONFIG',
        'cozenEnhancedLogs',
        'rfc4122'
    ];

    function cozenBtnLazyTest(Themes, CONFIG, cozenEnhancedLogs, rfc4122) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnLazyTestOnClick: '&'
            },
            templateUrl: 'directives/btn-lazy-test/btnLazyTest.template.html'
        };

        function link(scope, element, attrs) {

            // Methods declaration
            var methods = {
                init        : init,
                destroy     : destroy,
                getMainClass: getMainClass,
                getMainStyle: getMainStyle,
                onClick     : onClick
            };

            // Internal data
            var data = {
                directive: 'cozenBtnLazyTest',
                uuid     : rfc4122.v4()
            };

            // Do stuff on creation
            methods.init();

            function init() {
                if (CONFIG.dev) {
                    scope._isReady = false;

                    // Public methods
                    scope._methods = {
                        getMainClass: getMainClass,
                        getMainStyle: getMainStyle,
                        onClick     : onClick
                    };

                    // Default values (attributes)
                    scope._cozenBtnLazyTestId    = angular.isDefined(attrs.cozenBtnLazyTestId) ? attrs.cozenBtnLazyTestId : data.uuid;
                    scope._cozenBtnLazyTestLabel = angular.isDefined(attrs.cozenBtnLazyTestLabel) ? attrs.cozenBtnLazyTestLabel : 'Lazy test';

                    // Init stuff
                    element.on('$destroy', methods.destroy);
                    scope._activeTheme               = Themes.getActiveTheme();
                    scope._cozenBtnLazyTestIconClass = CONFIG.btnLazyTest.icon.class;

                    // Display the template
                    scope._isReady = true;
                }
                else {
                    methods.destroy();
                }
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
                scope.$destroy();
                element.remove();
            }

            function getMainClass() {
                var classList = [
                    scope._activeTheme
                ];
                return classList;
            }

            function getMainStyle() {
                var styleList = [];
                if (angular.isDefined(attrs.cozenBtnLazyTestTop)) {
                    styleList.push({
                        top: attrs.cozenBtnLazyTestTop
                    });
                }
                if (angular.isDefined(attrs.cozenBtnLazyTestLeft)) {
                    styleList.push({
                        left: attrs.cozenBtnLazyTestLeft
                    });
                }
                return styleList;
            }

            function onClick($event) {
                $event.stopPropagation();
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClick');
                if (Methods.isFunction(scope.cozenBtnLazyTestOnClick)) {
                    scope.cozenBtnLazyTestOnClick();
                }
            }
        }
    }

})(window.angular);

