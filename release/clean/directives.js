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
 * @param {function} cozenAlertOnShow         > Callback function called on show
 * @param {function} cozenAlertOnHide         > Callback function called on hide
 * @param {boolean}  cozenAlertDisplay = true > To hide or show the popup
 *
 * [Attributes params]
 * @param {number}  cozenAlertId                          > Id of the button
 * @param {string}  cozenAlertSize            = 'normal'  > Size of the button
 * @param {string}  cozenAlertSizeSmall                   > Shortcut for small size
 * @param {string}  cozenAlertSizeNormal                  > Shortcut for normal size
 * @param {string}  cozenAlertSizeLarge                   > Shortcut for large size
 * @param {string}  cozenAlertType            = 'default' > Type of the button (change the color)
 * @param {string}  cozenAlertTypeDefault                 > Shortcut for default type
 * @param {string}  cozenAlertTypeInfo                    > Shortcut for info type
 * @param {string}  cozenAlertTypeSuccess                 > Shortcut for success type
 * @param {string}  cozenAlertTypeWarning                 > Shortcut for warning type
 * @param {string}  cozenAlertTypeError                   > Shortcut for error type
 * @param {boolean} cozenAlertAnimationIn     = true      > Add an animation before show [config.json]
 * @param {boolean} cozenAlertAnimationOut    = true      > Add an animation before hide [config.json]
 * @param {boolean} cozenAlertCloseBtn        = true      > Display the close btn (top-right) [config.json]
 * @param {string}  cozenAlertIconLeft        = Multiple  > Text of the icon left [config.json]
 * @param {string}  cozenAlertLabel                       > Text to display
 * @param {string}  cozenAlertTextAlign       = 'justify' > Alignment of the label [config.json]
 * @param {boolean} cozenAlertCloseBtnTooltip = true      > Display a tooltip on the close btn [config.json]
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLib.alert', [])
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
        cozenAlertOnShow : '&',
        cozenAlertOnHide : '&',
        cozenAlertDisplay: '=?'
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

      scope._isReady = false;

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
        }

        // Shortcut values (type)
        if (angular.isUndefined(attrs.cozenAlertType)) {
          if (angular.isDefined(attrs.cozenAlertTypeDefault)) scope._cozenAlertType = 'default';
          else if (angular.isDefined(attrs.cozenAlertTypeInfo)) scope._cozenAlertType = 'info';
          else if (angular.isDefined(attrs.cozenAlertTypeSuccess)) scope._cozenAlertType = 'success';
          else if (angular.isDefined(attrs.cozenAlertTypeWarning)) scope._cozenAlertType = 'warning';
          else if (angular.isDefined(attrs.cozenAlertTypeError)) scope._cozenAlertType = 'error';
          else scope._cozenAlertType = 'default';
        }

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenAlertDisplay)) scope.cozenAlertDisplay = true;

        // Default values (attributes)
        scope._cozenAlertId              = angular.isDefined(attrs.cozenAlertId) ? attrs.cozenAlertId : '';
        scope._cozenAlertAnimationIn     = angular.isDefined(attrs.cozenAlertAnimationIn) ? JSON.parse(attrs.cozenAlertAnimationIn) : CONFIG.alert.animation.in;
        scope._cozenAlertAnimationOut    = angular.isDefined(attrs.cozenAlertAnimationOut) ? JSON.parse(attrs.cozenAlertAnimationOut) : CONFIG.alert.animation.out;
        scope._cozenAlertCloseBtn        = angular.isDefined(attrs.cozenAlertCloseBtn) ? JSON.parse(attrs.cozenAlertCloseBtn) : CONFIG.alert.closeBtn.enabled;
        scope._cozenAlertIconLeft        = angular.isDefined(attrs.cozenAlertIconLeft) ? attrs.cozenAlertIconLeft : CONFIG.alert.iconLeft[scope._cozenAlertType];
        scope._cozenAlertLabel           = angular.isDefined(attrs.cozenAlertLabel) ? attrs.cozenAlertLabel : '';
        scope._cozenAlertTextAlign       = angular.isDefined(attrs.cozenAlertTextAlign) ? attrs.cozenAlertTextAlign : CONFIG.alert.textAlign;
        scope._cozenAlertCloseBtnTooltip = angular.isDefined(attrs.cozenAlertCloseBtnTooltip) ? JSON.parse(attrs.cozenAlertCloseBtnTooltip) : CONFIG.alert.closeBtn.tooltip;

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme = Themes.getActiveTheme();
        scope.$on('cozenAlertShow', methods.show);
        scope.$on('cozenAlertHide', methods.hide);

        // To execute the hide and show stuff even if the value is changed elsewhere
        scope.$watch('cozenAlertDisplay', function (newValue) {
          if (!data.firstDisplayWatch) {
            if (newValue) {
              methods.show(null, {
                uuid: data.uuid
              });
            } else {
              methods.hide(null, {
                uuid: data.uuid
              });
            }
          } else data.firstDisplayWatch = false;
        });

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classList = [scope._activeTheme, scope._cozenAlertSize, scope._cozenAlertType];
        if (!data.firstHide) {
          if (scope._cozenAlertAnimationIn) classList.push('animate-in');
          if (scope._cozenAlertAnimationOut) classList.push('animate-out');
          if (scope.cozenAlertDisplay && scope._cozenAlertAnimationIn) classList.push('fadeInUp');
          if (!scope.cozenAlertDisplay && scope._cozenAlertAnimationOut) classList.push('fadeOutDown');
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
        methods.hide(null, {
          uuid: data.uuid
        });
      }
    }
  }

})(window.angular);


(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .constant('CONFIG'
             ,
            {
  "languages": [
    "fr",
    "en"
  ],
  "currentLanguage": "fr",
  "themes": [
    "tau",
    "atom"
  ],
  "debug": false,
  "scrollsBar": true,
  "scrollsBarConfig": {
    "autoHideScrollbar": true,
    "theme": "dark",
    "advanced": {
      "updateOnContentResize": true,
      "updateOnSelectorChange": true
    },
    "setHeight": 0,
    "scrollInertia": 100,
    "axis": "yx",
    "scrollButtons": {
      "scrollAmount": "auto",
      "enable": false
    }
  },
  "dropdown": {
    "autoCloseOthers": true,
    "displayModelLength": false
  },
  "input": {
    "displayModelLength": false
  },
  "textarea": {
    "displayModelLength": false
  },
  "required": {
    "type": "star",
    "icon": "fa fa-exclamation-circle"
  },
  "alert": {
    "textAlign": "justify",
    "closeBtn": {
      "tooltip": true,
      "enabled": true
    },
    "iconLeft": {
      "default": "",
      "info": "fa fa-info-circle",
      "success": "fa fa-check-circle",
      "warning": "fa fa-exclamation-triangle",
      "error": "fa fa-exclamation-circle"
    },
    "animation": {
      "in": true,
      "out": true
    }
  },
  "popup": {
    "header": true,
    "footer": true,
    "animation": {
      "in": {
        "enabled": true,
        "animation": "fadeInUp"
      },
      "out": {
        "enabled": true,
        "animation": "fadeOutDown"
      }
    },
    "easeClose": true,
    "closeBtn": true
  }
}

        );

})(window.angular);

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
 * @param {function} cozenBtnOnClick          > Callback function called on click
 * @param {boolean}  cozenBtnActive   = false > Active the button (hover state)
 * @param {boolean}  cozenBtnDisabled = false > Disable the button
 * @param {boolean}  cozenBtnLoader   = false > Active a loader (replace all the content and disable visual state)
 *
 * [Attributes params]
 * @param {number}  cozenBtnId                      > Id of the button
 * @param {string}  cozenBtnLabel                   > Text of the button
 * @param {string}  cozenBtnSize        = 'normal'  > Size of the button
 * @param {string}  cozenBtnSizeSmall               > Shortcut for small size
 * @param {string}  cozenBtnSizeNormal              > Shortcut for normal size
 * @param {string}  cozenBtnSizeLarge               > Shortcut for large size
 * @param {string}  cozenBtnType        = 'default' > Type of the button (change the color)
 * @param {string}  cozenBtnTypePrimary             > Shortcut for primary type
 * @param {string}  cozenBtnTypeTransparent         > Shortcut for transparent type
 * @param {string}  cozenBtnTypeCold                > Shortcut for cold type
 * @param {string}  cozenBtnTypeDefault             > Shortcut for default type
 * @param {string}  cozenBtnTypeInfo                > Shortcut for info type
 * @param {string}  cozenBtnTypeSuccess             > Shortcut for success type
 * @param {string}  cozenBtnTypeWarning             > Shortcut for warning type
 * @param {string}  cozenBtnTypeError               > Shortcut for error type
 * @param {string}  cozenBtnIconLeft                > Add an icon the to left (write the class)
 * @param {string}  cozenBtnIconRight               > Add an icon the to right (write the class)
 * @param {boolean} cozenBtnAutoSizing  = false     > Shortcut to activate the auto sizing (instead of 100% width)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btn', [])
        .directive('cozenBtn', cozenBtn);

    cozenBtn.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenBtn(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnOnClick : '&',
                cozenBtnActive  : '=?',
                cozenBtnDisabled: '=?',
                cozenBtnLoader  : '=?'
            },
            templateUrl: 'directives/btn/btn.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex
            };

            var data = {
                directive: 'cozenBtn'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnSize)) {
                    if (angular.isDefined(attrs.cozenBtnSizeSmall)) scope._cozenBtnSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnSizeNormal)) scope._cozenBtnSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnSizeLarge)) scope._cozenBtnSize = 'large';
                    else scope._cozenBtnSize = 'normal';
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenBtnType)) {
                    if (angular.isDefined(attrs.cozenBtnTypeDefault)) scope._cozenBtnType = 'default';
                    else if (angular.isDefined(attrs.cozenBtnTypePrimary)) scope._cozenBtnType = 'primary';
                    else if (angular.isDefined(attrs.cozenBtnTypeTransparent)) scope._cozenBtnType = 'transparent';
                    else if (angular.isDefined(attrs.cozenBtnTypeCold)) scope._cozenBtnType = 'cold';
                    else if (angular.isDefined(attrs.cozenBtnTypeInfo)) scope._cozenBtnType = 'info';
                    else if (angular.isDefined(attrs.cozenBtnTypeSuccess)) scope._cozenBtnType = 'success';
                    else if (angular.isDefined(attrs.cozenBtnTypeWarning)) scope._cozenBtnType = 'warning';
                    else if (angular.isDefined(attrs.cozenBtnTypeError)) scope._cozenBtnType = 'error';
                    else scope._cozenBtnType = 'default';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnActive)) scope.cozenBtnActive = false;
                if (angular.isUndefined(attrs.cozenBtnDisabled)) scope.cozenBtnDisabled = false;
                if (angular.isUndefined(attrs.cozenBtnLoader)) scope.cozenBtnLoader = false;

                // Default values (attributes)
                scope._cozenBtnId        = angular.isDefined(attrs.cozenBtnId) ? attrs.cozenBtnId : '';
                scope._cozenBtnLabel     = attrs.cozenBtnLabel;
                scope._cozenBtnIconLeft  = angular.isDefined(attrs.cozenBtnIconLeft) ? attrs.cozenBtnIconLeft : '';
                scope._cozenBtnIconRight = angular.isDefined(attrs.cozenBtnIconRight) ? attrs.cozenBtnIconRight : '';

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

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenBtnSize, scope._cozenBtnType];
                if (scope.cozenBtnActive) classList.push('active');
                if (scope.cozenBtnDisabled) classList.push('disabled');
                if (scope.cozenBtnLoader) classList.push('loading');
                if (angular.isDefined(attrs.cozenBtnAutoSizing)) classList.push('auto');
                return classList;
            }

            function onClick($event) {
                $event.stopPropagation();
                if (scope.cozenBtnDisabled) return;
                if (scope.cozenBtnLoader) return;
                if (Methods.isFunction(scope.cozenBtnOnClick)) scope.cozenBtnOnClick();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'OnClick');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnDisabled) tabIndex = -1;
                else if (scope.cozenBtnLoader) tabIndex = -1;
                return tabIndex;
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-btn-check
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnCheckOnChange         > Callback function called on change
 * @param {boolean}  cozenBtnCheckDisabled = false > Disable the button check
 * @param {boolean}  cozenBtnCheckModel            > Model (ak ng-model) which is edited by this directive [required]
 *
 * [Attributes params]
 * @param {number}  cozenBtnCheckId                      > Id of the button check
 * @param {string}  cozenBtnCheckSize         = 'normal' > Size of the button check
 * @param {string}  cozenBtnCheckSizeSmall               > Shortcut for small size
 * @param {string}  cozenBtnCheckSizeNormal              > Shortcut for normal size
 * @param {string}  cozenBtnCheckSizeLarge               > Shortcut for large size
 * @param {boolean} cozenBtnCheckAnimationIn  = true     > Add an animation on show
 * @param {boolean} cozenBtnCheckAnimationOut = true     > Add an animation on hide
 * @param {string}  cozenBtnCheckLabel                   > Text added with the button check
 * @param {string}  cozenBtnCheckTooltip                 > Text of the tooltip
 * @param {boolean} cozenBtnCheckStartRight   = true     > Display the check on the right of the label
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btnCheck', [])
        .directive('cozenBtnCheck', cozenBtnCheck);

    cozenBtnCheck.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenBtnCheck(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnCheckOnChange: '&',
                cozenBtnCheckDisabled: '=?',
                cozenBtnCheckModel   : '=?'
            },
            templateUrl: 'directives/btn-check/btnCheck.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex
            };

            var data = {
                directive: 'cozenBtnCheck'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnCheckSize)) {
                    if (angular.isDefined(attrs.cozenBtnCheckSizeSmall)) scope._cozenBtnCheckSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnCheckSizeNormal)) scope._cozenBtnCheckSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnCheckSizeLarge)) scope._cozenBtnCheckSize = 'large';
                    else scope._cozenBtnCheckSize = 'normal';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnCheckDisabled)) scope.cozenBtnCheckDisabled = false;

                // Default values (attributes)
                scope._cozenBtnCheckId           = angular.isDefined(attrs.cozenBtnCheckId) ? attrs.cozenBtnCheckId : '';
                scope._cozenBtnCheckAnimationIn  = angular.isDefined(attrs.cozenBtnCheckAnimationIn) ? JSON.parse(attrs.cozenBtnCheckAnimationIn) : true;
                scope._cozenBtnCheckAnimationOut = angular.isDefined(attrs.cozenBtnCheckAnimationOut) ? JSON.parse(attrs.cozenBtnCheckAnimationOut) : true;
                scope._cozenBtnCheckLabel        = angular.isDefined(attrs.cozenBtnCheckLabel) ? attrs.cozenBtnCheckLabel : '';
                scope._cozenBtnCheckTooltip      = angular.isDefined(attrs.cozenBtnCheckTooltip) ? attrs.cozenBtnCheckTooltip : '';
                scope._cozenBtnCheckStartRight   = angular.isDefined(attrs.cozenBtnCheckStartRight) ? JSON.parse(attrs.cozenBtnCheckStartRight) : true;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnCheckModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnCheckModel != 'boolean') {
                    Methods.directiveErrorBoolean(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenBtnCheckSize];
                if (scope.cozenBtnCheckDisabled) classList.push('disabled');
                if (scope.cozenBtnCheckModel) classList.push('active');
                if (scope._cozenBtnCheckStartRight) classList.push('check-right');
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnCheckDisabled) return;
                scope.cozenBtnCheckModel = !scope.cozenBtnCheckModel;
                if (Methods.isFunction(scope.cozenBtnCheckOnChange)) scope.cozenBtnCheckOnChange();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnCheckDisabled) tabIndex = -1;
                return tabIndex;
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-btn-radio
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnRadioOnChange         > Callback function called on change
 * @param {boolean}  cozenBtnRadioDisabled = false > Disable the button radio
 * @param {boolean}  cozenBtnRadioModel            > Model (ak ng-model) which is edited by this directive [required]
 *
 * [Attributes params]
 * @param {number}  cozenBtnRadioId                      > Id of the button radio
 * @param {string}  cozenBtnRadioSize         = 'normal' > Size of the button radio
 * @param {string}  cozenBtnRadioSizeSmall               > Shortcut for small size
 * @param {string}  cozenBtnRadioSizeNormal              > Shortcut for normal size
 * @param {string}  cozenBtnRadioSizeLarge               > Shortcut for large size
 * @param {boolean} cozenBtnRadioAnimationIn  = true     > Add an animation on show
 * @param {boolean} cozenBtnRadioAnimationOut = true     > Add an animation on hide
 * @param {string}  cozenBtnRadioLabel                   > Text added with the button radio
 * @param {string}  cozenBtnRadioGroup                   > Group to link radio together [required]
 * @param {string}  cozenBtnRadioTooltip                 > Text of the tooltip
 * @param {boolean} cozenBtnRadioStartRight   = true     > Display the bubble on the right of the label
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btnRadio', [])
        .directive('cozenBtnRadio', cozenBtnRadio);

    cozenBtnRadio.$inject = [
        'Themes',
        'CONFIG',
        '$rootScope',
        'rfc4122'
    ];

    function cozenBtnRadio(Themes, CONFIG, $rootScope, rfc4122) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnRadioOnChange: '&',
                cozenBtnRadioDisabled: '=?',
                cozenBtnRadioModel   : '=?'
            },
            templateUrl: 'directives/btn-radio/btnRadio.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init          : init,
                hasError      : hasError,
                destroy       : destroy,
                getMainClass  : getMainClass,
                onClick       : onClick,
                getTabIndex   : getTabIndex,
                onGroupChanged: onGroupChanged
            };

            var data = {
                directive : 'cozenBtnRadio',
                groupEvent: {
                    onChange: 'cozenBtnRadioOnChange' + Methods.capitalizeFirstLetter(attrs.cozenBtnRadioGroup)
                },
                group     : attrs.cozenBtnRadioGroup,
                uuid      : rfc4122.v4()
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnRadioSize)) {
                    if (angular.isDefined(attrs.cozenBtnRadioSizeSmall)) scope._cozenBtnRadioSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeNormal)) scope._cozenBtnRadioSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeLarge)) scope._cozenBtnRadioSize = 'large';
                    else scope._cozenBtnRadioSize = 'normal';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnRadioDisabled)) scope.cozenBtnRadioDisabled = false;

                // Default values (attributes)
                scope._cozenBtnRadioId           = angular.isDefined(attrs.cozenBtnRadioId) ? attrs.cozenBtnRadioId : '';
                scope._cozenBtnRadioAnimationIn  = angular.isDefined(attrs.cozenBtnRadioAnimationIn) ? JSON.parse(attrs.cozenBtnRadioAnimationIn) : true;
                scope._cozenBtnRadioAnimationOut = angular.isDefined(attrs.cozenBtnRadioAnimationOut) ? JSON.parse(attrs.cozenBtnRadioAnimationOut) : true;
                scope._cozenBtnRadioLabel        = angular.isDefined(attrs.cozenBtnRadioLabel) ? attrs.cozenBtnRadioLabel : '';
                scope._cozenBtnRadioTooltip      = angular.isDefined(attrs.cozenBtnRadioTooltip) ? attrs.cozenBtnRadioTooltip : '';
                scope._cozenBtnRadioStartRight   = angular.isDefined(attrs.cozenBtnRadioStartRight) ? JSON.parse(attrs.cozenBtnRadioStartRight) : true;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
                $rootScope.$on(data.groupEvent.onChange, methods.onGroupChanged);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnRadioModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnRadioModel != 'boolean') {
                    Methods.directiveErrorBoolean(data.directive, 'Model');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenBtnRadioGroup)) {
                    Methods.directiveErrorRequired(data.directive, 'Group');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenBtnRadioSize];
                if (scope.cozenBtnRadioDisabled) classList.push('disabled');
                if (scope.cozenBtnRadioModel) classList.push('active');
                if (scope._cozenBtnRadioStartRight) classList.push('bubble-right');
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnRadioDisabled) return;
                if (scope.cozenBtnRadioModel) return;
                scope.cozenBtnRadioModel = true;
                if (Methods.isFunction(scope.cozenBtnRadioOnChange)) scope.cozenBtnRadioOnChange();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
                $rootScope.$broadcast(data.groupEvent.onChange, data);
            }

            function getTabIndex() {
                var tabIndex = 0;
                return tabIndex;
            }

            function onGroupChanged(event, eventData) {
                if (eventData.group == data.group) {
                    if (eventData.uuid != data.uuid) {
                        if (!scope.cozenBtnRadioModel) return;
                        scope.cozenBtnRadioModel = false;
                        if (Methods.isFunction(scope.cozenBtnRadioOnChange)) scope.cozenBtnRadioOnChange();
                        if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
                    }
                }
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-btn-toggle
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnToggleOnChange         > Callback function called on change
 * @param {boolean}  cozenBtnToggleDisabled = false > Disable the button toggle
 * @param {boolean}  cozenBtnToggleModel            > Model (ak ng-model) which is edited by this directive [required]
 *
 * [Attributes params]
 * @param {number}  cozenBtnToggleId                    > Id of the button toggle
 * @param {string}  cozenBtnToggleSize       = 'normal' > Size of the button toggle
 * @param {string}  cozenBtnToggleSizeSmall             > Shortcut for small size
 * @param {string}  cozenBtnToggleSizeNormal            > Shortcut for normal size
 * @param {string}  cozenBtnToggleSizeLarge             > Shortcut for large size
 * @param {boolean} cozenBtnToggleAnimation  = true     > Add an animation on toggle
 * @param {string}  cozenBtnToggleLabel                 > Text added with the button toggle
 * @param {string}  cozenBtnToggleTooltip               > Text of the tooltip
 * @param {boolean} cozenBtnToggleStartRight = true     > Display the toggle on the right of the label
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btnToggle', [])
        .directive('cozenBtnToggle', cozenBtnToggle);

    cozenBtnToggle.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenBtnToggle(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnToggleOnChange: '&',
                cozenBtnToggleDisabled: '=?',
                cozenBtnToggleModel   : '=?'
            },
            templateUrl: 'directives/btn-toggle/btnToggle.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex
            };

            var data = {
                directive: 'cozenBtnToggle'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Toggleing required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnToggleSize)) {
                    if (angular.isDefined(attrs.cozenBtnToggleSizeSmall)) scope._cozenBtnToggleSize = 'small';
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeNormal)) scope._cozenBtnToggleSize = 'normal';
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeLarge)) scope._cozenBtnToggleSize = 'large';
                    else scope._cozenBtnToggleSize = 'normal';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnToggleDisabled)) scope.cozenBtnToggleDisabled = false;

                // Default values (attributes)
                scope._cozenBtnToggleId         = angular.isDefined(attrs.cozenBtnToggleId) ? attrs.cozenBtnToggleId : '';
                scope._cozenBtnToggleAnimation  = angular.isDefined(attrs.cozenBtnToggleAnimation) ? JSON.parse(attrs.cozenBtnToggleAnimation) : true;
                scope._cozenBtnToggleLabel      = angular.isDefined(attrs.cozenBtnToggleLabel) ? attrs.cozenBtnToggleLabel : '';
                scope._cozenBtnToggleTooltip    = angular.isDefined(attrs.cozenBtnToggleTooltip) ? attrs.cozenBtnToggleTooltip : '';
                scope._cozenBtnToggleStartRight = angular.isDefined(attrs.cozenBtnToggleStartRight) ? JSON.parse(attrs.cozenBtnToggleStartRight) : true;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnToggleModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnToggleModel != 'boolean') {
                    Methods.directiveErrorBoolean(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenBtnToggleSize];
                if (scope.cozenBtnToggleDisabled) classList.push('disabled');
                if (scope.cozenBtnToggleModel) classList.push('active');
                if (scope._cozenBtnToggleStartRight) classList.push('switch-right');
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnToggleDisabled) return;
                scope.cozenBtnToggleModel = !scope.cozenBtnToggleModel;
                if (Methods.isFunction(scope.cozenBtnToggleOnChange)) scope.cozenBtnToggleOnChange();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnToggleDisabled) tabIndex = -1;
                return tabIndex;
            }
        }
    }

})(window.angular);


