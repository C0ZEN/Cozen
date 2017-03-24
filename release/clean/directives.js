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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenAlertSize)) {
                    if (angular.isDefined(attrs.cozenAlertSizeSmall)) {
                        scope._cozenAlertSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenAlertSizeNormal)) {
                        scope._cozenAlertSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenAlertSizeLarge)) {
                        scope._cozenAlertSize = 'large';
                    }
                    else {
                        scope._cozenAlertSize = 'normal';
                    }
                }
                else {
                    scope._cozenAlertSize = attrs.cozenAlertSize;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenAlertType)) {
                    if (angular.isDefined(attrs.cozenAlertTypeDefault)) {
                        scope._cozenAlertType = 'default';
                    }
                    else if (angular.isDefined(attrs.cozenAlertTypeInfo)) {
                        scope._cozenAlertType = 'info';
                    }
                    else if (angular.isDefined(attrs.cozenAlertTypeSuccess)) {
                        scope._cozenAlertType = 'success';
                    }
                    else if (angular.isDefined(attrs.cozenAlertTypeWarning)) {
                        scope._cozenAlertType = 'warning';
                    }
                    else if (angular.isDefined(attrs.cozenAlertTypeError)) {
                        scope._cozenAlertType = 'error';
                    }
                    else {
                        scope._cozenAlertType = 'default';
                    }
                }
                else {
                    scope._cozenAlertType = attrs.cozenAlertType;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenAlertDisplay)) {
                    scope.cozenAlertDisplay = true;
                }
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
                if (scope._cozenAlertForceAnimation) {
                    methods.show(null, {
                        uuid: data.uuid
                    });
                }

                // To execute the hide and show stuff even if the value is changed elsewhere
                scope.$watch('cozenAlertDisplay', function (newValue) {
                    if (!data.firstDisplayWatch) {
                        if (newValue) {
                            methods.show(null, {});
                        }
                        else {
                            methods.hide(null, {
                                uuid: data.uuid
                            });
                        }
                    }
                    else {
                        data.firstDisplayWatch = false;
                    }
                });
            }

            function hasError() {
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [
                    scope._activeTheme,
                    scope._cozenAlertSize,
                    scope._cozenAlertType,
                    attrs.cozenAlertClass
                ];
                if (!data.firstHide) {
                    if (scope._cozenAlertAnimationIn) {
                        classList.push('animate-in');
                    }
                    if (scope._cozenAlertAnimationOut) {
                        classList.push('animate-out');
                    }
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
                    if (Methods.isFunction(scope.cozenAlertOnHide)) {
                        scope.cozenAlertOnHide();
                    }
                    if (CONFIG.debug) {
                        Methods.directiveCallbackLog(data.directive, 'OnHide');
                    }
                    Methods.safeApply(scope);

                    // @todo instead of added a fix value (corresponding to animation-duration-out) we could:
                    // - Add a parameter (attr + config) to set the time
                    // - Get a real callback when the hide animation is done
                    var timeout = scope._cozenAlertAnimationOut ? 200 : 0;
                    $timeout(function () {
                        if (Methods.isFunction(scope.cozenAlertOnHideDone)) {
                            scope.cozenAlertOnHideDone();
                        }
                    }, timeout);
                }
            }

            function show($event, params) {
                if (params.uuid == data.uuid) {
                    data.firstHide          = false;
                    scope.cozenAlertDisplay = true;
                    if (Methods.isFunction(scope.cozenAlertOnShow)) {
                        scope.cozenAlertOnShow();
                    }
                    if (CONFIG.debug) {
                        Methods.directiveCallbackLog(data.directive, 'OnShow');
                    }
                    Methods.safeApply(scope);
                }
            }

            function onClose() {
                scope.cozenAlertDisplay = false;
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
    "broadcastLog": false,
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
        "displayModelLength": false,
        "required": false,
        "errorDesign": true,
        "successDesign": true,
        "minLength": 0,
        "maxLength": 200,
        "validator": {
            "type": "dirty",
            "empty": true
        },
        "elastic": true,
        "rows": 2,
        "tooltip": {
            "placement": "auto right",
            "trigger": "outsideClick"
        }
    },
    "required": {
        "type": "star",
        "icon": "fa fa-fw fa-exclamation-circle"
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
            "inClass": "fadeInUp",
            "out": true,
            "outClass": "fadeOutDown"
        },
        "timeout": 0
    },
    "btnToggle": {
        "animation": true,
        "tooltipType": "default",
        "startRight": true
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
    },
    "floatingFeed": {
        "width": 460,
        "size": "normal",
        "animation": {
            "in": "fadeInDown",
            "out": "fadeOutDown"
        },
        "closeBtn": true,
        "iconLeft": true,
        "right": 20,
        "bottom": 20
    }
}

        );

})(window.angular);

