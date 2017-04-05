/**
 * @ngdoc directive
 * @name cozen-textarea
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {string}   cozenTextareaModel                           > Value edited by the textarea [required]
 * @param {boolean}  cozenTextareaDisabled = false                > Disable the textarea
 * @param {function} cozenTextareaOnChange                        > Callback function called on change
 * @param {string}   cozenTextareaTooltipMaxWidth = max-width-200 > Max width of the tooltip
 *
 * [Attributes params]
 * @param {number}  cozenTextareaId                                           > Id of the textarea
 * @param {string}  cozenTextareaTooltip                                      > Text of the tooltip
 * @param {string}  cozenTextareaTooltipPlacement = auto right                > Change the position of the tooltip [config]
 * @param {string}  cozenTextareaTooltipTrigger   = outsideClick              > Type of trigger to show the tooltip [config]
 * @param {boolean} cozenTextareaRequired         = false                     > Required textarea [config]
 * @param {boolean} cozenTextareaErrorDesign      = true                      > Add style when error [config]
 * @param {boolean} cozenTextareaSuccessDesign    = true                      > Add style when success [config]
 * @param {string}  cozenTextareaSize             = normal                    > Size of the button
 * @param {string}  cozenTextareaSizeSmall                                    > Shortcut for small size
 * @param {string}  cozenTextareaSizeNormal                                   > Shortcut for normal size
 * @param {string}  cozenTextareaSizeLarge                                    > Shortcut for large size
 * @param {string}  cozenTextareaPlaceholder                                  > Text for the placeholder
 * @param {number}  cozenTextareaMinLength        = 0                         > Minimum char length [config]
 * @param {number}  cozenTextareaMaxLength        = 200                       > Maximum char length [config]
 * @param {string}  cozenTextareaName             = uuid                      > Name of the textarea
 * @param {boolean} cozenTextareaValidator        = dirty                     > Define after what type of event the textarea must add more ui color [config]
 * @param {boolean} cozenTextareaValidatorAll                                 > Shortcut for all type
 * @param {boolean} cozenTextareaValidatorTouched                             > Shortcut for touched type
 * @param {boolean} cozenTextareaValidatorDirty                               > Shortcut for dirty type
 * @param {boolean} cozenTextareaValidatorEmpty   = true                      > Display ui color even if textarea empty [config]
 * @param {boolean} cozenTextareaElastic          = true                      > Auto resize the textarea depending of his content [config]
 * @param {number}  cozenTextareaRows             = 2                         > Number of rows [config]
 * @param {string}  cozenTextareaLabel                                        > Add a label on the top of the textarea
 * @param {string}  cozenTextareaRequiredTooltip  = textarea_required_tooltip > Text to display for the tooltip of the required element
 * @param {string}  cozenTextareaClass                                        > Custom class
 * @param {string}  cozenTextareaTooltipType      = default                   > Type of the tooltip
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.textarea', [])
        .directive('cozenTextarea', cozenTextarea);

    cozenTextarea.$inject = [
        'Themes',
        'CONFIG',
        'rfc4122',
        '$interval',
        '$filter',
        '$rootScope'
    ];

    function cozenTextarea(Themes, CONFIG, rfc4122, $interval, $filter, $rootScope) {
        return {
            link            : link,
            restrict        : 'E',
            replace         : false,
            transclude      : false,
            scope           : {
                cozenTextareaModel          : '=?',
                cozenTextareaDisabled       : '=?',
                cozenTextareaOnChange       : '&',
                cozenTextareaTooltipMaxWidth: '=?'
            },
            templateUrl     : 'directives/textarea/textarea.template.html',
            bindToController: true,
            controller      : cozenTextareaCtrl,
            controllerAs    : 'vm'
        };

        function link(scope, element, attrs) {
            var methods = {
                init             : init,
                hasError         : hasError,
                destroy          : destroy,
                getMainClass     : getMainClass,
                onChange         : onChange,
                getDesignClass   : getDesignClass,
                getForm          : getForm,
                updateModelLength: updateModelLength
            };

            var data = {
                directive: 'cozenTextarea',
                uuid     : rfc4122.v4()
            };

            methods.init();

            function init() {

                // Show only when the textarea know his parent (all the stuff is prepared)
                scope.cozenTextareaHasParentKnowledge = false;

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onChange    : onChange
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenTextareaSize)) {
                    if (angular.isDefined(attrs.cozenTextareaSizeSmall)) {
                        scope._cozenTextareaSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaSizeNormal)) {
                        scope._cozenTextareaSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaSizeLarge)) {
                        scope._cozenTextareaSize = 'large';
                    }
                    else {
                        scope._cozenTextareaSize = 'normal';
                    }
                }
                else {
                    scope._cozenTextareaSize = attrs.cozenTextareaSize;
                }

                // Shortcut values (validator)
                if (angular.isUndefined(attrs.cozenTextareaValidator)) {
                    if (angular.isDefined(attrs.cozenTextareaValidatorAll)) {
                        scope._cozenTextareaValidator = 'all';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaValidatorTouched)) {
                        scope._cozenTextareaValidator = 'touched';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaValidatorDirty)) {
                        scope._cozenTextareaValidator = 'dirty';
                    }
                    else {
                        scope._cozenTextareaValidator = CONFIG.textarea.validator.type;
                    }
                }
                else {
                    scope._cozenTextareaValidator = attrs.cozenTextareaValidator;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenTextareaDisabled) ? scope.vm.cozenTextareaDisabled = false : null;
                angular.isUndefined(attrs.cozenTextareaTooltipMaxWidth) ? scope.vm.cozenTextareaTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attributes)
                scope._cozenTextareaId                 = angular.isDefined(attrs.cozenTextareaId) ? attrs.cozenTextareaId : '';
                scope._cozenTextareaTooltip            = angular.isDefined(attrs.cozenTextareaTooltip) ? attrs.cozenTextareaTooltip : '';
                scope._cozenTextareaTooltipTrigger     = angular.isDefined(attrs.cozenTextareaTooltipTrigger) ? attrs.cozenTextareaTooltipTrigger : CONFIG.textarea.tooltip.trigger;
                scope._cozenTextareaRequired           = angular.isDefined(attrs.cozenTextareaRequired) ? JSON.parse(attrs.cozenTextareaRequired) : CONFIG.textarea.required;
                scope._cozenTextareaErrorDesign        = angular.isDefined(attrs.cozenTextareaErrorDesign) ? JSON.parse(attrs.cozenTextareaErrorDesign) : CONFIG.textarea.errorDesign;
                scope._cozenTextareaSuccessDesign      = angular.isDefined(attrs.cozenTextareaSuccessDesign) ? JSON.parse(attrs.cozenTextareaSuccessDesign) : CONFIG.textarea.successDesign;
                scope._cozenTextareaPlaceholder        = angular.isDefined(attrs.cozenTextareaPlaceholder) ? attrs.cozenTextareaPlaceholder : '';
                scope._cozenTextareaMinLength          = angular.isDefined(attrs.cozenTextareaMinLength) ? attrs.cozenTextareaMinLength : CONFIG.textarea.minLength;
                scope._cozenTextareaMaxLength          = angular.isDefined(attrs.cozenTextareaMaxLength) ? attrs.cozenTextareaMaxLength : CONFIG.textarea.maxLength;
                scope._cozenTextareaName               = angular.isDefined(attrs.cozenTextareaName) ? attrs.cozenTextareaName : data.uuid;
                scope._cozenTextareaValidatorEmpty     = angular.isDefined(attrs.cozenTextareaValidatorEmpty) ? JSON.parse(attrs.cozenTextareaValidatorEmpty) : CONFIG.textarea.validator.empty;
                scope._cozenTextareaValidatorIcon      = angular.isDefined(attrs.cozenTextareaValidatorIcon) ? JSON.parse(attrs.cozenTextareaValidatorIcon) : true;
                scope._cozenTextareaTooltipPlacement   = angular.isDefined(attrs.cozenTextareaTooltipPlacement) ? attrs.cozenTextareaTooltipPlacement : CONFIG.textarea.tooltip.placement;
                scope._cozenTextareaElastic            = angular.isDefined(attrs.cozenTextareaElastic) ? JSON.parse(attrs.cozenTextareaElastic) : CONFIG.textarea.elastic;
                scope._cozenTextareaRows               = angular.isDefined(attrs.cozenTextareaRows) ? JSON.parse(attrs.cozenTextareaRows) : CONFIG.textarea.rows;
                scope._cozenTextareaLabel              = angular.isDefined(attrs.cozenTextareaLabel) ? attrs.cozenTextareaLabel : '';
                scope._cozenTextareaUuid               = data.uuid;
                scope._cozenTextareaDisplayModelLength = CONFIG.textarea.displayModelLength;
                scope._cozenTextareaModelLength        = scope._cozenTextareaMaxLength;
                scope._cozenTextareaRequiredConfig     = CONFIG.required;
                scope._cozenTextareaRequiredTooltip    = angular.isDefined(attrs.cozenTextareaRequiredTooltip) ? attrs.cozenTextareaRequiredTooltip : 'textarea_required_tooltip';
                scope._cozenTextareaTooltipType        = angular.isDefined(attrs.cozenTextareaTooltipType) ? attrs.cozenTextareaTooltipType : 'default';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // When the form is ready, get the required intels
                scope.$on('cozenFormName', function (event, eventData) {
                    scope._cozenTextareaForm      = eventData.name;
                    scope._cozenTextareaFormCtrl  = eventData.ctrl;
                    scope._cozenTextareaFormModel = eventData.model;
                    scope.cozenTextareaHasParentKnowledge = true;

                    // Force to dirty and touched if the model is not empty
                    // The interval is required because the digest is random so a timeout wasn't enough
                    var intervalCount = 0;
                    var interval      = $interval(function () {
                        var form = methods.getForm();
                        try {
                            var textarea = form[scope._cozenTextareaFormCtrl][scope._cozenTextareaFormModel][scope._cozenTextareaForm];
                            if (!Methods.isNullOrEmpty(textarea)) {
                                textarea = textarea[scope._cozenTextareaName];
                                if (!Methods.isNullOrEmpty(textarea)) {
                                    if (!Methods.isNullOrEmpty(scope.vm.cozenTextareaModel)) {
                                        textarea.$setDirty();
                                        textarea.$setTouched();
                                    }
                                    $interval.cancel(interval);
                                }
                            }
                        } finally {
                            methods.updateModelLength();
                            intervalCount++;
                            if (intervalCount > 10) {
                                $interval.cancel(interval);
                            }
                        }
                    }, 10);
                });

                // Ask the parent to launch the cozenFormName event to get the data
                // -> Avoid problems when elements are added to the DOM after the form loading
                $rootScope.$broadcast('cozenFormChildInit');
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenTextareaModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                if (!Methods.isNullOrEmpty(scope._cozenTextareaForm)) {
                    var classList = [
                        scope._activeTheme,
                        scope._cozenTextareaSize,
                        attrs.cozenTextareaClass
                    ];
                    var textarea  = methods.getForm();
                    textarea      = textarea[scope._cozenTextareaFormCtrl][scope._cozenTextareaFormModel][scope._cozenTextareaForm][scope._cozenTextareaName];
                    if (!Methods.isNullOrEmpty(textarea)) {
                        if (scope._cozenTextareaValidatorEmpty || (!scope._cozenTextareaValidatorEmpty && !Methods.isNullOrEmpty(scope.vm.cozenTextareaModel))) {
                            switch (scope._cozenTextareaValidator) {
                                case 'touched':
                                    if (textarea.$touched) {
                                        classList.push(methods.getDesignClass(textarea));
                                    }
                                    break;
                                case 'dirty':
                                    if (textarea.$dirty) {
                                        classList.push(methods.getDesignClass(textarea));
                                    }
                                    break;
                                case 'all':
                                    classList.push(methods.getDesignClass(textarea));
                                    break;
                            }
                        }
                    }
                    if (scope.vm.cozenTextareaDisabled) {
                        classList.push('disabled');
                    }
                    return classList;
                }
            }

            function onChange($event) {
                if (scope.vm.cozenTextareaDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenTextareaOnChange)) {
                    scope.cozenTextareaOnChange();
                }
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
                methods.updateModelLength();
            }

            function getDesignClass(textarea) {
                if (scope._cozenTextareaErrorDesign) {
                    if (textarea.$invalid) {
                        scope._cozenTextareaHasFeedback = 'error';
                        return 'error-design';
                    }
                }
                if (scope._cozenTextareaSuccessDesign) {
                    if (textarea.$valid) {
                        scope._cozenTextareaHasFeedback = 'success';
                        return 'success-design';
                    }
                }
                scope._cozenTextareaHasFeedback = false;
                return '';
            }

            function getForm() {
                var form = scope.$parent.$parent;
                if (!Methods.hasOwnProperty(form, '_cozenFormName')) {
                    form = scope.$parent.$parent.$parent;
                    if (!Methods.hasOwnProperty(form, '_cozenFormName')) {
                        form = scope.$parent.$parent.$parent.$parent;
                        if (!Methods.hasOwnProperty(form, '_cozenFormName')) {
                            form = scope.$parent.$parent.$parent.$parent.$parent;
                            if (!Methods.hasOwnProperty(form, '_cozenFormName')) {
                                form = scope.$parent.$parent.$parent.$parent.$parent.$parent;
                                if (!Methods.hasOwnProperty(form, '_cozenFormName')) {
                                    return form;
                                }
                                else {
                                    return form;
                                }
                            }
                            else {
                                return form;
                            }
                        }
                        else {
                            return form;
                        }
                    }
                    else {
                        return form;
                    }
                }
                else {
                    return form;
                }
            }

            function updateModelLength() {
                if (Methods.isNullOrEmpty(scope.vm.cozenTextareaModel)) {
                    scope._cozenTextareaModelLength = scope._cozenTextareaMaxLength
                }
                else {
                    scope._cozenTextareaModelLength = scope._cozenTextareaMaxLength - scope.vm.cozenTextareaModel.length;
                }
            }
        }
    }

    cozenTextareaCtrl.$inject = [];

    function cozenTextareaCtrl() {
        var vm = this;
    }

})(window.angular);