(function (angular) {
  'use strict';

  angular
    .module('cozenLib')
    .provider('Config', ConfigProvider);

  ConfigProvider.$inject = [
    'CONFIG'
  ];

  function ConfigProvider(CONFIG) {

    this.debug = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('debug');
      else CONFIG.debug = value;
      return this;
    };

    this.currentLanguage = function (value) {
      var list = CONFIG.languages;
      if (!Methods.isInList(list, value)) Methods.dataMustBeInThisList('currentLanguage', list);
      else CONFIG.currentLanguage = value;
      return this;
    };

    this.scrollsBar = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('scrollsBar');
      else CONFIG.scrollsBar = value;
      return this;
    };

    this.scrollsBarConfig = function (config) {
      if (typeof config != 'object') Methods.dataMustBeObject('scrollsBarConfig');
      else CONFIG.scrollsBarConfig = config;
      return this;
    };

    this.dropdownAutoCloseOthers = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('dropdownAutoCloseOthers');
      else CONFIG.dropdown.autoCloseOthers = value;
      return this;
    };

    this.inputDisplayModelLength = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('inputDisplayModelLength');
      else CONFIG.input.displayModelLength = value;
      return this;
    };

    this.textareaDisplayModelLength = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaDisplayModelLength');
      else CONFIG.textarea.displayModelLength = value;
      return this;
    };

    this.dropdownDisplayModelLength = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('dropdownDisplayModelLength');
      else CONFIG.dropdown.displayModelLength = value;
      return this;
    };

    this.requiredType = function (value) {
      var list = ['star', 'icon'];
      if (!Methods.isInList(list, value)) Methods.dataMustBeInThisList('requiredType', list);
      else CONFIG.required.type = value;
      return this;
    };

    this.requiredIcon = function (value) {
      CONFIG.required.icon = value;
      return this;
    };

    this.alertTextAlign = function (value) {
      CONFIG.alert.textAlign = value;
      return this;
    };

    this.alertCloseBtnEnabled = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertCloseBtnEnabled');
      else CONFIG.alert.closeBtn.enabled = value;
      return this;
    };

    this.alertCloseBtnTootlip = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertCloseBtnTootlip');
      else CONFIG.alert.closeBtn.tooltip = value;
      return this;
    };

    this.alertAnimationIn = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertAnimationIn');
      else CONFIG.alert.animation.in = value;
      return this;
    };

    this.alertAnimationOut = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertAnimationOut');
      else CONFIG.alert.animation.out = value;
      return this;
    };

    this.alertIconLeftDefault = function (value) {
      CONFIG.alert.iconLeft.default = value;
      return this;
    };

    this.alertIconLeftInfo = function (value) {
      CONFIG.alert.iconLeft.info = value;
      return this;
    };

    this.alertIconLeftSuccess = function (value) {
      CONFIG.alert.iconLeft.success = value;
      return this;
    };

    this.alertIconLeftWarning = function (value) {
      CONFIG.alert.iconLeft.warning = value;
      return this;
    };

    this.alertIconLeftError = function (value) {
      CONFIG.alert.iconLeft.error = value;
      return this;
    };

    this.popupHeader = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupHeader');
      else CONFIG.popup.header = value;
      return this;
    };

    this.popupFooter = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupFooter');
      else CONFIG.popup.footer = value;
      return this;
    };

    this.popupAnimationInEnabled = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupAnimationInEnabled');
      else CONFIG.popup.animation.in.enabled = value;
      return this;
    };

    this.popupAnimationOutEnabled = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupAnimationOutEnabled');
      else CONFIG.popup.animation.out.enabled = value;
      return this;
    };

    this.popupAnimationInAnimation = function (value) {
      CONFIG.popup.animation.in.animation = value;
      return this;
    };

    this.popupAnimationOutAnimation = function (value) {
      CONFIG.popup.animation.out.animation = value;
      return this;
    };

    this.popupEasyClose = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupEasyClose');
      else CONFIG.popup.easyClose = value;
      return this;
    };

    this.popupCloseBtn = function (value) {
      if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupCloseBtn');
      else CONFIG.popup.closeBtn = value;
      return this;
    };

    this.$get = Config;

    Config.$inject = [];

    function Config() {
      return {};
    }
  }

})(window.angular);

