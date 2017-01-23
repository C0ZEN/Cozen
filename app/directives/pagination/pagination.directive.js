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
 * @param {boolean}  cozenPaginationModel                > Model (ak ng-model) which is edited by this directive (actual page) [required]
 * @param {boolean}  cozenPaginationDisabled     = false > Disable the pagination
 * @param {number}   cozenPaginationLimitPerPage = 20    > Number of item per page
 * @param {number}   cozenPaginationTotalElements        > Number of elements [required]
 * @param {function} cozenPaginationOnChange             > Callback function on change
 *
 * [Attributes params]
 * @param {number}  cozenPaginationId                      > Id
 * @param {boolean} cozenPaginationFirst        = true     > Display the first button
 * @param {boolean} cozenPaginationPrevious     = true     > Display the previous button
 * @param {boolean} cozenPaginationNext         = true     > Display the next button
 * @param {boolean} cozenPaginationLast         = true     > Display the last button
 * @param {string}  cozenPaginationSize         = 'normal' > Size of the button
 * @param {string}  cozenPaginationSizeSmall               > Shortcut for small size
 * @param {string}  cozenPaginationSizeNormal              > Shortcut for normal size
 * @param {string}  cozenPaginationSizeLarge               > Shortcut for large size
 * @param {boolean} cozenPaginationWithTooltips = true     > Display/hide the tooltips
 * @param {boolean} cozenPaginationAutoHide     = false    > Hide the pagination if there is only one page
 * @param {string}  cozenPaginationClass                   > Custom class
 *
 */
