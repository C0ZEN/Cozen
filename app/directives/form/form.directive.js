/**
 * @ngdoc directive
 * @name cozen-form
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number} cozenFormId   > Id of the form
 * @param {string} cozenFormName > Name of the form [required]
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .directive('cozenForm', cozenForm);

    cozenForm.$inject = [
        '$timeout'
    ];

    function cozenForm($timeout) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            templateUrl: 'directives/form/form.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                dispatchName: dispatchName
            };

            var data = {
                directive: 'cozenForm'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    dispatchName: dispatchName
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (attributes)
                scope._cozenFormId   = angular.isDefined(attrs.cozenFormId) ? attrs.cozenFormId : '';
                scope._cozenFormName = attrs.cozenFormName;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenFormName)) {
                    Methods.directiveErrorRequired(data.directive, 'Name');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function dispatchName() {
                $timeout(function () {
                    scope.$broadcast('cozenFormName', {
                        name: scope._cozenFormName
                    });
                }, 1);
            }
        }
    }

})(window.angular);