/**
 * @ngdoc directive
 * @name cozen-dropdown
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 * @param {string}   cozenDropdownModel            > Value edited by the dropdown [required]
 * @param {boolean}  cozenDropdownDisabled = false > Disable the dropdown
 * @param {function} cozenDropdownOnChange         > Callback function called on change
 *
 * [Attributes params]
 * @param {number}  cozenDropdownId                                             > Id of the dropdown
 * @param {string}  cozenDropdownSize             = 'normal'                    > Size of the dropdown
 * @param {string}  cozenDropdownSizeSmall                                      > Shortcut for small size
 * @param {string}  cozenDropdownSizeNormal                                     > Shortcut for normal size
 * @param {string}  cozenDropdownSizeLarge                                      > Shortcut for large size
 * @param {boolean} cozenDropdownRequired         = false                       > Required input
 * @param {boolean} cozenDropdownErrorDesign      = true                        > Add style when error
 * @param {boolean} cozenDropdownSuccessDesign    = true                        > Add style when success
 * @param {string}  cozenDropdownPlaceholder                                    > Text for the placeholder
 * @param {string}  cozenDropdownIconLeft                                       > Text for the icon left (font)
 * @param {string}  cozenDropdownName             = uuid                        > Name of the input
 * @param {boolean} cozenDropdownValidator        = 'touched'                   > Define after what type of event the input must add more ui color
 * @param {boolean} cozenDropdownValidatorAll                                   > Shortcut for all type
 * @param {boolean} cozenDropdownValidatorTouched                               > Shortcut for touched type
 * @param {boolean} cozenDropdownEasyNavigation   = true                        > Allow to navigate with arrows even if the pointer is out of the dropdown
 * @param {boolean} cozenDropdownMultiple         = false                       > Allow to select multiple data
 * @param {boolean} cozenDropdownAutoClose        = true                        > Close the dropdown after had selected a data (only for single)
 * @param {boolean} cozenDropdownEasyClose        = true                        > Auto close the dropdown when a click is outside
 * @param {boolean} cozenDropdownShowTick         = true                        > Display an icon to the right when a data is selected
 * @param {boolean} cozenDropdownTickIcon         = 'fa fa-check'               > Define what type of icon should it be
 * @param {string}  cozenDropdownModelEnhanced    = 'last'                      > Choose the way of display the selected data text in the input [last, all, count, number (value expected)]
 * @param {number}  cozenDropdownMaxHeight        = 200                         > Max-height of the dropdown
 * @param {string}  cozenDropdownLabel                                          > Add a label on the top of the dropdown
 * @param {string}  cozenDropdownRequiredTooltip  = 'dropdown_required_tooltip' > Text to display for the tooltip of the required element
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLib.dropdown', [
      'cozenLib.dropdown.group',
      'cozenLib.dropdown.search',
      'cozenLib.dropdown.simple'
    ])
    .directive('cozenDropdown', cozenDropdown);

  cozenDropdown.$inject = [
    'Themes',
    'CONFIG',
    '$window',
    '$rootScope',
    'rfc4122',
    '$filter',
    '$timeout'
  ];

  function cozenDropdown(Themes, CONFIG, $window, $rootScope, rfc4122, $filter, $timeout) {
    return {
      link            : link,
      restrict        : 'E',
      replace         : false,
      transclude      : true,
      scope           : {
        cozenDropdownModel   : '=?',
        cozenDropdownDisabled: '=?',
        cozenDropdownOnChange: '&'
      },
      templateUrl     : 'directives/dropdown/dropdown.template.html',
      bindToController: true,
      controller      : cozenDropdownCtrl,
      controllerAs    : 'vm'
    };

    function link(scope, element, attrs) {
      var methods = {
        init                     : init,
        hasError                 : hasError,
        destroy                  : destroy,
        getMainClass             : getMainClass,
        onHover                  : onHover,
        onKeyDown                : onKeyDown,
        onChange                 : onChange,
        getForm                  : getForm,
        onClick                  : onClick,
        onAutoCloseOthers        : onAutoCloseOthers,
        onWindowClick            : onWindowClick,
        onChildSelected          : onChildSelected,
        onChildSearched          : onChildSearched,
        setScrollBarHeight       : setScrollBarHeight,
        onActiveChild            : onActiveChild,
        defineTranscludeDirection: defineTranscludeDirection,
        getArrowClass            : getArrowClass,
        getTranscludeStyle       : getTranscludeStyle
      };

      var data = {
        directive       : 'cozenDropdown',
        uuid            : rfc4122.v4(),
        transcludeHeight: 0,
        touched         : false
      };

      scope._isReady = false;

      methods.init();

      function init() {

        // Public functions
        scope._methods = {
          getMainClass      : getMainClass,
          onHover           : onHover,
          onChange          : onChange,
          onClick           : onClick,
          getArrowClass     : getArrowClass,
          getTranscludeStyle: getTranscludeStyle
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenDropdownSize)) {
          if (angular.isDefined(attrs.cozenDropdownSizeSmall)) scope._cozenDropdownSize = 'small';
          else if (angular.isDefined(attrs.cozenDropdownSizeNormal)) scope._cozenDropdownSize = 'normal';
          else if (angular.isDefined(attrs.cozenDropdownSizeLarge)) scope._cozenDropdownSize = 'large';
          else scope._cozenDropdownSize = 'normal';
        }

        // Shortcut values (validator)
        if (angular.isUndefined(attrs.cozenDropdownValidator)) {
          if (angular.isDefined(attrs.cozenDropdownValidatorAll)) scope._cozenDropdownValidator = 'all';
          else if (angular.isDefined(attrs.cozenDropdownValidatorTouched)) scope._cozenDropdownValidator = 'touched';
          else scope._cozenDropdownValidator = 'touched';
        }

        // Check the model enhanced mod
        if (angular.isUndefined(attrs.cozenDropdownModelEnhanced)) scope._cozenDropdownModelEnhanced = 'last';
        else {
          if (attrs.cozenDropdownModelEnhanced == 'last') scope._cozenDropdownModelEnhanced = 'last';
          else if (attrs.cozenDropdownModelEnhanced == 'count') scope._cozenDropdownModelEnhanced = 'count';
          else if (attrs.cozenDropdownModelEnhanced == 'all') scope._cozenDropdownModelEnhanced = 'all';
          else if (!isNaN(attrs.cozenDropdownModelEnhanced)) scope._cozenDropdownModelEnhanced = parseInt(attrs.cozenDropdownModelEnhanced);
          else {
            scope._cozenDropdownModelEnhanced = 'last';
            Methods.directiveWarningUnmatched(data.directive, 'ModelEnhanced', 'last');
          }
        }

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenDropdownDisabled)) scope.vm.cozenDropdownDisabled = false;
        scope.vm.cozenDropdownModelEnhanced = '';

        // Default values (attributes)
        scope._cozenDropdownId              = angular.isDefined(attrs.cozenDropdownId) ? attrs.cozenDropdownId : '';
        scope._cozenDropdownRequired        = angular.isDefined(attrs.cozenDropdownRequired) ? JSON.parse(attrs.cozenDropdownRequired) : false;
        scope._cozenDropdownErrorDesign     = angular.isDefined(attrs.cozenDropdownErrorDesign) ? JSON.parse(attrs.cozenDropdownErrorDesign) : true;
        scope._cozenDropdownSuccessDesign   = angular.isDefined(attrs.cozenDropdownSuccessDesign) ? JSON.parse(attrs.cozenDropdownSuccessDesign) : true;
        scope._cozenDropdownPlaceholder     = angular.isDefined(attrs.cozenDropdownPlaceholder) ? attrs.cozenDropdownPlaceholder : '';
        scope._cozenDropdownIconLeft        = angular.isDefined(attrs.cozenDropdownIconLeft) ? attrs.cozenDropdownIconLeft : '';
        scope._cozenDropdownName            = angular.isDefined(attrs.cozenDropdownName) ? attrs.cozenDropdownName : data.uuid;
        scope._cozenDropdownEasyNavigation  = angular.isDefined(attrs.cozenDropdownEasyNavigation) ? JSON.parse(attrs.cozenDropdownEasyNavigation) : true;
        scope._cozenDropdownMultiple        = angular.isDefined(attrs.cozenDropdownMultiple) ? JSON.parse(attrs.cozenDropdownMultiple) : false;
        scope._cozenDropdownAutoClose       = angular.isDefined(attrs.cozenDropdownAutoClose) ? JSON.parse(attrs.cozenDropdownAutoClose) : true;
        scope._cozenDropdownEasyClose       = angular.isDefined(attrs.cozenDropdownEasyClose) ? JSON.parse(attrs.cozenDropdownEasyClose) : true;
        scope._cozenDropdownShowTick        = angular.isDefined(attrs.cozenDropdownShowTick) ? JSON.parse(attrs.cozenDropdownShowTick) : true;
        scope._cozenDropdownTickIcon        = angular.isDefined(attrs.cozenDropdownTickIcon) ? attrs.cozenDropdownTickIcon : 'fa fa-check';
        scope._cozenDropdownMaxHeight       = angular.isDefined(attrs.cozenDropdownMaxHeight) ? JSON.parse(attrs.cozenDropdownMaxHeight) : 200;
        scope._cozenDropdownDirection       = 'down';
        scope._cozenDropdownLabel           = angular.isDefined(attrs.cozenDropdownLabel) ? attrs.cozenDropdownLabel : '';
        scope._cozenDropdownRequiredConfig  = CONFIG.required;
        scope._cozenDropdownRequiredTooltip = angular.isDefined(attrs.cozenDropdownRequiredTooltip) ? attrs.cozenDropdownRequiredTooltip : 'dropdown_required_tooltip';
        scope._cozenDropdownUuid            = data.uuid;

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme           = Themes.getActiveTheme();
        scope.isHover                = false;
        scope.childrenUuid           = [];
        scope.activeChild            = 0;
        scope._cozenDropdownCollapse = false;

        // To get the name of the form
        scope.$on('cozenFormName', function (event, eventData) {
          scope._cozenDropdownForm = eventData.name;
        });

        // Watch the up/down key to navigate
        $window.addEventListener('keydown', methods.onKeyDown);

        // To auto close when a drop down is show
        scope.$on('cozenDropdownAutoCloseOthers', methods.onAutoCloseOthers);

        // When a child is toggle
        scope.$on('cozenDropdownSelected', methods.onChildSelected);

        // When the search change (from each child)
        scope.$on('cozenDropdownItemDisabled', methods.onChildSearched);

        // Update the active child when a change occur in a child
        scope.$on('cozenDropdownActiveChild', methods.onActiveChild);

        // Define the transclude position
        $window.addEventListener('scroll', methods.defineTranscludeDirection);

        // ScrollBar
        scope._cozenScrollBar            = CONFIG.scrollsBar;
        scope._cozenScrollBarConfig      = CONFIG.scrollsBarConfig;
        scope._cozenScrollBarConfig.axis = 'y';
        methods.setScrollBarHeight();

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenDropdownModel)) {
          Methods.directiveErrorRequired(data.directive, 'Model');
          return true;
        }
        if (angular.isDefined(attrs.cozenDropdownName)) {
          if (Methods.isNullOrEmpty(attrs.cozenDropdownName)) {
            Methods.directiveErrorEmpty(data.directive, 'Name');
            return true;
          }
        }
        return false;
      }

      function destroy() {
        $window.removeEventListener('keydown', methods.onKeyDown);
        $window.removeEventListener('click', methods.onWindowClick);
        $window.removeEventListener('scroll', methods.onScroll);
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        if (!Methods.isNullOrEmpty(scope._cozenDropdownForm)) {
          var classList = [scope._activeTheme, scope._cozenDropdownSize, 'icon-right', scope._cozenDropdownDirection];
          switch (scope._cozenDropdownValidator) {
            case 'touched':
              if (data.touched) {
                if (!Methods.isNullOrEmpty(scope.vm.cozenDropdownModelEnhanced)) classList.push('success-design');
                else if (scope._cozenDropdownRequired) classList.push('error-design');
              }
              break;
            case 'all':
              if (!Methods.isNullOrEmpty(scope.vm.cozenDropdownModelEnhanced)) classList.push('success-design');
              else if (scope._cozenDropdownRequired) classList.push('error-design');
              break;
          }
          if (scope.vm.cozenDropdownDisabled) classList.push('disabled');
          if (scope._cozenDropdownIconLeft) classList.push('icon-left');
          return classList;
        }
      }

      function onHover($event, state) {
        scope.isHover = state;
        if (!scope._cozenDropdownEasyNavigation) {
          if (!scope.isHover) {
            $rootScope.$broadcast('cozenDropdownActive', {
              uuid: null
            });
          }
        }
      }

      function onKeyDown(event) {
        if (scope.vm.cozenDropdownDisabled) return;
        if (!scope._cozenDropdownCollapse) return;
        if (!scope._cozenDropdownEasyNavigation) {
          if (!scope.isHover) return;
        }
        if (event.keyCode == 38 || event.keyCode == 40) {

          event.stopPropagation();
          event.preventDefault();

          // Search for a new active child (escape disabled ones)
          var length = scope.childrenUuid.length, i = 0;
          var value  = angular.copy(scope.activeChild);
          do {
            if (event.keyCode == 38) value = decrease(value, length);
            else if (event.keyCode == 40) value = increase(value, length);
            if (!scope.childrenUuid[value].disabled) break;
            i++;
          } while (i < length);

          scope.activeChild = value;
          $rootScope.$broadcast('cozenDropdownActive', {
            uuid: scope.childrenUuid[scope.activeChild].uuid
          });
        }

        function decrease(value, max) {
          if (value > 0) value--;
          else value = max - 1;
          return value;
        }

        function increase(value, max) {
          if (value < max - 1) value++;
          else value = 0;
          return value;
        }
      }

      function onChange($event) {
        if (scope.vm.cozenDropdownDisabled) return;
        if (Methods.isFunction(scope.cozenDropdownOnChange)) scope.cozenDropdownOnChange();
        if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
      }

      function getForm() {
        var form = scope.$parent.$parent[scope._cozenDropdownForm];
        if (Methods.isNullOrEmpty(form)) {
          form = scope.$parent.$parent.$parent[scope._cozenDropdownForm];
          if (Methods.isNullOrEmpty(form)) {
            form = scope.$parent.$parent.$parent.$parent[scope._cozenDropdownForm];
            if (Methods.isNullOrEmpty(form)) {
              form = scope.$parent.$parent.$parent.$parent.$parent[scope._cozenDropdownForm];
              if (Methods.isNullOrEmpty(form)) {
                form = scope.$parent.$parent.$parent.$parent.$parent.$parent[scope._cozenDropdownForm];
                if (Methods.isNullOrEmpty(form)) {
                  return form;
                } else return form;
              } else return form;
            } else return form;
          } else return form;
        } else return form;
      }

      function onClick($event) {
        data.touched = true;
        if (!Methods.isNullOrEmpty($event)) $event.stopPropagation();
        if (!scope.vm.cozenDropdownDisabled) {
          scope._cozenDropdownCollapse = !scope._cozenDropdownCollapse;
          scope.$broadcast('cozenDropdownCollapse', {
            collapse: scope._cozenDropdownCollapse
          });

          if (scope._cozenDropdownCollapse) {

            // Auto close all other dropdown
            if (CONFIG.dropdown.autoCloseOthers) {
              $rootScope.$broadcast('cozenDropdownAutoCloseOthers', {
                name: scope._cozenDropdownName
              });
            }

            // Watch the click
            if (scope._cozenDropdownEasyClose) {
              $window.addEventListener('click', methods.onWindowClick);
            }

            $timeout(function () {
              data.transcludeHeight = element.find('.cozen-dropdown-transclude .ng-transclude')[0].offsetHeight;
              methods.defineTranscludeDirection();
            }, 1);
          } else {
            $window.removeEventListener('click', methods.onWindowClick);
          }
        }
      }

      function onAutoCloseOthers(event, data) {
        if (scope._cozenDropdownCollapse) {
          if (scope._cozenDropdownName != data.name) {
            methods.onClick();
          }
        }
      }

      // Listener call it only if the dropdown is open and easy close at true
      function onWindowClick() {

        // If not hover the dropdown, close it
        if (!scope.isHover) {
          methods.onClick();

          // Required to refresh the DOM and see the change
          Methods.safeApply(scope);
        }
      }

      function onChildSelected(event, data) {
        if (data.dropdown == scope._cozenDropdownName) {

          // ModelEnhanced stuff
          if (data.selected && scope._cozenDropdownModelEnhanced == 'last') scope.vm.cozenDropdownModelEnhanced = data.label;
          else if (scope._cozenDropdownModelEnhanced != 'last') scope.vm.cozenDropdownModelEnhanced = '';

          if (scope._cozenDropdownMultiple) {

            // Update the array and forge the model
            var selectedValues          = 0;
            scope.vm.cozenDropdownModel = [];
            scope.childrenUuid.forEach(function (child) {

              // Updaye the new value
              if (child.uuid == data.uuid) {
                child.selected = data.selected;
                child.value    = data.value;
              }

              // Update the model
              if (!child.disabled && child.selected) {
                scope.vm.cozenDropdownModel.push(child.value);

                // ModelEnhanced : all & number
                if (scope._cozenDropdownModelEnhanced == 'all' || typeof scope._cozenDropdownModelEnhanced == 'number') {
                  if (selectedValues > 0) scope.vm.cozenDropdownModelEnhanced += ', ';
                  scope.vm.cozenDropdownModelEnhanced += child.label;
                  selectedValues++;
                }

                // ModelEnhanced : count (first result)
                else if (scope._cozenDropdownModelEnhanced == 'count') {
                  scope.vm.cozenDropdownModelEnhanced = child.label;
                  selectedValues++;
                }

                // ModelEnhanced : last
                else if (scope._cozenDropdownModelEnhanced == 'last') selectedValues++;
              }
            });

            // ModelEnhanced : number
            var useCount = false;
            if (typeof scope._cozenDropdownModelEnhanced == 'number') {
              if (selectedValues > scope._cozenDropdownModelEnhanced) {
                useCount = true;
              }
            }

            // ModelEnhanced : count (if more than one result)
            if ((scope._cozenDropdownModelEnhanced == 'count' && selectedValues > 1) || useCount) {
              scope.vm.cozenDropdownModelEnhanced = $filter('translate')('dropdown_count', {
                selected: selectedValues,
                total   : scope.childrenUuid.length
              });
            }

            // ModelEnhanced : count (if all selected)
            if ((scope._cozenDropdownModelEnhanced == 'count' || useCount) && selectedValues == scope.childrenUuid.length) {
              scope.vm.cozenDropdownModelEnhanced = $filter('translate')('dropdown_count_all');
            }

            // No data selected
            if (selectedValues == 0) {
              scope.vm.cozenDropdownModel         = '';
              scope.vm.cozenDropdownModelEnhanced = '';
            }
          } else {

            // Change the model
            if (data.selected) {
              scope.vm.cozenDropdownModel = data.value;

              // Deselect the other children
              scope.$broadcast('cozenDropdownDeselect', {
                uuid: data.uuid
              });
            } else scope.vm.cozenDropdownModel = '';
            scope.vm.cozenDropdownModelEnhanced = scope.vm.cozenDropdownModel;
          }
        }
      }

      function onChildSearched(event, params) {
        if (scope._cozenDropdownName == params.dropdown) {
          var disabled = 0, length = scope.childrenUuid.length;
          for (var i = 0; i < length; i++) {
            if (scope.childrenUuid[i].uuid == params.uuid) {
              scope.childrenUuid[i].disabled = params.disabled;
            }
            if (scope.childrenUuid[i].disabled) disabled++;
          }

          // To show or hide the empty text
          scope.$broadcast('cozenDropdownEmpty', {
            empty   : disabled == length,
            dropdown: data.uuid
          });
        }
      }

      function setScrollBarHeight() {
        $timeout(function () {
          var body       = element.find('.cozen-dropdown-transclude')[0];
          var transclude = element.find('.cozen-dropdown-transclude .ng-transclude')[0];
          if (transclude.offsetHeight > 0) body.style.height = transclude.offsetHeight + Methods.getElementPaddingTopBottom(body) + 'px';
          Methods.safeApply(scope);
        });
      }

      function onActiveChild(event, params) {
        if (scope._cozenDropdownName == params.dropdown) {
          scope.activeChild = params.activeChild;
        }
      }

      function defineTranscludeDirection() {
        var inputViewport = element.find('.cozen-dropdown-content')[0].getBoundingClientRect();
        var windowHeight  = window.innerHeight;
        var maxHeight     = data.transcludeHeight;
        if (data.transcludeHeight > scope._cozenDropdownMaxHeight) maxHeight = scope._cozenDropdownMaxHeight + 8;
        if (windowHeight - inputViewport.bottom < maxHeight) scope._cozenDropdownDirection = 'up';
        else scope._cozenDropdownDirection = 'down';
        Methods.safeApply(scope);
      }

      function getArrowClass() {
        var classList = ['fa', 'fa-caret-down'];
        if (scope._cozenDropdownDirection == 'down' && scope._cozenDropdownCollapse) classList.push('fa-rotate-90');
        else if (scope._cozenDropdownDirection == 'up' && scope._cozenDropdownCollapse) classList.push('fa-rotate-90');
        else if (scope._cozenDropdownDirection == 'up' && !scope._cozenDropdownCollapse) classList.push('fa-rotate-180');
        return classList;
      }

      function getTranscludeStyle() {
        var styleList = {
          'max-height': scope._cozenDropdownMaxHeight + 'px'
        };
        if (scope._cozenDropdownDirection == 'down') styleList.top = '100%';
        else styleList.bottom = '100%';
        return styleList;
      }
    }
  }

  cozenDropdownCtrl.$inject = [];

  function cozenDropdownCtrl() {
    var vm = this;
  }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-dropdown-item-group
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number} cozenDropdownItemGroupId       > Id of the item
 * @param {string} cozenDropdownItemGroupLabel    > Text of the item [required]
 * @param {string} cozenDropdownItemGroupIconLeft > Icon left (name of the icon)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.dropdown.group', [])
        .directive('cozenDropdownItemGroup', cozenDropdownItemGroup);

    cozenDropdownItemGroup.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        '$timeout'
    ];

    function cozenDropdownItemGroup(CONFIG, rfc4122, $rootScope, $window, $timeout) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : false,
            templateUrl: 'directives/dropdown/items/group/dropdown.group.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenDropdownItemGroup',
                uuid     : rfc4122.v4()
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (attributes)
                scope._cozenDropdownItemGroupId       = angular.isDefined(attrs.cozenDropdownItemGroupId) ? attrs.cozenDropdownItemGroupId : '';
                scope._cozenDropdownItemGroupLabel    = attrs.cozenDropdownItemGroupLabel;
                scope._cozenDropdownItemGroupIconLeft = angular.isDefined(attrs.cozenDropdownItemGroupIconLeft) ? attrs.cozenDropdownItemGroupIconLeft : '';

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenDropdownItemGroupLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [];
                return classList;
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-dropdown-item-search
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {string} cozenDropdownItemSearchModel > Value edited by the search
 *
 * [Attributes params]
 * @param {number} cozenDropdownItemSearchId                           > Id of the item
 * @param {string} cozenDropdownItemSearchPlaceholder                  > Text for the placeholder
 * @param {string} cozenDropdownItemSearchIconLeft    = 'fa fa-search' > Icon left (name of the icon)
 * @param {string} cozenDropdownItemSearchIconRight                    > Icon right (name of the icon)
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLib.dropdown.search', [])
    .directive('cozenDropdownItemSearch', cozenDropdownItemSearch);

  cozenDropdownItemSearch.$inject = [
    'CONFIG',
    'rfc4122',
    '$rootScope',
    '$window',
    '$timeout'
  ];

  function cozenDropdownItemSearch(CONFIG, rfc4122, $rootScope, $window, $timeout) {
    return {
      link            : link,
      restrict        : 'E',
      replace         : false,
      transclude      : false,
      scope           : {
        cozenDropdownItemSearchModel: '=?'
      },
      templateUrl     : 'directives/dropdown/items/search/dropdown.search.template.html',
      bindToController: true,
      controller      : cozenDropdownItemSearchCtrl,
      controllerAs    : 'vm'
    };

    function link(scope, element, attrs) {
      var methods = {
        init        : init,
        hasError    : hasError,
        destroy     : destroy,
        getMainClass: getMainClass,
        getDropdown : getDropdown,
        onChange    : onChange,
        onEmpty     : onEmpty
      };

      var data = {
        directive: 'cozenDropdownItemSearch',
        uuid     : rfc4122.v4(),
        dropdown : {
          name: null
        }
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

        // Default values (attributes)
        scope._cozenDropdownItemSearchId          = angular.isDefined(attrs.cozenDropdownItemSearchId) ? attrs.cozenDropdownItemSearchId : '';
        scope._cozenDropdownItemSearchPlaceholder = angular.isDefined(attrs.cozenDropdownItemSearchPlaceholder) ? attrs.cozenDropdownItemSearchPlaceholder : '';
        scope._cozenDropdownItemSearchIconLeft    = angular.isDefined(attrs.cozenDropdownItemSearchIconLeft) ? attrs.cozenDropdownItemSearchIconLeft : 'fa fa-search';
        scope._cozenDropdownItemSearchIconRight   = angular.isDefined(attrs.cozenDropdownItemSearchIconRight) ? attrs.cozenDropdownItemSearchIconRight : '';
        scope._cozenDropdownItemSearchEmpty       = false;

        // Init stuff
        element.on('$destroy', methods.destroy);
        data.dropdown.name = methods.getDropdown()._cozenDropdownName;

        scope.$on('cozenDropdownEmpty', methods.onEmpty);

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classList = [];
        if (scope._cozenDropdownItemSearchIconLeft != '') classList.push('icon-left');
        if (scope._cozenDropdownItemSearchIconRight != '') classList.push('icon-right');
        return classList;
      }

      function getDropdown() {
        var dropdown = scope.$parent.$parent;
        if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
          dropdown = scope.$parent.$parent.$parent;
          if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
            dropdown = scope.$parent.$parent.$parent.$parent;
            if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
              dropdown = scope.$parent.$parent.$parent.$parent.$parent;
              if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                dropdown = scope.$parent.$parent.$parent.$parent.$parent.$parent;
                if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                  return dropdown;
                } else return dropdown;
              } else return dropdown;
            } else return dropdown;
          } else return dropdown;
        } else return dropdown;
      }

      function onChange($event) {
        $rootScope.$broadcast('cozenDropdownSearch', {
          dropdown: data.dropdown.name,
          value   : scope.vm.cozenDropdownItemSearchModel
        });
      }

      function onEmpty(event, params) {
        if (methods.getDropdown().uuid == params.uuid) {
          scope._cozenDropdownItemSearchEmpty = params.empty;
        }
      }
    }
  }

  cozenDropdownItemSearchCtrl.$inject = [];

  function cozenDropdownItemSearchCtrl() {
    var vm = this;
  }

})(window.angular);


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
 * @param {boolean}  cozenDropdownItemSimpleSelected = false > Select the item (edit the models and styles)
 * @param {boolean}  cozenDropdownItemSimpleValue            > Use this value instead of label for parent model
 *
 * [Attributes params]
 * @param {number} cozenDropdownItemSimpleId        > Id of the item
 * @param {string} cozenDropdownItemSimpleLabel     > Text of the item [required]
 * @param {string} cozenDropdownItemSimpleSubLabel  > Text of the item
 * @param {string} cozenDropdownItemSimpleIconLeft  > Icon left (name of the icon)
 * @param {string} cozenDropdownItemSimpleIconRight > Icon right (name of the icon)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.dropdown.simple', [])
        .directive('cozenDropdownItemSimple', cozenDropdownItemSimple);

    cozenDropdownItemSimple.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        '$timeout',
        '$filter'
    ];

    function cozenDropdownItemSimple(CONFIG, rfc4122, $rootScope, $window, $timeout, $filter) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenDropdownItemSimpleOnClick : '&',
                cozenDropdownItemSimpleDisabled: '=?',
                cozenDropdownItemSimpleSelected: '=?',
                cozenDropdownItemSimpleValue   : '=?'
            },
            templateUrl: 'directives/dropdown/items/simple/dropdown.simple.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init             : init,
                hasError         : hasError,
                destroy          : destroy,
                getMainClass     : getMainClass,
                onClickItem      : onClickItem,
                getTabIndex      : getTabIndex,
                onActive         : onActive,
                onKeyDown        : onKeyDown,
                onHover          : onHover,
                onCollapse       : onCollapse,
                getDropdown      : getDropdown,
                updateParentModel: updateParentModel,
                deselect         : deselect,
                search           : search
            };

            var data = {
                directive: 'cozenDropdownItemSimple',
                uuid     : rfc4122.v4(),
                dropdown : {
                    name: null
                }
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : {
                        item: onClickItem
                    },
                    getTabIndex : getTabIndex,
                    onHover     : onHover
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenDropdownItemSimpleDisabled)) scope.cozenDropdownItemSimpleDisabled = false;
                if (angular.isUndefined(attrs.cozenDropdownItemSimpleSelected)) {
                    scope.cozenDropdownItemSimpleSelected = false;
                }
                else if (typeof scope.cozenDropdownItemSimpleSelected != "boolean") {
                    scope.cozenDropdownItemSimpleSelected = false;
                }

                // Default values (attributes)
                scope._cozenDropdownItemSimpleId        = angular.isDefined(attrs.cozenDropdownItemSimpleId) ? attrs.cozenDropdownItemSimpleId : '';
                scope._cozenDropdownItemSimpleLabel     = attrs.cozenDropdownItemSimpleLabel;
                scope._cozenDropdownItemSimpleSubLabel  = angular.isDefined(attrs.cozenDropdownItemSimpleSubLabel) ? attrs.cozenDropdownItemSimpleSubLabel : '';
                scope._cozenDropdownItemSimpleIconLeft  = angular.isDefined(attrs.cozenDropdownItemSimpleIconLeft) ? attrs.cozenDropdownItemSimpleIconLeft : '';
                scope._cozenDropdownItemSimpleIconRight = angular.isDefined(attrs.cozenDropdownItemSimpleIconRight) ? attrs.cozenDropdownItemSimpleIconRight : '';
                scope._cozenDropdownItemSimpleShowTick  = methods.getDropdown()._cozenDropdownShowTick;
                scope._cozenDropdownItemSimpleTickIcon  = methods.getDropdown()._cozenDropdownTickIcon;
                scope._cozenDropdownSearch              = [scope._cozenDropdownItemSimpleLabel, scope._cozenDropdownItemSimpleSubLabel];

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope.cozenDropdownItemSimpleActive = false;

                // Register data into the parent
                var dropdown = methods.getDropdown();
                dropdown.childrenUuid.push({
                    uuid    : data.uuid,
                    disabled: scope.cozenDropdownItemSimpleDisabled,
                    label   : scope._cozenDropdownItemSimpleLabel
                });
                data.dropdown.name = dropdown._cozenDropdownName;
                methods.updateParentModel();

                $rootScope.$on('cozenDropdownActive', methods.onActive);
                scope.$on('cozenDropdownCollapse', methods.onCollapse);
                scope.$on('cozenDropdownDeselect', methods.deselect);
                scope.$on('cozenDropdownSearch', methods.search);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenDropdownItemSimpleLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                return false;
            }

            function destroy() {
                $window.removeEventListener('keydown', methods.onKeyDown);
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [];
                if (scope.cozenDropdownItemSimpleDisabled) classList.push('disabled');
                else if (scope.cozenDropdownItemSimpleActive) classList.push('active');
                if (scope.cozenDropdownItemSimpleSelected) classList.push('selected');
                return classList;
            }

            function onClickItem($event) {
                $event.stopPropagation();
                var dropdown = methods.getDropdown();
                if (!dropdown._cozenDropdownCollapse) return;
                if (scope.cozenDropdownItemSimpleDisabled) return;
                if (Methods.isFunction(scope.cozenDropdownItemSimpleOnClick)) scope.cozenDropdownItemSimpleOnClick();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickItem');
                if (!dropdown._cozenDropdownMultiple && dropdown._cozenDropdownAutoClose) dropdown._methods.onClick();

                // Toggle and inform the parent
                scope.cozenDropdownItemSimpleSelected = !scope.cozenDropdownItemSimpleSelected;
                methods.updateParentModel();
                Methods.safeApply(scope);
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenDropdownItemSimpleDisabled) tabIndex = -1;
                return tabIndex;
            }

            function onActive(event, eventData) {
                if (scope.cozenDropdownItemSimpleDisabled) return;
                scope.cozenDropdownItemSimpleActive = eventData.uuid == data.uuid;
                Methods.safeApply(scope);
            }

            function onKeyDown(event) {
                if (scope.cozenDropdownItemSimpleDisabled) return;
                if (!scope.cozenDropdownItemSimpleActive) return;
                event.stopPropagation();
                switch (event.keyCode) {

                    // Enter
                    case 13:
                        methods.onClickItem(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenDropdownItemSimpleActive) return;

                // Search the active child
                var activeChild = 0;
                for (var i = 0, length = methods.getDropdown().childrenUuid.length; i < length; i++) {
                    if (methods.getDropdown().childrenUuid[i].uuid == data.uuid) {
                        activeChild = i;
                        break;
                    }
                }

                // Tell the parent about the new active child
                $rootScope.$broadcast('cozenDropdownActiveChild', {
                    dropdown   : data.dropdown.name,
                    activeChild: activeChild
                });

                $rootScope.$broadcast('cozenDropdownActive', {
                    uuid: data.uuid
                });
            }

            function onCollapse(event, data) {
                if (data.collapse) {
                    $window.addEventListener('keydown', methods.onKeyDown);
                } else {
                    $window.removeEventListener('keydown', methods.onKeyDown);
                }
            }

            function getDropdown() {
                var dropdown = scope.$parent.$parent;
                if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                    dropdown = scope.$parent.$parent.$parent;
                    if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                        dropdown = scope.$parent.$parent.$parent.$parent;
                        if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                            dropdown = scope.$parent.$parent.$parent.$parent.$parent;
                            if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                                dropdown = scope.$parent.$parent.$parent.$parent.$parent.$parent;
                                if (Methods.isNullOrEmpty(dropdown._cozenDropdownName)) {
                                    return dropdown;
                                } else return dropdown;
                            } else return dropdown;
                        } else return dropdown;
                    } else return dropdown;
                } else return dropdown;
            }

            function updateParentModel() {
                $rootScope.$broadcast('cozenDropdownSelected', {
                    uuid    : data.uuid,
                    selected: scope.cozenDropdownItemSimpleSelected,
                    dropdown: data.dropdown.name,
                    value   : Methods.isNullOrEmpty(scope.cozenDropdownItemSimpleValue) ? scope._cozenDropdownItemSimpleLabel : scope.cozenDropdownItemSimpleValue,
                    label   : scope._cozenDropdownItemSimpleLabel
                });
            }

            function deselect(event, params) {
                if (params.uuid != data.uuid) {
                    scope.cozenDropdownItemSimpleSelected = false;
                }
            }

            function search(event, params) {
                if (data.dropdown.name == params.dropdown) {
                    scope._cozenDropdownSearch = $filter('filter')([scope._cozenDropdownItemSimpleLabel, scope._cozenDropdownItemSimpleSubLabel], params.value);
                    $rootScope.$broadcast('cozenDropdownItemDisabled', {
                        uuid    : data.uuid,
                        disabled: scope._cozenDropdownSearch.length == 0,
                        dropdown: data.dropdown.name
                    });
                }
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-form
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number} cozenFormId   > Id of the form
 * @param {string} cozenFormName > Name of the form [required]
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.form', [])
        .directive('cozenForm', cozenForm);

    cozenForm.$inject = [
        '$timeout'
    ];

    function cozenForm($timeout) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            templateUrl: 'directives/form/form.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                dispatchName: dispatchName
            };

            var data = {
                directive: 'cozenForm'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    dispatchName: dispatchName
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (attributes)
                scope._cozenFormId   = angular.isDefined(attrs.cozenFormId) ? attrs.cozenFormId : '';
                scope._cozenFormName = attrs.cozenFormName;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenFormName)) {
                    Methods.directiveErrorRequired(data.directive, 'Name');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function dispatchName() {
                $timeout(function () {
                    scope.$broadcast('cozenFormName', {
                        name: scope._cozenFormName
                    });
                }, 1);
            }
        }
    }

})(window.angular);



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
 *
 * [cozenInputTypePasswordConfig]
 *
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
        '$filter'
    ];

    function cozenInput(Themes, CONFIG, rfc4122, $timeout, $interval, $filter) {
        return {
            link            : link,
            restrict        : 'E',
            replace         : false,
            transclude      : false,
            scope           : {
                cozenInputModel             : '=?',
                cozenInputDisabled          : '=?',
                cozenInputOnChange          : '&',
                cozenInputTypePasswordConfig: '=?'
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

            scope._isReady = false;

            methods.init();

            function init() {

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
                if (methods.hasError()) return;

                // Shortcut values (pattern)
                if (angular.isUndefined(attrs.cozenInputPattern)) {

                    if (angular.isDefined(attrs.cozenInputPatternEmail)) scope._cozenInputPattern = 'email';
                    else if (angular.isDefined(attrs.cozenInputPatternLetter)) scope._cozenInputPattern = 'letter';
                    else if (angular.isDefined(attrs.cozenInputPatternName)) scope._cozenInputPattern = 'name';
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
                    else if (angular.isDefined(attrs.cozenInputTypePassword)) scope._cozenInputType = 'password';
                    else scope._cozenInputType = 'text';
                }

                // Shortcut values (validator)
                if (angular.isUndefined(attrs.cozenInputValidator)) {
                    if (angular.isDefined(attrs.cozenInputValidatorAll)) scope._cozenInputValidator = 'all';
                    else if (angular.isDefined(attrs.cozenInputValidatorTouched)) scope._cozenInputValidator = 'touched';
                    else if (angular.isDefined(attrs.cozenInputValidatorDirty)) scope._cozenInputValidator = 'dirty';
                    else scope._cozenInputValidator = 'dirty';
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenInputDisabled)) scope.vm.cozenInputDisabled = false;

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
                scope._activeTheme       = Themes.getActiveTheme();
                scope.vm.cozenInputModel = angular.copy(scope._cozenInputPrefix + (Methods.isNullOrEmpty(scope.vm.cozenInputModel) ? '' : scope.vm.cozenInputModel) + scope._cozenInputSuffix);
                scope.$on('cozenFormName', function (event, eventData) {
                    scope._cozenInputForm = eventData.name;
                });
                scope._cozenInputPatternRegExp = methods.getPattern();

                // Display the template (the timeout avoid a visual bug due to events)
                $timeout(function () {
                    scope._isReady = true;
                }, 1);
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
                    var classList = [scope._activeTheme, scope._cozenInputSize];
                    var input     = methods.getForm()[scope._cozenInputName];
                    if (!Methods.isNullOrEmpty(input)) {
                        if (scope._cozenInputValidatorEmpty || (!scope._cozenInputValidatorEmpty && !Methods.isNullOrEmpty(scope.vm.cozenInputModel))) {
                            switch (scope._cozenInputValidator) {
                                case 'touched':
                                    if (input.$touched) classList.push(methods.getDesignClass(input));
                                    break;
                                case 'dirty':
                                    if (input.$dirty) classList.push(methods.getDesignClass(input));
                                    break;
                                case 'all':
                                    classList.push(methods.getDesignClass(input));
                                    break;
                            }
                        }
                    }
                    if (scope.vm.cozenInputDisabled) classList.push('disabled');
                    if (scope._cozenInputIconLeft) classList.push('icon-left');
                    if (methods.isIconRightDisplay()) classList.push('icon-right');
                    if (scope._cozenInputType == 'password') classList.push('password');
                    if (scope._cozenInputType == 'number') classList.push('number');
                    return classList;
                }
            }

            function onChange($event) {
                if (scope.vm.cozenInputDisabled) return;
                if (Methods.isFunction(scope.cozenInputOnChange)) scope.cozenInputOnChange();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
                methods.getPasswordTooltipLabel();
                methods.updateModelLength();
            }

            function getDesignClass(input) {
                if (scope._cozenInputErrorDesign) {
                    if (input.$invalid) {
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
                var form = scope.$parent.$parent[scope._cozenInputForm];
                if (Methods.isNullOrEmpty(form)) {
                    form = scope.$parent.$parent.$parent[scope._cozenInputForm];
                    if (Methods.isNullOrEmpty(form)) {
                        form = scope.$parent.$parent.$parent.$parent[scope._cozenInputForm];
                        if (Methods.isNullOrEmpty(form)) {
                            form = scope.$parent.$parent.$parent.$parent.$parent[scope._cozenInputForm];
                            if (Methods.isNullOrEmpty(form)) {
                                form = scope.$parent.$parent.$parent.$parent.$parent.$parent[scope._cozenInputForm];
                                if (Methods.isNullOrEmpty(form)) {
                                    return form;
                                } else return form;
                            } else return form;
                        } else return form;
                    } else return form;
                } else return form;
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
                if (!Methods.isNullOrEmpty(scope._cozenInputIconRight)) return true;
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
                        return '[a-zA-Z\'- ]*';
                    case 'password':
                        var pattern = '';
                        if (scope.vm.cozenInputTypePasswordConfig.lowercase) pattern += '(?=.*' + data.password.lowercase.regexp + ')';
                        if (scope.vm.cozenInputTypePasswordConfig.uppercase) pattern += '(?=.*' + data.password.uppercase.regexp + ')';
                        if (scope.vm.cozenInputTypePasswordConfig.number) pattern += '(?=.*' + data.password.number.regexp + ')';
                        if (scope.vm.cozenInputTypePasswordConfig.specialChar) pattern += '(?=.*' + data.password.specialChar.regexp + ')';
                        pattern += '.{' + scope.vm.cozenInputTypePasswordConfig.minLength + ',}';
                        return pattern;
                    default:
                        return '';
                }
            }

            function onArrowDown($event, arrow) {
                if (scope.vm.cozenInputDisabled) return;
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
                        } else {
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
                } else {
                    if (scope.vm.cozenInputModel > scope._cozenInputMin) {
                        scope.vm.cozenInputModel -= 1;
                        methods.onChange($event);
                    }
                }
            }

            function onArrowUp($event) {
                if (scope.vm.cozenInputDisabled) return;
                $timeout.cancel(data.arrowTimeout);
                data.arrowDown   = false;
                var input        = methods.getForm()[scope._cozenInputName];
                input.$touched   = true;
                input.$untouched = false;
                input.$dirty     = true;
            }

            function getPasswordTooltipLabel() {
                if (scope._cozenInputType != 'password') return;

                // Test the regexp
                data.password.lowercase.complete   = Methods.isRegExpValid(data.password.lowercase.regexp, scope.vm.cozenInputModel);
                data.password.uppercase.complete   = Methods.isRegExpValid(data.password.uppercase.regexp, scope.vm.cozenInputModel);
                data.password.number.complete      = Methods.isRegExpValid(data.password.number.regexp, scope.vm.cozenInputModel);
                data.password.specialChar.complete = Methods.isRegExpValid(data.password.specialChar.regexp, scope.vm.cozenInputModel);
                if (!Methods.isNullOrEmpty(scope.vm.cozenInputModel)) {
                    data.password.minLength.complete = scope.vm.cozenInputModel.length >= scope.vm.cozenInputTypePasswordConfig.minLength;
                } else data.password.minLength.complete = false;

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
                if (data.password[regexp].complete) classList.push('active');
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
 * @param {number} cozenListId                    > Id of the list
 * @param {string} cozenListSize       = 'normal' > Size of the list
 * @param {string} cozenListSizeSmall             > Shortcut for small size
 * @param {string} cozenListSizeNormal            > Shortcut for normal size
 * @param {string} cozenListSizeLarge             > Shortcut for large size
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.list', [
            'cozenLib.list.simple',
            'cozenLib.list.media3'
        ])
        .directive('cozenList', cozenList);

    cozenList.$inject = [
        'Themes',
        'CONFIG',
        '$window',
        '$rootScope'
    ];

    function cozenList(Themes, CONFIG, $window, $rootScope) {
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
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onHover     : onHover,
                onKeyDown   : onKeyDown
            };

            var data = {
                directive: 'cozenList'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onHover     : onHover
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenListSize)) {
                    if (angular.isDefined(attrs.cozenListSizeSmall)) scope._cozenListSize = 'small';
                    else if (angular.isDefined(attrs.cozenListSizeNormal)) scope._cozenListSize = 'normal';
                    else if (angular.isDefined(attrs.cozenListSizeLarge)) scope._cozenListSize = 'large';
                    else scope._cozenListSize = 'normal';
                }

                // Default values (attributes)
                scope._cozenListId = angular.isDefined(attrs.cozenListId) ? attrs.cozenListId : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
                scope.isHover      = false;
                $window.addEventListener('keydown', methods.onKeyDown);
                scope.childrenUuid = [];
                scope.activeChild  = 0;

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                return false;
            }

            function destroy() {
                $window.removeEventListener('keydown', methods.onKeyDown);
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme, scope._cozenListSize];
                return classList;
            }

            function onHover($event, state) {
                scope.isHover = state;
                if (!state) {
                    $rootScope.$broadcast('cozenListActive', {
                        uuid: null
                    });
                }
            }

            function onKeyDown(event) {
                if (!scope.isHover) return;
                switch (event.keyCode) {

                    // Arrow up
                    case 38:
                        event.stopPropagation();
                        if (scope.activeChild > 1) scope.activeChild--;
                        else scope.activeChild = scope.childrenUuid.length;
                        $rootScope.$broadcast('cozenListActive', {
                            uuid: scope.childrenUuid[scope.activeChild - 1]
                        });
                        break;

                    // Arrow down
                    case 40:
                        event.stopPropagation();
                        if (scope.activeChild < scope.childrenUuid.length) scope.activeChild++;
                        else scope.activeChild = 1;
                        $rootScope.$broadcast('cozenListActive', {
                            uuid: scope.childrenUuid[scope.activeChild - 1]
                        });
                        break;
                }
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-list-item-media3
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenListItemMedia3OnClick          > Callback function called on click
 * @param {boolean}  cozenListItemMedia3Disabled = false > Disable the item
 *
 * [Attributes params]
 * @param {number} cozenListItemMedia3Id       > Id of the item
 * @param {string} cozenListItemMedia3Header   > Text for the header [required]
 * @param {string} cozenListItemMedia3Label    > Text for the label [required]
 * @param {string} cozenListItemMedia3SubLabel > Text for the sub label [required]
 * @param {string} cozenListItemMedia3Media    > URL of the media
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.list.media3', [])
        .directive('cozenListItemMedia3', cozenListItemMedia3);

    cozenListItemMedia3.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window'
    ];

    function cozenListItemMedia3(CONFIG, rfc4122, $rootScope, $window) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenListItemMedia3OnClick : '&',
                cozenListItemMedia3Disabled: '=?'
            },
            templateUrl: 'directives/list/items/media3/list.media3.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex,
                onActive    : onActive,
                onKeyDown   : onKeyDown,
                onHover     : onHover
            };

            var data = {
                directive: 'cozenListItemMedia3',
                uuid     : rfc4122.v4()
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex,
                    onHover     : onHover
                };

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenListItemMedia3Disabled)) scope.cozenListItemMedia3Disabled = false;

                // Default values (attributes)
                scope._cozenLisItemMedia3Id        = angular.isDefined(attrs.cozenLisItemMedia3Id) ? attrs.cozenLisItemMedia3Id : '';
                scope._cozenListItemMedia3Header   = attrs.cozenListItemMedia3Header;
                scope._cozenListItemMedia3Label    = attrs.cozenListItemMedia3Label;
                scope._cozenListItemMedia3SubLabel = attrs.cozenListItemMedia3SubLabel;
                scope._cozenListItemMedia3Media    = angular.isDefined(attrs.cozenListItemMedia3Media) ? attrs.cozenListItemMedia3Media : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope.cozenListItemMedia3Active = false;
                scope.$parent.$parent.$parent.childrenUuid.push(data.uuid);
                $rootScope.$on('cozenListActive', methods.onActive);
                $window.addEventListener('keydown', methods.onKeyDown);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3Header)) {
                    Methods.directiveErrorRequired(data.directive, 'Header');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3Label)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3SubLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'SubLabel');
                    return true;
                }
                return false;
            }

            function destroy() {
                $window.removeEventListener('keydown', methods.onKeyDown);
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [];
                if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) classList.push('no-action');
                if (scope.cozenListItemMedia3Disabled) classList.push('disabled');
                else if (scope.cozenListItemMedia3Active) classList.push('active');
                if (scope.$id % 2 != 0) classList.push('odd');
                return classList;
            }

            function onClick($event) {
                if (scope.cozenListItemMedia3Disabled) return;
                if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) return;
                if (Methods.isFunction(scope.cozenListItemMedia3OnClick)) scope.cozenListItemMedia3OnClick();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickItem');
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenListItemMedia3Disabled) tabIndex = -1;
                else if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) tabIndex = -1;
                return tabIndex;
            }

            function onActive(event, eventData) {
                if (scope.cozenListItemMedia3Disabled) return;
                scope.cozenListItemMedia3Active = eventData.uuid == data.uuid;
                Methods.safeApply(scope);
            }

            function onKeyDown(event) {
                if (scope.cozenListItemMedia3Disabled) return;
                if (!scope.cozenListItemMedia3Active) return;
                event.preventDefault();
                switch (event.keyCode) {

                    // Enter
                    case 13:
                        methods.onClick(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenListItemMedia3Active) return;
                scope.$parent.$parent.$parent.$parent.activeChild = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
                $rootScope.$broadcast('cozenListActive', {
                    uuid: data.uuid
                });
            }
        }
    }

})(window.angular);


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
        .module('cozenLib.list.simple', [])
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
            templateUrl: 'directives/list/items/simple/list.simple.template.html'
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
                if (scope.$id % 2 != 0) classList.push('odd');
                return classList;
            }

            function onClickItem($event) {
                if (scope.cozenListItemSimpleDisabled) return;
                if (angular.isUndefined(attrs.cozenListItemSimpleOnClick)) return;
                if (Methods.isFunction(scope.cozenListItemSimpleOnClick)) scope.cozenListItemSimpleOnClick();
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickItem');
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
                if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickBtnRight');
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
                        methods.onClickItem(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenListItemSimpleActive) return;
                scope.$parent.$parent.$parent.$parent.activeChild = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
                scope.$parent.$parent.$parent.activeChild         = scope.$parent.$parent.$parent.childrenUuid.indexOf(data.uuid) + 1;
                $rootScope.$broadcast('cozenListActive', {
                    uuid: data.uuid
                });
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-on-blur
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {function} cozenOnBlurCallback         > Callback function called on focus
 * @param {boolean}  cozenOnBlurDisabled = false > Disable/enable the listener
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenOnBlur', cozenOnBlur);

    cozenOnBlur.$inject = [
        '$parse'
    ];

    function cozenOnBlur($parse) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            var methods = {
                init          : init,
                hasError      : hasError,
                destroy       : destroy,
                startListening: startListening,
                stopListening : stopListening
            };

            var data = {
                directive: 'cozenOnBlur'
            };

            methods.init();

            function init() {

                // To avoid using a new isolated scope, parse the attributes
                data.callback = $parse(attrs.cozenOnBlurCallback);
                data.disabled = $parse(attrs.cozenOnBlurDisabled);

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenOnBlurDisabled)) data.disabled = false;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Start listening if not disabled
                if (!data.disabled) methods.startListening();

                // Start/stop listening when disabled change
                scope.$watch('cozenOnBlurDisabled', function (newValue, oldValue) {
                    if (newValue) methods.stopListening();
                    else methods.startListening();
                });
            }

            function hasError() {
                if (!Methods.isFunction(data.callback)) {
                    Methods.directiveErrorFunction(data.directive, 'cozenOnBlurCallback');
                    return true;
                }
                return false;
            }

            function destroy() {
                methods.stopListening();
                element.off('$destroy', methods.destroy);
            }

            function startListening() {
                element[0].addEventListener('blur', data.callback);
            }

            function stopListening() {
                element[0].removeEventListener('blur', data.callback);
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-on-focus
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {function} cozenOnFocusCallback         > Callback function called on focus
 * @param {boolean}  cozenOnFocusDisabled = false > Disable/enable the listener
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenOnFocus', cozenOnFocus);

    cozenOnFocus.$inject = [
        '$parse'
    ];

    function cozenOnFocus($parse) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            var methods = {
                init          : init,
                hasError      : hasError,
                destroy       : destroy,
                startListening: startListening,
                stopListening : stopListening
            };

            var data = {
                directive: 'cozenOnFocus'
            };

            methods.init();

            function init() {

                // To avoid using a new isolated scope, parse the attributes
                data.callback = $parse(attrs.cozenOnFocusCallback);
                data.disabled = $parse(attrs.cozenOnFocusDisabled);

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenOnFocusDisabled)) data.disabled = false;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Start listening if not disabled
                if (!data.disabled) methods.startListening();

                // Start/stop listening when disabled change
                scope.$watch('cozenOnFocusDisabled', function (newValue, oldValue) {
                    if (newValue) methods.stopListening();
                    else methods.startListening();
                });
            }

            function hasError() {
                if (!Methods.isFunction(data.callback)) {
                    Methods.directiveErrorFunction(data.directive, 'cozenOnFocusCallback');
                    return true;
                }
                return false;
            }

            function destroy() {
                methods.stopListening();
                element.off('$destroy', methods.destroy);
            }

            function startListening() {
                element[0].addEventListener('focus', data.callback);
            }

            function stopListening() {
                element[0].removeEventListener('focus', data.callback);
            }
        }
    }

})(window.angular);


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

      scope._isReady = false;

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
        }

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
        var classList = [scope._activeTheme, scope._cozenPaginationSize];
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


/**
 * @ngdoc directive
 * @name cozen-panel
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 * @param {function} cozenPanelOnClick                        > Callback function called on click
 * @param {boolean}  cozenPanelDisabled            = false    > Disable the panel
 * @param {boolean}  cozenPanelOpen                = true     > Close/Open the panel
 * @param {function} cozenPanelOnToggle                       > Callback function called on toggle (open/close)
 * @param {function} cozenPanelOnClickBigIconLeft             > Callback function called on click on the left big icon
 * @param {function} cozenPanelOnClickBigIconRight            > Callback function called on click on the right big icon
 *
 * [Attributes params]
 * @param {number}  cozenPanelId                              > Id of the panel
 * @param {string}  cozenPanelLabel                           > Text of the panel
 * @param {string}  cozenPanelSize                = 'normal'  > Size of the panel
 * @param {string}  cozenPanelSizeSmall                       > Shortcut for small size
 * @param {string}  cozenPanelSizeNormal                      > Shortcut for normal size
 * @param {string}  cozenPanelSizeLarge                       > Shortcut for large size
 * @param {string}  cozenPanelType                = 'default' > Type of the panel (change the color)
 * @param {string}  cozenPanelTypeDefault                     > Shortcut for default type
 * @param {string}  cozenPanelTypeInfo                        > Shortcut for info type
 * @param {string}  cozenPanelTypeSuccess                     > Shortcut for success type
 * @param {string}  cozenPanelTypeWarning                     > Shortcut for warning type
 * @param {string}  cozenPanelTypeError                       > Shortcut for error type
 * @param {string}  cozenPanelIconLeft                        > Add an icon the to left (write the class)
 * @param {string}  cozenPanelIconRight                       > Add an icon the to right (write the class)
 * @param {string}  cozenPanelBigIconLeft                     > Add a big icon the to left (write the class)
 * @param {string}  cozenPanelBigIconRight                    > Add a big icon the to right (write the class)
 * @param {boolean} cozenPanelBigIconLeftTooltip              > Text of the tooltip for the big icon left
 * @param {boolean} cozenPanelBigIconRightTooltip             > Text of the tooltip for the big icon right
 * @param {boolean} cozenPanelFrozen              = false     > Shortcut to freeze the panel (avoid open/close)
 * @param {string}  cozenPanelSubLabel                        > Text of the sub label (smaller than label)
 * @param {string}  cozenPanelMaxHeight                       > Max height of the body
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLib.panel', [])
    .directive('cozenPanel', cozenPanel);

  cozenPanel.$inject = [
    'Themes',
    'CONFIG'
  ];

  function cozenPanel(Themes, CONFIG) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : true,
      scope      : {
        cozenPanelOnClick            : '&',
        cozenPanelDisabled           : '=?',
        cozenPanelOpen               : '=?',
        cozenPanelOnToggle           : '&',
        cozenPanelOnClickBigIconLeft : '&',
        cozenPanelOnClickBigIconRight: '&'
      },
      templateUrl: 'directives/panel/panel.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init               : init,
        hasError           : hasError,
        destroy            : destroy,
        getMainClass       : getMainClass,
        onClickHeader      : onClickHeader,
        startWatching      : startWatching,
        onClickBigIconLeft : onClickBigIconLeft,
        onClickBigIconRight: onClickBigIconRight,
        bigIconHover       : bigIconHover,
        getTabIndex        : getTabIndex,
        getBodyStyles      : getBodyStyles
      };

      var data = {
        directive: 'cozenPanel'
      };

      scope._isReady = false;

      methods.init();

      function init() {

        // Public functions
        scope._methods = {
          getMainClass : getMainClass,
          onClick      : {
            header      : onClickHeader,
            bigIconLeft : onClickBigIconLeft,
            bigIconRight: onClickBigIconRight
          },
          bigIconHover : bigIconHover,
          getTabIndex  : getTabIndex,
          getBodyStyles: getBodyStyles
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenPanelSize)) {
          if (angular.isDefined(attrs.cozenPanelSizeSmall)) scope._cozenPanelSize = 'small';
          else if (angular.isDefined(attrs.cozenPanelSizeNormal)) scope._cozenPanelSize = 'normal';
          else if (angular.isDefined(attrs.cozenPanelSizeLarge)) scope._cozenPanelSize = 'large';
          else scope._cozenPanelSize = 'normal';
        }

        // Shortcut values (type)
        if (angular.isUndefined(attrs.cozenPanelType)) {
          if (angular.isDefined(attrs.cozenPanelTypeDefault)) scope._cozenPanelType = 'default';
          else if (angular.isDefined(attrs.cozenPanelTypeInfo)) scope._cozenPanelType = 'info';
          else if (angular.isDefined(attrs.cozenPanelTypeSuccess)) scope._cozenPanelType = 'success';
          else if (angular.isDefined(attrs.cozenPanelTypeWarning)) scope._cozenPanelType = 'warning';
          else if (angular.isDefined(attrs.cozenPanelTypeError)) scope._cozenPanelType = 'error';
          else scope._cozenPanelType = 'default';
        }

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenPanelDisabled)) scope.cozenPanelDisabled = false;
        if (angular.isUndefined(attrs.cozenPanelOpen)) scope.cozenPanelOpen = true;

        // Default values (attributes)
        scope._cozenPanelId                  = angular.isDefined(attrs.cozenPanelId) ? attrs.cozenPanelId : '';
        scope._cozenPanelLabel               = attrs.cozenPanelLabel;
        scope._cozenPanelIconLeft            = angular.isDefined(attrs.cozenPanelIconLeft) ? attrs.cozenPanelIconLeft : '';
        scope._cozenPanelIconRight           = angular.isDefined(attrs.cozenPanelIconRight) ? attrs.cozenPanelIconRight : '';
        scope._cozenPanelBigIconLeft         = angular.isDefined(attrs.cozenPanelBigIconLeft) ? attrs.cozenPanelBigIconLeft : '';
        scope._cozenPanelBigIconRight        = angular.isDefined(attrs.cozenPanelBigIconRight) ? attrs.cozenPanelBigIconRight : '';
        scope._bigIconHover                  = false;
        scope._cozenPanelFrozen              = angular.isDefined(attrs.cozenPanelFrozen);
        scope._cozenPanelBigIconLeftTooltip  = angular.isDefined(attrs.cozenPanelBigIconLeftTooltip) ? attrs.cozenPanelBigIconLeftTooltip : '';
        scope._cozenPanelBigIconRightTooltip = angular.isDefined(attrs.cozenPanelBigIconRightTooltip) ? attrs.cozenPanelBigIconRightTooltip : '';
        scope._cozenPanelSubLabel            = angular.isDefined(attrs.cozenPanelSubLabel) ? attrs.cozenPanelSubLabel : '';
        scope._cozenPanelMaxHeight           = angular.isDefined(attrs.cozenPanelMaxHeight) ? attrs.cozenPanelMaxHeight : 'auto';

        // ScrollBar
        scope._cozenScrollBar       = CONFIG.scrollsBar && scope._cozenPanelMaxHeight != 'auto';
        scope._cozenScrollBarConfig = CONFIG.scrollsBarConfig;

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme = Themes.getActiveTheme();
        methods.startWatching();

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenPanelLabel)) {
          Methods.directiveErrorRequired(data.directive, 'Label');
          return true;
        }
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classList = [scope._activeTheme, scope._cozenPanelSize, scope._cozenPanelType];
        if (scope.cozenPanelDisabled) classList.push('disabled');
        if (scope.cozenPanelOpen || scope._cozenPanelFrozen) classList.push('open');
        if (scope._bigIconHover) classList.push('no-hover');
        return classList;
      }

      function onClickHeader($event) {
        if (scope.cozenPanelDisabled) return;
        if (Methods.isFunction(scope.cozenPanelOnClick)) scope.cozenPanelOnClick();
        if (Methods.isFunction(scope.cozenPanelOnToggle) && !scope._cozenPanelFrozen) scope.cozenPanelOnToggle();
        if (!scope._cozenPanelFrozen) scope.cozenPanelOpen = !scope.cozenPanelOpen;
        if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickHeader');
      }

      function startWatching() {
        scope.$watch('cozenPanelDisabled', function (newValue, oldValue) {
          if (newValue && scope.cozenPanelOpen && !scope._cozenPanelFrozen) {
            scope.cozenPanelOpen = false;
            if (Methods.isFunction(scope.cozenPanelOnToggle)) scope.cozenPanelOnToggle();
          }
        });
      }

      function onClickBigIconLeft($event) {
        $event.stopPropagation();
        if (scope.cozenPanelDisabled) return;
        if (Methods.isFunction(scope.cozenPanelOnClickBigIconLeft)) scope.cozenPanelOnClickBigIconLeft();
        if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickBigIconLeft');
      }

      function onClickBigIconRight($event) {
        $event.stopPropagation();
        if (scope.cozenPanelDisabled) return;
        if (Methods.isFunction(scope.cozenPanelOnClickBigIconRight)) scope.cozenPanelOnClickBigIconRight();
        if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onClickBigIconRight');
      }

      function bigIconHover(hover) {
        scope._bigIconHover = hover;
      }

      function getTabIndex() {
        var tabIndex = 0;
        if (scope.cozenPanelDisabled) tabIndex = -1;
        else if (scope._cozenPanelFrozen) tabIndex = -1;
        return tabIndex;
      }

      function getBodyStyles() {
        return {
          'max-height': scope._cozenPanelMaxHeight
        };
      }
    }
  }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-popup
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 * @param {function} cozenPopupOnShow         > Callback function called on show
 * @param {function} cozenPopupOnHide         > Callback function called on hide
 * @param {boolean}  cozenPopupIsOpen = false > Display the popup without event
 *
 * [Attributes params]
 * @param {number}  cozenPopupId                          > Id of the popup
 * @param {string}  cozenPopupSize            = 'normal'  > Size of the popup
 * @param {string}  cozenPopupSizeSmall                   > Shortcut for small size
 * @param {string}  cozenPopupSizeNormal                  > Shortcut for normal size
 * @param {string}  cozenPopupSizeLarge                   > Shortcut for large size
 * @param {string}  cozenPopupType            = 'default' > Type of the popup (change the color)
 * @param {string}  cozenPopupTypeDefault                 > Shortcut for default type
 * @param {string}  cozenPopupTypeInfo                    > Shortcut for info type
 * @param {string}  cozenPopupTypeSuccess                 > Shortcut for success type
 * @param {string}  cozenPopupTypeWarning                 > Shortcut for warning type
 * @param {string}  cozenPopupTypeError                   > Shortcut for error type
 * @param {boolean} cozenPopupHeader          = true      > Display the header [config]
 * @param {string}  cozenPopupHeaderTitle                 > Text of the header title
 * @param {string}  cozenPopupHeaderSubTitle              > Text of the header sub-title
 * @param {boolean} cozenPopupFooter          = true      > Display the footer [config]
 * @param {string}  cozenPopupName                        > Name of the popup [required]
 * @param {boolean} cozenPopupAnimationIn     = true      > Add an animation before show [config]
 * @param {boolean} cozenPopupAnimationOut    = true      > Add an animation before hide [config]
 * @param {boolean} cozenPopupEasyClose       = true      > Auto close the popup when a click is outside [config]
 * @param {boolean} cozenPopupCloseBtn        = true      > Display the close btn (top-right) [config]
 * @param {string}  cozenPopupHeaderPictoLeft             > Add a picto on left of the header (url of the picto)
 *
 */
