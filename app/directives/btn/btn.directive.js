/**
 * @ngdoc directive
 * @name cozen-btn
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnOnClick > Callback function called on click
 *
 * [Attributes params]
 * @param {string} cozenBtnLabel > Text of the button [required]
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLibApp')
    .directive('cozenBtn', cozenBtn);

  cozenBtn.$inject = [];

  function cozenBtn() {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : false,
      scope      : {
        cozenBtnOnClick: '&'
      },
      templateUrl: 'directives/btn/btn.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init    : init,
        hasError: hasError,
        destroy : destroy,
        onClick : onClick
      };

      methods.init();

      scope._isReady = false;

      function init() {

        // Public functions
        scope._methods = {
          onClick: methods.onClick
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Default values
        // ...

        // Init stuff
        element.on('$destroy', methods.destroy);

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        var directive = 'cozenBtn';
        if (Methods.isNullOrEmpty(attrs.cozenBtnLabel)) {
          Methods.directiveErrorRequired(directive, 'cozenBtnLabel');
          return true;
        }
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function onClick($event) {
        if (Methods.isFunction(scope.cozenBtnOnClick)) scope.cozenBtnOnClick();
      }
    }
  }

})(window.angular);