(function (angular, window) {
  'use strict';

  angular
    .module('cozenLib.pagination', [])
    .directive('cozenPagination', cozenPagination);

  cozenPagination.$inject = [
    'CONFIG',
    'Themes'
  ];

  function cozenPagination(CONFIG, Themes) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : true,
      scope      : {
        cozenPaginationModel        : '=?',
        cozenPaginationDisabled     : '=?',
        cozenPaginationLimitPerPage : '=?',
        cozenPaginationTotalElements: '=?',
        cozenPaginationOnChange     : '&'
      },
      templateUrl: 'directives/pagination/pagination.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init         : init,
        hasError     : hasError,
        destroy      : destroy,
        getMainClass : getMainClass,
        onClick      : onClick,
        getPages     : getPages,
        getTotalPage : getTotalPage,
        show         : show,
        nextBlock    : nextBlock,
        getMaxBlock  : getMaxBlock,
        previousBlock: previousBlock
      };

      var data = {
        directive: 'cozenPagination'
      };

      scope._isReady = true;

      methods.init();

      function init() {

        // Public functions
        scope._methods = {
          getMainClass : getMainClass,
          onClick      : onClick,
          getPages     : getPages,
          getTotalPage : getTotalPage,
          show         : show,
          nextBlock    : nextBlock,
          previousBlock: previousBlock
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenPaginationSize)) {
          if (angular.isDefined(attrs.cozenPaginationSizeSmall)) scope._cozenPaginationSize = 'small';
          else if (angular.isDefined(attrs.cozenPaginationSizeNormal)) scope._cozenPaginationSize = 'normal';
          else if (angular.isDefined(attrs.cozenPaginationSizeLarge)) scope._cozenPaginationSize = 'large';
          else scope._cozenPaginationSize = 'normal';
        } else scope._cozenPaginationSize = attrs.cozenPaginationSize;

        // Default values (scope)
        scope.cozenPaginationModel = 1;
        if (angular.isUndefined(attrs.cozenPaginationDisabled)) scope.cozenPaginationDisabled = false;
        if (angular.isUndefined(attrs.cozenPaginationLimitPerPage)) scope.cozenPaginationLimitPerPage = 20;

        // Default values (attributes)
        scope._cozenPaginationId           = angular.isDefined(attrs.cozenPaginationId) ? attrs.cozenPaginationId : '';
        scope._cozenPaginationFirst        = angular.isDefined(attrs.cozenPaginationFirst) ? attrs.cozenPaginationFirst : true;
        scope._cozenPaginationPrevious     = angular.isDefined(attrs.cozenPaginationPrevious) ? attrs.cozenPaginationPrevious : true;
        scope._cozenPaginationNext         = angular.isDefined(attrs.cozenPaginationNext) ? attrs.cozenPaginationNext : true;
        scope._cozenPaginationLast         = angular.isDefined(attrs.cozenPaginationLast) ? attrs.cozenPaginationLast : true;
        scope._cozenPaginationWithTooltips = angular.isDefined(attrs.cozenPaginationWithTooltips) ? attrs.cozenPaginationWithTooltips : true;
        scope._cozenPaginationAutoHide     = angular.isDefined(attrs.cozenPaginationAutoHide) ? attrs.cozenPaginationAutoHide : false;

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme         = Themes.getActiveTheme();
        scope.cozenPaginationBlock = 0;

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenPaginationModel)) {
          Methods.directiveErrorRequired(data.directive, 'Model');
          return true;
        }
        else if (Methods.isNullOrEmpty(attrs.cozenPaginationTotalElements)) {
          Methods.directiveErrorRequired(data.directive, 'TotalElements');
          return true;
        }
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classList = [scope._activeTheme, scope._cozenPaginationSize, attrs.cozenPaginationClass];
        if (scope.cozenPaginationDisabled) classList.push('disabled');
        return classList;
      }

      function onClick($event, type, page) {
        if (scope.cozenPaginationDisabled) return;
        if (page == null) page = '';
        var oldModel = angular.copy(scope.cozenPaginationModel);
        var max      = methods.getTotalPage();
        switch (type) {
          case 'first':
            if (max <= 1) return;
            scope.cozenPaginationModel = 1;
            scope.cozenPaginationBlock = 0;
            break;
          case 'previous':
            if (max <= 1) return;
            scope.cozenPaginationModel > 1 ? scope.cozenPaginationModel-- : scope.cozenPaginationModel;
            if (oldModel != scope.cozenPaginationModel) {
              if (scope.cozenPaginationModel % 5 == 0) {
                scope.cozenPaginationBlock--;
              }
            }
            break;
          case 'next':
            if (max <= 1) return;
            if (scope.cozenPaginationModel < max) {
              scope.cozenPaginationModel++;
            }
            if (oldModel != scope.cozenPaginationModel) {
              if (oldModel % 5 == 0) {
                scope.cozenPaginationBlock++;
              }
            }
            break;
          case 'last':
            if (max <= 1) return;
            scope.cozenPaginationModel = max;
            scope.cozenPaginationBlock = methods.getMaxBlock();
            break;
          case 'next-block':
            scope.cozenPaginationBlock++;
            scope.cozenPaginationModel = 5 * scope.cozenPaginationBlock + 1;
            break;
          case 'previous-block':
            scope.cozenPaginationBlock--;
            scope.cozenPaginationModel = 5 * scope.cozenPaginationBlock + 5;
            break;
          default:
            if (scope.cozenPaginationModel == page) return;
            scope.cozenPaginationModel = page;
            break;
        }
        if (oldModel != scope.cozenPaginationModel && Methods.isFunction(scope.cozenPaginationOnChange)) scope.cozenPaginationOnChange();
        if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClick' + Methods.capitalizeFirstLetter(type) + page);
      }

      function getPages() {
        var page  = methods.getTotalPage();
        var pages = [];
        if (page > 5) page = 5;
        for (var i = 0; i < page; i++) {
          pages.push(i + 1 + (5 * scope.cozenPaginationBlock));
        }
        return pages;
      }

      function getTotalPage() {
        return Math.ceil(parseInt(scope.cozenPaginationTotalElements) / parseInt(scope.cozenPaginationLimitPerPage));
      }

      function show() {
        if (scope._cozenPaginationAutoHide) {
          return methods.getTotalPage() > 1;
        } else return true;
      }

      function nextBlock() {
        var nextBlock = (scope.cozenPaginationBlock + 1) * 5;
        return nextBlock < methods.getTotalPage();
      }

      function getMaxBlock() {
        return Math.ceil(methods.getTotalPage() / 5) - 1;
      }

      function previousBlock() {
        var previousBlock = scope.cozenPaginationBlock * 5;
        return previousBlock >= 5;
      }
    }
  }

})(window.angular, window);