(function (angular) {
  'use strict';

  angular
    .module('cozenLib.popup', [
      'cozenLib.popup.factory'
    ])
    .directive('cozenPopup', cozenPopup);

  cozenPopup.$inject = [
    'Themes',
    'CONFIG',
    '$window',
    '$timeout'
  ];

  function cozenPopup(Themes, CONFIG, $window, $timeout) {
    return {
      link       : link,
      restrict   : 'E',
      replace    : false,
      transclude : true,
      scope      : {
        cozenPopupOnShow: '&',
        cozenPopupOnHide: '&',
        cozenPopupIsOpen: '=?'
      },
      templateUrl: 'directives/popup/popup.template.html'
    };

    function link(scope, element, attrs) {
      var methods = {
        init              : init,
        hasError          : hasError,
        destroy           : destroy,
        getMainClass      : getMainClass,
        hide              : hide,
        show              : show,
        onClick           : onClick,
        onEnter           : onEnter,
        onLeave           : onLeave,
        getPopupClass     : getPopupClass,
        setScrollBarHeight: setScrollBarHeight,
        onKeyDown         : onKeyDown,
        setHeaderPictoSize: setHeaderPictoSize
      };

      var data = {
        directive: 'cozenPopup',
        isHover  : false,
        firstHide: true
      };

      scope._isReady = false;

      methods.init();

      function init() {

        // Public functions
        scope._methods = {
          getMainClass : getMainClass,
          hide         : hide,
          onEnter      : onEnter,
          onLeave      : onLeave,
          getPopupClass: getPopupClass
        };

        // Checking required stuff
        if (methods.hasError()) return;

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenPopupSize)) {
          if (angular.isDefined(attrs.cozenPopupSizeSmall)) scope._cozenPopupSize = 'small';
          else if (angular.isDefined(attrs.cozenPopupSizeNormal)) scope._cozenPopupSize = 'normal';
          else if (angular.isDefined(attrs.cozenPopupSizeLarge)) scope._cozenPopupSize = 'large';
          else scope._cozenPopupSize = 'normal';
        }

        // Shortcut values (type)
        if (angular.isUndefined(attrs.cozenPopupType)) {
          if (angular.isDefined(attrs.cozenPopupTypeDefault)) scope._cozenPopupType = 'default';
          else if (angular.isDefined(attrs.cozenPopupTypeInfo)) scope._cozenPopupType = 'info';
          else if (angular.isDefined(attrs.cozenPopupTypeSuccess)) scope._cozenPopupType = 'success';
          else if (angular.isDefined(attrs.cozenPopupTypeWarning)) scope._cozenPopupType = 'warning';
          else if (angular.isDefined(attrs.cozenPopupTypeError)) scope._cozenPopupType = 'error';
          else scope._cozenPopupType = 'default';
        }

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenPopupIsOpen)) scope.cozenPopupIsOpen = false;

        // Default values (attributes)
        scope._cozenPopupId              = angular.isDefined(attrs.cozenPopupId) ? attrs.cozenPopupId : '';
        scope._cozenPopupHeader          = angular.isDefined(attrs.cozenPopupHeader) ? JSON.parse(attrs.cozenPopupHeader) : CONFIG.popup.header;
        scope._cozenPopupHeaderTitle     = angular.isDefined(attrs.cozenPopupHeaderTitle) ? attrs.cozenPopupHeaderTitle : '';
        scope._cozenPopupHeaderSubTitle  = angular.isDefined(attrs.cozenPopupHeaderSubTitle) ? attrs.cozenPopupHeaderSubTitle : '';
        scope._cozenPopupFooter          = angular.isDefined(attrs.cozenPopupFooter) ? JSON.parse(attrs.cozenPopupFooter) : CONFIG.popup.footer;
        scope._cozenPopupName            = attrs.cozenPopupName;
        scope._cozenPopupAnimationIn     = angular.isDefined(attrs.cozenPopupAnimationIn) ? JSON.parse(attrs.cozenPopupAnimationIn) : CONFIG.popup.animation.in.enabled;
        scope._cozenPopupAnimationOut    = angular.isDefined(attrs.cozenPopupAnimationOut) ? JSON.parse(attrs.cozenPopupAnimationOut) : CONFIG.popup.animation.out.enabled;
        scope._cozenPopupEasyClose       = angular.isDefined(attrs.cozenPopupEasyClose) ? JSON.parse(attrs.cozenPopupEasyClose) : CONFIG.popup.easeClose;
        scope._cozenPopupCloseBtn        = angular.isDefined(attrs.cozenPopupCloseBtn) ? JSON.parse(attrs.cozenPopupCloseBtn) : CONFIG.popup.closeBtn;
        scope._cozenPopupHeaderPictoLeft = angular.isDefined(attrs.cozenPopupHeaderPictoLeft) ? attrs.cozenPopupHeaderPictoLeft : '';

        // ScrollBar
        scope._cozenScrollBar            = CONFIG.scrollsBar;
        scope._cozenScrollBarConfig      = CONFIG.scrollsBarConfig;
        scope._cozenScrollBarConfig.axis = 'y';
        methods.setScrollBarHeight();

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme = Themes.getActiveTheme();
        scope.$on('cozenPopupShow', methods.show);
        scope.$on('cozenPopupHide', methods.hide);
        methods.setHeaderPictoSize();

        // Watch click when popup if instant show (easy-close)
        if (scope._cozenPopupEasyClose && scope.cozenPopupIsOpen) {
          $window.addEventListener('click', methods.onClick);
          $window.addEventListener('keydown', methods.onKeyDown);
        }

        // Allow animation on first load if instant show
        if (scope.cozenPopupIsOpen) data.firstHide = false;

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenPopupName)) {
          Methods.directiveErrorRequired(data.directive, 'Name');
          return true;
        }
        return false;
      }

      function destroy() {
        $window.removeEventListener('click', methods.onClick);
        $window.removeEventListener('keydown', methods.onKeyDown);
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        var classList = [scope._activeTheme, scope._cozenPopupSize, scope._cozenPopupType];
        if (scope._cozenPopupAnimationIn) classList.push('animate-in');
        if (scope._cozenPopupAnimationOut && !data.firstHide) classList.push('animate-out');
        return classList;
      }

      function hide($event, params) {
        if (params.name == scope._cozenPopupName) {
          data.firstHide         = false;
          scope.cozenPopupIsOpen = false;
          if (Methods.isFunction(scope.cozenPopupOnHide)) scope.cozenPopupOnHide();
          if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'OnHide');
          Methods.safeApply(scope);
          $window.removeEventListener('click', methods.onClick);
          $window.removeEventListener('keydown', methods.onKeyDown);
        }
      }

      function show($event, params) {
        if (params.name == scope._cozenPopupName) {
          scope.cozenPopupIsOpen = true;
          if (Methods.isFunction(scope.cozenPopupOnShow)) scope.cozenPopupOnShow();
          if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'OnShow');
          Methods.safeApply(scope);
          if (scope._cozenPopupEasyClose) {
            $window.addEventListener('click', methods.onClick);
            $window.addEventListener('keydown', methods.onKeyDown);
          }
          methods.setScrollBarHeight();
          methods.setHeaderPictoSize();
        }
      }

      function onClick() {
        if (scope.cozenPopupIsOpen) {
          if (!data.isHover) {
            methods.hide(null, {
              name: scope._cozenPopupName
            });
          }
        }
      }

      function onEnter() {
        data.isHover = true;
      }

      function onLeave() {
        data.isHover = false;
      }

      function getPopupClass() {
        var classList = [];
        if (scope.cozenPopupIsOpen && scope._cozenPopupAnimationIn) {
          classList.push(CONFIG.popup.animation.in.animation);
          classList.push('animation-in');
        }
        if (!scope.cozenPopupIsOpen && scope._cozenPopupAnimationOut) {
          classList.push(CONFIG.popup.animation.out.animation);
          classList.push('animation-out');
        }
        return classList;
      }

      function setScrollBarHeight() {
        $timeout(function () {
          var body       = element.find('.cozen-popup-body')[0];
          var transclude = element.find('.cozen-popup-body .ng-transclude')[0];
          if (transclude.offsetHeight > 0) body.style.height = transclude.offsetHeight + Methods.getElementPaddingTopBottom(body) + 'px';
          Methods.safeApply(scope);
        });
      }

      function onKeyDown(event) {
        event.stopPropagation();
        switch (event.keyCode) {

          // Escape
          case 27:
            methods.hide(null, {name: scope._cozenPopupName});
            break;
        }
      }

      function setHeaderPictoSize() {

        // Set the height of the img (to auto fit)
        if (scope._cozenPopupHeaderPictoLeft != '') {
          $timeout(function () {
            var img          = element.find('.cozen-popup-header .cozen-popup-header-img.left')[0];
            var title        = element.find('.cozen-popup-header .cozen-popup-header-title')[0];
            img.style.height = title.offsetHeight + 'px';
            img.style.width  = title.offsetHeight + 'px';
          });
        }
      }
    }
  }

})(window.angular);


