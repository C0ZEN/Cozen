/**
 * @ngdoc directive
 * @name cozen-on-blur
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {function} cozenOnBlurCallback         > Callback function called on focus
 * @param {boolean}  cozenOnBlurDisabled = false > Disable/enable the listener
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .directive('cozenOnBlur', cozenOnBlur);

    cozenOnBlur.$inject = [
        '$parse'
    ];

    function cozenOnBlur($parse) {
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
                directive: 'cozenOnBlur'
            };

            methods.init();

            function init() {

                // To avoid using a new isolated scope, parse the attributes
                data.callback = $parse(attrs.cozenOnBlurCallback);
                data.disabled = $parse(attrs.cozenOnBlurDisabled);

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenOnBlurDisabled)) data.disabled = false;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Start listening if not disabled
                if (!data.disabled) methods.startListening();

                // Start/stop listening when disabled change
                scope.$watch('cozenOnBlurDisabled', function (newValue, oldValue) {
                    if (newValue) methods.stopListening();
                    else methods.startListening();
                });
            }

            function hasError() {
                if (!Methods.isFunction(data.callback)) {
                    Methods.directiveErrorFunction(data.directive, 'cozenOnBlurCallback');
                    return true;
                }
                return false;
            }

            function destroy() {
                methods.stopListening();
                element.off('$destroy', methods.destroy);
            }

            function startListening() {
                element[0].addEventListener('blur', data.callback);
            }

            function stopListening() {
                element[0].removeEventListener('blur', data.callback);
            }
        }
    }

})(window.angular);

