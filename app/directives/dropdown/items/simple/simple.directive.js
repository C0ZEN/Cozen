/**
 * @ngdoc directive
 * @name cozen-dropdown-item-simple
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenDropdownItemSimpleOnClick          > Callback function called on click
 * @param {boolean}  cozenDropdownItemSimpleDisabled = false > Disable the item
 * @param {boolean}  cozenDropdownItemSimpleBtnRight = false > Display a btn on the right
 * @param {function} cozenDropdownItemSimpleBtnRightOnClick  > Callback function called on click on the btn
 *
 * [Attributes params]
 * @param {number} cozenLisItemSimpleId               > Id of the item
 * @param {string} cozenDropdownItemSimpleLabel           > Text of the item [required]
 * @param {string} cozenDropdownItemSimpleSubLabel        > Text of the item
 * @param {string} cozenDropdownItemSimpleIconLeft        > Icon left (name of the icon)
 * @param {string} cozenDropdownItemSimpleBtnRightIcon    > Icon of the btn (name of the icon)
 * @param {string} cozenDropdownItemSimpleBtnRightTooltip > Text of the btn tooltip
 * @param {string} cozenDropdownItemSimpleBtnRightLabel   > Text of the btn
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLibApp.dropdown.simple', [])
    .directive('cozenDropdownItemSimple', cozenDropdownItemSimple);

  cozenDropdownItemSimple.$inject = [
    'CONFIG',
    'rfc4122',
    '$rootScope',
    '$window'
  ];

  function cozenDropdownItemSimple(CONFIG, rfc4122, $rootScope, $window) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : false,
      scope      : {
        cozenDropdownItemSimpleOnClick        : '&',
        cozenDropdownItemSimpleDisabled       : '=?',
        cozenDropdownItemSimpleBtnRight       : '=?',
        cozenDropdownItemSimpleBtnRightOnClick: '&'
      },
      templateUrl: 'directives/dropdown/items/simple/simple.template.html'
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
        directive: 'cozenDropdownItemSimple',
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
        if (angular.isUndefined(attrs.cozenDropdownItemSimpleDisabled)) scope.cozenDropdownItemSimpleDisabled = false;
        if (angular.isUndefined(attrs.cozenDropdownItemSimpleBtnRight)) scope.cozenDropdownItemSimpleBtnRight = false;

        // Default values (attributes)
        scope._cozenLisItemSimpleId               = angular.isDefined(attrs.cozenLisItemSimpleId) ? attrs.cozenLisItemSimpleId : '';
        scope._cozenDropdownItemSimpleLabel           = attrs.cozenDropdownItemSimpleLabel;
        scope._cozenDropdownItemSimpleSubLabel        = angular.isDefined(attrs.cozenDropdownItemSimpleSubLabel) ? attrs.cozenDropdownItemSimpleSubLabel : '';
        scope._cozenDropdownItemSimpleIconLeft        = angular.isDefined(attrs.cozenDropdownItemSimpleIconLeft) ? attrs.cozenDropdownItemSimpleIconLeft : '';
        scope._cozenDropdownItemSimpleBtnRightIcon    = attrs.cozenDropdownItemSimpleBtnRightIcon;
        scope._cozenDropdownItemSimpleBtnRightTooltip = angular.isDefined(attrs.cozenDropdownItemSimpleBtnRightTooltip) ? attrs.cozenDropdownItemSimpleBtnRightTooltip : '';
        scope._cozenDropdownItemSimpleBtnRightLabel   = angular.isDefined(attrs.cozenDropdownItemSimpleBtnRightLabel) ? attrs.cozenDropdownItemSimpleBtnRightLabel : '';

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope.cozenDropdownItemSimpleActive = false;
        scope.$parent.$parent.$parent.childrenUuid.push(data.uuid);
        $rootScope.$on('cozenDropdownActive', methods.onActive);
        $window.addEventListener('keydown', methods.onKeyDown);

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenDropdownItemSimpleLabel)) {
          Methods.directiveErrorRequired(data.directive, 'Label');
          return true;
        }
        else if (scope.cozenDropdownItemSimpleBtnRight && angular.isUndefined(attrs.cozenDropdownItemSimpleBtnRightOnClick)) {
          Methods.directiveErrorRequired(data.directive, 'BtnRightOnClick');
          return true;
        }
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classDropdown = [];
        if (angular.isUndefined(attrs.cozenDropdownItemSimpleOnClick)) classDropdown.push('no-action');
        if (scope.cozenDropdownItemSimpleDisabled) classDropdown.push('disabled');
        else if (scope.cozenDropdownItemSimpleActive) classDropdown.push('active');
        return classDropdown;
      }

      function onClickItem($event) {
        if (scope.cozenDropdownItemSimpleDisabled) return;
        if (angular.isUndefined(attrs.cozenDropdownItemSimpleOnClick)) return;
        if (Methods.isFunction(scope.cozenDropdownItemSimpleOnClick)) scope.cozenDropdownItemSimpleOnClick();
        if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onClickItem');
      }

      function getTabIndex() {
        var tabIndex = 0;
        if (scope.cozenDropdownItemSimpleDisabled) tabIndex = -1;
        else if (angular.isUndefined(attrs.cozenDropdownItemSimpleOnClick)) tabIndex = -1;
        return tabIndex;
      }

      function onClickBtnRight($event) {
        if (scope.cozenDropdownItemSimpleDisabled) return;
        if (Methods.isFunction(scope.cozenDropdownItemSimpleBtnRightOnClick)) scope.cozenDropdownItemSimpleBtnRightOnClick();
        if (CONFIG.config.debug) Methods.directiveCallbackLog(data.directive, 'onClickBtnRight');
        $event.stopPropagation();
      }

      function onActive(event, eventData) {
        if (scope.cozenDropdownItemSimpleDisabled) return;
        scope.cozenDropdownItemSimpleActive = eventData.uuid == data.uuid;
        Methods.safeApply(scope);
      }

      function onKeyDown(event) {
        if (scope.cozenDropdownItemSimpleDisabled) return;
        if (!scope.cozenDropdownItemSimpleActive) return;
        event.preventDefault();
        switch (event.keyCode) {

          // Enter
          case 13:
            methods.onClick(event);
            break;
        }
      }

      function onHover($event) {
        if (scope.cozenDropdownItemSimpleActive) return;
        scope.$parent.$parent.$parent.$parent.activeChild = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
        scope.$parent.$parent.$parent.activeChild = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
        $rootScope.$broadcast('cozenDropdownActive', {
          uuid: data.uuid
        });
      }
    }
  }

})(window.angular);