(function (angular) {
    'use strict';

    angular
        .module('cozenLib.popup.factory', [])
        .factory('cozenPopupFactory', cozenPopupFactory);

    cozenPopupFactory.$inject = [
        '$rootScope'
    ];

    function cozenPopupFactory($rootScope) {
        return {
            show: show,
            hide: hide
        };

        function show(params) {
            $rootScope.$broadcast('cozenPopupShow', params);
        }

        function hide(params) {
            $rootScope.$broadcast('cozenPopupHide', params);
        }
    }

})(window.angular);


'use strict';

var Methods = {
    isInList                  : isInList,
    isNullOrEmpty             : isNullOrEmpty,
    safeApply                 : safeApply,
    isFunction                : isFunction,
    directiveErrorRequired    : directiveErrorRequired,
    directiveCallbackLog      : directiveCallbackLog,
    getConsoleColor           : getConsoleColor,
    capitalizeFirstLetter     : capitalizeFirstLetter,
    directiveErrorFunction    : directiveErrorFunction,
    directiveErrorBoolean     : directiveErrorBoolean,
    isRegExpValid             : isRegExpValid,
    getElementPaddingTopBottom: getElementPaddingTopBottom,
    directiveErrorEmpty       : directiveErrorEmpty,
    directiveWarningUnmatched : directiveWarningUnmatched,
    dataMustBeBoolean         : dataMustBeBoolean,
    dataMustBeObject          : dataMustBeObject,
    dataMustBeInThisList: dataMustBeInThisList
};

