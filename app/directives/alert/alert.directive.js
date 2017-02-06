/**
 * @ngdoc directive
 * @name cozen-alert
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenAlertOnShow             > Callback function called on show
 * @param {function} cozenAlertOnHide             > Callback function called on hide
 * @param {boolean}  cozenAlertDisplay     = true > To hide or show the popup
 * @param {string}   cozenAlertLabel              > Text to display
 * @param {string}   cozenAlertLabelValues        > Values for translate label
 * @param {function} cozenAlertOnHideDone         > Callback function called when the hide action is finished
 *
 * [Attributes params]
 * @param {number}  cozenAlertId                                > Id of the button
 * @param {string}  cozenAlertSize              = 'normal'      > Size of the button
 * @param {string}  cozenAlertSizeSmall                         > Shortcut for small size
 * @param {string}  cozenAlertSizeNormal                        > Shortcut for normal size
 * @param {string}  cozenAlertSizeLarge                         > Shortcut for large size
 * @param {string}  cozenAlertType              = 'default'     > Type of the button (change the color)
 * @param {string}  cozenAlertTypeDefault                       > Shortcut for default type
 * @param {string}  cozenAlertTypeInfo                          > Shortcut for info type
 * @param {string}  cozenAlertTypeSuccess                       > Shortcut for success type
 * @param {string}  cozenAlertTypeWarning                       > Shortcut for warning type
 * @param {string}  cozenAlertTypeError                         > Shortcut for error type
 * @param {boolean} cozenAlertAnimationIn       = true          > Add an animation before show [config.json]
 * @param {boolean} cozenAlertAnimationOut      = true          > Add an animation before hide [config.json]
 * @param {boolean} cozenAlertCloseBtn          = true          > Display the close btn (top-right) [config.json]
 * @param {string}  cozenAlertIconLeft          = Multiple      > Text of the icon left [config.json]
 * @param {string}  cozenAlertTextAlign         = 'justify'     > Alignment of the label [config.json]
 * @param {boolean} cozenAlertCloseBtnTooltip   = true          > Display a tooltip on the close btn [config.json]
 * @param {string}  cozenAlertClass                             > Custom class
 * @param {boolean} cozenAlertForceAnimation    = false         > Force to launch the animation
 * @param {string}  cozenAlertAnimationInClass  = 'fadeInUp'    > Define the kind of animation when showing [config.json]
 * @param {string}  cozenAlertAnimationOutClass = 'fadeOutDown' > Define the kind of animation when hiding [config.json]
 * @param {number}  cozenAlertTimeout           = 0             > Define after how many seconds the alert should hide (0 is never) [config.json]
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLib.alert', [
      'cozenLib.alert.floatingFeed',
      'cozenLib.alert.floatingFeedFactory'
    ])
    .directive('cozenAlert', cozenAlert);

  cozenAlert.$inject = [
    'Themes',
    'CONFIG',
    '$window',
    '$timeout',
    'rfc4122'
  ];

  function cozenAlert(Themes, CONFIG, $window, $timeout, rfc4122) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : false,
      scope      : {
        cozenAlertOnShow     : '&',
        cozenAlertOnHide     : '&',
        cozenAlertDisplay    : '=?',
        cozenAlertLabel      : '=?',
        cozenAlertLabelValues: '=?',
        cozenAlertOnHideDone : '&'
      },
      templateUrl: 'directives/alert/alert.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init        : init,
        hasError    : hasError,
        destroy     : destroy,
        getMainClass: getMainClass,
        hide        : hide,
        show        : show,
        onClose     : onClose
      };

      var data = {
        directive        : 'cozenAlert',
        uuid             : rfc4122.v4(),
        shown            : true,
        firstHide        : true,
        firstDisplayWatch: true
      };

      methods.init();

      function init() {

        // Public functions
        scope._methods = {
          getMainClass: getMainClass,
          hide        : hide,
          onClose     : onClose
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenAlertSize)) {
          if (angular.isDefined(attrs.cozenAlertSizeSmall)) scope._cozenAlertSize = 'small';
          else if (angular.isDefined(attrs.cozenAlertSizeNormal)) scope._cozenAlertSize = 'normal';
          else if (angular.isDefined(attrs.cozenAlertSizeLarge)) scope._cozenAlertSize = 'large';
          else scope._cozenAlertSize = 'normal';
        } else scope._cozenAlertSize = attrs.cozenAlertSize;

        // Shortcut values (type)
        if (angular.isUndefined(attrs.cozenAlertType)) {
          if (angular.isDefined(attrs.cozenAlertTypeDefault)) scope._cozenAlertType = 'default';
          else if (angular.isDefined(attrs.cozenAlertTypeInfo)) scope._cozenAlertType = 'info';
          else if (angular.isDefined(attrs.cozenAlertTypeSuccess)) scope._cozenAlertType = 'success';
          else if (angular.isDefined(attrs.cozenAlertTypeWarning)) scope._cozenAlertType = 'warning';
          else if (angular.isDefined(attrs.cozenAlertTypeError)) scope._cozenAlertType = 'error';
          else scope._cozenAlertType = 'default';
        } else scope._cozenAlertType = attrs.cozenAlertType;

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenAlertDisplay)) scope.cozenAlertDisplay = true;
        // if (angular.isUndefined(attrs.cozenAlertDisplay)) scope.cozenAlertLabel = '';

        // Default values (attributes)
        scope._cozenAlertId                = angular.isDefined(attrs.cozenAlertId) ? attrs.cozenAlertId : '';
        scope._cozenAlertAnimationIn       = angular.isDefined(attrs.cozenAlertAnimationIn) ? JSON.parse(attrs.cozenAlertAnimationIn) : CONFIG.alert.animation.in;
        scope._cozenAlertAnimationOut      = angular.isDefined(attrs.cozenAlertAnimationOut) ? JSON.parse(attrs.cozenAlertAnimationOut) : CONFIG.alert.animation.out;
        scope._cozenAlertCloseBtn          = angular.isDefined(attrs.cozenAlertCloseBtn) ? JSON.parse(attrs.cozenAlertCloseBtn) : CONFIG.alert.closeBtn.enabled;
        scope._cozenAlertIconLeft          = angular.isDefined(attrs.cozenAlertIconLeft) ? attrs.cozenAlertIconLeft : CONFIG.alert.iconLeft[scope._cozenAlertType];
        scope._cozenAlertTextAlign         = angular.isDefined(attrs.cozenAlertTextAlign) ? attrs.cozenAlertTextAlign : CONFIG.alert.textAlign;
        scope._cozenAlertCloseBtnTooltip   = angular.isDefined(attrs.cozenAlertCloseBtnTooltip) ? JSON.parse(attrs.cozenAlertCloseBtnTooltip) : CONFIG.alert.closeBtn.tooltip;
        scope._cozenAlertForceAnimation    = angular.isDefined(attrs.cozenAlertForceAnimation) ? JSON.parse(attrs.cozenAlertForceAnimation) : false;
        scope._cozenAlertAnimationInClass  = angular.isDefined(attrs.cozenAlertAnimationInClass) ? attrs.cozenAlertAnimationInClass : CONFIG.alert.animation.inClass;
        scope._cozenAlertAnimationOutClass = angular.isDefined(attrs.cozenAlertAnimationOutClass) ? attrs.cozenAlertAnimationOutClass : CONFIG.alert.animation.outClass;
        scope._cozenAlertTimeout           = angular.isDefined(attrs.cozenAlertTimeout) ? JSON.parse(attrs.cozenAlertTimeout) : CONFIG.alert.timeout;

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme = Themes.getActiveTheme();
        scope.$on('cozenAlertShow', methods.show);
        scope.$on('cozenAlertHide', methods.hide);
        data.firstHide = false;

        // To force the popup to get his stuff done as a normal show (with animation)
        if (scope._cozenAlertForceAnimation) methods.show(null, {
          uuid: data.uuid
        });

        // To execute the hide and show stuff even if the value is changed elsewhere
        scope.$watch('cozenAlertDisplay', function (newValue) {
          if (!data.firstDisplayWatch) {
            if (newValue) {
              methods.show(null, {});
            } else {
              methods.hide(null, {
                uuid: data.uuid
              });
            }
          } else data.firstDisplayWatch = false;
        });
      }

      function hasError() {
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classList = [scope._activeTheme, scope._cozenAlertSize, scope._cozenAlertType, attrs.cozenAlertClass];
        if (!data.firstHide) {
          if (scope._cozenAlertAnimationIn) classList.push('animate-in');
          if (scope._cozenAlertAnimationOut) classList.push('animate-out');
          if (scope.cozenAlertDisplay && scope._cozenAlertAnimationIn) {
            classList.push(scope._cozenAlertAnimationInClass);
            classList.push('with-animation-in');
          }
          if (!scope.cozenAlertDisplay && scope._cozenAlertAnimationOut) {
            classList.push(scope._cozenAlertAnimationOutClass);
            classList.push('with-animation-out');
          }
        }
        return classList;
      }

      function hide($event, params) {
        if (params.uuid == data.uuid) {
          data.firstHide          = false;
          scope.cozenAlertDisplay = false;
          if (Methods.isFunction(scope.cozenAlertOnHide)) scope.cozenAlertOnHide();
          if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'OnHide');
          Methods.safeApply(scope);

          // @todo instead of added a fix value (corresponding to animation-duration-out) we could:
          // - Add a parameter (attr + config) to set the time
          // - Get a real callback when the hide animation is done
          var timeout = scope._cozenAlertAnimationOut ? 200 : 0;
          $timeout(function () {
            if (Methods.isFunction(scope.cozenAlertOnHideDone)) scope.cozenAlertOnHideDone();
          }, timeout);
        }
      }

      function show($event, params) {
        if (params.uuid == data.uuid) {
          data.firstHide          = false;
          scope.cozenAlertDisplay = true;
          if (Methods.isFunction(scope.cozenAlertOnShow)) scope.cozenAlertOnShow();
          if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'OnShow');
          Methods.safeApply(scope);
        }
      }

      function onClose() {
        scope.cozenAlertDisplay = false;
      }
    }
  }

})(window.angular);

