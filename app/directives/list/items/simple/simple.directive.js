/**
 * @ngdoc directive
 * @name cozen-list-item-simple
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenListItemSimpleOnClick          > Callback function called on click
 * @param {boolean}  cozenListItemSimpleDisabled = false > Disable the item
 * @param {boolean}  cozenListItemSimpleBtnRight = false > Display a btn on the right
 * @param {function} cozenListItemSimpleBtnRightOnClick  > Callback function called on click on the btn
 *
 * [Attributes params]
 * @param {number} cozenLisItemSimpleId               > Id of the item
 * @param {string} cozenListItemSimpleLabel           > Text of the item [required]
 * @param {string} cozenListItemSimpleSubLabel        > Text of the item
 * @param {string} cozenListItemSimpleIconLeft        > Icon left (name of the icon)
 * @param {string} cozenListItemSimpleBtnRightIcon    > Icon of the btn (name of the icon)
 * @param {string} cozenListItemSimpleBtnRightTooltip > Text of the btn tooltip
 * @param {string} cozenListItemSimpleBtnRightLabel   > Text of the btn
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLibApp.list.simple', [])
    .directive('cozenListItemSimple', cozenListItemSimple);

  cozenListItemSimple.$inject = [
    'CONFIG',
    'rfc4122',
    '$rootScope',
    '$window'
  ];

  function cozenListItemSimple(CONFIG, rfc4122, $rootScope, $window) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : false,
      scope      : {
        cozenListItemSimpleOnClick        : '&',
        cozenListItemSimpleDisabled       : '=?',
        cozenListItemSimpleBtnRight       : '=?',
        cozenListItemSimpleBtnRightOnClick: '&'
      },
      templateUrl: 'directives/list/items/simple/simple.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init           : init,
        hasError       : hasError,
        destroy        : destroy,
        getMainClass   : getMainClass,
        onClickItem    : onClickItem,
        getTabIndex    : getTabIndex,
        onClickBtnRight: onClickBtnRight,
        onActive       : onActive,
        onKeyDown      : onKeyDown,
        onHover        : onHover
      };

      var data = {
        directive: 'cozenListItemSimple',
        uuid     : rfc4122.v4()
      };

      scope._isReady = false;

      methods.init();

      function init() {

        // Public functions
        scope._methods = {
          getMainClass: getMainClass,
          onClick     : {
            item    : onClickItem,
            btnRight: onClickBtnRight
          },
          getTabIndex : getTabIndex,
          onHover     : onHover
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenListItemSimpleDisabled)) scope.cozenListItemSimpleDisabled = false;
        if (angular.isUndefined(attrs.cozenListItemSimpleBtnRight)) scope.cozenListItemSimpleBtnRight = false;

        // Default values (attributes)
        scope._cozenLisItemSimpleId               = angular.isDefined(attrs.cozenLisItemSimpleId) ? attrs.cozenLisItemSimpleId : '';
        scope._cozenListItemSimpleLabel           = attrs.cozenListItemSimpleLabel;
        scope._cozenListItemSimpleSubLabel        = angular.isDefined(attrs.cozenListItemSimpleSubLabel) ? attrs.cozenListItemSimpleSubLabel : '';
        scope._cozenListItemSimpleIconLeft        = angular.isDefined(attrs.cozenListItemSimpleIconLeft) ? attrs.cozenListItemSimpleIconLeft : '';
        scope._cozenListItemSimpleBtnRightIcon    = attrs.cozenListItemSimpleBtnRightIcon;
        scope._cozenListItemSimpleBtnRightTooltip = angular.isDefined(attrs.cozenListItemSimpleBtnRightTooltip) ? attrs.cozenListItemSimpleBtnRightTooltip : '';
        scope._cozenListItemSimpleBtnRightLabel   = angular.isDefined(attrs.cozenListItemSimpleBtnRightLabel) ? attrs.cozenListItemSimpleBtnRightLabel : '';

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope.cozenListItemSimpleActive = false;
        scope.$parent.$parent.$parent.childrenUuid.push(data.uuid);
        $rootScope.$on('cozenListActive', methods.onActive);
        $window.addEventListener('keydown', methods.onKeyDown);

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenListItemSimpleLabel)) {
          Methods.directiveErrorRequired(data.directive, 'Label');
          return true;
        }
        else if (scope.cozenListItemSimpleBtnRight && angular.isUndefined(attrs.cozenListItemSimpleBtnRightOnClick)) {
          Methods.directiveErrorRequired(data.directive, 'BtnRightOnClick');
          return true;
        }
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classList = [];
        if (angular.isUndefined(attrs.cozenListItemSimpleOnClick)) classList.push('no-action');
        if (scope.cozenListItemSimpleDisabled) classList.push('disabled');
        else if (scope.cozenListItemSimpleActive) classList.push('active');
        return classList;
      }

      function onClickItem($event) {
        if (scope.cozenListItemSimpleDisabled) return;
        if (angular.isUndefined(attrs.cozenListItemSimpleOnClick)) return;
        if (Methods.isFunction(scope.cozenListItemSimpleOnClick)) scope.cozenListItemSimpleOnClick();
        if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onClickItem');
      }

      function getTabIndex() {
        var tabIndex = 0;
        if (scope.cozenListItemSimpleDisabled) tabIndex = -1;
        else if (angular.isUndefined(attrs.cozenListItemSimpleOnClick)) tabIndex = -1;
        return tabIndex;
      }

      function onClickBtnRight($event) {
        if (scope.cozenListItemSimpleDisabled) return;
        if (Methods.isFunction(scope.cozenListItemSimpleBtnRightOnClick)) scope.cozenListItemSimpleBtnRightOnClick();
        if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onClickBtnRight');
        $event.stopPropagation();
      }

      function onActive(event, eventData) {
        if (scope.cozenListItemSimpleDisabled) return;
        scope.cozenListItemSimpleActive = eventData.uuid == data.uuid;
        Methods.safeApply(scope);
      }

      function onKeyDown(event) {
        if (scope.cozenListItemSimpleDisabled) return;
        if (!scope.cozenListItemSimpleActive) return;
        event.preventDefault();
        switch (event.keyCode) {

          // Enter
          case 13:
            methods.onClick(event);
            break;
        }
      }

      function onHover($event) {
        if (scope.cozenListItemSimpleActive) return;
        scope.$parent.$parent.$parent.$parent.activeChild = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
        scope.$parent.$parent.$parent.activeChild = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
        $rootScope.$broadcast('cozenListActive', {
          uuid: data.uuid
        });
      }
    }
  }

})(window.angular);

