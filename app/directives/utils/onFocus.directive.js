/**
 * @ngdoc directive
 * @name cozen-on-focus
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {function} cozenOnFocusCallback         > Callback function called on focus
 * @param {boolean}  cozenOnFocusDisabled = false > Disable/enable the listener
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .directive('cozenOnFocus', cozenOnFocus);

    cozenOnFocus.$inject = [
        '$parse'
    ];

    function cozenOnFocus($parse) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            var methods = {
                init          : init,
                hasError      : hasError,
                destroy       : destroy,
                startListening: startListening,
                stopListening : stopListening
            };

            var data = {
                directive: 'cozenOnFocus'
            };

            methods.init();

            function init() {

                // To avoid using a new isolated scope, parse the attributes
                data.callback = $parse(attrs.cozenOnFocusCallback);
                data.disabled = $parse(attrs.cozenOnFocusDisabled);

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenOnFocusDisabled)) data.disabled = false;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Start listening if not disabled
                if (!data.disabled) methods.startListening();

                // Start/stop listening when disabled change
                scope.$watch('cozenOnFocusDisabled', function (newValue, oldValue) {
                    if (newValue) methods.stopListening();
                    else methods.startListening();
                });
            }

            function hasError() {
                if (!Methods.isFunction(data.callback)) {
                    Methods.directiveErrorFunction(data.directive, 'cozenOnFocusCallback');
                    return true;
                }
                return false;
            }

            function destroy() {
                methods.stopListening();
                element.off('$destroy', methods.destroy);
            }

            function startListening() {
                element[0].addEventListener('focus', data.callback);
            }

            function stopListening() {
                element[0].removeEventListener('focus', data.callback);
            }
        }
    }

})(window.angular);

