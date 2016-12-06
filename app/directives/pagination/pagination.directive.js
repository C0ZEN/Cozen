/**
 * @ngdoc directive
 * @name cozen-pagination
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {boolean} cozenPaginationModel > Model (ak ng-model) which is edited by this directive (actual page) [required]
 *
 * [Attributes params]
 * @param {number}  cozenPaginationId              > Id
 * @param {boolean} cozenPaginationFirst    = true > Display the first button
 * @param {boolean} cozenPaginationPrevious = true > Display the previous button
 * @param {boolean} cozenPaginationNext     = true > Display the next button
 * @param {boolean} cozenPaginationLast     = true > Display the last button
 *
 */
(function (angular, window) {
  'use strict';

  angular
    .module('cozenLibApp')
    .directive('cozenPagination', cozenPagination);

  cozenPagination.$inject = [
    'CONFIG'
  ];

  function cozenPagination(CONFIG) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : true,
      scope      : {
        cozenPaginationModel: '=?'
      },
      templateUrl: 'directives/pagination/pagination.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init    : init,
        hasError: hasError,
        destroy : destroy
      };

      var data = {
        directive: 'cozenPagination'
      };

      scope._isReady = false;

      methods.init();

      function init() {

        // Checking required stuff
        if (methods.hasError()) return;

        // Default values (scope)
        scope.cozenPaginationModel = parseInt(scope.cozenPaginationModel);
        if (typeof scope.cozenPaginationModel != 'number') scope.cozenPaginationModel = 1;

        // Default values (attributes)
        scope._cozenPaginationId       = angular.isDefined(attrs.cozenPaginationId) ? attrs.cozenPaginationId : '';
        scope._cozenPaginationFirst    = angular.isDefined(attrs.cozenPaginationFirst) ? attrs.cozenPaginationFirst : true;
        scope._cozenPaginationPrevious = angular.isDefined(attrs.cozenPaginationPrevious) ? attrs.cozenPaginationPrevious : true;
        scope._cozenPaginationNext     = angular.isDefined(attrs.cozenPaginationNext) ? attrs.cozenPaginationNext : true;
        scope._cozenPaginationLast     = angular.isDefined(attrs.cozenPaginationLast) ? attrs.cozenPaginationLast : true;

        // Init stuff
        element.on('$destroy', methods.destroy);

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenPaginationModel)) {
          Methods.directiveErrorRequired(data.directive, 'Model');
          return true;
        }
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }
    }
  }

})(window.angular, window);