(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('CloudinaryUpload', CloudinaryUploadProvider);

    CloudinaryUploadProvider.$inject = [
        'CONFIG'
    ];

    function CloudinaryUploadProvider(CONFIG) {

        // Default values
        var data = {
            url      : 'https://api.cloudinary.com/',
            version  : 'v1_1/',
            cloudName: 'cozen',
            action   : '/upload'
        };

        this.url = function (url) {
            data.url = url;
            return this;
        };

        this.version = function (version) {
            data.version = version;
            return this;
        };

        this.cloudName = function (cloudName) {
            data.cloudName = cloudName;
            return this;
        };

        this.action = function (action) {
            data.action = action;
            return this;
        };

        this.$get = Cloudinary;

        Cloudinary.$inject = [
            'Upload',
            'CONFIG'
        ];

        function Cloudinary(Upload, CONFIG) {
            return {
                upload: upload
            };

            function upload(file, scope, commonData) {
                scope._hasUploadError = false;
                if (Methods.isNullOrEmpty(file)) {
                    return;
                }
                scope._isUploading = true;

                if (file && !file.$error) {

                    // Upload it
                    file.upload = Upload.upload({
                        url : data.url + data.version + data.cloudName + data.action,
                        data: angular.merge({
                            context: 'photo=' + file.$ngfName,
                            file   : file
                        }, commonData)
                    }).progress(function (e) {
                        scope._uploadingText = Math.round((e.loaded * 100.0) / e.total) + '%';
                    }).success(function (data, status, headers, config) {
                        file.name          = file.$ngfName;
                        file.width         = data.width;
                        file.height        = data.height;
                        file.format        = data.format;
                        file.url           = data.url;
                        scope._isUploading = false;
                        if (CONFIG.debug) {
                            Methods.directiveCallbackLog(data.directive, 'upload');
                        }

                        // Update form validity
                        if (scope._cozenBtnUploadRequired) {
                            var btn = scope._methods.getForm()[scope._cozenBtnFormCtrl][scope._cozenBtnFormModel][scope._cozenBtnForm][scope._cozenBtnName];
                            if (!Methods.isNullOrEmpty(btn)) {
                                btn.$setValidity('isUploadSet', true);
                            }
                        }
                    }).error(function (data, status, headers, config) {
                        file.result             = data;
                        scope._hasUploadError   = true;
                        scope._uploadErrorLabel = 'btn_upload_error_occurred';

                        // Update form validity
                        if (scope._cozenBtnUploadRequired) {
                            var btn = scope._methods.getForm()[scope._cozenBtnFormCtrl][scope._cozenBtnFormModel][scope._cozenBtnForm][scope._cozenBtnName];
                            if (!Methods.isNullOrEmpty(btn)) {
                                btn.$setValidity('isUploadSet', false);
                            }
                        }
                    });
                }
            }
        }
    }

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
 * @param {function} cozenBtnOnClick              > Callback function called on click
 * @param {boolean}  cozenBtnActive       = false > Active the button (hover state)
 * @param {boolean}  cozenBtnDisabled     = false > Disable the button
 * @param {boolean}  cozenBtnLoader       = false > Active a loader (replace all the content and disable visual state)
 * @param {object}   cozenBtnUploadConfig         > Config of the upload (see ng-file-upload doc)
 * @param {object}   cozenBtnUploadModel          > Model (ng-model) which contain the uploaded image
 * @param {string}   cozenBtnLabel                > Text of the button
 *
 * [Attributes params]
 * @param {number}  cozenBtnId                                     > Id of the button
 * @param {string}  cozenBtnSize            = normal               > Size of the button
 * @param {string}  cozenBtnSizeSmall                              > Shortcut for small size
 * @param {string}  cozenBtnSizeNormal                             > Shortcut for normal size
 * @param {string}  cozenBtnSizeLarge                              > Shortcut for large size
 * @param {string}  cozenBtnType            = default              > Type of the button (change the color)
 * @param {string}  cozenBtnTypePrimary                            > Shortcut for primary type
 * @param {string}  cozenBtnTypeTransparent                        > Shortcut for transparent type
 * @param {string}  cozenBtnTypeCold                               > Shortcut for cold type
 * @param {string}  cozenBtnTypePurple                             > Shortcut for purple type
 * @param {string}  cozenBtnTypeGreen                              > Shortcut for green type
 * @param {string}  cozenBtnTypeGoogle                             > Shortcut for google type
 * @param {string}  cozenBtnTypeFacebook                           > Shortcut for facebook type
 * @param {string}  cozenBtnTypeDefault                            > Shortcut for default type
 * @param {string}  cozenBtnTypeInfo                               > Shortcut for info type
 * @param {string}  cozenBtnTypeSuccess                            > Shortcut for success type
 * @param {string}  cozenBtnTypeWarning                            > Shortcut for warning type
 * @param {string}  cozenBtnTypeError                              > Shortcut for error type
 * @param {string}  cozenBtnIconLeft                               > Add an icon the to left (write the class)
 * @param {string}  cozenBtnIconRight                              > Add an icon the to right (write the class)
 * @param {boolean} cozenBtnAutoSizing      = false                > Shortcut to activate the auto sizing (instead of 100% width)
 * @param {string}  cozenBtnClass                                  > Custom class
 * @param {string}  cozenBtnImgLeft                                > URL/path to the left img
 * @param {boolean} cozenBtnIsUpload        = false                > Active the upload mod
 * @param {string}  cozenBtnUpperLabel                             > Add a label on the top of the btn
 * @param {string}  cozenBtnRequiredTooltip = btn_required_tooltip > Text to display for the tooltip of the required element
 * @param {boolean} cozenBtnUploadRequired  = false                > Required upload model
 * @param {boolean} cozenBtnPreviewIcon     = fa fa-fw fa-eye      > Preview icon on the right
 * @param {boolean} cozenBtnUploadInfoIcon  = true                 > Display an info icon to show the upload requirements
 *
 */
(function (angular, document) {
    'use strict';

    angular
        .module('cozenLib.btn', [])
        .directive('cozenBtn', cozenBtn);

    cozenBtn.$inject = [
        'Themes',
        'CONFIG',
        'rfc4122',
        'CloudinaryUpload'
    ];

    function cozenBtn(Themes, CONFIG, rfc4122, CloudinaryUpload) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnOnClick     : '&',
                cozenBtnActive      : '=?',
                cozenBtnDisabled    : '=?',
                cozenBtnLoader      : '=?',
                cozenBtnUploadConfig: '=?',
                cozenBtnUploadModel : '=?',
                cozenBtnLabel       : '=?'
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
                getTabIndex : getTabIndex,
                getForm     : getForm,
                upload      : upload
            };

            var data = {
                directive: 'cozenBtn',
                uuid     : rfc4122.v4()
            };

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex,
                    upload      : upload,
                    getForm     : getForm
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnSize)) {
                    if (angular.isDefined(attrs.cozenBtnSizeSmall)) {
                        scope._cozenBtnSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenBtnSizeNormal)) {
                        scope._cozenBtnSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenBtnSizeLarge)) {
                        scope._cozenBtnSize = 'large';
                    }
                    else {
                        scope._cozenBtnSize = 'normal';
                    }
                }
                else {
                    scope._cozenBtnSize = attrs.cozenBtnSize;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenBtnType)) {
                    if (angular.isDefined(attrs.cozenBtnTypeDefault)) {
                        scope._cozenBtnType = 'default';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypePrimary)) {
                        scope._cozenBtnType = 'primary';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeTransparent)) {
                        scope._cozenBtnType = 'transparent';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeCold)) {
                        scope._cozenBtnType = 'cold';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypePurple)) {
                        scope._cozenBtnType = 'purple';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeGreen)) {
                        scope._cozenBtnType = 'green';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeGoogle)) {
                        scope._cozenBtnType = 'google';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeFacebook)) {
                        scope._cozenBtnType = 'facebook';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeInfo)) {
                        scope._cozenBtnType = 'info';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeSuccess)) {
                        scope._cozenBtnType = 'success';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeWarning)) {
                        scope._cozenBtnType = 'warning';
                    }
                    else if (angular.isDefined(attrs.cozenBtnTypeError)) {
                        scope._cozenBtnType = 'error';
                    }
                    else {
                        scope._cozenBtnType = 'default';
                    }
                }
                else {
                    scope._cozenBtnType = attrs.cozenBtnType;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnActive)) {
                    scope.cozenBtnActive = false;
                }
                if (angular.isUndefined(attrs.cozenBtnDisabled)) {
                    scope.cozenBtnDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenBtnLoader)) {
                    scope.cozenBtnLoader = false;
                }

                // Default values (attributes)
                scope._cozenBtnId              = angular.isDefined(attrs.cozenBtnId) ? attrs.cozenBtnId : '';
                scope._cozenBtnIconLeft        = angular.isDefined(attrs.cozenBtnIconLeft) ? attrs.cozenBtnIconLeft : '';
                scope._cozenBtnIconRight       = angular.isDefined(attrs.cozenBtnIconRight) ? attrs.cozenBtnIconRight : '';
                scope._cozenBtnImgLeft         = angular.isDefined(attrs.cozenBtnImgLeft) ? attrs.cozenBtnImgLeft : '';
                scope._cozenBtnIsUpload        = angular.isDefined(attrs.cozenBtnIsUpload) ? JSON.parse(attrs.cozenBtnIsUpload) : false;
                scope._cozenBtnName            = data.uuid;
                scope._cozenBtnUpperLabel      = angular.isDefined(attrs.cozenBtnUpperLabel) ? attrs.cozenBtnUpperLabel : '';
                scope._cozenBtnRequiredConfig  = CONFIG.required;
                scope._cozenBtnRequiredTooltip = angular.isDefined(attrs.cozenBtnRequiredTooltip) ? attrs.cozenBtnRequiredTooltip : 'btn_required_tooltip';
                scope._cozenBtnUploadRequired  = angular.isDefined(attrs.cozenBtnUploadRequired) ? JSON.parse(attrs.cozenBtnUploadRequired) : false;
                scope._cozenBtnPreviewIcon     = angular.isDefined(attrs.cozenBtnPreviewIcon) ? attrs.cozenBtnPreviewIcon : 'fa fa-fw fa-eye';
                scope._cozenBtnUploadInfoIcon  = angular.isDefined(attrs.cozenBtnUploadInfoIcon) ? JSON.parse(attrs.cozenBtnUploadInfoIcon) : true;

                // Upload config
                if (scope._cozenBtnIsUpload) {
                    data.defaultUploadConfig   = {
                        pattern      : '.jpg,.jpeg,.png',
                        maxSize      : '5MB',
                        minHeight    : 40,
                        maxHeight    : 1080,
                        minWidth     : 40,
                        maxWidth     : 1920,
                        resize       : {},
                        dragOverClass: {
                            pattern: 'image/*',
                            accept : 'drop-accept',
                            reject : 'drop-reject'
                        },
                        keep         : false,
                        options      : {
                            updateOn: 'change drop dropUrl paste'
                        }
                    };
                    scope.cozenBtnUploadConfig = angular.merge({}, data.defaultUploadConfig, scope.cozenBtnUploadConfig);
                }
                scope._hasUploadError = false;
                scope._isUploading    = false;
                scope._uploadingText  = '0%';

                // When the form is ready, get the required intels
                scope.$on('cozenFormName', function (event, eventData) {
                    scope._cozenBtnFormCtrl  = eventData.ctrl;
                    scope._cozenBtnFormModel = eventData.model;
                    scope._cozenBtnForm      = eventData.name;

                    // Set error to parent if model is empty and required
                    if (Methods.isNullOrEmpty(scope.cozenBtnUploadModel) && scope._cozenBtnUploadRequired) {
                        var btn = methods.getForm()[scope._cozenBtnFormCtrl][scope._cozenBtnFormModel][scope._cozenBtnForm][scope._cozenBtnName];
                        if (!Methods.isNullOrEmpty(btn)) {
                            btn.$setValidity('isUploadSet', false);
                        }
                    }
                });

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function hasError() {
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [
                    scope._activeTheme,
                    scope._cozenBtnSize,
                    scope._cozenBtnType,
                    attrs.cozenBtnClass
                ];
                if (scope.cozenBtnActive) {
                    classList.push('active');
                }
                if (scope.cozenBtnDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenBtnLoader) {
                    classList.push('loading');
                }
                if (angular.isDefined(attrs.cozenBtnAutoSizing)) {
                    classList.push('auto');
                }
                if (scope._cozenBtnIsUpload) {
                    classList.push('upload');
                }
                return classList;
            }

            function onClick($event) {
                $event.stopPropagation();
                if (scope.cozenBtnDisabled) {
                    return;
                }
                if (scope.cozenBtnLoader) {
                    return;
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'OnClick');
                }
                if (Methods.isFunction(scope.cozenBtnOnClick)) {
                    scope.cozenBtnOnClick();
                }
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnDisabled) {
                    tabIndex = -1;
                }
                else if (scope.cozenBtnLoader) {
                    tabIndex = -1;
                }
                return tabIndex;
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

            function upload($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                if (!Methods.isNullOrEmpty($newFiles)) {

                    // Error file
                    if (!Methods.isNullOrEmpty($newFiles[0].$error)) {
                        scope._hasUploadError = true;
                        switch ($newFiles[0].$error) {
                            case 'maxWidth':
                                scope._uploadErrorLabel  = 'btn_upload_error_maxWidth';
                                scope._uploadErrorValues = {
                                    maxWidth: scope.cozenBtnUploadConfig.maxWidth,
                                    width   : $newFiles[0].$ngfWidth
                                };
                                break;
                            case 'minWidth':
                                scope._uploadErrorLabel  = 'btn_upload_error_minWidth';
                                scope._uploadErrorValues = {
                                    minWidth: scope.cozenBtnUploadConfig.minWidth,
                                    width   : $newFiles[0].$ngfWidth
                                };
                                break;
                            case 'maxHeight':
                                scope._uploadErrorLabel  = 'btn_upload_error_maxHeight';
                                scope._uploadErrorValues = {
                                    maxHeight: scope.cozenBtnUploadConfig.maxHeight,
                                    height   : $newFiles[0].$ngfHeight
                                };
                                break;
                            case 'minHeight':
                                scope._uploadErrorLabel  = 'btn_upload_error_minHeight';
                                scope._uploadErrorValues = {
                                    maxHeight: scope.cozenBtnUploadConfig.minHeight,
                                    height   : $newFiles[0].$ngfHeight
                                };
                                break;
                            case 'maxSize':
                                scope._uploadErrorLabel  = 'btn_upload_error_maxSize';
                                scope._uploadErrorValues = {
                                    maxSize: scope.cozenBtnUploadConfig.maxSize,
                                    size   : $newFiles[0].size
                                };
                                break;
                            case 'pattern':
                                scope._uploadErrorLabel  = 'btn_upload_error_pattern';
                                var types                = $newFiles[0].$errorParam;
                                types                    = types.replace(/,/g, ', ');
                                types                    = types.replace(/\./g, '');
                                scope._uploadErrorValues = {
                                    type : $newFiles[0].type,
                                    types: types.toUpperCase()
                                };
                                break;
                            default:
                                scope._uploadErrorLabel = 'btn_upload_error_unknown';
                        }
                    }

                    // Upload
                    else {
                        CloudinaryUpload.upload($files[$files.length - 1], scope, {
                            upload_preset: 'wt5h2jyz',
                            tags         : 'cozen'
                        });
                    }
                }
            }
        }
    }

})(window.angular, document);

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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnCheckSize)) {
                    if (angular.isDefined(attrs.cozenBtnCheckSizeSmall)) {
                        scope._cozenBtnCheckSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenBtnCheckSizeNormal)) {
                        scope._cozenBtnCheckSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenBtnCheckSizeLarge)) {
                        scope._cozenBtnCheckSize = 'large';
                    }
                    else {
                        scope._cozenBtnCheckSize = 'normal';
                    }
                }
                else {
                    scope._cozenBtnCheckSize = attrs.cozenBtnCheckSize;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnCheckDisabled)) {
                    scope.cozenBtnCheckDisabled = false;
                }

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
                var classList = [
                    scope._activeTheme,
                    scope._cozenBtnCheckSize
                ];
                if (scope.cozenBtnCheckDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenBtnCheckModel) {
                    classList.push('active');
                }
                if (scope._cozenBtnCheckStartRight) {
                    classList.push('check-right');
                }
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnCheckDisabled) {
                    return;
                }
                scope.cozenBtnCheckModel = !scope.cozenBtnCheckModel;
                if (Methods.isFunction(scope.cozenBtnCheckOnChange)) {
                    scope.cozenBtnCheckOnChange();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onChange');
                }
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnCheckDisabled) {
                    tabIndex = -1;
                }
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnRadioSize)) {
                    if (angular.isDefined(attrs.cozenBtnRadioSizeSmall)) {
                        scope._cozenBtnRadioSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeNormal)) {
                        scope._cozenBtnRadioSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenBtnRadioSizeLarge)) {
                        scope._cozenBtnRadioSize = 'large';
                    }
                    else {
                        scope._cozenBtnRadioSize = 'normal';
                    }
                }
                else {
                    scope._cozenBtnRadioSize = attrs.cozenBtnRadioSize;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenBtnRadioDisabled)) {
                    scope.cozenBtnRadioDisabled = false;
                }

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
                var classList = [
                    scope._activeTheme,
                    scope._cozenBtnRadioSize
                ];
                if (scope.cozenBtnRadioDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenBtnRadioModel) {
                    classList.push('active');
                }
                if (scope._cozenBtnRadioStartRight) {
                    classList.push('bubble-right');
                }
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnRadioDisabled) {
                    return;
                }
                if (scope.cozenBtnRadioModel) {
                    return;
                }
                scope.cozenBtnRadioModel = true;
                if (Methods.isFunction(scope.cozenBtnRadioOnChange)) {
                    scope.cozenBtnRadioOnChange();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onChange');
                }
                $rootScope.$broadcast(data.groupEvent.onChange, data);
            }

            function getTabIndex() {
                var tabIndex = 0;
                return tabIndex;
            }

            function onGroupChanged(event, eventData) {
                if (eventData.group == data.group) {
                    if (eventData.uuid != data.uuid) {
                        if (!scope.cozenBtnRadioModel) {
                            return;
                        }
                        scope.cozenBtnRadioModel = false;
                        if (Methods.isFunction(scope.cozenBtnRadioOnChange)) {
                            scope.cozenBtnRadioOnChange();
                        }
                        if (CONFIG.debug) {
                            Methods.directiveCallbackLog(data.directive, 'onChange');
                        }
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
 * @param {function} cozenBtnToggleOnChange                        > Callback function called on change
 * @param {boolean}  cozenBtnToggleDisabled        = false         > Disable the button toggle
 * @param {boolean}  cozenBtnToggleModel                           > Model (ak ng-model) which is edited by this directive [required]
 * @param {string}   cozenBtnToggleTooltipMaxWidth = max-width-200 > Max width of the tooltip (must be a class custom or predefined) [ex: max-width-[100-450])
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
 * @param {string}  cozenBtnToggleTooltipType           > Type of the tooltip
 * @param {boolean} cozenBtnToggleStartRight = true     > Display the toggle on the right of the label
 * @param {string}  cozenBtnToggleClass                 > Custom class
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
                cozenBtnToggleOnChange       : '&',
                cozenBtnToggleDisabled       : '=?',
                cozenBtnToggleModel          : '=?',
                cozenBtnToggleTooltipMaxWidth: '=?'
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

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Toggleing required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenBtnToggleSize)) {
                    if (angular.isDefined(attrs.cozenBtnToggleSizeSmall)) {
                        scope._cozenBtnToggleSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeNormal)) {
                        scope._cozenBtnToggleSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenBtnToggleSizeLarge)) {
                        scope._cozenBtnToggleSize = 'large';
                    }
                    else {
                        scope._cozenBtnToggleSize = 'normal';
                    }
                }
                else {
                    scope._cozenBtnToggleSize = attrs.cozenBtnToggleSize;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenBtnToggleDisabled) ? scope.cozenBtnToggleDisabled = false : null;
                angular.isUndefined(attrs.cozenBtnToggleTooltipMaxWidth) ? scope.cozenBtnToggleTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attributes)
                scope._cozenBtnToggleId          = angular.isDefined(attrs.cozenBtnToggleId) ? attrs.cozenBtnToggleId : '';
                scope._cozenBtnToggleAnimation   = angular.isDefined(attrs.cozenBtnToggleAnimation) ? JSON.parse(attrs.cozenBtnToggleAnimation) : CONFIG.btnToggle.animation;
                scope._cozenBtnToggleLabel       = angular.isDefined(attrs.cozenBtnToggleLabel) ? attrs.cozenBtnToggleLabel : '';
                scope._cozenBtnToggleTooltip     = angular.isDefined(attrs.cozenBtnToggleTooltip) ? attrs.cozenBtnToggleTooltip : '';
                scope._cozenBtnToggleTooltipType = angular.isDefined(attrs.cozenBtnToggleTooltipType) ? attrs.cozenBtnToggleTooltipType : CONFIG.btnToggle.tooltipType;
                scope._cozenBtnToggleStartRight  = angular.isDefined(attrs.cozenBtnToggleStartRight) ? JSON.parse(attrs.cozenBtnToggleStartRight) : CONFIG.btnToggle.startRight;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnToggleModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                var classList = [
                    scope._activeTheme,
                    scope._cozenBtnToggleSize,
                    attrs.cozenBtnToggleClass
                ];
                if (scope.cozenBtnToggleDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenBtnToggleModel) {
                    classList.push('active');
                }
                if (scope._cozenBtnToggleStartRight) {
                    classList.push('switch-right');
                }
                return classList;
            }

            function onClick($event) {
                if (scope.cozenBtnToggleDisabled) {
                    return;
                }
                scope.cozenBtnToggleModel = !scope.cozenBtnToggleModel;
                if (Methods.isFunction(scope.cozenBtnToggleOnChange)) {
                    scope.cozenBtnToggleOnChange();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onChange');
                }
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenBtnToggleDisabled) {
                    tabIndex = -1;
                }
                return tabIndex;
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-compile
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenCompile', cozenCompile);

    cozenCompile.$inject = [
        '$compile'
    ];

    function cozenCompile($compile) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.cozenCompile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
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
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('debug');
            }
            else {
                CONFIG.debug = value;
            }
            return this;
        };

        this.broadcastLog = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('broadcastLog');
            }
            else {
                CONFIG.broadcastLog = value;
            }
            return this;
        };

        this.currentLanguage = function (value) {
            var list = CONFIG.languages;
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('currentLanguage', list);
            }
            else {
                CONFIG.currentLanguage = value;
            }
            return this;
        };

        this.scrollsBar = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('scrollsBar');
            }
            else {
                CONFIG.scrollsBar = value;
            }
            return this;
        };

        this.scrollsBarConfig = function (config) {
            if (typeof config != 'object') {
                Methods.dataMustBeObject('scrollsBarConfig');
            }
            else {
                CONFIG.scrollsBarConfig = config;
            }
            return this;
        };

        this.dropdownAutoCloseOthers = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('dropdownAutoCloseOthers');
            }
            else {
                CONFIG.dropdown.autoCloseOthers = value;
            }
            return this;
        };

        this.inputDisplayModelLength = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('inputDisplayModelLength');
            }
            else {
                CONFIG.input.displayModelLength = value;
            }
            return this;
        };

        this.textareaDisplayModelLength = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('textareaDisplayModelLength');
            }
            else {
                CONFIG.textarea.displayModelLength = value;
            }
            return this;
        };

        this.textareaRequired = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('textareaRequired');
            }
            else {
                CONFIG.textarea.required = value;
            }
            return this;
        };

        this.textareaErrorDesign = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('textareaErrorDesign');
            }
            else {
                CONFIG.textarea.errorDesign = value;
            }
            return this;
        };

        this.textareaSuccessDesign = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('textareaSuccessDesign');
            }
            else {
                CONFIG.textarea.successDesign = value;
            }
            return this;
        };

        this.textareaMinLength = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('textareaMinLength');
            }
            else {
                CONFIG.textarea.minLength = value;
            }
            return this;
        };

        this.textareaMaxLength = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('textareaMaxLength');
            }
            else {
                CONFIG.textarea.maxLength = value;
            }
            return this;
        };

        this.textareaValidatorType = function (value) {
            CONFIG.textarea.validator.type = value;
            return this;
        };

        this.textareaValidatorEmpty = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('textareaValidatorEmpty');
            }
            else {
                CONFIG.textarea.validator.empty = value;
            }
            return this;
        };

        this.textareaElastic = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('textareaElastic');
            }
            else {
                CONFIG.textarea.elastic = value;
            }
            return this;
        };

        this.textareaRows = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('textareaRows');
            }
            else {
                CONFIG.textarea.rows = value;
            }
            return this;
        };

        this.textareaTooltipPlacement = function (value) {
            CONFIG.textarea.tooltip.placement = value;
            return this;
        };

        this.textareaTooltipTrigger = function (value) {
            CONFIG.textarea.tooltip.trigger = value;
            return this;
        };

        this.dropdownDisplayModelLength = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('dropdownDisplayModelLength');
            }
            else {
                CONFIG.dropdown.displayModelLength = value;
            }
            return this;
        };

        this.requiredType = function (value) {
            var list = [
                'star',
                'icon'
            ];
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('requiredType', list);
            }
            else {
                CONFIG.required.type = value;
            }
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
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('alertCloseBtnEnabled');
            }
            else {
                CONFIG.alert.closeBtn.enabled = value;
            }
            return this;
        };

        this.alertCloseBtnTootlip = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('alertCloseBtnTootlip');
            }
            else {
                CONFIG.alert.closeBtn.tooltip = value;
            }
            return this;
        };

        this.alertAnimationIn = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('alertAnimationIn');
            }
            else {
                CONFIG.alert.animation.in = value;
            }
            return this;
        };

        this.alertAnimationInClass = function (value) {
            CONFIG.alert.animation.inClass = value;
            return this;
        };

        this.alertAnimationOut = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('alertAnimationOut');
            }
            else {
                CONFIG.alert.animation.out = value;
            }
            return this;
        };

        this.alertAnimationOutClass = function (value) {
            CONFIG.alert.animation.outClass = value;
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

        this.alertTimeout = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('alertTimeout');
            }
            else {
                CONFIG.alert.timeout = value;
            }
            return this;
        };

        this.btnToggleAnimation = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('btnToggleAnimation');
            }
            else {
                CONFIG.btnToggle.animation = value;
            }
            return this;
        };

        this.btnToggleTooltipType = function (value) {
            CONFIG.btnToggle.tooltipType = value;
            return this;
        };

        this.btnToggleStartRight = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('btnToggleStartRight');
            }
            else {
                CONFIG.btnToggle.startRight = value;
            }
            return this;
        };

        this.popupHeader = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('popupHeader');
            }
            else {
                CONFIG.popup.header = value;
            }
            return this;
        };

        this.popupFooter = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('popupFooter');
            }
            else {
                CONFIG.popup.footer = value;
            }
            return this;
        };

        this.popupAnimationInEnabled = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('popupAnimationInEnabled');
            }
            else {
                CONFIG.popup.animation.in.enabled = value;
            }
            return this;
        };

        this.popupAnimationOutEnabled = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('popupAnimationOutEnabled');
            }
            else {
                CONFIG.popup.animation.out.enabled = value;
            }
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
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('popupEasyClose');
            }
            else {
                CONFIG.popup.easyClose = value;
            }
            return this;
        };

        this.popupCloseBtn = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('popupCloseBtn');
            }
            else {
                CONFIG.popup.closeBtn = value;
            }
            return this;
        };

        this.floatingFeedWidth = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('floatingFeedWidth');
            }
            else {
                CONFIG.floatingFeed.width = value;
            }
            return this;
        };

        this.floatingFeedSize = function (value) {
            CONFIG.floatingFeed.size = value;
            return this;
        };

        this.floatingFeedAnimationIn = function (value) {
            CONFIG.floatingFeed.animation.in = value;
            return this;
        };

        this.floatingFeedAnimationOut = function (value) {
            CONFIG.floatingFeed.animation.out = value;
            return this;
        };

        this.floatingFeedCloseBtn = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('floatingFeedCloseBtn');
            }
            else {
                CONFIG.floatingFeed.closeBtn = value;
            }
            return this;
        };

        this.floatingFeedIconLeft = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('floatingFeedIconLeft');
            }
            else {
                CONFIG.floatingFeed.iconLeft = value;
            }
            return this;
        };

        this.floatingFeedRight = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('floatingFeedRight');
            }
            else {
                CONFIG.floatingFeed.right = value;
            }
            return this;
        };

        this.floatingFeedBottom = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('floatingFeedBottom');
            }
            else {
                CONFIG.floatingFeed.bottom = value;
            }
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
 * @param {string}  cozenDropdownSize                       = 'normal'                    > Size of the dropdown
 * @param {string}  cozenDropdownSizeSmall                                                > Shortcut for small size
 * @param {string}  cozenDropdownSizeNormal                                               > Shortcut for normal size
 * @param {string}  cozenDropdownSizeLarge                                                > Shortcut for large size
 * @param {boolean} cozenDropdownRequired                   = false                       > Required input
 * @param {boolean} cozenDropdownErrorDesign                = true                        > Add style when error
 * @param {boolean} cozenDropdownSuccessDesign              = true                        > Add style when success
 * @param {string}  cozenDropdownPlaceholder                                              > Text for the placeholder
 * @param {string}  cozenDropdownIconLeft                                                 > Text for the icon left (font)
 * @param {string}  cozenDropdownName                       = uuid                        > Name of the input
 * @param {boolean} cozenDropdownValidator                  = 'touched'                   > Define after what type of event the input must add more ui color
 * @param {boolean} cozenDropdownValidatorAll                                             > Shortcut for all type
 * @param {boolean} cozenDropdownValidatorTouched                                         > Shortcut for touched type
 * @param {boolean} cozenDropdownEasyNavigation             = true                        > Allow to navigate with arrows even if the pointer is out of the dropdown
 * @param {boolean} cozenDropdownMultiple                   = false                       > Allow to select multiple data
 * @param {boolean} cozenDropdownAutoClose                  = true                        > Close the dropdown after had selected a data (only for single)
 * @param {boolean} cozenDropdownEasyClose                  = true                        > Auto close the dropdown when a click is outside
 * @param {boolean} cozenDropdownShowTick                   = true                        > Display an icon to the right when a data is selected
 * @param {boolean} cozenDropdownTickIcon                   = 'fa fa-check'               > Define what type of icon should it be
 * @param {string}  cozenDropdownModelEnhanced              = 'last'                      > Choose the way of display the selected data text in the input [last, all, count, number (value expected)]
 * @param {number}  cozenDropdownMaxHeight                  = 200                         > Max-height of the dropdown
 * @param {string}  cozenDropdownLabel                                                    > Add a label on the top of the dropdown
 * @param {string}  cozenDropdownRequiredTooltip            = 'dropdown_required_tooltip' > Text to display for the tooltip of the required element
 * @param {string}  cozenDropdownClass                                                    > Custom class
 * @param {string}  cozenDropdownAllSelectedText            = 'dropdown_count_all'        > Text to display when all elements are selected
 * @param {string}  cozenDropdownCountText                  = 'dropdown_count'            > Text to display when some elements are selected [variables: {{selected}} {{total}}
 * @param {string}  cozenDropdownSingleDisplaySelectedLabel = false                       > Display the label instead of the value (if the value was set - the model still have the value)
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenDropdownSize)) {
                    if (angular.isDefined(attrs.cozenDropdownSizeSmall)) {
                        scope._cozenDropdownSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenDropdownSizeNormal)) {
                        scope._cozenDropdownSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenDropdownSizeLarge)) {
                        scope._cozenDropdownSize = 'large';
                    }
                    else {
                        scope._cozenDropdownSize = 'normal';
                    }
                }
                else {
                    scope._cozenDropdownSize = attrs.cozenDropdownSize;
                }

                // Shortcut values (validator)
                if (angular.isUndefined(attrs.cozenDropdownValidator)) {
                    if (angular.isDefined(attrs.cozenDropdownValidatorAll)) {
                        scope._cozenDropdownValidator = 'all';
                    }
                    else if (angular.isDefined(attrs.cozenDropdownValidatorTouched)) {
                        scope._cozenDropdownValidator = 'touched';
                    }
                    else {
                        scope._cozenDropdownValidator = 'touched';
                    }
                }
                else {
                    scope._cozenDropdownValidator = attrs.cozenDropdownValidator;
                }

                // Check the model enhanced mod
                if (angular.isUndefined(attrs.cozenDropdownModelEnhanced)) {
                    scope._cozenDropdownModelEnhanced = 'last';
                }
                else {
                    if (attrs.cozenDropdownModelEnhanced == 'last') {
                        scope._cozenDropdownModelEnhanced = 'last';
                    }
                    else if (attrs.cozenDropdownModelEnhanced == 'count') {
                        scope._cozenDropdownModelEnhanced = 'count';
                    }
                    else if (attrs.cozenDropdownModelEnhanced == 'all') {
                        scope._cozenDropdownModelEnhanced = 'all';
                    }
                    else if (!isNaN(attrs.cozenDropdownModelEnhanced)) {
                        scope._cozenDropdownModelEnhanced = parseInt(attrs.cozenDropdownModelEnhanced);
                    }
                    else {
                        scope._cozenDropdownModelEnhanced = 'last';
                        Methods.directiveWarningUnmatched(data.directive, 'ModelEnhanced', 'last');
                    }
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenDropdownDisabled)) {
                    scope.vm.cozenDropdownDisabled = false;
                }
                scope.vm.cozenDropdownModelEnhanced = '';

                // Default values (attributes)
                scope._cozenDropdownId                         = angular.isDefined(attrs.cozenDropdownId) ? attrs.cozenDropdownId : '';
                scope._cozenDropdownRequired                   = angular.isDefined(attrs.cozenDropdownRequired) ? JSON.parse(attrs.cozenDropdownRequired) : false;
                scope._cozenDropdownErrorDesign                = angular.isDefined(attrs.cozenDropdownErrorDesign) ? JSON.parse(attrs.cozenDropdownErrorDesign) : true;
                scope._cozenDropdownSuccessDesign              = angular.isDefined(attrs.cozenDropdownSuccessDesign) ? JSON.parse(attrs.cozenDropdownSuccessDesign) : true;
                scope._cozenDropdownPlaceholder                = angular.isDefined(attrs.cozenDropdownPlaceholder) ? attrs.cozenDropdownPlaceholder : '';
                scope._cozenDropdownIconLeft                   = angular.isDefined(attrs.cozenDropdownIconLeft) ? attrs.cozenDropdownIconLeft : '';
                scope._cozenDropdownName                       = angular.isDefined(attrs.cozenDropdownName) ? attrs.cozenDropdownName : data.uuid;
                scope._cozenDropdownEasyNavigation             = angular.isDefined(attrs.cozenDropdownEasyNavigation) ? JSON.parse(attrs.cozenDropdownEasyNavigation) : true;
                scope._cozenDropdownMultiple                   = angular.isDefined(attrs.cozenDropdownMultiple) ? JSON.parse(attrs.cozenDropdownMultiple) : false;
                scope._cozenDropdownAutoClose                  = angular.isDefined(attrs.cozenDropdownAutoClose) ? JSON.parse(attrs.cozenDropdownAutoClose) : true;
                scope._cozenDropdownEasyClose                  = angular.isDefined(attrs.cozenDropdownEasyClose) ? JSON.parse(attrs.cozenDropdownEasyClose) : true;
                scope._cozenDropdownShowTick                   = angular.isDefined(attrs.cozenDropdownShowTick) ? JSON.parse(attrs.cozenDropdownShowTick) : true;
                scope._cozenDropdownTickIcon                   = angular.isDefined(attrs.cozenDropdownTickIcon) ? attrs.cozenDropdownTickIcon : 'fa fa-check';
                scope._cozenDropdownMaxHeight                  = angular.isDefined(attrs.cozenDropdownMaxHeight) ? JSON.parse(attrs.cozenDropdownMaxHeight) : 200;
                scope._cozenDropdownDirection                  = 'down';
                scope._cozenDropdownLabel                      = angular.isDefined(attrs.cozenDropdownLabel) ? attrs.cozenDropdownLabel : '';
                scope._cozenDropdownRequiredConfig             = CONFIG.required;
                scope._cozenDropdownRequiredTooltip            = angular.isDefined(attrs.cozenDropdownRequiredTooltip) ? attrs.cozenDropdownRequiredTooltip : 'dropdown_required_tooltip';
                scope._cozenDropdownUuid                       = data.uuid;
                scope._cozenDropdownAllSelectedText            = angular.isDefined(attrs.cozenDropdownAllSelectedText) ? attrs.cozenDropdownAllSelectedText : 'dropdown_count_all';
                scope._cozenDropdownCountText                  = angular.isDefined(attrs.cozenDropdownCountText) ? attrs.cozenDropdownCountText : 'dropdown_count';
                scope._cozenDropdownSingleDisplaySelectedLabel = angular.isDefined(attrs.cozenDropdownSingleDisplaySelectedLabel) ? JSON.parse(attrs.cozenDropdownSingleDisplaySelectedLabel) : false;

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
                    var classList = [
                        scope._activeTheme,
                        scope._cozenDropdownSize,
                        'icon-right',
                        scope._cozenDropdownDirection,
                        attrs.cozenDropdownClass
                    ];
                    switch (scope._cozenDropdownValidator) {
                        case 'touched':
                            if (data.touched) {
                                if (!Methods.isNullOrEmpty(scope.vm.cozenDropdownModelEnhanced) && scope._cozenDropdownSuccessDesign) {
                                    classList.push('success-design');
                                }
                                else if (scope._cozenDropdownRequired && scope._cozenDropdownErrorDesign) {
                                    classList.push('error-design');
                                }
                            }
                            break;
                        case 'all':
                            if (!Methods.isNullOrEmpty(scope.vm.cozenDropdownModelEnhanced) && scope._cozenDropdownSuccessDesign) {
                                classList.push('success-design');
                            }
                            else if (scope._cozenDropdownRequired && scope._cozenDropdownErrorDesign) {
                                classList.push('error-design');
                            }
                            break;
                    }
                    if (scope.vm.cozenDropdownDisabled) {
                        classList.push('disabled');
                    }
                    if (scope._cozenDropdownIconLeft) {
                        classList.push('icon-left');
                    }
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
                if (scope.vm.cozenDropdownDisabled) {
                    return;
                }
                if (!scope._cozenDropdownCollapse) {
                    return;
                }
                if (!scope._cozenDropdownEasyNavigation) {
                    if (!scope.isHover) {
                        return;
                    }
                }
                if (event.keyCode == 38 || event.keyCode == 40) {

                    event.stopPropagation();
                    event.preventDefault();

                    // Search for a new active child (escape disabled ones)
                    var length = scope.childrenUuid.length, i = 0;
                    var value  = angular.copy(scope.activeChild);
                    do {
                        if (event.keyCode == 38) {
                            value = decrease(value, length);
                        }
                        else if (event.keyCode == 40) {
                            value = increase(value, length);
                        }
                        if (!scope.childrenUuid[value].disabled) {
                            break;
                        }
                        i++;
                    }
                    while (i < length);

                    scope.activeChild = value;
                    $rootScope.$broadcast('cozenDropdownActive', {
                        uuid: scope.childrenUuid[scope.activeChild].uuid
                    });
                }

                function decrease(value, max) {
                    if (value > 0) {
                        value--;
                    }
                    else {
                        value = max - 1;
                    }
                    return value;
                }

                function increase(value, max) {
                    if (value < max - 1) {
                        value++;
                    }
                    else {
                        value = 0;
                    }
                    return value;
                }
            }

            function onChange($event) {
                if (scope.vm.cozenDropdownDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenDropdownOnChange)) {
                    scope.cozenDropdownOnChange();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onChange');
                }
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

            function onClick($event) {
                data.touched = true;
                if (!Methods.isNullOrEmpty($event)) {
                    $event.stopPropagation();
                }
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
                    }
                    else {
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
                    if (data.selected && scope._cozenDropdownModelEnhanced == 'last') {
                        scope.vm.cozenDropdownModelEnhanced = data.label;
                    }
                    else if (scope._cozenDropdownModelEnhanced != 'last') {
                        scope.vm.cozenDropdownModelEnhanced = '';
                    }

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
                                    if (selectedValues > 0) {
                                        scope.vm.cozenDropdownModelEnhanced += ', ';
                                    }
                                    scope.vm.cozenDropdownModelEnhanced += child.label;
                                    selectedValues++;
                                }

                                // ModelEnhanced : count (first result)
                                else if (scope._cozenDropdownModelEnhanced == 'count') {
                                    scope.vm.cozenDropdownModelEnhanced = child.label;
                                    selectedValues++;
                                }

                                // ModelEnhanced : last
                                else if (scope._cozenDropdownModelEnhanced == 'last') {
                                    selectedValues++;
                                }
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
                            scope.vm.cozenDropdownModelEnhanced = $filter('translate')(scope._cozenDropdownCountText, {
                                selected: selectedValues,
                                total   : scope.childrenUuid.length
                            });
                        }

                        // ModelEnhanced : count (if all selected)
                        if ((scope._cozenDropdownModelEnhanced == 'count' || useCount) && selectedValues == scope.childrenUuid.length) {
                            scope.vm.cozenDropdownModelEnhanced = $filter('translate')(scope._cozenDropdownAllSelectedText);
                        }

                        // No data selected
                        if (selectedValues == 0) {
                            scope.vm.cozenDropdownModel         = '';
                            scope.vm.cozenDropdownModelEnhanced = '';
                        }
                    }
                    else {

                        // Change the model
                        if (data.selected) {
                            scope.vm.cozenDropdownModel = data.value;

                            // Display the label instead of the value
                            if (scope._cozenDropdownSingleDisplaySelectedLabel) {
                                scope.vm.cozenDropdownModelEnhanced = $filter('translate')(data.label);
                            }
                            else {
                                scope.vm.cozenDropdownModelEnhanced = data.value;
                            }

                            // Deselect the other children
                            scope.$broadcast('cozenDropdownDeselect', {
                                uuid: data.uuid
                            });
                        }
                        else {
                            scope.vm.cozenDropdownModel         = '';
                            scope.vm.cozenDropdownModelEnhanced = scope.vm.cozenDropdownModel;
                        }
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
                        if (scope.childrenUuid[i].disabled) {
                            disabled++;
                        }
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
                    if (transclude.offsetHeight > 0) {
                        body.style.height = transclude.offsetHeight + Methods.getElementPaddingTopBottom(body) + 'px';
                    }
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
                if (data.transcludeHeight > scope._cozenDropdownMaxHeight) {
                    maxHeight = scope._cozenDropdownMaxHeight + 8;
                }
                if (windowHeight - inputViewport.bottom < maxHeight) {
                    scope._cozenDropdownDirection = 'up';
                }
                else {
                    scope._cozenDropdownDirection = 'down';
                }
                Methods.safeApply(scope);
            }

            function getArrowClass() {
                var classList = [
                    'fa',
                    'fa-caret-down'
                ];
                if (scope._cozenDropdownDirection == 'down' && scope._cozenDropdownCollapse) {
                    classList.push('fa-rotate-90');
                }
                else if (scope._cozenDropdownDirection == 'up' && scope._cozenDropdownCollapse) {
                    classList.push('fa-rotate-90');
                }
                else if (scope._cozenDropdownDirection == 'up' && !scope._cozenDropdownCollapse) {
                    classList.push('fa-rotate-180');
                }
                return classList;
            }

            function getTranscludeStyle() {
                var styleList = {
                    'max-height': scope._cozenDropdownMaxHeight + 'px'
                };
                if (scope._cozenDropdownDirection == 'down') {
                    styleList.top = '100%';
                }
                else {
                    styleList.bottom = '100%';
                }
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
                if (methods.hasError()) {
                    return;
                }

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
 * @param {number} cozenDropdownItemSearchId                                    > Id of the item
 * @param {string} cozenDropdownItemSearchPlaceholder                           > Text for the placeholder
 * @param {string} cozenDropdownItemSearchIconLeft    = 'fa fa-search'          > Icon left (name of the icon)
 * @param {string} cozenDropdownItemSearchIconRight                             > Icon right (name of the icon)
 * @param {string} cozenDropdownItemSearchEmptyText   = 'dropdown_search_empty' > Replace the text when the search give 0 result
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
                if (methods.hasError()) {
                    return;
                }

                // Default values (attributes)
                scope._cozenDropdownItemSearchId          = angular.isDefined(attrs.cozenDropdownItemSearchId) ? attrs.cozenDropdownItemSearchId : '';
                scope._cozenDropdownItemSearchPlaceholder = angular.isDefined(attrs.cozenDropdownItemSearchPlaceholder) ? attrs.cozenDropdownItemSearchPlaceholder : '';
                scope._cozenDropdownItemSearchIconLeft    = angular.isDefined(attrs.cozenDropdownItemSearchIconLeft) ? attrs.cozenDropdownItemSearchIconLeft : 'fa fa-search';
                scope._cozenDropdownItemSearchIconRight   = angular.isDefined(attrs.cozenDropdownItemSearchIconRight) ? attrs.cozenDropdownItemSearchIconRight : '';
                scope._cozenDropdownItemSearchEmpty       = false;
                scope._cozenDropdownItemSearchEmptyText   = angular.isDefined(attrs.cozenDropdownItemSearchEmptyText) ? attrs.cozenDropdownItemSearchEmptyText : 'dropdown_search_empty';

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
                if (scope._cozenDropdownItemSearchIconLeft != '') {
                    classList.push('icon-left');
                }
                if (scope._cozenDropdownItemSearchIconRight != '') {
                    classList.push('icon-right');
                }
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
                                }
                                else {
                                    return dropdown;
                                }
                            }
                            else {
                                return dropdown;
                            }
                        }
                        else {
                            return dropdown;
                        }
                    }
                    else {
                        return dropdown;
                    }
                }
                else {
                    return dropdown;
                }
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
 * @param {number} cozenDropdownItemSimpleId             > Id of the item
 * @param {string} cozenDropdownItemSimpleLabel          > Text of the item [required]
 * @param {string} cozenDropdownItemSimpleSubLabel       > Text of the item
 * @param {string} cozenDropdownItemSimpleIconLeft       > Icon left (name of the icon)
 * @param {string} cozenDropdownItemSimpleIconRight      > Icon right (name of the icon)
 * @param {string} cozenDropdownItemSimpleCustomHtmlLeft > Custom HTML (compiled) on the left
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

            scope._isReady = true;

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
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenDropdownItemSimpleDisabled)) {
                    scope.cozenDropdownItemSimpleDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenDropdownItemSimpleSelected)) {
                    scope.cozenDropdownItemSimpleSelected = false;
                }
                else if (typeof scope.cozenDropdownItemSimpleSelected != "boolean") {
                    scope.cozenDropdownItemSimpleSelected = false;
                }

                // Default values (attributes)
                scope._cozenDropdownItemSimpleId             = angular.isDefined(attrs.cozenDropdownItemSimpleId) ? attrs.cozenDropdownItemSimpleId : '';
                scope._cozenDropdownItemSimpleLabel          = attrs.cozenDropdownItemSimpleLabel;
                scope._cozenDropdownItemSimpleSubLabel       = angular.isDefined(attrs.cozenDropdownItemSimpleSubLabel) ? attrs.cozenDropdownItemSimpleSubLabel : '';
                scope._cozenDropdownItemSimpleIconLeft       = angular.isDefined(attrs.cozenDropdownItemSimpleIconLeft) ? attrs.cozenDropdownItemSimpleIconLeft : '';
                scope._cozenDropdownItemSimpleIconRight      = angular.isDefined(attrs.cozenDropdownItemSimpleIconRight) ? attrs.cozenDropdownItemSimpleIconRight : '';
                scope._cozenDropdownItemSimpleShowTick       = methods.getDropdown()._cozenDropdownShowTick;
                scope._cozenDropdownItemSimpleTickIcon       = methods.getDropdown()._cozenDropdownTickIcon;
                scope._cozenDropdownSearch                   = [
                    scope._cozenDropdownItemSimpleLabel,
                    scope._cozenDropdownItemSimpleSubLabel
                ];
                scope._cozenDropdownItemSimpleCustomHtmlLeft = angular.isDefined(attrs.cozenDropdownItemSimpleCustomHtmlLeft) ? attrs.cozenDropdownItemSimpleCustomHtmlLeft : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope.cozenDropdownItemSimpleActive = false;

                // Register data into the parent
                var dropdown = methods.getDropdown();
                dropdown.childrenUuid.push({
                    uuid    : data.uuid,
                    disabled: scope.cozenDropdownItemSimpleDisabled,
                    label   : $filter('translate')(scope._cozenDropdownItemSimpleLabel)
                });
                data.dropdown.name = dropdown._cozenDropdownName;
                methods.updateParentModel();

                // If attr selected is set, look at the change (for out of the box change) and update the parent
                if (angular.isDefined(attrs.cozenDropdownItemSimpleSelected)) {
                    scope.$watch('cozenDropdownItemSimpleSelected', function (newValue) {

                        // Avoid to deselect an option when single and required
                        if (!dropdown._cozenDropdownMultiple) {
                            if (dropdown._cozenDropdownRequired) {
                                if (newValue) {
                                    methods.updateParentModel(newValue);
                                }
                            }
                            else {
                                methods.updateParentModel(newValue);
                            }
                        }
                        else {
                            methods.updateParentModel(newValue);
                        }
                    });
                }

                // Listener from the parent or from brothers (items)
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
                if (scope.cozenDropdownItemSimpleDisabled) {
                    classList.push('disabled');
                }
                else if (scope.cozenDropdownItemSimpleActive) {
                    classList.push('active');
                }
                if (scope.cozenDropdownItemSimpleSelected) {
                    classList.push('selected');
                }
                return classList;
            }

            function onClickItem($event) {
                $event.stopPropagation();
                var dropdown = methods.getDropdown();
                if (!dropdown._cozenDropdownCollapse) {
                    return;
                }
                if (scope.cozenDropdownItemSimpleDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenDropdownItemSimpleOnClick)) {
                    scope.cozenDropdownItemSimpleOnClick();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickItem');
                }
                if (!dropdown._cozenDropdownMultiple && dropdown._cozenDropdownAutoClose) {
                    dropdown._methods.onClick();
                }

                // Toggle and inform the parent
                scope.cozenDropdownItemSimpleSelected = !scope.cozenDropdownItemSimpleSelected;
                methods.updateParentModel();
                Methods.safeApply(scope);
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenDropdownItemSimpleDisabled) {
                    tabIndex = -1;
                }
                return tabIndex;
            }

            function onActive(event, eventData) {
                if (scope.cozenDropdownItemSimpleDisabled) {
                    return;
                }
                scope.cozenDropdownItemSimpleActive = eventData.uuid == data.uuid;
                Methods.safeApply(scope);
            }

            function onKeyDown(event) {
                if (scope.cozenDropdownItemSimpleDisabled) {
                    return;
                }
                if (!scope.cozenDropdownItemSimpleActive) {
                    return;
                }
                event.stopPropagation();
                switch (event.keyCode) {

                    // Enter
                    case 13:
                        methods.onClickItem(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenDropdownItemSimpleActive) {
                    return;
                }

                // Search the active child
                var activeChild = 0;
                for (var i = 0, length = methods.getDropdown().childrenUuid.length; i < length; i++) {
                    if (methods.getDropdown().childrenUuid[i].uuid == data.uuid) {
                        activeChild = i;
                        break;
                    }
                }

                // Tell the parent about the new active child
                if (CONFIG.broadcastLog) {
                    Methods.broadcastLog('$rootScope', 'cozenDropdownActiveChild');
                }
                $rootScope.$broadcast('cozenDropdownActiveChild', {
                    dropdown   : data.dropdown.name,
                    activeChild: activeChild
                });

                if (CONFIG.broadcastLog) {
                    Methods.broadcastLog('$rootScope', 'cozenDropdownActive');
                }
                $rootScope.$broadcast('cozenDropdownActive', {
                    uuid: data.uuid
                });
            }

            function onCollapse(event, data) {
                if (data.collapse) {
                    $window.addEventListener('keydown', methods.onKeyDown);
                }
                else {
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
                                }
                                else {
                                    return dropdown;
                                }
                            }
                            else {
                                return dropdown;
                            }
                        }
                        else {
                            return dropdown;
                        }
                    }
                    else {
                        return dropdown;
                    }
                }
                else {
                    return dropdown;
                }
            }

            function updateParentModel(selected) {
                selected = selected == null ? scope.cozenDropdownItemSimpleSelected : selected;
                if (CONFIG.broadcastLog) {
                    Methods.broadcastLog('$rootScope', 'cozenDropdownSelected');
                }
                $rootScope.$broadcast('cozenDropdownSelected', {
                    uuid    : data.uuid,
                    selected: selected,
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
                    scope._cozenDropdownSearch = $filter('filter')([
                        scope._cozenDropdownItemSimpleLabel,
                        scope._cozenDropdownItemSimpleSubLabel
                    ], params.value);
                    if (CONFIG.broadcastLog) {
                        Methods.broadcastLog('$rootScope', 'cozenDropdownItemDisabled');
                    }
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
 * @name cozen-floating-feed
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {number}  cozenFloatingFeedId                           > Id of the floatingFeed
 * @param {number}  cozenFloatingFeedWidth        = 460           > Width of the floating feed in pixel [config.json]
 * @param {string}  cozenFloatingFeedSize         = 'normal'      > Size of the popup [config.json]
 * @param {string}  cozenFloatingFeedAnimationIn  = 'fadeInDown'  > Animation when showing the popup [config.json]
 * @param {string}  cozenFloatingFeedAnimationOut = 'fadeOutDown' > Animation when hiding the popup [config.json]
 * @param {boolean} cozenFloatingFeedCloseBtn     = true          > Display the close btn of the popups [config.json]
 * @param {boolean} cozenFloatingFeedIconLeft     = true          > Display the left icon of the popups [config.json]
 * @param {number}  cozenFloatingFeedRight        = 20            > Pixel form the right [config.json]
 * @param {number}  cozenFloatingFeedBottom       = 20            > Pixel from the bottom [config.json]
 *
 * [Factory - addAlert]
 * @param {string} label > Text to display [required]
 * @param {string} type  > Type of the alert (see types in cozen-alert) [required]
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.alert.floatingFeed', [])
        .directive('cozenFloatingFeed', cozenFloatingFeed);

    cozenFloatingFeed.$inject = [
        'CONFIG',
        '$rootScope',
        'Themes',
        'rfc4122',
        '$timeout',
        '$animate'
    ];

    function cozenFloatingFeed(CONFIG, $rootScope, Themes, rfc4122, $timeout, $animate) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            templateUrl: 'directives/alert/floatingFeed.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                destroy     : destroy,
                getMainClass: getMainClass,
                getMainStyle: getMainStyle,
                add         : add,
                removeAll   : removeAll,
                onHideAlert : onHideAlert
            };

            var data = {
                directive: 'cozenFloatingFeed',
                uuid     : rfc4122.v4()
            };

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    getMainStyle: getMainStyle,
                    onHideAlert : onHideAlert
                };

                // Default values (attributes)
                scope._cozenFloatingFeedId           = angular.isDefined(attrs.cozenFloatingFeedId) ? attrs.cozenFloatingFeedId : data.uuid;
                scope._cozenFloatingFeedWidth        = angular.isDefined(attrs.cozenFloatingFeedWidth) ? attrs.cozenFloatingFeedWidth : CONFIG.floatingFeed.width;
                scope._cozenFloatingFeedSize         = angular.isDefined(attrs.cozenFloatingFeedSize) ? attrs.cozenFloatingFeedSize : CONFIG.floatingFeed.size;
                scope._cozenFloatingFeedAnimationIn  = angular.isDefined(attrs.cozenFloatingFeedAnimationIn) ? attrs.cozenFloatingFeedAnimationIn : CONFIG.floatingFeed.animation.in;
                scope._cozenFloatingFeedAnimationOut = angular.isDefined(attrs.cozenFloatingFeedAnimationOut) ? attrs.cozenFloatingFeedAnimationOut : CONFIG.floatingFeed.animation.out;
                scope._cozenFloatingFeedCloseBtn     = angular.isDefined(attrs.cozenFloatingFeedCloseBtn) ? JSON.parse(attrs.cozenFloatingFeedCloseBtn) : CONFIG.floatingFeed.closeBtn;
                scope._cozenFloatingFeedIconLeft     = angular.isDefined(attrs.cozenFloatingFeedIconLeft) ? JSON.parse(attrs.cozenFloatingFeedIconLeft) : CONFIG.floatingFeed.iconLeft;
                scope._cozenFloatingFeedRight        = angular.isDefined(attrs.cozenFloatingFeedRight) ? attrs.cozenFloatingFeedRight : CONFIG.floatingFeed.right;
                scope._cozenFloatingFeedBottom       = angular.isDefined(attrs.cozenFloatingFeedBottom) ? attrs.cozenFloatingFeedBottom : CONFIG.floatingFeed.bottom;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Contain all the alert
                scope._cozenFloatingAlerts = [];

                // Watch for events
                $rootScope.$on('cozenFloatingFeedAdd', methods.add);
                $rootScope.$on('cozenFloatingFeedRemoveAll', methods.removeAll);
                scope.$on('onFloatingFeedFinished', function () {

                    // Animation when adding
                    if (scope._cozenFloatingFeedAnimationIn != '') {
                        var child       = element[0].querySelector('#float-feed-alert-0');
                        scope.hideFirst = false;
                        $animate.addClass(child, 'floating-alert-animation-in ' + scope._cozenFloatingFeedAnimationIn).then(function () {
                            $animate.removeClass(child, 'hidden floating-alert-animation-in ' + scope._cozenFloatingFeedAnimationIn);
                        });
                    }
                });
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function getMainClass() {
                return [scope._activeTheme];
            }

            function getMainStyle() {
                return {
                    width : scope._cozenFloatingFeedWidth,
                    right : scope._cozenFloatingFeedRight,
                    bottom: scope._cozenFloatingFeedBottom
                };
            }

            function add($event, alert) {
                if (!Methods.isNullOrEmpty(alert)) {
                    if (!Methods.hasOwnProperty(alert, 'label')) {
                        Methods.missingKeyLog(data.directive, 'label', 'adding alert');
                    }
                    else if (!Methods.hasOwnProperty(alert, 'type')) {
                        Methods.missingKeyLog(data.directive, 'type', 'adding alert');
                    }
                    else {
                        alert.addedOn                    = moment().unix();
                        alert.display                    = true;
                        alert.uuid                       = rfc4122.v4();
                        scope._cozenFloatingFeedIconLeft = scope._cozenFloatingFeedIconLeft ? CONFIG.alert.iconLeft[alert.type] : '';
                        scope._cozenFloatingAlerts.unshift(alert);
                        scope.hideFirst = true;
                    }
                }
                else {
                    Methods.directiveErrorRequired(data.directive, 'alert');
                }
            }

            function removeAll() {
                scope._cozenFloatingAlerts = [];
            }

            function onHideAlert(popupUuid) {
                for (var i = 0, length = scope._cozenFloatingAlerts.length; i < length; i++) {
                    if (scope._cozenFloatingAlerts[i].uuid == popupUuid) {
                        scope._cozenFloatingAlerts.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

})(window.angular);


(function (angular) {
    'use strict';

    angular
        .module('cozenLib.alert.floatingFeedFactory', [])
        .factory('cozenFloatingFeedFactory', cozenFloatingFeedFactory);

    cozenFloatingFeedFactory.$inject = [
        '$rootScope'
    ];

    function cozenFloatingFeedFactory($rootScope) {
        return {
            addAlert : addAlert,
            removeAll: removeAll
        };

        function addAlert(alert) {
            $rootScope.$broadcast('cozenFloatingFeedAdd', alert);
        }

        function removeAll() {
            $rootScope.$broadcast('cozenFloatingFeedRemoveAll');
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
 * @param {number} cozenFormId    > Id of the form
 * @param {string} cozenFormName  > Name of the form [required]
 * @param {string} cozenFormCtrl  > Controller [required]
 * @param {string} cozenFormModel > Model [required]
 * @param {string} cozenFormClass > Add custom class
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.form', [])
        .directive('cozenForm', cozenForm);

    cozenForm.$inject = [
        '$timeout',
        '$rootScope'
    ];

    function cozenForm($timeout, $rootScope) {
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
                dispatchName: dispatchName,
                getMainClass: getMainClass
            };

            var data       = {
                directive: 'cozenForm'
            };
            scope._isReady = false;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    dispatchName: dispatchName,
                    getMainClass: getMainClass
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (attributes)
                scope._cozenFormId    = angular.isDefined(attrs.cozenFormId) ? attrs.cozenFormId : '';
                scope._cozenFormName  = attrs.cozenFormName;
                scope._cozenFormModel = attrs.cozenFormModel;
                scope._cozenFormCtrl  = attrs.cozenFormCtrl;

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Give to the child the require stuff
                // Occur when a child ask for it
                $rootScope.$on('cozenFormChildInit', methods.dispatchName);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenFormName)) {
                    Methods.directiveErrorRequired(data.directive, 'Name');
                    return true;
                }
                if (Methods.isNullOrEmpty(attrs.cozenFormCtrl)) {
                    Methods.directiveErrorRequired(data.directive, 'Ctrl');
                    return true;
                }
                if (Methods.isNullOrEmpty(attrs.cozenFormModel)) {
                    Methods.directiveErrorRequired(data.directive, 'Model');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function dispatchName() {
                scope.$broadcast('cozenFormName', {
                    name : scope._cozenFormName,
                    ctrl : scope._cozenFormCtrl,
                    model: scope._cozenFormModel
                });
            }

            function getMainClass() {
                var classList = [attrs.cozenFormClass];
                return classList;
            }
        }
    }

})(window.angular);



(function (angular) {
    'use strict';

    angular
        .module('cozenLib.icons', [
            'cozenLib.icons.uploadInfo',
            'cozenLib.icons.info',
            'cozenLib.icons.required'
        ]);

})(window.angular);



/**
 * @ngdoc directive
 * @name cozen-icon-info
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {boolean} cozenIconInfoDisplay         = true          > Hide or show the info icon
 * @param {string}  cozenIconInfoTooltipLabel                    > Label of the tooltip [required]
 * @param {string}  cozenIconInfoTooltipMaxWidth = max-width-200 > Max width of the tooltip
 *
 * [Attribute params]
 * @param {string} cozenIconInfoTooltipType = default > Type of the tooltip
 * @param {string} cozenIconInfoStyle                 > Custom style
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.icons.info', [])
        .directive('cozenIconInfo', cozenIconInfo);

    cozenIconInfo.$inject = [
        '$filter',
        'Themes'
    ];

    function cozenIconInfo($filter, Themes) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenIconInfoDisplay        : '=?',
                cozenIconInfoTooltipLabel   : '=?',
                cozenIconInfoTooltipMaxWidth: '=?'
            },
            templateUrl: 'directives/icons/info/info.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init    : init,
                destroy : destroy,
                hasError: hasError
            };

            var data = {
                directive: 'cozenIconInfo'
            };

            methods.init();

            function init() {

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenIconInfoDisplay) ? scope.cozenIconInfoDisplay = true : null;
                angular.isUndefined(attrs.cozenIconInfoTooltipLabel) ? scope.cozenIconInfoTooltipLabel = '' : null;
                angular.isUndefined(attrs.cozenIconInfoTooltipMaxWidth) ? scope.cozenIconInfoTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attribute)
                scope._cozenIconInfoTooltipType = angular.isDefined(attrs.cozenIconInfoTooltipType) ? attrs.cozenIconInfoTooltipType : 'default';
                scope._cozenIconInfoStyle       = angular.isDefined(attrs.cozenIconInfoStyle) ? attrs.cozenIconInfoStyle : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenIconInfoTooltipLabel)) {
                    Methods.directiveErrorRequired(data.directive, 'Label');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
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
 * @param {string}  cozenInputPatternWord                                 > Shortcut for word pattern
 * @param {string}  cozenInputPatternWords                                > Shortcut for words pattern
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
                    else if (angular.isDefined(attrs.cozenInputPatternWord)) {
                        scope._cozenInputPattern = 'word';
                    }
                    else if (angular.isDefined(attrs.cozenInputPatternWords)) {
                        scope._cozenInputPattern = 'words';
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
                        var form = methods.getForm();
                        try {
                            var input = form[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm];
                            if (!Methods.isNullOrEmpty(input)) {
                                input = input[scope._cozenInputName];
                                if (!Methods.isNullOrEmpty(input)) {
                                    if (!Methods.isNullOrEmpty(scope.vm.cozenInputModel)) {
                                        input.$setDirty();
                                        input.$setTouched();
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
                    if (angular.isDefined(attrs.cozenInputHasError)) {
                        var intervalCount = 0;
                        var interval      = $interval(function () {
                            var form = methods.getForm();
                            try {
                                var input = form[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm];
                                if (!Methods.isNullOrEmpty(input)) {
                                    input = input[scope._cozenInputName];
                                    if (!Methods.isNullOrEmpty(input)) {
                                        input.$setValidity('hasError', !newValue);
                                        if (newValue) {
                                            input.$setDirty();
                                            input.$setTouched();
                                        }
                                        $interval.cancel(interval);
                                    }
                                }
                            } finally {
                                intervalCount++;
                                if (intervalCount > 10) {
                                    $interval.cancel(interval);
                                }
                            }
                        }, 10);
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
                    case 'word':
                        return '[A-Za-z\\u00C0-\\u017F]+$';
                    case 'words':
                        return '[A-Za-z\\u00C0-\\u017F ]+$';
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
                data.arrowDown = false;
                var form       = methods.getForm();
                var input      = form[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm][scope._cozenInputName];
                input.$setTouched();
                input.$setDirty();
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenListSize)) {
                    if (angular.isDefined(attrs.cozenListSizeSmall)) {
                        scope._cozenListSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenListSizeNormal)) {
                        scope._cozenListSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenListSizeLarge)) {
                        scope._cozenListSize = 'large';
                    }
                    else {
                        scope._cozenListSize = 'normal';
                    }
                }
                else {
                    scope._cozenListSize = attrs.cozenListSize;
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
                var classList = [
                    scope._activeTheme,
                    scope._cozenListSize
                ];
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
                if (!scope.isHover) {
                    return;
                }
                switch (event.keyCode) {

                    // Arrow up
                    case 38:
                        event.stopPropagation();
                        if (scope.activeChild > 1) {
                            scope.activeChild--;
                        }
                        else {
                            scope.activeChild = scope.childrenUuid.length;
                        }
                        $rootScope.$broadcast('cozenListActive', {
                            uuid: scope.childrenUuid[scope.activeChild - 1]
                        });
                        break;

                    // Arrow down
                    case 40:
                        event.stopPropagation();
                        if (scope.activeChild < scope.childrenUuid.length) {
                            scope.activeChild++;
                        }
                        else {
                            scope.activeChild = 1;
                        }
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
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenListItemMedia3Disabled)) {
                    scope.cozenListItemMedia3Disabled = false;
                }

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
                if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) {
                    classList.push('no-action');
                }
                if (scope.cozenListItemMedia3Disabled) {
                    classList.push('disabled');
                }
                else if (scope.cozenListItemMedia3Active) {
                    classList.push('active');
                }
                if (scope.$id % 2 != 0) {
                    classList.push('odd');
                }
                return classList;
            }

            function onClick($event) {
                if (scope.cozenListItemMedia3Disabled) {
                    return;
                }
                if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) {
                    return;
                }
                if (Methods.isFunction(scope.cozenListItemMedia3OnClick)) {
                    scope.cozenListItemMedia3OnClick();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickItem');
                }
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenListItemMedia3Disabled) {
                    tabIndex = -1;
                }
                else if (angular.isUndefined(attrs.cozenListItemMedia3OnClick)) {
                    tabIndex = -1;
                }
                return tabIndex;
            }

            function onActive(event, eventData) {
                if (scope.cozenListItemMedia3Disabled) {
                    return;
                }
                scope.cozenListItemMedia3Active = eventData.uuid == data.uuid;
                Methods.safeApply(scope);
            }

            function onKeyDown(event) {
                if (scope.cozenListItemMedia3Disabled) {
                    return;
                }
                if (!scope.cozenListItemMedia3Active) {
                    return;
                }
                event.preventDefault();
                switch (event.keyCode) {

                    // Enter
                    case 13:
                        methods.onClick(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenListItemMedia3Active) {
                    return;
                }
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
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenListItemSimpleDisabled)) {
                    scope.cozenListItemSimpleDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenListItemSimpleBtnRight)) {
                    scope.cozenListItemSimpleBtnRight = false;
                }

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
                if (angular.isUndefined(attrs.cozenListItemSimpleOnClick)) {
                    classList.push('no-action');
                }
                if (scope.cozenListItemSimpleDisabled) {
                    classList.push('disabled');
                }
                else if (scope.cozenListItemSimpleActive) {
                    classList.push('active');
                }
                if (scope.$id % 2 != 0) {
                    classList.push('odd');
                }
                return classList;
            }

            function onClickItem($event) {
                if (scope.cozenListItemSimpleDisabled) {
                    return;
                }
                if (angular.isUndefined(attrs.cozenListItemSimpleOnClick)) {
                    return;
                }
                if (Methods.isFunction(scope.cozenListItemSimpleOnClick)) {
                    scope.cozenListItemSimpleOnClick();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickItem');
                }
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenListItemSimpleDisabled) {
                    tabIndex = -1;
                }
                else if (angular.isUndefined(attrs.cozenListItemSimpleOnClick)) {
                    tabIndex = -1;
                }
                return tabIndex;
            }

            function onClickBtnRight($event) {
                if (scope.cozenListItemSimpleDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenListItemSimpleBtnRightOnClick)) {
                    scope.cozenListItemSimpleBtnRightOnClick();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickBtnRight');
                }
                $event.stopPropagation();
            }

            function onActive(event, eventData) {
                if (scope.cozenListItemSimpleDisabled) {
                    return;
                }
                scope.cozenListItemSimpleActive = eventData.uuid == data.uuid;
                Methods.safeApply(scope);
            }

            function onKeyDown(event) {
                if (scope.cozenListItemSimpleDisabled) {
                    return;
                }
                if (!scope.cozenListItemSimpleActive) {
                    return;
                }
                event.preventDefault();
                switch (event.keyCode) {

                    // Enter
                    case 13:
                        methods.onClickItem(event);
                        break;
                }
            }

            function onHover($event) {
                if (scope.cozenListItemSimpleActive) {
                    return;
                }
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
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenOnBlurDisabled)) {
                    data.disabled = false;
                }

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Start listening if not disabled
                if (!data.disabled) {
                    methods.startListening();
                }

                // Start/stop listening when disabled change
                scope.$watch('cozenOnBlurDisabled', function (newValue, oldValue) {
                    if (newValue) {
                        methods.stopListening();
                    }
                    else {
                        methods.startListening();
                    }
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


(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenOnClickService', cozenOnClickService);

    cozenOnClickService.$inject = [
        '$window',
        '$rootScope'
    ];

    function cozenOnClickService($window, $rootScope) {

        // Listen for a click
        $window.addEventListener('click', _onClick);

        return {
            subscribe: subscribe
        };

        /// Public functions ///

        function subscribe(scope, callback) {
            var handler = $rootScope.$on('cozenOnClickServiceTriggered', callback);
            scope.$on('$destroy', handler);
        }

        // Internal functions ///

        // Notify the send message when subscribe is on
        function _notify() {
            $rootScope.$emit('cozenOnClickServiceTriggered');
        }

        function _onClick() {
            _notify();
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
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenOnFocusDisabled)) {
                    data.disabled = false;
                }

                // Init stuff
                element.on('$destroy', methods.destroy);

                // Start listening if not disabled
                if (!data.disabled) {
                    methods.startListening();
                }

                // Start/stop listening when disabled change
                scope.$watch('cozenOnFocusDisabled', function (newValue, oldValue) {
                    if (newValue) {
                        methods.stopListening();
                    }
                    else {
                        methods.startListening();
                    }
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
 * Generated header by Cozen for cozen project
 * Generated file onRepeatFinish.directive on WebStorm
 *
 * Created by: Geoffrey "C0ZEN" Testelin
 * Date: 07/02/2017
 * Time: 12:29
 * Version: 1.0.0
 *
 * @ngdoc directive
 * @name cozen-on-repeat-finish
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {string} cozenOnRepeatFinish > Name of the event sent when the ng-repeat has finished
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenOnRepeatFinish', cozenOnRepeatFinish);

    cozenOnRepeatFinish.$inject = [
        '$timeout'
    ];

    function cozenOnRepeatFinish($timeout) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attrs.cozenOnRepeatFinish);
                });
            }
        }
    }

})(window.angular);


/**
 * Generated header by Cozen for cozen project
 * Generated file onRepeatFinish.filter on WebStorm
 *
 * Created by: Geoffrey "C0ZEN" Testelin
 * Date: 07/02/2017
 * Time: 12:47
 * Version: 1.0.0
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .filter('cozenOnRepeatFinish', cozenOnRepeatFinish);

    cozenOnRepeatFinish.$inject = [
        '$timeout',
        '$rootScope'
    ];

    function cozenOnRepeatFinish($timeout, $rootScope) {
        return cozenOnRepeatFinishFilter;

        function cozenOnRepeatFinishFilter(data, eventName) {
            var flagProperty = '__finishedRendering__';
            if (!data[flagProperty]) {
                Object.defineProperty(
                    data,
                    flagProperty,
                    {
                        enumerable  : false,
                        configurable: true,
                        writable    : false,
                        value       : {}
                    });
                $timeout(function () {
                    delete data[flagProperty];
                    $rootScope.$emit(eventName);
                }, 0, false);
            }
            return data;
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenPaginationSize)) {
                    if (angular.isDefined(attrs.cozenPaginationSizeSmall)) {
                        scope._cozenPaginationSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenPaginationSizeNormal)) {
                        scope._cozenPaginationSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenPaginationSizeLarge)) {
                        scope._cozenPaginationSize = 'large';
                    }
                    else {
                        scope._cozenPaginationSize = 'normal';
                    }
                }
                else {
                    scope._cozenPaginationSize = attrs.cozenPaginationSize;
                }

                // Default values (scope)
                scope.cozenPaginationModel = 1;
                if (angular.isUndefined(attrs.cozenPaginationDisabled)) {
                    scope.cozenPaginationDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenPaginationLimitPerPage)) {
                    scope.cozenPaginationLimitPerPage = 20;
                }

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
                var classList = [
                    scope._activeTheme,
                    scope._cozenPaginationSize,
                    attrs.cozenPaginationClass
                ];
                if (scope.cozenPaginationDisabled) {
                    classList.push('disabled');
                }
                return classList;
            }

            function onClick($event, type, page) {
                if (scope.cozenPaginationDisabled) {
                    return;
                }
                if (page == null) {
                    page = '';
                }
                var oldModel = angular.copy(scope.cozenPaginationModel);
                var max      = methods.getTotalPage();
                switch (type) {
                    case 'first':
                        if (max <= 1) {
                            return;
                        }
                        scope.cozenPaginationModel = 1;
                        scope.cozenPaginationBlock = 0;
                        break;
                    case 'previous':
                        if (max <= 1) {
                            return;
                        }
                        scope.cozenPaginationModel > 1 ? scope.cozenPaginationModel-- : scope.cozenPaginationModel;
                        if (oldModel != scope.cozenPaginationModel) {
                            if (scope.cozenPaginationModel % 5 == 0) {
                                scope.cozenPaginationBlock--;
                            }
                        }
                        break;
                    case 'next':
                        if (max <= 1) {
                            return;
                        }
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
                        if (max <= 1) {
                            return;
                        }
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
                        if (scope.cozenPaginationModel == page) {
                            return;
                        }
                        scope.cozenPaginationModel = page;
                        break;
                }
                if (oldModel != scope.cozenPaginationModel && Methods.isFunction(scope.cozenPaginationOnChange)) {
                    scope.cozenPaginationOnChange();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClick' + Methods.capitalizeFirstLetter(type) + page);
                }
            }

            function getPages() {
                var page  = methods.getTotalPage();
                var pages = [];
                if (page > 5) {
                    page = 5;
                }
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
                }
                else {
                    return true;
                }
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenPanelSize)) {
                    if (angular.isDefined(attrs.cozenPanelSizeSmall)) {
                        scope._cozenPanelSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenPanelSizeNormal)) {
                        scope._cozenPanelSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenPanelSizeLarge)) {
                        scope._cozenPanelSize = 'large';
                    }
                    else {
                        scope._cozenPanelSize = 'normal';
                    }
                }
                else {
                    scope._cozenPanelSize = attrs.cozenPanelSize;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenPanelType)) {
                    if (angular.isDefined(attrs.cozenPanelTypeDefault)) {
                        scope._cozenPanelType = 'default';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeInfo)) {
                        scope._cozenPanelType = 'info';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeSuccess)) {
                        scope._cozenPanelType = 'success';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeWarning)) {
                        scope._cozenPanelType = 'warning';
                    }
                    else if (angular.isDefined(attrs.cozenPanelTypeError)) {
                        scope._cozenPanelType = 'error';
                    }
                    else {
                        scope._cozenPanelType = 'default';
                    }
                }
                else {
                    scope._cozenPanelType = attrs.cozenPanelType;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenPanelDisabled)) {
                    scope.cozenPanelDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenPanelOpen)) {
                    scope.cozenPanelOpen = true;
                }

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
                var classList = [
                    scope._activeTheme,
                    scope._cozenPanelSize,
                    scope._cozenPanelType
                ];
                if (scope.cozenPanelDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenPanelOpen || scope._cozenPanelFrozen) {
                    classList.push('open');
                }
                if (scope._bigIconHover) {
                    classList.push('no-hover');
                }
                return classList;
            }

            function onClickHeader($event) {
                if (scope.cozenPanelDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPanelOnClick)) {
                    scope.cozenPanelOnClick();
                }
                if (Methods.isFunction(scope.cozenPanelOnToggle) && !scope._cozenPanelFrozen) {
                    scope.cozenPanelOnToggle();
                }
                if (!scope._cozenPanelFrozen) {
                    scope.cozenPanelOpen = !scope.cozenPanelOpen;
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickHeader');
                }
            }

            function startWatching() {
                scope.$watch('cozenPanelDisabled', function (newValue, oldValue) {
                    if (newValue && scope.cozenPanelOpen && !scope._cozenPanelFrozen) {
                        scope.cozenPanelOpen = false;
                        if (Methods.isFunction(scope.cozenPanelOnToggle)) {
                            scope.cozenPanelOnToggle();
                        }
                    }
                });
            }

            function onClickBigIconLeft($event) {
                $event.stopPropagation();
                if (scope.cozenPanelDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPanelOnClickBigIconLeft)) {
                    scope.cozenPanelOnClickBigIconLeft();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickBigIconLeft');
                }
            }

            function onClickBigIconRight($event) {
                $event.stopPropagation();
                if (scope.cozenPanelDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPanelOnClickBigIconRight)) {
                    scope.cozenPanelOnClickBigIconRight();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClickBigIconRight');
                }
            }

            function bigIconHover(hover) {
                scope._bigIconHover = hover;
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenPanelDisabled) {
                    tabIndex = -1;
                }
                else if (scope._cozenPanelFrozen) {
                    tabIndex = -1;
                }
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
 * @name cozen-pills
 * @restrict E
 * @replace false
 * @transclude true
 * @description
 *
 * [Attributes params]
 * @param {number}  cozenPillsId                          > Id of the pills
 * @param {string}  cozenPillsSize            = 'normal'  > Size of the pills
 * @param {string}  cozenPillsSizeSmall                   > Shortcut for small size
 * @param {string}  cozenPillsSizeNormal                  > Shortcut for normal size
 * @param {string}  cozenPillsSizeLarge                   > Shortcut for large size
 * @param {string}  cozenPillsClass                       > Custom class
 * @param {boolean} cozenPillsAutoUpdateModel = true      > Auto update the ng-model on click
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.pills', [
            'cozenLib.pills.factory',
            'cozenLib.pills.simple'
        ])
        .directive('cozenPills', cozenPills);

    cozenPills.$inject = [
        'Themes',
        'CONFIG'
    ];

    function cozenPills(Themes, CONFIG) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : true,
            templateUrl: 'directives/pills/pills.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass
            };

            var data = {
                directive: 'cozenPills'
            };

            // After some test, wait too long for the load make things crappy
            // So, I set it to true for now
            scope._isReady = true;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenPillsSize)) {
                    if (angular.isDefined(attrs.cozenPillsSizeSmall)) {
                        scope._cozenPillsSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenPillsSizeNormal)) {
                        scope._cozenPillsSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenPillsSizeLarge)) {
                        scope._cozenPillsSize = 'large';
                    }
                    else {
                        scope._cozenPillsSize = 'normal';
                    }
                }
                else {
                    scope._cozenPillsSize = attrs.cozenPillsSize;
                }

                // Default values (attributes)
                scope._cozenPillsId              = angular.isDefined(attrs.cozenPillsId) ? attrs.cozenPillsId : '';
                scope._cozenPillsAutoUpdateModel = angular.isDefined(attrs.cozenPillsAutoUpdateModel) ? JSON.parse(attrs.cozenPillsAutoUpdateModel) : true;

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
                var classList = [scope._activeTheme,
                    scope._cozenPillsSize,
                    attrs.cozenPillsClass];
                return classList;
            }
        }
    }

})(window.angular);


(function (angular) {
    'use strict';

    angular
        .module('cozenLib.pills.factory', [])
        .factory('cozenPillsFactory', cozenPillsFactory);

    cozenPillsFactory.$inject = [
        '$rootScope'
    ];

    function cozenPillsFactory($rootScope) {
        return {
            active: active
        };

        function active(name) {
            $rootScope.$broadcast('cozenPillsActive', {
                name: name
            });
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-pills-item-simple
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenPillsItemSimpleOnClick          > Callback function called on click
 * @param {boolean}  cozenPillsItemSimpleDisabled = false > Disable the item
 * @param {boolean}  cozenPillsItemSimpleSelected = false > Select the item (edit the models and styles)
 *
 * [Attributes params]
 * @param {number} cozenPillsItemSimpleId                  > Id of the item
 * @param {string} cozenPillsItemSimpleLabel               > Text of the item [required]
 * @param {string} cozenPillsItemSimpleIconLeft            > Icon left (name of the icon)
 * @param {string} cozenPillsItemSimpleIconRight           > Icon right (name of the icon)
 * @param {string} cozenPillsItemSimpleName                > Name of the pill (only for factory use)
 * @param {string} cozenPillsItemSimpleType       = 'blue' > Type of the pill (change the color)
 * @param {string} cozenPillsItemSimpleTypeBlue            > Shortcut for blue type
 * @param {string} cozenPillsItemSimpleTypePurple          > Shortcut for purple type
 * @param {string} cozenPillsItemSimpleTypeGreen           > Shortcut for green type
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.pills.simple', [])
        .directive('cozenPillsItemSimple', cozenPillsItemSimple);

    cozenPillsItemSimple.$inject = [
        'CONFIG',
        'rfc4122',
        '$rootScope',
        '$window',
        '$timeout',
        '$filter'
    ];

    function cozenPillsItemSimple(CONFIG, rfc4122, $rootScope, $window, $timeout, $filter) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenPillsItemSimpleOnClick : '&',
                cozenPillsItemSimpleDisabled: '=?',
                cozenPillsItemSimpleSelected: '=?'
            },
            templateUrl: 'directives/pills/items/simple/pills.simple.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init        : init,
                hasError    : hasError,
                destroy     : destroy,
                getMainClass: getMainClass,
                onClick     : onClick,
                getTabIndex : getTabIndex,
                onActive    : onActive
            };

            var data = {
                directive: 'cozenPillsItemSimple',
                uuid     : rfc4122.v4()
            };

            scope._isReady = true;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                if (angular.isUndefined(attrs.cozenPillsItemSimpleDisabled)) {
                    scope.cozenPillsItemSimpleDisabled = false;
                }
                if (angular.isUndefined(attrs.cozenPillsItemSimpleSelected)) {
                    scope.cozenPillsItemSimpleSelected = false;
                }
                else if (typeof scope.cozenPillsItemSimpleSelected != "boolean") {
                    scope.cozenPillsItemSimpleSelected = false;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenPillsItemSimpleType)) {
                    if (angular.isDefined(attrs.cozenPillsItemSimpleTypeBlue)) {
                        scope._cozenPillsItemSimpleType = 'blue';
                    }
                    else if (angular.isDefined(attrs.cozenPillsItemSimpleTypePurple)) {
                        scope._cozenPillsItemSimpleType = 'purple';
                    }
                    else if (angular.isDefined(attrs.cozenPillsItemSimpleTypeGreen)) {
                        scope._cozenPillsItemSimpleType = 'green';
                    }
                    else {
                        scope._cozenPillsItemSimpleType = 'blue';
                    }
                }
                else {
                    scope._cozenPillsItemSimpleType = attrs.cozenPillsItemSimpleType;
                }

                // Default values (attributes)
                scope._cozenPillsItemSimpleId        = angular.isDefined(attrs.cozenPillsItemSimpleId) ? attrs.cozenPillsItemSimpleId : '';
                scope._cozenPillsItemSimpleLabel     = attrs.cozenPillsItemSimpleLabel;
                scope._cozenPillsItemSimpleIconLeft  = angular.isDefined(attrs.cozenPillsItemSimpleIconLeft) ? attrs.cozenPillsItemSimpleIconLeft : '';
                scope._cozenPillsItemSimpleIconRight = angular.isDefined(attrs.cozenPillsItemSimpleIconRight) ? attrs.cozenPillsItemSimpleIconRight : '';
                scope._cozenPillsItemSimpleName      = angular.isDefined(attrs.cozenPillsItemSimpleName) ? attrs.cozenPillsItemSimpleName : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope.cozenPillsItemSimpleActive = false;

                // From the factory, to toggle the active state
                scope.$on('cozenPillsActive', methods.onActive);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenPillsItemSimpleLabel)) {
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
                var classList = [
                    scope._cozenPillsItemSimpleType
                ];
                if (scope.cozenPillsItemSimpleDisabled) {
                    classList.push('disabled');
                }
                if (scope.cozenPillsItemSimpleSelected) {
                    classList.push('selected');
                }
                return classList;
            }

            function onClick($event) {
                $event.stopPropagation();
                if (scope.cozenPillsItemSimpleDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPillsItemSimpleOnClick)) {
                    scope.cozenPillsItemSimpleOnClick();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onClick');
                }
                if (scope.$parent.$parent.$parent._cozenPillsAutoUpdateModel) {
                    scope.cozenPillsItemSimpleSelected = !scope.cozenPillsItemSimpleSelected;
                    Methods.safeApply(scope);
                }
            }

            function getTabIndex() {
                var tabIndex = 0;
                if (scope.cozenPillsItemSimpleDisabled) {
                    tabIndex = -1;
                }
                return tabIndex;
            }

            function onActive(event, data) {
                scope.cozenPillsItemSimpleSelected = scope._cozenPillsItemSimpleName == data.name;
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
 * @param {function} cozenPopupOnShow         > Callback function called on show (id, name)
 * @param {function} cozenPopupOnHide         > Callback function called on hide (id, name)
 * @param {boolean}  cozenPopupIsOpen = false > Display the popup without event
 * @param {object}   cozenPopupData           > Custom data gave through the factory events
 * @param {string}   cozenPopupHeaderTitle    > Text of the header title
 *
 * [Attributes params]
 * @param {number}  cozenPopupId              = uuid      > Id of the popup
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
 * @param {string}  cozenPopupTypeGreen                   > Shortcut for green type
 * @param {string}  cozenPopupTypePurple                  > Shortcut for purple type
 * @param {boolean} cozenPopupHeader          = true      > Display the header [config]
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
(function (angular, document) {
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
        '$timeout',
        'rfc4122',
        '$animate'
    ];

    function cozenPopup(Themes, CONFIG, $window, $timeout, rfc4122, $animate) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : true,
            scope      : {
                cozenPopupOnShow     : '&',
                cozenPopupOnHide     : '&',
                cozenPopupIsOpen     : '=?',
                cozenPopupData       : '=?',
                cozenPopupHeaderTitle: '=?'
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
                onKeyDown         : onKeyDown,
                setHeaderPictoSize: setHeaderPictoSize
            };

            var data = {
                directive: 'cozenPopup',
                isHover  : false,
                firstHide: true,
                uuid     : rfc4122.v4(),
                isHiding : false
            };

            scope._isReady = true;

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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenPopupSize)) {
                    if (angular.isDefined(attrs.cozenPopupSizeSmall)) {
                        scope._cozenPopupSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenPopupSizeNormal)) {
                        scope._cozenPopupSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenPopupSizeLarge)) {
                        scope._cozenPopupSize = 'large';
                    }
                    else {
                        scope._cozenPopupSize = 'normal';
                    }
                }
                else {
                    scope._cozenPopupSize = attrs.cozenPopupSize;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenPopupType)) {
                    if (angular.isDefined(attrs.cozenPopupTypeDefault)) {
                        scope._cozenPopupType = 'default';
                    }
                    else if (angular.isDefined(attrs.cozenPopupTypeInfo)) {
                        scope._cozenPopupType = 'info';
                    }
                    else if (angular.isDefined(attrs.cozenPopupTypeSuccess)) {
                        scope._cozenPopupType = 'success';
                    }
                    else if (angular.isDefined(attrs.cozenPopupTypeWarning)) {
                        scope._cozenPopupType = 'warning';
                    }
                    else if (angular.isDefined(attrs.cozenPopupTypeError)) {
                        scope._cozenPopupType = 'error';
                    }
                    else if (angular.isDefined(attrs.cozenPopupTypeGreen)) {
                        scope._cozenPopupType = 'green';
                    }
                    else if (angular.isDefined(attrs.cozenPopupTypePurple)) {
                        scope._cozenPopupType = 'purple';
                    }
                    else {
                        scope._cozenPopupType = 'default';
                    }
                }
                else {
                    scope._cozenPopupType = attrs.cozenPopupType;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenPopupIsOpen) ? scope.cozenPopupIsOpen = false : null;
                angular.isUndefined(attrs.cozenPopupHeaderTitle) ? scope.cozenPopupHeaderTitle = '' : null;

                // Default values (attributes)
                scope._cozenPopupId              = angular.isDefined(attrs.cozenPopupId) ? attrs.cozenPopupId : data.uuid;
                scope._cozenPopupHeader          = angular.isDefined(attrs.cozenPopupHeader) ? JSON.parse(attrs.cozenPopupHeader) : CONFIG.popup.header;
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
                if (scope.cozenPopupIsOpen) {
                    data.firstHide = false;
                }

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
                var classList = [
                    scope._activeTheme,
                    scope._cozenPopupSize,
                    scope._cozenPopupType
                ];
                if (scope._cozenPopupAnimationIn && !data.isHiding) {
                    classList.push('animate-in');
                }
                return classList;
            }

            function hide($event, params) {
                if (params.name == scope._cozenPopupName) {
                    data.firstHide = false;
                    data.isHiding  = true;
                    if (Methods.isFunction(scope.cozenPopupOnHide)) {
                        scope.cozenPopupOnHide({
                            id  : scope._cozenPopupId,
                            name: scope._cozenPopupName
                        });
                    }
                    if (CONFIG.debug) {
                        Methods.directiveCallbackLog(data.directive, 'OnHide');
                    }
                    $window.removeEventListener('click', methods.onClick);
                    $window.removeEventListener('keydown', methods.onKeyDown);

                    // If popup has animation for exit, execute it then hide the popup
                    if (scope._cozenPopupAnimationOut && !data.firstHide) {
                        var popup    = angular.element(element.children()[0]);
                        var popupCtn = angular.element(angular.element(popup.children()[0]));
                        $animate.addClass(popup, 'animate-out');
                        $animate.addClass(popupCtn, 'animate-out ' + CONFIG.popup.animation.out.animation).then(function () {
                            $animate.removeClass(popupCtn, 'animate-out ' + CONFIG.popup.animation.out.animation);
                            scope.cozenPopupIsOpen = false;
                            data.isHiding          = false;
                        });
                    }
                    else {
                        scope.cozenPopupIsOpen = false;
                        data.isHiding          = false;
                    }
                }
            }

            function show($event, params) {
                if (params.name == scope._cozenPopupName) {
                    scope.cozenPopupIsOpen = true;
                    if (Methods.isFunction(scope.cozenPopupOnShow)) {
                        scope.cozenPopupOnShow({
                            id  : scope._cozenPopupId,
                            name: scope._cozenPopupName
                        });
                    }
                    if (CONFIG.debug) {
                        Methods.directiveCallbackLog(data.directive, 'OnShow');
                    }
                    if (scope._cozenPopupEasyClose) {
                        $window.addEventListener('click', methods.onClick);
                        $window.addEventListener('keydown', methods.onKeyDown);
                    }
                    methods.setHeaderPictoSize();
                    scope.cozenPopupData = params.data;
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
                return classList;
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
                        var img   = element.find('.cozen-popup-header .cozen-popup-header-img.left')[0];
                        var title = element.find('.cozen-popup-header .cozen-popup-header-title')[0];
                        if (img != null) {
                            img.style.height = title.offsetHeight + 'px';
                            img.style.width  = title.offsetHeight + 'px';
                        }
                    });
                }
            }
        }
    }

})(window.angular, window.document);


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
    dataMustBeNumber          : dataMustBeNumber,
    dataMustBeObject          : dataMustBeObject,
    dataMustBeInThisList      : dataMustBeInThisList,
    hasOwnProperty            : hasOwnProperty,
    httpRequestLog            : httpRequestLog,
    firstLoadLog              : firstLoadLog,
    missingKeyLog             : missingKeyLog,
    changeRouteLog            : changeRouteLog,
    hasDuplicates             : hasDuplicates,
    broadcastLog              : broadcastLog
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
    }
    else {
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
    if (Methods.isNullOrEmpty(string) || typeof string != 'string') {
        return string;
    }
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

function dataMustBeNumber(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cnumber%c>',
        getConsoleColor(),
        getConsoleColor('red'),
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

function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

function httpRequestLog(request) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + request.methods + '%c][%c' + now + '%c] ' + request.url,
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor()
    );
}

function firstLoadLog(isStarting) {
    var now  = moment().format('HH:mm:ss.SSS');
    var text = isStarting ? 'Starting' : 'Ready';
    console.log('%c[%c' + text + '%c][%c' + now + '%c]',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor()
    );
}

function missingKeyLog(directive, key, when) {
    console.error('%c[%c' + directive + '%c] Missing key <%c' + key + '%c> when ' + when,
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function changeRouteLog(directive, route, params) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + directive + '%c][%c' + now + '%c] Redirection to <%c' + route + '%c>' + getFormattedParams(params),
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor(),
        getConsoleColor('fn')
    );

    function getFormattedParams(params) {
        var text = '', count = 0;
        if (!Methods.isNullOrEmpty(params) && Object.keys(params).length > 0) {
            text += '\nParams:%c ';
            Object.keys(params).forEach(function (key) {
                if (count > 0) {
                    text += ', ';
                }
                else {
                    text += '{'
                }
                text += key + ':' + params[key];
                count++;
            });
            text += '}';
        }
        else {
            text += '%c';
        }
        return text;
    }
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

function broadcastLog(scope, eventName) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + scope + '%c][%c' + now + '%c] Broadcasted event <%c' + eventName + '%c>',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}
/**
 * @ngdoc directive
 * @name cozen-icon-required
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {boolean} cozenIconRequiredDisplay         = true                   > Hide or show the required icon
 * @param {string}  cozenIconRequiredTooltipLabel    = input_required_tooltip > Label of the tooltip
 * @param {string}  cozenIconRequiredTooltipMaxWidth = max-width-200          > Max width of the tooltip
 *
 * [Attribute params]
 * @param {string} cozenIconRequiredTooltipType = default > Type of the tooltip
 * @param {string} cozenIconRequiredStyle                 > Custom style
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.icons.required', [])
        .directive('cozenIconRequired', cozenIconRequired);

    cozenIconRequired.$inject = [
        'Themes'
    ];

    function cozenIconRequired(Themes) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenIconRequiredDisplay        : '=?',
                cozenIconRequiredTooltipLabel   : '=?',
                cozenIconRequiredTooltipMaxWidth: '=?'
            },
            templateUrl: 'directives/icons/required/required.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init   : init,
                destroy: destroy
            };

            var data = {
                directive: 'cozenIconRequired'
            };

            methods.init();

            function init() {

                // Default values (scope)
                angular.isUndefined(attrs.cozenIconRequiredDisplay) ? scope.cozenIconRequiredDisplay = true : null;
                angular.isUndefined(attrs.cozenIconRequiredTooltipLabel) ? scope.cozenIconRequiredTooltipLabel = 'input_required_tooltip' : null;
                angular.isUndefined(attrs.cozenIconRequiredTooltipMaxWidth) ? scope.cozenIconRequiredTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attribute)
                scope._cozenIconRequiredTooltipType = angular.isDefined(attrs.cozenIconRequiredTooltipType) ? attrs.cozenIconRequiredTooltipType : 'default';
                scope._cozenIconRequiredStyle       = angular.isDefined(attrs.cozenIconRequiredStyle) ? attrs.cozenIconRequiredStyle : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);



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
                Object.keys(Shortcuts).forEach(function (key) {
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
 * @name cozen-string-to-number
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {boolean} cozenStringToNumberDisabled = false > Disable the behavior
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenStringToNumber', cozenStringToNumber);

    cozenStringToNumber.$inject = [];

    function cozenStringToNumber() {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false,
            require   : 'ngModel'
        };

        function link(scope, element, attrs, ngModel) {
            var methods = {
                init   : init,
                destroy: destroy
            };

            var data = {
                directive: 'cozenStringToNumber'
            };

            methods.init();

            function init() {

                // Disabled check
                if (angular.isDefined(attrs.cozenStringToNumberDisabled)) {
                    if (JSON.parse(attrs.cozenStringToNumberDisabled)) {
                        return;
                    }
                }

                // Behavior
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value);
                });
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
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
 * @param {string}   cozenTextareaModel                           > Value edited by the textarea [required]
 * @param {boolean}  cozenTextareaDisabled = false                > Disable the textarea
 * @param {function} cozenTextareaOnChange                        > Callback function called on change
 * @param {string}   cozenTextareaTooltipMaxWidth = max-width-200 > Max width of the tooltip
 *
 * [Attributes params]
 * @param {number}  cozenTextareaId                                           > Id of the textarea
 * @param {string}  cozenTextareaTooltip                                      > Text of the tooltip
 * @param {string}  cozenTextareaTooltipPlacement = auto right                > Change the position of the tooltip [config]
 * @param {string}  cozenTextareaTooltipTrigger   = outsideClick              > Type of trigger to show the tooltip [config]
 * @param {boolean} cozenTextareaRequired         = false                     > Required textarea [config]
 * @param {boolean} cozenTextareaErrorDesign      = true                      > Add style when error [config]
 * @param {boolean} cozenTextareaSuccessDesign    = true                      > Add style when success [config]
 * @param {string}  cozenTextareaSize             = normal                    > Size of the button
 * @param {string}  cozenTextareaSizeSmall                                    > Shortcut for small size
 * @param {string}  cozenTextareaSizeNormal                                   > Shortcut for normal size
 * @param {string}  cozenTextareaSizeLarge                                    > Shortcut for large size
 * @param {string}  cozenTextareaPlaceholder                                  > Text for the placeholder
 * @param {number}  cozenTextareaMinLength        = 0                         > Minimum char length [config]
 * @param {number}  cozenTextareaMaxLength        = 200                       > Maximum char length [config]
 * @param {string}  cozenTextareaName             = uuid                      > Name of the textarea
 * @param {boolean} cozenTextareaValidator        = dirty                     > Define after what type of event the textarea must add more ui color [config]
 * @param {boolean} cozenTextareaValidatorAll                                 > Shortcut for all type
 * @param {boolean} cozenTextareaValidatorTouched                             > Shortcut for touched type
 * @param {boolean} cozenTextareaValidatorDirty                               > Shortcut for dirty type
 * @param {boolean} cozenTextareaValidatorEmpty   = true                      > Display ui color even if textarea empty [config]
 * @param {boolean} cozenTextareaElastic          = true                      > Auto resize the textarea depending of his content [config]
 * @param {number}  cozenTextareaRows             = 2                         > Number of rows [config]
 * @param {string}  cozenTextareaLabel                                        > Add a label on the top of the textarea
 * @param {string}  cozenTextareaRequiredTooltip  = textarea_required_tooltip > Text to display for the tooltip of the required element
 * @param {string}  cozenTextareaClass                                        > Custom class
 * @param {string}  cozenTextareaTooltipType      = default                   > Type of the tooltip
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
        '$filter',
        '$rootScope'
    ];

    function cozenTextarea(Themes, CONFIG, rfc4122, $timeout, $interval, $filter, $rootScope) {
        return {
            link            : link,
            restrict        : 'E',
            replace         : false,
            transclude      : false,
            scope           : {
                cozenTextareaModel          : '=?',
                cozenTextareaDisabled       : '=?',
                cozenTextareaOnChange       : '&',
                cozenTextareaTooltipMaxWidth: '=?'
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

            scope._isReady = true;

            methods.init();

            function init() {

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onChange    : onChange
                };

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (size)
                if (angular.isUndefined(attrs.cozenTextareaSize)) {
                    if (angular.isDefined(attrs.cozenTextareaSizeSmall)) {
                        scope._cozenTextareaSize = 'small';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaSizeNormal)) {
                        scope._cozenTextareaSize = 'normal';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaSizeLarge)) {
                        scope._cozenTextareaSize = 'large';
                    }
                    else {
                        scope._cozenTextareaSize = 'normal';
                    }
                }
                else {
                    scope._cozenTextareaSize = attrs.cozenTextareaSize;
                }

                // Shortcut values (validator)
                if (angular.isUndefined(attrs.cozenTextareaValidator)) {
                    if (angular.isDefined(attrs.cozenTextareaValidatorAll)) {
                        scope._cozenTextareaValidator = 'all';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaValidatorTouched)) {
                        scope._cozenTextareaValidator = 'touched';
                    }
                    else if (angular.isDefined(attrs.cozenTextareaValidatorDirty)) {
                        scope._cozenTextareaValidator = 'dirty';
                    }
                    else {
                        scope._cozenTextareaValidator = CONFIG.textarea.validator.type;
                    }
                }
                else {
                    scope._cozenTextareaValidator = attrs.cozenTextareaValidator;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenTextareaDisabled) ? scope.vm.cozenTextareaDisabled = false : null;
                angular.isUndefined(attrs.cozenTextareaTooltipMaxWidth) ? scope.vm.cozenTextareaTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attributes)
                scope._cozenTextareaId                 = angular.isDefined(attrs.cozenTextareaId) ? attrs.cozenTextareaId : '';
                scope._cozenTextareaTooltip            = angular.isDefined(attrs.cozenTextareaTooltip) ? attrs.cozenTextareaTooltip : '';
                scope._cozenTextareaTooltipTrigger     = angular.isDefined(attrs.cozenTextareaTooltipTrigger) ? attrs.cozenTextareaTooltipTrigger : CONFIG.textarea.tooltip.trigger;
                scope._cozenTextareaRequired           = angular.isDefined(attrs.cozenTextareaRequired) ? JSON.parse(attrs.cozenTextareaRequired) : CONFIG.textarea.required;
                scope._cozenTextareaErrorDesign        = angular.isDefined(attrs.cozenTextareaErrorDesign) ? JSON.parse(attrs.cozenTextareaErrorDesign) : CONFIG.textarea.errorDesign;
                scope._cozenTextareaSuccessDesign      = angular.isDefined(attrs.cozenTextareaSuccessDesign) ? JSON.parse(attrs.cozenTextareaSuccessDesign) : CONFIG.textarea.successDesign;
                scope._cozenTextareaPlaceholder        = angular.isDefined(attrs.cozenTextareaPlaceholder) ? attrs.cozenTextareaPlaceholder : '';
                scope._cozenTextareaMinLength          = angular.isDefined(attrs.cozenTextareaMinLength) ? attrs.cozenTextareaMinLength : CONFIG.textarea.minLength;
                scope._cozenTextareaMaxLength          = angular.isDefined(attrs.cozenTextareaMaxLength) ? attrs.cozenTextareaMaxLength : CONFIG.textarea.maxLength;
                scope._cozenTextareaName               = angular.isDefined(attrs.cozenTextareaName) ? attrs.cozenTextareaName : data.uuid;
                scope._cozenTextareaValidatorEmpty     = angular.isDefined(attrs.cozenTextareaValidatorEmpty) ? JSON.parse(attrs.cozenTextareaValidatorEmpty) : CONFIG.textarea.validator.empty;
                scope._cozenTextareaValidatorIcon      = angular.isDefined(attrs.cozenTextareaValidatorIcon) ? JSON.parse(attrs.cozenTextareaValidatorIcon) : true;
                scope._cozenTextareaTooltipPlacement   = angular.isDefined(attrs.cozenTextareaTooltipPlacement) ? attrs.cozenTextareaTooltipPlacement : CONFIG.textarea.tooltip.placement;
                scope._cozenTextareaElastic            = angular.isDefined(attrs.cozenTextareaElastic) ? JSON.parse(attrs.cozenTextareaElastic) : CONFIG.textarea.elastic;
                scope._cozenTextareaRows               = angular.isDefined(attrs.cozenTextareaRows) ? JSON.parse(attrs.cozenTextareaRows) : CONFIG.textarea.rows;
                scope._cozenTextareaLabel              = angular.isDefined(attrs.cozenTextareaLabel) ? attrs.cozenTextareaLabel : '';
                scope._cozenTextareaUuid               = data.uuid;
                scope._cozenTextareaDisplayModelLength = CONFIG.textarea.displayModelLength;
                scope._cozenTextareaModelLength        = scope._cozenTextareaMaxLength;
                scope._cozenTextareaRequiredConfig     = CONFIG.required;
                scope._cozenTextareaRequiredTooltip    = angular.isDefined(attrs.cozenTextareaRequiredTooltip) ? attrs.cozenTextareaRequiredTooltip : 'textarea_required_tooltip';
                scope._cozenTextareaTooltipType        = angular.isDefined(attrs.cozenTextareaTooltipType) ? attrs.cozenTextareaTooltipType : 'default';

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();

                // Ask the parent to launch the cozenFormName event to get the data
                // -> Avoid problems when elements are added to the DOM after the form loading
                $rootScope.$broadcast('cozenFormChildInit');

                // When the form is ready, get the required intels
                scope.$on('cozenFormName', function (event, eventData) {
                    scope._cozenTextareaForm      = eventData.name;
                    scope._cozenTextareaFormCtrl  = eventData.ctrl;
                    scope._cozenTextareaFormModel = eventData.model;

                    // Force to dirty and touched if the model is not empty
                    if (!Methods.isNullOrEmpty(scope.vm.cozenTextareaModel)) {
                        var textarea = methods.getForm();
                        textarea     = textarea[scope._cozenTextareaFormCtrl][scope._cozenTextareaFormModel][scope._cozenTextareaForm][scope._cozenTextareaName];
                        if (!Methods.isNullOrEmpty(textarea)) {
                            textarea.$setDirty();
                            textarea.$setTouched();
                        }
                    }
                });

                // Display the template (the timeout avoid a visual bug due to events)
                $timeout(function () {
                    scope._isReady = true;
                    methods.updateModelLength();
                }, 1);
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
                    var classList = [
                        scope._activeTheme,
                        scope._cozenTextareaSize,
                        attrs.cozenTextareaClass
                    ];
                    var textarea  = methods.getForm();
                    textarea      = textarea[scope._cozenTextareaFormCtrl][scope._cozenTextareaFormModel][scope._cozenTextareaForm][scope._cozenTextareaName];
                    if (!Methods.isNullOrEmpty(textarea)) {
                        if (scope._cozenTextareaValidatorEmpty || (!scope._cozenTextareaValidatorEmpty && !Methods.isNullOrEmpty(scope.vm.cozenTextareaModel))) {
                            switch (scope._cozenTextareaValidator) {
                                case 'touched':
                                    if (textarea.$touched) {
                                        classList.push(methods.getDesignClass(textarea));
                                    }
                                    break;
                                case 'dirty':
                                    if (textarea.$dirty) {
                                        classList.push(methods.getDesignClass(textarea));
                                    }
                                    break;
                                case 'all':
                                    classList.push(methods.getDesignClass(textarea));
                                    break;
                            }
                        }
                    }
                    if (scope.vm.cozenTextareaDisabled) {
                        classList.push('disabled');
                    }
                    return classList;
                }
            }

            function onChange($event) {
                if (scope.vm.cozenTextareaDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenTextareaOnChange)) {
                    scope.cozenTextareaOnChange();
                }
                if (CONFIG.debug) {
                    Methods.directiveCallbackLog(data.directive, 'onChange');
                }
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

            function updateModelLength() {
                if (Methods.isNullOrEmpty(scope.vm.cozenTextareaModel)) {
                    scope._cozenTextareaModelLength = scope._cozenTextareaMaxLength
                }
                else {
                    scope._cozenTextareaModelLength = scope._cozenTextareaMaxLength - scope.vm.cozenTextareaModel.length;
                }
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
            }
            else {
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
 * @param {string}  cozenTooltipLabel                    > Text of the tooltip (could be html as well) [required]
 * @param {boolean} cozenTooltipDisabled = false         > Disable the tooltip (allow empty label)
 * @param {string}  cozenTooltipMaxWidth = max-width-200 > Max width of the tooltip (must be a class custom or predefined) [ex: max-width-[100-450])
 *
 * [Attributes params]
 * @param {string}  cozenTooltipPlacement   = auto right > Position of the tooltip (ui-tooltip placement)
 * @param {boolean} cozenTooltipBody        = true       > Tooltip append to body
 * @param {number}  cozenTooltipCloseDelay  = 100        > Delay before hide
 * @param {number}  cozenTooltipDelay       = 250        > Delay before show
 * @param {string}  cozenTooltipTrigger     = mouseenter > Define what trigger the tooltip (mouseenter, click, outsideClick, focus, none)
 * @param {string}  cozenTooltipType        = default    > Define what type of tooltip is required
 * @param {string}  cozenTooltipTypeDefault              > Shortcut for default type
 * @param {string}  cozenTooltipTypeHtml                 > Shortcut for html type
 * @param {string}  cozenTooltipDisplay                  > Change the display (only when there are problem)
 * @param {string}  cozenTooltipDisplayChild             > Change the display for the child (only when there are problem)
 * @param {string}  cozenTooltipClass                    > Add a custom class on the tooltip
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
                cozenTooltipDisabled: '=?',
                cozenTooltipMaxWidth: '=?'
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
                if (methods.hasError()) {
                    return;
                }

                // Shortcut values (type)
                if (angular.isUndefined(attrs.cozenTooltipType)) {
                    if (angular.isDefined(attrs.cozenTooltipTypeDefault)) {
                        scope._cozenTooltipType = 'default';
                    }
                    else if (angular.isDefined(attrs.cozenTooltipTypeHtml)) {
                        scope._cozenTooltipType = 'html';
                    }
                    else {
                        scope._cozenTooltipType = 'default';
                    }
                }
                else {
                    scope._cozenTooltipType = attrs.cozenTooltipType;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenTooltipDisabled) ? scope.cozenTooltipDisabled = false : null;
                angular.isUndefined(attrs.cozenTooltipMaxWidth) ? scope.cozenTooltipMaxWidth = 'max-width-200' : null;

                // Default values (attributes)
                scope._cozenTooltipPlacement    = angular.isDefined(attrs.cozenTooltipPlacement) ? attrs.cozenTooltipPlacement : 'auto right';
                scope._cozenTooltipBody         = angular.isDefined(attrs.cozenTooltipBody) ? JSON.parse(attrs.cozenTooltipBody) : true;
                scope._cozenTooltipCloseDelay   = angular.isDefined(attrs.cozenTooltipCloseDelay) ? JSON.parse(attrs.cozenTooltipCloseDelay) : 100;
                scope._cozenTooltipDelay        = angular.isDefined(attrs.cozenTooltipDelay) ? JSON.parse(attrs.cozenTooltipDelay) : 250;
                scope._cozenTooltipTrigger      = angular.isDefined(attrs.cozenTooltipTrigger) ? attrs.cozenTooltipTrigger : 'mouseenter';
                scope._cozenTooltipDisplay      = angular.isDefined(attrs.cozenTooltipDisplay) ? attrs.cozenTooltipDisplay : '';
                scope._cozenTooltipDisplayChild = angular.isDefined(attrs.cozenTooltipDisplayChild) ? attrs.cozenTooltipDisplayChild : '';
                scope._cozenTooltipClass        = angular.isDefined(attrs.cozenTooltipClass) ? attrs.cozenTooltipClass : '';

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
 * @name cozen-upload-info
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {object}  cozenUploadInfoConfig         > Label of the tooltip [required]
 * @param {boolean} cozenUploadInfoDisplay = true > Hide or show the info icon
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.icons.uploadInfo', [])
        .directive('cozenUploadInfo', cozenUploadInfo);

    cozenUploadInfo.$inject = [
        '$filter',
        'Themes'
    ];

    function cozenUploadInfo($filter, Themes) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenUploadInfoConfig : '=?',
                cozenUploadInfoDisplay: '=?'
            },
            templateUrl: 'directives/icons/upload-info/uploadInfo.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init    : init,
                destroy : destroy,
                hasError: hasError
            };

            var data = {
                directive: 'cozenUploadInfo'
            };

            methods.init();

            function init() {

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenUploadInfoDisplay) ? scope.cozenUploadInfoDisplay = true : null;

                // Forge the label
                scope.cozenUploadInfoLabel = '<span>';
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'pattern')) {

                    // Remove dots and comma, split types into one array
                    var types = scope.cozenUploadInfoConfig.pattern;
                    types     = types.replace(/\./g, '');
                    types     = types.split(',');

                    // Title
                    if (types.length > 1) {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_types');
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_type');
                    }

                    // Add the types
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    for (var i = 0, length = types.length; i < length; i++) {
                        scope.cozenUploadInfoLabel += types[i].toUpperCase();
                        if (i < length - 1) {
                            scope.cozenUploadInfoLabel += ', ';
                        }
                    }
                    scope.cozenUploadInfoLabel += '</span><br>';
                }
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxSize')) {
                    scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_maxSize');
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.maxSize;
                    scope.cozenUploadInfoLabel += '</span><br>';
                }
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minHeight') || Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxHeight')) {
                    scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_height');
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minHeight')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.minHeight;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += ' x ';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxHeight')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.maxHeight;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += '</span><br>';
                }
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minWidth') || Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxWidth')) {
                    scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_width');
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minWidth')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.minWidth;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += ' x ';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxWidth')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.maxWidth;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += '</span><br>';
                }

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenUploadInfoConfig)) {
                    Methods.directiveErrorRequired(data.directive, 'Config');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
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
                if (methods.hasError()) {
                    return;
                }

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
                    }
                    else {
                        requestAnimationFrame(checkIfReady);
                    }
                });
            }
            else {
                evalExpressions(expressions);
            }
        }
    }

})(window.angular);