var Data = {
    red   : '#c0392b',
    purple: '#8e44ad',
    black : '#2c3e50',
    orange: '#d35400',
    green : '#27ae60'
};

function isInList(list, value) {
    return list.indexOf(value) != -1;
}

function isNullOrEmpty(element) {
    return element == null || element == '' || element == 'undefined';
}

function safeApply(scope, fn) {
    var phase = scope.$root.$$phase;
    if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
            fn();
        }
    } else {
        scope.$apply(fn);
    }
}

function isFunction(fn) {
    return typeof fn === 'function';
}

function directiveErrorRequired(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is required',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function directiveCallbackLog(directive, fn) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + directive + '%c][%c' + now + '%c] Fn <%c' + fn + '%c> called',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function getConsoleColor(type) {
    var color = 'color:';
    switch (type) {
        case 'red':
        case 'directive':
            return color + Data.red;
        case 'purple':
        case 'fn':
            return color + Data.purple;
        case 'orange':
        case 'time':
            return color + Data.orange;
        case 'green':
            return color + Data.green;
        default:
            return color + Data.black;
    }
}

function capitalizeFirstLetter(string) {
    if (Methods.isNullOrEmpty(string) || typeof string != 'string') return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function directiveErrorFunction(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is not a function',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function directiveErrorBoolean(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is not a boolean',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function isRegExpValid(regexp, value) {
    return !(!new RegExp(regexp).test(value) || isNullOrEmpty(value));
}

function getElementPaddingTopBottom(element) {
    var styles = window.getComputedStyle(element);
    return parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
}

function directiveErrorEmpty(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is null or empty',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function directiveWarningUnmatched(directive, param, value) {
    console.warn('%c[%c' + directive + '%c] Attr <%c' + param + '%c> value\'s was wrong\nThe default value <%c' + value + '%c> was set',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function dataMustBeBoolean(attribute) {
    console.error('%c<%c' + attribute + '%c> must be <%ctrue%c> or <%cfalse%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

function dataMustBeObject(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cobject%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

function dataMustBeInThisList(attribute, list) {
    console.error('%c<%c' + attribute + '%c> must be a correct value from this list <%c' + list + '%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}
/**
 * @ngdoc directive
 * @name cozen-shortcut
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .value('Shortcuts', {
            shift: false,
            ctrl : false,
            alt  : false
        })
        .directive('cozenShortcut', cozenShortcut);

    cozenShortcut.$inject = [
        '$window',
        'Shortcuts'
    ];

    function cozenShortcut($window, Shortcuts) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            var methods = {
                init          : init,
                destroy       : destroy,
                startListening: startListening,
                shortcutsLog  : shortcutsLog
            };

            var data = {
                directive: 'cozenShortcut'
            };

            methods.init();

            function init() {

                // Init stuff
                element.on('$destroy', methods.destroy);
                methods.startListening('keydown', true);
                methods.startListening('keyup', false);
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function startListening(event, newValue) {
                $window.addEventListener(event, function ($event) {
                    switch ($event.keyCode) {

                        // Shift
                        case 16:
                            Shortcuts.shift = newValue;
                            methods.shortcutsLog();
                            break;

                        // Ctrl
                        case 17:
                            Shortcuts.ctrl = newValue;
                            methods.shortcutsLog();
                            break;

                        // Alt
                        case 18:
                            Shortcuts.alt = newValue;
                            methods.shortcutsLog();
                            break;
                    }
                });
            }

            function shortcutsLog() {
                var log = '';
                Object.keys(Shortcuts).forEach(function(key) {
                    log += '%c[%c' + Methods.capitalizeFirstLetter(key) + ' %c' + Shortcuts[key] + '%c]';
                });

                // @todo: Injection automatique en fonction du nombre de clés
                console.log(log,
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor('directive'),
                    Methods.getConsoleColor('fn'),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor('directive'),
                    Methods.getConsoleColor('fn'),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor('directive'),
                    Methods.getConsoleColor('fn'),
                    Methods.getConsoleColor());
            }
        }
    }

})(window.angular);


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
 * @param {string}   cozenTextareaModel            > Value edited by the textarea [required]
 * @param {boolean}  cozenTextareaDisabled = false > Disable the textarea
 * @param {function} cozenTextareaOnChange         > Callback function called on change
 *
 * [Attributes params]
 * @param {number}  cozenTextareaId                                             > Id of the textarea
 * @param {string}  cozenTextareaTooltip                                        > Text of the tooltip
 * @param {string}  cozenTextareaTooltipPlacement = 'auto right'                > Change the position of the tooltip
 * @param {string}  cozenTextareaTooltipTrigger   = 'outsideClick'              > Type of trigger to show the tooltip
 * @param {boolean} cozenTextareaRequired         = false                       > Required textarea
 * @param {boolean} cozenTextareaErrorDesign      = true                        > Add style when error
 * @param {boolean} cozenTextareaSuccessDesign    = true                        > Add style when success
 * @param {string}  cozenTextareaSize             = 'normal'                    > Size of the button
 * @param {string}  cozenTextareaSizeSmall                                      > Shortcut for small size
 * @param {string}  cozenTextareaSizeNormal                                     > Shortcut for normal size
 * @param {string}  cozenTextareaSizeLarge                                      > Shortcut for large size
 * @param {string}  cozenTextareaPlaceholder                                    > Text for the placeholder
 * @param {number}  cozenTextareaMinLength        = 0                           > Minimum char length
 * @param {number}  cozenTextareaMaxLength        = 100                         > Maximum char length
 * @param {string}  cozenTextareaName             = uuid                        > Name of the textarea
 * @param {boolean} cozenTextareaValidator        = 'dirty'                     > Define after what type of event the textarea must add more ui color
 * @param {boolean} cozenTextareaValidatorAll                                   > Shortcut for all type
 * @param {boolean} cozenTextareaValidatorTouched                               > Shortcut for touched type
 * @param {boolean} cozenTextareaValidatorDirty                                 > Shortcut for dirty type
 * @param {boolean} cozenTextareaValidatorEmpty   = true                        > Display ui color even if textarea empty
 * @param {boolean} cozenTextareaElastic          = false                       > Auto resize the textarea depending of his content
 * @param {number}  cozenTextareaRows             = 2                           > Number of rows
 * @param {string}  cozenTextareaLabel                                          > Add a label on the top of the textarea
 * @param {string}  cozenTextareaRequiredTooltip  = 'textarea_required_tooltip' > Text to display for the tooltip of the required element
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
    '$timeout',
    '$interval',
    '$filter'
  ];

  function cozenTextarea(Themes, CONFIG, rfc4122, $timeout, $interval, $filter) {
    return {
      link            : link,
      restrict        : 'E',
      replace         : false,
      transclude      : false,
      scope           : {
        cozenTextareaModel   : '=?',
        cozenTextareaDisabled: '=?',
        cozenTextareaOnChange: '&'
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

        // Shortcut values (size)
        if (angular.isUndefined(attrs.cozenTextareaSize)) {
          if (angular.isDefined(attrs.cozenTextareaSizeSmall)) scope._cozenTextareaSize = 'small';
          else if (angular.isDefined(attrs.cozenTextareaSizeNormal)) scope._cozenTextareaSize = 'normal';
          else if (angular.isDefined(attrs.cozenTextareaSizeLarge)) scope._cozenTextareaSize = 'large';
          else scope._cozenTextareaSize = 'normal';
        }

        // Shortcut values (validator)
        if (angular.isUndefined(attrs.cozenTextareaValidator)) {
          if (angular.isDefined(attrs.cozenTextareaValidatorAll)) scope._cozenTextareaValidator = 'all';
          if (angular.isDefined(attrs.cozenTextareaValidatorTouched)) scope._cozenTextareaValidator = 'touched';
          else if (angular.isDefined(attrs.cozenTextareaValidatorDirty)) scope._cozenTextareaValidator = 'dirty';
          else scope._cozenTextareaValidator = 'dirty';
        }

        // Default values (scope)
        if (angular.isUndefined(attrs.cozenTextareaDisabled)) scope.vm.cozenTextareaDisabled = false;

        // Default values (attributes)
        scope._cozenTextareaId                 = angular.isDefined(attrs.cozenTextareaId) ? attrs.cozenTextareaId : '';
        scope._cozenTextareaTooltip            = angular.isDefined(attrs.cozenTextareaTooltip) ? attrs.cozenTextareaTooltip : '';
        scope._cozenTextareaTooltipTrigger     = angular.isDefined(attrs.cozenTextareaTooltipTrigger) ? attrs.cozenTextareaTooltipTrigger : 'outsideClick';
        scope._cozenTextareaRequired           = angular.isDefined(attrs.cozenTextareaRequired) ? JSON.parse(attrs.cozenTextareaRequired) : false;
        scope._cozenTextareaErrorDesign        = angular.isDefined(attrs.cozenTextareaErrorDesign) ? JSON.parse(attrs.cozenTextareaErrorDesign) : true;
        scope._cozenTextareaSuccessDesign      = angular.isDefined(attrs.cozenTextareaSuccessDesign) ? JSON.parse(attrs.cozenTextareaSuccessDesign) : true;
        scope._cozenTextareaPlaceholder        = angular.isDefined(attrs.cozenTextareaPlaceholder) ? attrs.cozenTextareaPlaceholder : '';
        scope._cozenTextareaMinLength          = angular.isDefined(attrs.cozenTextareaMinLength) ? JSON.parse(attrs.cozenTextareaMinLength) : 0;
        scope._cozenTextareaMaxLength          = angular.isDefined(attrs.cozenTextareaMaxLength) ? JSON.parse(attrs.cozenTextareaMaxLength) : 100;
        scope._cozenTextareaName               = angular.isDefined(attrs.cozenTextareaName) ? attrs.cozenTextareaName : data.uuid;
        scope._cozenTextareaValidatorEmpty     = angular.isDefined(attrs.cozenTextareaValidatorEmpty) ? JSON.parse(attrs.cozenTextareaValidatorEmpty) : true;
        scope._cozenTextareaValidatorIcon      = angular.isDefined(attrs.cozenTextareaValidatorIcon) ? JSON.parse(attrs.cozenTextareaValidatorIcon) : true;
        scope._cozenTextareaTooltipPlacement   = angular.isDefined(attrs.cozenTextareaTooltipPlacement) ? attrs.cozenTextareaTooltipPlacement : 'auto right';
        scope._cozenTextareaElastic            = angular.isDefined(attrs.cozenTextareaElastic) ? JSON.parse(attrs.cozenTextareaElastic) : false;
        scope._cozenTextareaRows               = angular.isDefined(attrs.cozenTextareaRows) ? JSON.parse(attrs.cozenTextareaRows) : 2;
        scope._cozenTextareaLabel              = angular.isDefined(attrs.cozenTextareaLabel) ? attrs.cozenTextareaLabel : '';
        scope._cozenTextareaUuid               = data.uuid;
        scope._cozenTextareaDisplayModelLength = CONFIG.textarea.displayModelLength;
        scope._cozenTextareaModelLength        = scope._cozenTextareaMaxLength;
        scope._cozenTextareaRequiredConfig     = CONFIG.required;
        scope._cozenTextareaRequiredTooltip    = angular.isDefined(attrs.cozenTextareaRequiredTooltip) ? attrs.cozenTextareaRequiredTooltip : 'textarea_required_tooltip';

        // Init stuff
        element.on('$destroy', methods.destroy);
        scope._activeTheme = Themes.getActiveTheme();
        scope.$on('cozenFormName', function (event, eventData) {
          scope._cozenTextareaForm = eventData.name;
        });

        // Display the template
        scope._isReady = true;
      }

      function hasError() {
        if (Methods.isNullOrEmpty(attrs.cozenTextareaModel)) {
          Methods.directiveErrorRequired(data.directive, 'Model');
          return true;
        }
        return false;
      }

      function destroy() {
        element.off('$destroy', methods.destroy);
      }

      function getMainClass() {
        if (!Methods.isNullOrEmpty(scope._cozenTextareaForm)) {
          var classList = [scope._activeTheme, scope._cozenTextareaSize];
          var textarea  = methods.getForm()[scope._cozenTextareaName];
          if (!Methods.isNullOrEmpty(textarea)) {
            if (scope._cozenTextareaValidatorEmpty || (!scope._cozenTextareaValidatorEmpty && !Methods.isNullOrEmpty(scope.vm.cozenTextareaModel))) {
              switch (scope._cozenTextareaValidator) {
                case 'touched':
                  if (textarea.$touched) classList.push(methods.getDesignClass(textarea));
                  break;
                case 'dirty':
                  if (textarea.$dirty) classList.push(methods.getDesignClass(textarea));
                  break;
                case 'all':
                  classList.push(methods.getDesignClass(textarea));
                  break;
              }
            }
          }
          if (scope.vm.cozenTextareaDisabled) classList.push('disabled');
          return classList;
        }
      }

      function onChange($event) {
        if (scope.vm.cozenTextareaDisabled) return;
        if (Methods.isFunction(scope.cozenTextareaOnChange)) scope.cozenTextareaOnChange();
        if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'onChange');
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
        var form = scope.$parent.$parent[scope._cozenTextareaForm];
        if (Methods.isNullOrEmpty(form)) {
          form = scope.$parent.$parent.$parent[scope._cozenTextareaForm];
          if (Methods.isNullOrEmpty(form)) {
            form = scope.$parent.$parent.$parent.$parent[scope._cozenTextareaForm];
            if (Methods.isNullOrEmpty(form)) {
              form = scope.$parent.$parent.$parent.$parent.$parent[scope._cozenTextareaForm];
              if (Methods.isNullOrEmpty(form)) {
                form = scope.$parent.$parent.$parent.$parent.$parent.$parent[scope._cozenTextareaForm];
                if (Methods.isNullOrEmpty(form)) {
                  return form;
                } else return form;
              } else return form;
            } else return form;
          } else return form;
        } else return form;
      }

      function updateModelLength() {
        scope._cozenTextareaModelLength = scope._cozenTextareaMaxLength - scope.vm.cozenTextareaModel.length;
      }
    }
  }

  cozenTextareaCtrl.$inject = [];

  function cozenTextareaCtrl() {
    var vm = this;
  }

})(window.angular);



(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('Themes', ThemesProvider);

    ThemesProvider.$inject = [
        'CONFIG'
    ];

    function ThemesProvider(CONFIG) {
        var activeTheme = CONFIG.themes[0];

        this.setActiveTheme = function (theme) {
            if (!Methods.isInList(CONFIG.themes, theme)) {
                console.error('%cThe theme <%c' + theme + '%c> is not in the list of available themes.\n' +
                    'To avoid error, the new active theme is <%c' + activeTheme + '%c>.',
                    getConsoleColor(),
                    getConsoleColor('red'),
                    getConsoleColor(),
                    getConsoleColor('purple'),
                    getConsoleColor()
                );
            } else {
                activeTheme = theme;
            }
            return this;
        };

        this.$get = Themes;

        Themes.$inject = [];

        function Themes() {
            return {
                getActiveTheme: getActiveTheme
            };

            function getActiveTheme() {
                return activeTheme;
            }
        }
    }

})(window.angular);
/**
 * @ngdoc directive
 * @name cozen-tooltip
 * @scope
 * @restrict AE
 * @replace false
 * @transclude true
 * @description
 *
 * [Scope params]
 * @param {string}  cozenTooltipLabel            > Text of the tooltip (could be html as well) [required]
 * @param {boolean} cozenTooltipDisabled = false > Disable the tooltip (allow empty label)

 * [Attributes params]
 * @param {string}  cozenTooltipPlacement   = 'auto right' > Position of the tooltip (ui-tooltip placement)
 * @param {boolean} cozenTooltipBody        = true         > Tooltip append to body
 * @param {number}  cozenTooltipCloseDelay  = 100          > Delay before hide
 * @param {number}  cozenTooltipDelay       = 250          > Delay before show
 * @param {string}  cozenTooltipTrigger     = 'mouseenter' > Define what trigger the tooltip
 * @param {string}  cozenTooltipType        = 'default'    > Define what type of tooltip is required
 * @param {string}  cozenTooltipTypeDefault                > Shortcut for default type
 * @param {string}  cozenTooltipTypeHtml                   > Shortcut for html type
 * @param {string}  cozenTooltipDisplay                    > Change the display (only when there are problem)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.tooltip', [])
        .directive('cozenTooltip', cozenTooltip);

    cozenTooltip.$inject = [
        'Themes'
    ];

    function cozenTooltip(Themes) {
        return {
            link       : link,
            restrict   : 'AE',
            replace    : false,
            transclude : true,
            scope      : {
                cozenTooltipLabel   : '=?',
                cozenTooltipDisabled: '=?'
            },
            templateUrl: 'directives/tooltip/tooltip.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenTooltip'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {};

                // Checking required stuff
                if (methods.hasError()) return;

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenTooltipType)) {
                    if (angular.isDefined(attrs.cozenTooltipTypeDefault)) scope._cozenTooltipType = 'default';
                    else if (angular.isDefined(attrs.cozenTooltipTypeHtml)) scope._cozenTooltipType = 'html';
                    else scope._cozenTooltipType = 'default';
                } else scope._cozenTooltipType = attrs.cozenTooltipType;

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenTooltipDisabled)) scope.cozenTooltipDisabled = false;

                // Default values (attributes)
                scope._cozenTooltipPlacement  = angular.isDefined(attrs.cozenTooltipPlacement) ? attrs.cozenTooltipPlacement : 'auto right';
                scope._cozenTooltipBody       = angular.isDefined(attrs.cozenTooltipBody) ? JSON.parse(attrs.cozenTooltipBody) : true;
                scope._cozenTooltipCloseDelay = angular.isDefined(attrs.cozenTooltipCloseDelay) ? JSON.parse(attrs.cozenTooltipCloseDelay) : 100;
                scope._cozenTooltipDelay      = angular.isDefined(attrs.cozenTooltipDelay) ? JSON.parse(attrs.cozenTooltipDelay) : 250;
                scope._cozenTooltipTrigger    = angular.isDefined(attrs.cozenTooltipTrigger) ? attrs.cozenTooltipTrigger : 'mouseenter';
                scope._cozenTooltipDisplay    = angular.isDefined(attrs.cozenTooltipDisplay) ? attrs.cozenTooltipDisplay : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenTooltipLabel)) {
                    if (!scope.cozenTooltipDisabled) {
                        Methods.directiveErrorRequired(data.directive, 'cozenTooltipLabel');
                        return true;
                    }
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [scope._activeTheme];
                return classList;
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-view
 * @scope
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number} cozenViewScrollBarHeight > When using default config, define the height of the body
 *
 */
(function (angular, window) {
    'use strict';

    angular
        .module('cozenLib.view', [])
        .directive('cozenView', cozenView);

    cozenView.$inject = [
        'CONFIG'
    ];

    function cozenView(CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            templateUrl: 'directives/view/view.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init    : init,
                hasError: hasError,
                destroy : destroy
            };

            var data = {
                directive: 'cozenView'
            };

            scope._isReady = false;

            methods.init();

            function init() {

                // Checking required stuff
                if (methods.hasError()) return;

                // Default values (attributes)
                scope._cozenScrollBar       = CONFIG.scrollsBar;
                scope._cozenScrollBarConfig = CONFIG.scrollsBarConfig;

                // Scrollbar config for the height
                scope._cozenScrollBarConfig.setHeight = angular.isDefined(attrs.cozenViewScrollBarHeight) ? parseInt(attrs.cozenViewScrollBarHeight) : window.innerHeight;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (angular.isUndefined(attrs.cozenViewScrollBarHeight)) {
                    Methods.directiveErrorRequired(data.directive, 'cozenViewScrollBarHeight');
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


/*
 * The whenReady directive allows you to execute the content of a when-ready
 * attribute after the element is ready (i.e. when it's done loading all sub directives and DOM
 * content). See: http://stackoverflow.com/questions/14968690/sending-event-when-angular-js-finished-loading
 *
 * Execute multiple expressions in the when-ready attribute by delimiting them
 * with a semi-colon. when-ready="doThis(); doThat()"
 *
 * Optional: If the value of a wait-for-interpolation attribute on the
 * element evaluates to true, then the expressions in when-ready will be
 * evaluated after all text nodes in the element have been interpolated (i.e.
 * {{placeholders}} have been replaced with actual values).
 *
 * Optional: Use a ready-check attribute to write an expression that
 * specifies what condition is true at any given moment in time when the
 * element is ready. The expression will be evaluated repeatedly until the
 * condition is finally true. The expression is executed with
 * requestAnimationFrame so that it fires at a moment when it is least likely
 * to block rendering of the page.
 *
 * If wait-for-interpolation and ready-check are both supplied, then the
 * when-ready expressions will fire after interpolation is done *and* after
 * the ready-check condition evaluates to true.
 *
 * Caveats: if other directives exists on the same element as this directive
 * and destroy the element thus preventing other directives from loading, using
 * this directive won't work. The optimal way to use this is to put this
 * directive on an outer element.
 *
 * @ngdoc directive
 * @name cozen-when-ready
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {function} cozenWhenReady                    > Callback functions called on ready
 * @param {boolean}  cozenWaitForInterpolation = false > Wait for the end of the interpolation
 * @param {function} cozenReadyCheck                   >
 *
 */

(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenWhenReady', cozenWhenReady);

    cozenWhenReady.$inject = [
        '$interpolate'
    ];

    function cozenWhenReady($interpolate) {
        return {
            link    : link,
            restrict: 'A',
            priority: 100000
        };

        function link(scope, element, attrs) {
            var expressions             = attrs.cozenWhenReady.split(';');
            var waitForInterpolation    = false;
            var hasReadyCheckExpression = false;

            function evalExpressions(expressions) {
                expressions.forEach(function (expression) {
                    scope.$eval(expression);
                });
            }

            if (attrs.cozenWhenReady.trim().length === 0) {
                return;
            }
            if (attrs.cozenWaitForInterpolation && scope.$eval(attrs.cozenWaitForInterpolation)) {
                waitForInterpolation = true;
            }
            if (attrs.cozenReadyCheck) {
                hasReadyCheckExpression = true;
            }
            if (waitForInterpolation || hasReadyCheckExpression) {
                requestAnimationFrame(function checkIfReady() {
                    var isInterpolated   = false;
                    var isReadyCheckTrue = false;
                    isInterpolated       = !(waitForInterpolation && element.text().indexOf($interpolate.startSymbol()) >= 0);
                    isReadyCheckTrue     = !(hasReadyCheckExpression && !scope.$eval(attrs.cozenReadyCheck));
                    if (isInterpolated && isReadyCheckTrue) {
                        evalExpressions(expressions);
                    } else {
                        requestAnimationFrame(checkIfReady);
                    }
                });
            } else {
                evalExpressions(expressions);
            }
        }
    }

})(window.angular);