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
 * @param {string}  cozenInputModel             > Value edited by the input [required]
 * @param {boolean} cozenInputDisabled  = false > Disable the input
 * @param {function} cozenInputOnChange         > Callback function called on change
 *
 * [Attributes params]
 * @param {number}  cozenInputId                              > Id of the input
 * @param {string}  cozenInputTooltip                         > Text of the tooltip
 * @param {string}  cozenInputTooltipTrigger = 'outsideClick' > Type of trigger to show the tooltip
 * @param {boolean} cozenInputRequired       = false          > Required input
 * @param {boolean} cozenInputErrorDesign    = true           > Add style when error
 * @param {boolean} cozenInputSuccessDesign  = true           > Add style when success
 * @param {string}  cozenInputPattern                         > Pattern HTML5 to check for error
 * @param {string}  cozenInputPatternEmail                    > Shortcut for email pattern
 * @param {string}  cozenInputSize           = 'normal'       > Size of the button
 * @param {string}  cozenInputSizeSmall                       > Shortcut for small size
 * @param {string}  cozenInputSizeNormal                      > Shortcut for normal size
 * @param {string}  cozenInputSizeLarge                       > Shortcut for large size
 * @param {string}  cozenInputPrefix                          > Add a prefix
 * @param {string}  cozenInputSuffix                          > Add a suffix
 * @param {string}  cozenInputType           = 'text'         > Type of the input
 * @param {string}  cozenInputTypeText                        > Shortcut for text type
 * @param {string}  cozenInputTypeNumber                      > Shortcut for number type
 * @param {string}  cozenInputPlaceholder                     > Text for the placeholder
 * @param {number}  cozenInputMin            = 0              > Minimum length
 * @param {number}  cozenInputMax            = 60             > Maximum length
 * @param {number}  cozenInputMinLength      = 0              > Minimum char length
 * @param {number}  cozenInputMaxLength      = 100            > Maximum char length
 * @param {string}  cozenInputIconLeft                        > Text for the icon left (font)
 * @param {string}  cozenInputIconRight                       > Text for the icon right (font)
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLibApp')
    .directive('cozenInput', cozenInput);

  cozenInput.$inject = [
    'Themes',
    'CONFIG'
  ];

  function cozenInput(Themes, CONFIG) {
    return {
      link            : link,
      restrict        : 'E',
      replace         : false,
      transclude      : false,
      scope           : {
        cozenInputModel   : '=?',
        cozenInputDisabled: '=?',
        cozenInputOnChange: '&'
      },
      templateUrl     : 'directives/input/input.template.html',
      bindToController: true,
      controller      : cozenInputCtrl,
      controllerAs    : 'vm'
    };

    function link(scope, element, attrs) {
      var methods = {
        init        : init,
        hasError    : hasError,
        destroy     : destroy,
        getMainClass: getMainClass,
        onChange    : onChange
      };

      var data = {
        directive: 'cozenInput'
      };

      scope._isReady = false;

      methods.init();

      function init() {

        // Public functions
        scope._methods = {
          getMainClass: getMainClass,
          onChange    : onChange
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Shortcut values (pattern)
        if (angular.isUndefined(attrs.cozenInputPattern)) {
          if (angular.isDefined(attrs.cozenInputPatternEmail)) scope._cozenInputPattern = 'email';
          else scope._cozenInputPattern = '';
        }

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenInputSize)) {
          if (angular.isDefined(attrs.cozenInputSizeSmall)) scope._cozenInputSize = 'small';
          else if (angular.isDefined(attrs.cozenInputSizeNormal)) scope._cozenInputSize = 'normal';
          else if (angular.isDefined(attrs.cozenInputSizeLarge)) scope._cozenInputSize = 'large';
          else scope._cozenInputSize = 'normal';
        }

        // Shortcut values (type)
        if (angular.isUndefined(attrs.cozenInputType)) {
          if (angular.isDefined(attrs.cozenInputTypeText)) scope._cozenInputType = 'text';
          else if (angular.isDefined(attrs.cozenInputTypeNumber)) scope._cozenInputType = 'number';
          else scope._cozenInputType = 'text';
        }

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenInputDisabled)) scope.vm.cozenInputDisabled = false;

        // Default values (attributes)
        scope._cozenInputId             = angular.isDefined(attrs.cozenInputId) ? attrs.cozenInputId : '';
        scope._cozenInputTooltip        = angular.isDefined(attrs.cozenInputTooltip) ? attrs.cozenInputTooltip : '';
        scope._cozenInputTooltipTrigger = angular.isDefined(attrs.cozenInputTooltipTrigger) ? attrs.cozenInputTooltipTrigger : 'outsideClick';
        scope._cozenInputRequired       = angular.isDefined(attrs.cozenInputRequired) ? attrs.cozenInputRequired : false;
        scope._cozenInputErrorDesign    = angular.isDefined(attrs.cozenInputErrorDesign) ? attrs.cozenInputErrorDesign : true;
        scope._cozenInputSuccessDesign  = angular.isDefined(attrs.cozenInputSuccessDesign) ? attrs.cozenInputSuccessDesign : true;
        scope._cozenInputPrefix         = angular.isDefined(attrs.cozenInputPrefix) ? attrs.cozenInputPrefix : '';
        scope._cozenInputSuffix         = angular.isDefined(attrs.cozenInputSuffix) ? attrs.cozenInputSuffix : '';
        scope._cozenInputPlaceholder    = angular.isDefined(attrs.cozenInputPlaceholder) ? attrs.cozenInputPlaceholder : '';
        scope._cozenInputMin            = angular.isDefined(attrs.cozenInputMin) ? attrs.cozenInputMin : 0;
        scope._cozenInputMax            = angular.isDefined(attrs.cozenInputMax) ? attrs.cozenInputMax : 60;
        scope._cozenInputMinLength      = angular.isDefined(attrs.cozenInputMinLength) ? attrs.cozenInputMinLength : 0;
        scope._cozenInputMaxLength      = angular.isDefined(attrs.cozenInputMaxLength) ? attrs.cozenInputMaxLength : 100;
        scope._cozenInputIconLeft       = angular.isDefined(attrs.cozenInputIconLeft) ? attrs.cozenInputIconLeft : '';
        scope._cozenInputIconRight      = angular.isDefined(attrs.cozenInputIconRight) ? attrs.cozenInputIconRight : '';

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme       = Themes.getActiveTheme();
        scope.vm.cozenInputModel = angular.copy(scope._cozenInputPrefix + (Methods.isNullOrEmpty(scope.vm.cozenInputModel) ? '' : scope.vm.cozenInputModel) + scope._cozenInputSuffix);

        // Display the template
        scope._isReady = true;
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
        var classList = [scope._activeTheme, scope._cozenInputSize];
        if (scope._cozenInputErrorDesign) classList.push('error-design');
        if (scope._cozenInputSuccessDesign) classList.push('success-design');
        if (scope.vm.cozenInputDisabled) classList.push('disabled');
        if (scope._cozenInputIconLeft) classList.push('icon-left');
        if (scope._cozenInputIconRight) classList.push('icon-right');
        return classList;
      }

      function onChange() {
        if (scope.vm.cozenInputDisabled) return;
        if (Methods.isFunction(scope.cozenInputOnChange)) scope.cozenInputOnChange();
        if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
      }
    }
  }

  cozenInputCtrl.$inject = [];

  function cozenInputCtrl() {
    var vm = this;
  }

})(window.angular);


