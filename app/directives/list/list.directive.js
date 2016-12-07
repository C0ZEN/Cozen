/**
 * @ngdoc directive
 * @name cozen-list
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 *
 * [Attributes params]
 * @param {number} cozenListId > Id of the list
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLibApp')
    .directive('cozenList', cozenList);

  cozenList.$inject = [
    'Themes',
    'CONFIG'
  ];

  function cozenList(Themes, CONFIG) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : true,
      scope      : {},
      templateUrl: 'directives/list/list.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init    : init,
        hasError: hasError,
        destroy : destroy
      };

      var data = {
        directive: 'cozenList'
      };

      scope._isReady = false;

      methods.init();

      function init() {

        // Checking required stuff
        if (methods.hasError()) return;

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenBtnSize)) {
          if (angular.isDefined(attrs.cozenBtnSizeSmall)) scope._cozenBtnSize = 'small';
          else if (angular.isDefined(attrs.cozenBtnSizeNormal)) scope._cozenBtnSize = 'normal';
          else if (angular.isDefined(attrs.cozenBtnSizeLarge)) scope._cozenBtnSize = 'large';
          else scope._cozenBtnSize = 'normal';
        }

        // Default values (attributes)
        scope._cozenListId = angular.isDefined(attrs.cozenListId) ? attrs.cozenListId : '';

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme = Themes.getActiveTheme();

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }
    }
  }

})(window.angular);

