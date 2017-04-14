/**
 * @ngdoc directive
 * @name cozen-form
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number} cozenFormId    = uuid > Id of the form
 * @param {string} cozenFormName         > Name of the form [required]
 * @param {string} cozenFormCtrl         > Name of the controller [required]
 * @param {string} cozenFormModel        > Name of the model [required]
 * @param {string} cozenFormClass        > Add custom class
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.form', [])
        .directive('cozenForm', cozenForm);

    cozenForm.$inject = [
        '$rootScope',
        'cozenEnhancedLogs',
        'rfc4122'
    ];

    function cozenForm($rootScope, cozenEnhancedLogs, rfc4122) {
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
                dispatchName: dispatchName,
                getMainClass: getMainClass
            };

            var data       = {
                directive: 'cozenForm',
                uuid     : rfc4122.v4()
            };
            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    dispatchName: dispatchName,
                    getMainClass: getMainClass
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (attributes)
                scope._cozenFormId    = angular.isDefined(attrs.cozenFormId) ? attrs.cozenFormId : data.uuid;
                scope._cozenFormName  = attrs.cozenFormName;
                scope._cozenFormModel = attrs.cozenFormModel;
                scope._cozenFormCtrl  = attrs.cozenFormCtrl;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Give to the child the require stuff
                // Occur when a child ask for it
                $rootScope.$on('cozenFormChildInit', methods.dispatchName);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenFormName)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Name');
                    return true;
                }
                if (Methods.isNullOrEmpty(attrs.cozenFormCtrl)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Ctrl');
                    return true;
                }
                if (Methods.isNullOrEmpty(attrs.cozenFormModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function dispatchName() {
                scope.$broadcast('cozenFormName', {
                    name : scope._cozenFormName,
                    ctrl : scope._cozenFormCtrl,
                    model: scope._cozenFormModel
                });
            }

            function getMainClass() {
                var classList = [attrs.cozenFormClass];
                return classList;
            }
        }
    }

})(window.angular);


