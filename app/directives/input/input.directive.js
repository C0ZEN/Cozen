/**
 * @ngdoc directive
 * @name cozen-input
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {string}   cozenInputModel                      > Value edited by the input [required]
 * @param {boolean}  cozenInputDisabled           = false > Disable the input
 * @param {function} cozenInputOnChange                   > Callback function called on change
 * @param {object}   cozenInputTypePasswordConfig         > Override the default configuration object
 * @param {boolean}  cozenInputHasError                   > Force to have error design
 *
 * [Attributes params]
 * @param {number}  cozenInputId                                          > Id of the input
 * @param {string}  cozenInputTooltip                                     > Text of the tooltip
 * @param {string}  cozenInputTooltipPlacement = 'auto right'             > Change the position of the tooltip
 * @param {string}  cozenInputTooltipTrigger   = 'outsideClick'           > Type of trigger to show the tooltip
 * @param {boolean} cozenInputRequired         = false                    > Required input
 * @param {boolean} cozenInputErrorDesign      = true                     > Add style when error
 * @param {boolean} cozenInputSuccessDesign    = true                     > Add style when success
 * @param {string}  cozenInputPattern                                     > Pattern HTML5 to check for error
 * @param {string}  cozenInputPatternEmail                                > Shortcut for email pattern
 * @param {string}  cozenInputPatternLetter                               > Shortcut for letter pattern
 * @param {string}  cozenInputPatternName                                 > Shortcut for name pattern
 * @param {string}  cozenInputSize             = 'normal'                 > Size of the button
 * @param {string}  cozenInputSizeSmall                                   > Shortcut for small size
 * @param {string}  cozenInputSizeNormal                                  > Shortcut for normal size
 * @param {string}  cozenInputSizeLarge                                   > Shortcut for large size
 * @param {string}  cozenInputPrefix                                      > Add a prefix
 * @param {string}  cozenInputSuffix                                      > Add a suffix
 * @param {string}  cozenInputType             = 'text'                   > Type of the input
 * @param {string}  cozenInputTypeText                                    > Shortcut for text type
 * @param {string}  cozenInputTypeNumber                                  > Shortcut for number type
 * @param {string}  cozenInputTypePassword                                > Shortcut for password type
 * @param {string}  cozenInputPlaceholder                                 > Text for the placeholder
 * @param {number}  cozenInputMin              = 0                        > Minimum length
 * @param {number}  cozenInputMax              = 1000                     > Maximum length
 * @param {number}  cozenInputMinLength        = 0                        > Minimum char length
 * @param {number}  cozenInputMaxLength        = 100                      > Maximum char length
 * @param {string}  cozenInputIconLeft                                    > Text for the icon left (font)
 * @param {string}  cozenInputIconRight                                   > Text for the icon right (font)
 * @param {string}  cozenInputName             = uuid                     > Name of the input
 * @param {boolean} cozenInputValidator        = 'dirty'                  > Define after what type of event the input must add more ui color
 * @param {boolean} cozenInputValidatorAll                                > Shortcut for all type
 * @param {boolean} cozenInputValidatorTouched                            > Shortcut for touched type
 * @param {boolean} cozenInputValidatorDirty                              > Shortcut for dirty type
 * @param {boolean} cozenInputValidatorEmpty   = true                     > Display ui color even if input empty
 * @param {boolean} cozenInputValidatorIcon    = true                     > Add (and change) the icon right if success/error
 * @param {string}  cozenInputAutoComplete     = 'on'                     > Allow auto complete (on/off)
 * @param {string}  cozenInputLabel                                       > Add a label on the top of the input
 * @param {string}  cozenInputRequiredTooltip  = 'input_required_tooltip' > Text to display for the tooltip of the required element
 * @param {string}  cozenInputClass                                       > Additional class
 * @param {string}  cozenInputSpellCheck       = false                    > Disable the spell checking
 *
 * [cozenInputTypePasswordConfig]
 * @param {boolean} lowercase   = true > Check for a lowercase
 * @param {boolean} uppercase   = true > Check for an uppercase
 * @param {boolean} number      = true > Check for a number
 * @param {boolean} specialChar = true > Check for a special char
 * @param {number}  minLength   = 6    > Check for this min length
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.input', [])
        .directive('cozenInput', cozenInput);

    cozenInput.$inject = [
        'Themes',
        'CONFIG',
        'rfc4122',
        '$timeout',
        '$interval',
        '$filter',
        '$rootScope'
    ];

    function cozenInput(Themes, CONFIG, rfc4122, $timeout, $interval, $filter, $rootScope) {
        return {
            link            : link,
            restrict        : 'E',
            replace         : false,
            transclude      : false,
            scope           : {
                cozenInputModel             : '=?',
                cozenInputDisabled          : '=?',
                cozenInputOnChange          : '&',
                cozenInputTypePasswordConfig: '=?',
                cozenInputHasError          : '=?'
            },
            templateUrl     : 'directives/input/input.template.html',
            bindToController: true,
            controller      : cozenInputCtrl,
            controllerAs    : 'vm'
        };

        function link(scope, element, attrs) {
            var methods = {
                init                   : init,
                hasError               : hasError,
                destroy                : destroy,
                getMainClass           : getMainClass,
                onChange               : onChange,
                getDesignClass         : getDesignClass,
                getForm                : getForm,
                getIconRightClass      : getIconRightClass,
                isIconRightDisplay     : isIconRightDisplay,
                getPattern             : getPattern,
                onArrowDown            : onArrowDown,
                onArrowUp              : onArrowUp,
                arrowUpdateModel       : arrowUpdateModel,
                getPasswordTooltipLabel: getPasswordTooltipLabel,
                getPasswordStateClass  : getPasswordStateClass,
                updateModelLength      : updateModelLength
            };

            var data = {
                directive: 'cozenInput',
                uuid     : rfc4122.v4(),
                password : {
                    lowercase  : {
                        regexp  : '[a-z]',
                        complete: false
                    },
                    uppercase  : {
                        regexp  : '[A-Z]',
                        complete: false
                    },
                    number     : {
                        regexp  : '[0-9]',
                        complete: false
                    },
                    specialChar: {
                        regexp  : '[\\@\\+\\-\\_\\#\\!\\?\\*\\%]',
                        complete: false
                    },
                    minLength  : {
                        complete: false
                    }
                }
            };

            methods.init();

            function init() {

                // Show only when the input know his parent (all the stuff is prepared)
                scope.cozenInputHasParentKnowledge = false;

                // Public functions
                scope._methods = {
                    getMainClass         : getMainClass,
                    onChange             : onChange,
                    getIconRightClass    : getIconRightClass,
                    isIconRightDisplay   : isIconRightDisplay,
                    onArrowDown          : onArrowDown,
                    onArrowUp            : onArrowUp,
                    getPasswordStateClass: getPasswordStateClass
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (pattern)
                if (angular.isUndefined(attrs.cozenInputPattern)) {
                    if (angular.isDefined(attrs.cozenInputPatternEmail)) {
                        scope._cozenInputPattern = 'email';
                    }
                    else if (angular.isDefined(attrs.cozenInputPatternLetter)) {
                        scope._cozenInputPattern = 'letter';
                    }
                    else if (angular.isDefined(attrs.cozenInputPatternName)) {
                        scope._cozenInputPattern = 'name';
                    }
                    else {
                        scope._cozenInputPattern = '';
                    }
                }
                else {
                    scope._cozenInputPattern = attrs.cozenInputPattern;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenInputSize)) {
                    if (angular.isDefined(attrs.cozenInputSizeSmall)) {
                        scope._cozenInputSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenInputSizeNormal)) {
                        scope._cozenInputSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenInputSizeLarge)) {
                        scope._cozenInputSize = 'large';
                    }
                    else {
                        scope._cozenInputSize = 'normal';
                    }
                }
                else {
                    scope._cozenInputSize = attrs.cozenInputSize;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenInputType)) {
                    if (angular.isDefined(attrs.cozenInputTypeText)) {
                        scope._cozenInputType = 'text';
                    }
                    else if (angular.isDefined(attrs.cozenInputTypeNumber)) {
                        scope._cozenInputType = 'number';
                    }
                    else if (angular.isDefined(attrs.cozenInputTypePassword)) {
                        scope._cozenInputType = 'password';
                    }
                    else {
                        scope._cozenInputType = 'text';
                    }
                }
                else {
                    scope._cozenInputType = attrs.cozenInputType;
                }

                // Shortcut values (validator)
                if (angular.isUndefined(attrs.cozenInputValidator)) {
                    if (angular.isDefined(attrs.cozenInputValidatorAll)) {
                        scope._cozenInputValidator = 'all';
                    }
                    else if (angular.isDefined(attrs.cozenInputValidatorTouched)) {
                        scope._cozenInputValidator = 'touched';
                    }
                    else if (angular.isDefined(attrs.cozenInputValidatorDirty)) {
                        scope._cozenInputValidator = 'dirty';
                    }
                    else {
                        scope._cozenInputValidator = 'dirty';
                    }
                }
                else {
                    scope._cozenInputValidator = attrs.cozenInputValidator;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenInputDisabled)) {
                    scope.vm.cozenInputDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenInputHasError)) {
                    scope.vm.cozenInputHasError = false;
                }

                // Default values (attributes)
                scope._cozenInputId                 = angular.isDefined(attrs.cozenInputId) ? attrs.cozenInputId : '';
                scope._cozenInputTooltip            = angular.isDefined(attrs.cozenInputTooltip) ? attrs.cozenInputTooltip : '';
                scope._cozenInputTooltipTrigger     = angular.isDefined(attrs.cozenInputTooltipTrigger) ? attrs.cozenInputTooltipTrigger : 'outsideClick';
                scope._cozenInputRequired           = angular.isDefined(attrs.cozenInputRequired) ? JSON.parse(attrs.cozenInputRequired) : false;
                scope._cozenInputErrorDesign        = angular.isDefined(attrs.cozenInputErrorDesign) ? JSON.parse(attrs.cozenInputErrorDesign) : true;
                scope._cozenInputSuccessDesign      = angular.isDefined(attrs.cozenInputSuccessDesign) ? JSON.parse(attrs.cozenInputSuccessDesign) : true;
                scope._cozenInputPrefix             = angular.isDefined(attrs.cozenInputPrefix) ? attrs.cozenInputPrefix : '';
                scope._cozenInputSuffix             = angular.isDefined(attrs.cozenInputSuffix) ? attrs.cozenInputSuffix : '';
                scope._cozenInputPlaceholder        = angular.isDefined(attrs.cozenInputPlaceholder) ? attrs.cozenInputPlaceholder : '';
                scope._cozenInputMin                = angular.isDefined(attrs.cozenInputMin) ? JSON.parse(attrs.cozenInputMin) : 0;
                scope._cozenInputMax                = angular.isDefined(attrs.cozenInputMax) ? JSON.parse(attrs.cozenInputMax) : 1000;
                scope._cozenInputMinLength          = angular.isDefined(attrs.cozenInputMinLength) ? JSON.parse(attrs.cozenInputMinLength) : 0;
                scope._cozenInputMaxLength          = angular.isDefined(attrs.cozenInputMaxLength) ? JSON.parse(attrs.cozenInputMaxLength) : 100;
                scope._cozenInputIconLeft           = angular.isDefined(attrs.cozenInputIconLeft) ? attrs.cozenInputIconLeft : '';
                scope._cozenInputIconRight          = angular.isDefined(attrs.cozenInputIconRight) ? attrs.cozenInputIconRight : '';
                scope._cozenInputName               = angular.isDefined(attrs.cozenInputName) ? attrs.cozenInputName : data.uuid;
                scope._cozenInputValidatorEmpty     = angular.isDefined(attrs.cozenInputValidatorEmpty) ? JSON.parse(attrs.cozenInputValidatorEmpty) : true;
                scope._cozenInputValidatorIcon      = angular.isDefined(attrs.cozenInputValidatorIcon) ? JSON.parse(attrs.cozenInputValidatorIcon) : true;
                scope._cozenInputTooltipType        = scope._cozenInputType == 'password' ? 'html' : 'default';
                scope._cozenInputAutoComplete       = angular.isDefined(attrs.cozenInputAutoComplete) ? attrs.cozenInputAutoComplete : 'on';
                scope._cozenInputTooltipPlacement   = angular.isDefined(attrs.cozenInputTooltipPlacement) ? attrs.cozenInputTooltipPlacement : 'auto right';
                scope._cozenInputLabel              = angular.isDefined(attrs.cozenInputLabel) ? attrs.cozenInputLabel : '';
                scope._cozenInputUuid               = data.uuid;
                scope._cozenInputDisplayModelLength = CONFIG.input.displayModelLength;
                scope._cozenInputModelLength        = scope._cozenInputMaxLength;
                scope._cozenInputRequiredConfig     = CONFIG.required;
                scope._cozenInputRequiredTooltip    = angular.isDefined(attrs.cozenInputRequiredTooltip) ? attrs.cozenInputRequiredTooltip : 'input_required_tooltip';
                scope._cozenInputSpellCheck         = angular.isDefined(attrs.cozenInputSpellCheck) ? JSON.parse(attrs.cozenInputSpellCheck) : false;

                // Object overriding (typePasswordConfig)
                if (scope._cozenInputType == 'password') {
                    var passWordConfig                    = {
                        lowercase  : true,
                        uppercase  : true,
                        number     : true,
                        specialChar: true,
                        minLength  : 6
                    };
                    scope.vm.cozenInputTypePasswordConfig = angular.merge({}, passWordConfig, scope.vm.cozenInputTypePasswordConfig);
                    scope._cozenInputPattern              = 'password';
                    methods.getPasswordTooltipLabel();
                }

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Override the default model
                scope.vm.cozenInputModel = angular.copy(scope._cozenInputPrefix + (Methods.isNullOrEmpty(scope.vm.cozenInputModel) ? '' : scope.vm.cozenInputModel) + scope._cozenInputSuffix);

                // When the form is ready, get the required intels
                scope.$on('cozenFormName', function (event, eventData) {
                    scope._cozenInputForm              = eventData.name;
                    scope._cozenInputFormCtrl          = eventData.ctrl;
                    scope._cozenInputFormModel         = eventData.model;
                    scope.cozenInputHasParentKnowledge = true;

                    // Force to dirty and touched if the model is not empty
                    // The interval is required because the digest is random so a timeout wasn't enough
                    var intervalCount = 0;
                    var interval      = $interval(function () {
                        var input = methods.getForm();
                        try {
                            input = input[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm];
                            if (!Methods.isNullOrEmpty(input)) {
                                input = input[scope._cozenInputName];
                                if (!Methods.isNullOrEmpty(input)) {
                                    if (!Methods.isNullOrEmpty(scope.vm.cozenInputModel)) {
                                        input.$dirty   = true;
                                        input.$touched = true;
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
                scope._cozenInputPatternRegExp = methods.getPattern();

                // Watch for the forced error change
                scope.$watch('vm.cozenInputHasError', function (newValue) {
                    var form = methods.getForm();
                    if (!Methods.isNullOrEmpty(form[scope._cozenInputFormCtrl])) {
                        var input = form[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm][scope._cozenInputName];
                        if (!Methods.isNullOrEmpty(input)) {
                            input.$setValidity('hasError', !newValue);
                        }
                    }
                }, true);

                // Ask the parent to launch the cozenFormName event to get the data
                // -> Avoid problems when elements are added to the DOM after the form loading
                $rootScope.$broadcast('cozenFormChildInit');
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenInputModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                if (!Methods.isNullOrEmpty(scope._cozenInputForm)) {
                    var classList = [
                        scope._activeTheme,
                        scope._cozenInputSize,
                        attrs.cozenInputClass
                    ];
                    var input     = methods.getForm();
                    input         = input[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm][scope._cozenInputName];
                    if (!Methods.isNullOrEmpty(input)) {
                        if (scope._cozenInputValidatorEmpty || (!scope._cozenInputValidatorEmpty && !Methods.isNullOrEmpty(scope.vm.cozenInputModel))) {
                            switch (scope._cozenInputValidator) {
                                case 'touched':
                                    if (input.$touched) {
                                        classList.push(methods.getDesignClass(input));
                                    }
                                    break;
                                case 'dirty':
                                    if (input.$dirty) {
                                        classList.push(methods.getDesignClass(input));
                                    }
                                    break;
                                case 'all':
                                    classList.push(methods.getDesignClass(input));
                                    break;
                            }
                        }
                    }
                    if (scope.vm.cozenInputDisabled) {
                        classList.push('disabled');
                    }
                    if (scope._cozenInputIconLeft) {
                        classList.push('icon-left');
                    }
                    if (methods.isIconRightDisplay()) {
                        classList.push('icon-right');
                    }
                    if (scope._cozenInputType == 'password') {
                        classList.push('password');
                    }
                    if (scope._cozenInputType == 'number') {
                        classList.push('number');
                    }
                    return classList;
                }
            }

            function onChange($event) {
                if (scope.vm.cozenInputDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.vm.cozenInputOnChange)) {
                    scope.vm.cozenInputOnChange({
                        newModel: scope.vm.cozenInputModel
                    });
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onChange');
                }
                methods.getPasswordTooltipLabel();
                methods.updateModelLength();

                // Force the error
                if (scope.cozenInputHasError) {
                    methods.getForm()[scope._cozenInputName].$valid   = false;
                    methods.getForm()[scope._cozenInputName].$invalid = true;
                }
            }

            function getDesignClass(input) {
                if (scope._cozenInputErrorDesign) {
                    if (scope.vm.cozenInputHasError) {
                        scope._cozenInputHasFeedback = 'error';
                        return 'error-design';
                    }
                    else if (input.$invalid) {
                        scope._cozenInputHasFeedback = 'error';
                        return 'error-design';
                    }
                }
                if (scope._cozenInputSuccessDesign) {
                    if (input.$valid) {
                        scope._cozenInputHasFeedback = 'success';
                        return 'success-design';
                    }
                }
                scope._cozenInputHasFeedback = false;
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

            function getIconRightClass() {
                switch (scope._cozenInputHasFeedback) {
                    case 'error':
                        return 'fa fa-times';
                    case 'success':
                        return 'fa fa-check';
                    default:
                        return scope._cozenInputIconRight;
                }
            }

            function isIconRightDisplay() {
                if (!Methods.isNullOrEmpty(scope._cozenInputIconRight)) {
                    return true;
                }
                else if (scope._cozenInputValidatorIcon && scope._cozenInputHasFeedback) {
                    return !(!scope._cozenInputValidatorEmpty && Methods.isNullOrEmpty(scope.vm.cozenInputModel));
                }
                return false;
            }

            function getPattern() {
                switch (scope._cozenInputPattern) {
                    case 'email':
                        // Note: Double backslash because one is deleted during injection in the DOM
                        return '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
                    case 'letter':
                        return '[a-zA-Z]*';
                    case 'name':
                        return '[a-zA-Z\'-\\s]*';
                    case 'password':
                        var pattern = '';
                        if (scope.vm.cozenInputTypePasswordConfig.lowercase) {
                            pattern += '(?=.*' + data.password.lowercase.regexp + ')';
                        }
                        if (scope.vm.cozenInputTypePasswordConfig.uppercase) {
                            pattern += '(?=.*' + data.password.uppercase.regexp + ')';
                        }
                        if (scope.vm.cozenInputTypePasswordConfig.number) {
                            pattern += '(?=.*' + data.password.number.regexp + ')';
                        }
                        if (scope.vm.cozenInputTypePasswordConfig.specialChar) {
                            pattern += '(?=.*' + data.password.specialChar.regexp + ')';
                        }
                        pattern += '.{' + scope.vm.cozenInputTypePasswordConfig.minLength + ',}';
                        return pattern;
                    default:
                        return scope._cozenInputPattern;
                }
            }

            function onArrowDown($event, arrow) {
                if (scope.vm.cozenInputDisabled) {
                    return;
                }
                data.arrowDown = true;
                if (typeof scope.vm.cozenInputModel != 'number') {
                    scope.vm.cozenInputModel = scope._cozenInputMin;
                    methods.onChange($event);
                }
                methods.arrowUpdateModel($event, arrow);

                // Over the time
                data.arrowTimeout = $timeout(function () {
                    data.arrowInterval = $interval(function () {
                        if (data.arrowDown) {
                            methods.arrowUpdateModel($event, arrow);
                        }
                        else {
                            $interval.cancel(data.arrowInterval);
                        }
                    }, 60);
                }, 300);
            }

            function arrowUpdateModel($event, arrow) {
                if (arrow == 'up') {
                    if (scope.vm.cozenInputModel < scope._cozenInputMax) {
                        scope.vm.cozenInputModel += 1;
                        methods.onChange($event);
                    }
                }
                else {
                    if (scope.vm.cozenInputModel > scope._cozenInputMin) {
                        scope.vm.cozenInputModel -= 1;
                        methods.onChange($event);
                    }
                }
            }

            function onArrowUp($event) {
                if (scope.vm.cozenInputDisabled) {
                    return;
                }
                $timeout.cancel(data.arrowTimeout);
                data.arrowDown   = false;
                var form         = methods.getForm();
                var input        = form[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm][scope._cozenInputName];
                input.$touched   = true;
                input.$untouched = false;
                input.$dirty     = true;
            }

            function getPasswordTooltipLabel() {
                if (scope._cozenInputType != 'password') {
                    return;
                }

                // Test the regexp
                data.password.lowercase.complete   = Methods.isRegExpValid(data.password.lowercase.regexp, scope.vm.cozenInputModel);
                data.password.uppercase.complete   = Methods.isRegExpValid(data.password.uppercase.regexp, scope.vm.cozenInputModel);
                data.password.number.complete      = Methods.isRegExpValid(data.password.number.regexp, scope.vm.cozenInputModel);
                data.password.specialChar.complete = Methods.isRegExpValid(data.password.specialChar.regexp, scope.vm.cozenInputModel);
                if (!Methods.isNullOrEmpty(scope.vm.cozenInputModel)) {
                    data.password.minLength.complete = scope.vm.cozenInputModel.length >= scope.vm.cozenInputTypePasswordConfig.minLength;
                }
                else {
                    data.password.minLength.complete = false;
                }

                // Create the tooltip
                scope._cozenInputTooltip = '<ul class="cozen-input-password-tooltip ' + scope._activeTheme + '">';
                scope._cozenInputTooltip += data.password.minLength.complete ? '<li class="complete">' : '<li>';
                scope._cozenInputTooltip += $filter('translate')('input_password_min_length', {length: scope.vm.cozenInputTypePasswordConfig.minLength}) + '</li>';
                if (scope.vm.cozenInputTypePasswordConfig.lowercase) {
                    scope._cozenInputTooltip += data.password.lowercase.complete ? '<li class="complete">' : '<li>';
                    scope._cozenInputTooltip += $filter('translate')('input_password_lowercase') + '</li>';
                }
                if (scope.vm.cozenInputTypePasswordConfig.uppercase) {
                    scope._cozenInputTooltip += data.password.uppercase.complete ? '<li class="complete">' : '<li>';
                    scope._cozenInputTooltip += $filter('translate')('input_password_uppercase') + '</li>';
                }
                if (scope.vm.cozenInputTypePasswordConfig.number) {
                    scope._cozenInputTooltip += data.password.number.complete ? '<li class="complete">' : '<li>';
                    scope._cozenInputTooltip += $filter('translate')('input_password_number') + '</li>';
                }
                if (scope.vm.cozenInputTypePasswordConfig.specialChar) {
                    scope._cozenInputTooltip += data.password.specialChar.complete ? '<li class="complete">' : '<li>';
                    scope._cozenInputTooltip += $filter('translate')('input_password_special_char') + '</li>';
                }
                scope._cozenInputTooltip += '</ul>';
            }

            function getPasswordStateClass(regexp) {
                var classList = [];
                if (data.password[regexp].complete) {
                    classList.push('active');
                }
                return classList;
            }

            function updateModelLength() {
                scope._cozenInputModelLength = scope._cozenInputMaxLength - scope.vm.cozenInputModel.length;
            }
        }
    }

    cozenInputCtrl.$inject = [];

    function cozenInputCtrl() {
        var vm = this;
    }

})(window.angular);


