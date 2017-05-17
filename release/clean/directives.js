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
 * @param {string}  cozenAlertTypePurple                        > Shortcut for purple type
 * @param {string}  cozenAlertTypeGreen                         > Shortcut for green type
 * @param {string}  cozenAlertTypeBlue                          > Shortcut for blue type
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
 * @param {number}  cozenAlertTimeout           = 0             > Define after how many ms the alert should hide (0 is never) [config.json]
 * @param {boolean} cozenAlertAutoDestroy       = false         > Auto destroy the popup on the DOM after the hide [config.json]
 * @param {boolean} cozenAlertTimeoutBar        = false         > Show a progress bar for the lifetime of the alert [config.json]
 *
 * [Event cozenAlertShow]
 * @param {object} data > Object with all the data (uuid)
 *
 * [Event cozenAlertHide]
 * @param {object}  data          > Object with all the data (uuid)
 * @param {boolean} force = false > Force all the popup to be hide (without watching the id)
 *
 * [Event cozenAlertHideMatching]
 * @param {string} matching > String to match which one should be hide (corresponding to the id param)
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
        'CozenThemes',
        'CONFIG',
        '$interval',
        '$timeout',
        'rfc4122',
        '$rootScope',
        'cozenEnhancedLogs'
    ];

    function cozenAlert(CozenThemes, CONFIG, $interval, $timeout, rfc4122, $rootScope, cozenEnhancedLogs) {
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
                onClose     : onClose,
                hideMatching: hideMatching
            };

            var data = {
                directive        : 'cozenAlert',
                uuid             : rfc4122.v4(),
                shown            : true,
                firstHide        : true,
                firstDisplayWatch: true,
                timeout          : null,
                timeSpentInterval: null,
                displayWatcher   : null
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
                    else if (angular.isDefined(attrs.cozenAlertTypePurple)) {
                        scope._cozenAlertType = 'purple';
                    }
                    else if (angular.isDefined(attrs.cozenAlertTypeGreen)) {
                        scope._cozenAlertType = 'green';
                    }
                    else if (angular.isDefined(attrs.cozenAlertTypeBlue)) {
                        scope._cozenAlertType = 'blue';
                    }
                    else {
                        scope._cozenAlertType = 'default';
                    }
                }
                else {
                    scope._cozenAlertType = attrs.cozenAlertType;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenAlertDisplay) ? scope.cozenAlertDisplay = true : null;
                // if (angular.isUndefined(attrs.cozenAlertDisplay)) scope.cozenAlertLabel = '';

                // Default values (attributes)
                scope._cozenAlertId                = angular.isDefined(attrs.cozenAlertId) ? attrs.cozenAlertId : data.uuid;
                scope._cozenAlertAnimationIn       = angular.isDefined(attrs.cozenAlertAnimationIn) ? JSON.parse(attrs.cozenAlertAnimationIn) : CONFIG.alert.animation.in;
                scope._cozenAlertAnimationOut      = angular.isDefined(attrs.cozenAlertAnimationOut) ? JSON.parse(attrs.cozenAlertAnimationOut) : CONFIG.alert.animation.out;
                scope._cozenAlertCloseBtn          = angular.isDefined(attrs.cozenAlertCloseBtn) ? JSON.parse(attrs.cozenAlertCloseBtn) : CONFIG.alert.closeBtn.enabled;
                scope._cozenAlertIconLeft          = angular.isDefined(attrs.cozenAlertIconLeft) ? attrs.cozenAlertIconLeft : CONFIG.alert.iconLeft[scope._cozenAlertType];
                scope._cozenAlertTextAlign         = angular.isDefined(attrs.cozenAlertTextAlign) ? attrs.cozenAlertTextAlign : CONFIG.alert.textAlign;
                scope._cozenAlertCloseBtnTooltip   = angular.isDefined(attrs.cozenAlertCloseBtnTooltip) ? JSON.parse(attrs.cozenAlertCloseBtnTooltip) : CONFIG.alert.closeBtn.tooltip;
                scope._cozenAlertForceAnimation    = angular.isDefined(attrs.cozenAlertForceAnimation) ? JSON.parse(attrs.cozenAlertForceAnimation) : false;
                scope._cozenAlertAnimationInClass  = angular.isDefined(attrs.cozenAlertAnimationInClass) ? attrs.cozenAlertAnimationInClass : CONFIG.alert.animation.inClass;
                scope._cozenAlertAnimationOutClass = angular.isDefined(attrs.cozenAlertAnimationOutClass) ? attrs.cozenAlertAnimationOutClass : CONFIG.alert.animation.outClass;
                scope._cozenAlertTimeout           = angular.isDefined(attrs.cozenAlertTimeout) ? JSON.parse(attrs.cozenAlertTimeout) : CONFIG.alert.timeout.time;
                scope._cozenAlertAutoDestroy       = angular.isDefined(attrs.cozenAlertAutoDestroy) ? JSON.parse(attrs.cozenAlertAutoDestroy) : CONFIG.alert.autoDestroy;
                scope._cozenAlertTimeoutBar        = angular.isDefined(attrs.cozenAlertTimeoutBar) ? JSON.parse(attrs.cozenAlertTimeoutBar) : CONFIG.alert.timeout.bar;
                scope._cozenAlertHasTimeout        = scope._cozenAlertTimeout > 0;
                scope._cozenAlertTimeoutPct        = 0;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = CozenThemes.getActiveTheme();
                scope.$on('cozenAlertShow', methods.show);
                scope.$on('cozenAlertHide', methods.hide);
                $rootScope.$on('cozenAlertHideMatching', methods.hideMatching);
                data.firstHide = false;

                // To force the popup to get his stuff done as a normal show (with animation)
                if (scope._cozenAlertForceAnimation) {
                    methods.show(null, {
                        uuid: scope._cozenAlertId
                    });
                }

                // To execute the hide and show stuff even if the value is changed elsewhere
                data.displayWatcher = scope.$watch('cozenAlertDisplay', function (newValue) {
                    if (!data.firstDisplayWatch) {
                        if (newValue) {
                            methods.show(null, {});
                        }
                        else {
                            methods.hide(null, {
                                uuid: scope._cozenAlertId
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
                data.displayWatcher();
                element.off('$destroy', methods.destroy);
                scope.$destroy();
                element.remove();
                cozenEnhancedLogs.info.customMessage(data.directive, 'The alert was destroyed');
            }

            // Get the class
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

            // Hide the popup
            function hide($event, params, force) {
                if (scope.cozenAlertDisplay && (force || params.uuid == scope._cozenAlertId)) {

                    // Hide the popup
                    data.firstHide          = false;
                    scope.cozenAlertDisplay = false;

                    // Execute and log the callback function
                    if (Methods.isFunction(scope.cozenAlertOnHide)) {
                        scope.cozenAlertOnHide();
                    }
                    cozenEnhancedLogs.info.functionCalled(data.directive, 'OnHide');

                    // Stop the $interval
                    $interval.cancel(data.timeSpentInterval);

                    // @todo instead of added a fix value (corresponding to animation-duration-out) we could:
                    // - Add a parameter (attr + config) to set the time
                    // - Get a real callback when the hide animation is done
                    var timeout = scope._cozenAlertAnimationOut ? 200 : 0;
                    $timeout(function () {
                        if (Methods.isFunction(scope.cozenAlertOnHideDone)) {
                            scope.cozenAlertOnHideDone();
                        }

                        // Auto destroy the popup
                        if (scope._cozenAlertAutoDestroy) {
                            methods.destroy();
                        }
                    }, timeout);
                }
            }

            // Show the popup
            function show($event, params) {
                if (params.uuid == scope._cozenAlertId) {

                    // Show the popup
                    data.firstHide          = false;
                    scope.cozenAlertDisplay = true;

                    // Execute and log the callback function
                    if (Methods.isFunction(scope.cozenAlertOnShow)) {
                        scope.cozenAlertOnShow();
                    }
                    cozenEnhancedLogs.info.functionCalled(data.directive, 'OnShow');

                    // Start the timer to auto close if > 0
                    if (scope._cozenAlertTimeout > 0) {

                        // Timeout bar (calc the width progress in percentage)
                        if (scope._cozenAlertTimeoutBar) {

                            // Let's start with 0%
                            scope._cozenAlertTimeoutPct = 0;
                            data.oldTimeSpent           = moment().valueOf();

                            // Then start incrementing
                            data.timeSpentInterval = $interval(function () {

                                // Play with the timestamp to get real milliseconds
                                data.newTimeSpent = moment().valueOf();
                                scope._cozenAlertTimeoutPct += (data.newTimeSpent - data.oldTimeSpent) * 100 / scope._cozenAlertTimeout;
                                data.oldTimeSpent = data.newTimeSpent;

                                // 100% pct or more, it's over
                                if (scope._cozenAlertTimeoutPct >= 100) {

                                    // Fit it at 100% to avoid visual bug
                                    scope._cozenAlertTimeoutPct = 100;

                                    // If the popup is still visible, hide it
                                    if (scope.cozenAlertDisplay) {
                                        cozenEnhancedLogs.info.customMessageEnhanced(data.directive, 'The timeout of', scope._cozenAlertTimeout + 'ms', 'is over');
                                        methods.hide(null, {
                                            uuid: scope._cozenAlertId
                                        });
                                    }

                                    // And stop the interval
                                    $interval.cancel(data.timeSpentInterval);
                                }
                            }, 5);
                        }
                        else {

                            // Timeout to auto close when the time is over
                            data.timeout = $timeout(function () {

                                // If the popup is still visible, hide it
                                if (scope.cozenAlertDisplay) {
                                    cozenEnhancedLogs.info.customMessageEnhanced(data.directive, 'The timeout of', scope._cozenAlertTimeout + 'ms', 'is over');
                                    methods.hide(null, {
                                        uuid: scope._cozenAlertId
                                    });
                                }
                            }, scope._cozenAlertTimeout);
                        }
                    }
                }
            }

            // Close the popup
            function onClose($event) {
                methods.hide($event, {
                    uuid: scope._cozenAlertId
                });
            }

            // Hide the popup which contain this text (id param)
            function hideMatching($event, matching) {
                if (scope._cozenAlertId.search(matching) == 0) {
                    methods.hide($event, null, true);
                }
            }
        }
    }

})(window.angular);


/**
 * @ngdoc directive
 * @name cozen-alt-image
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 * A simple directive used to replace the image src with a default one when an error with the image was found
 *
 * @param {string} cozenAltImageType  = veolia > Define what image should be display instead (from a cozenAltImageTypeList below)
 * @param {string} cozenAltImageTitle          > Override the default title (only if the alt image is trigger)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenAltImage', cozenAltImage);

    cozenAltImage.$inject = [];

    function cozenAltImage() {
        return {
            required  : 'img',
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {

            // Methods declaration
            var methods = {
                init   : init,
                destroy: destroy
            };

            // Internal data
            var data = {
                cozenAltImageTypeList: {
                    veolia: 'assets/images/veolia/logo.jpg',
                    cross : 'assets/images/picto-supprimer-gris.png'
                },
                currentAltImage      : 'veolia',
                currentAltImageUrl   : ''
            };

            // Do stuff on creation
            methods.init();

            function init() {

                // Define the type (if cozenAltImageType is defined and the value found in object, update the default type)
                if (angular.isDefined(attrs.cozenAltImageType) &&
                    Methods.hasOwnProperty(data.cozenAltImageTypeList, attrs.cozenAltImageType)) {
                    data.currentAltImage = attrs.cozenAltImageType;
                }
                data.currentAltImageUrl = data.cozenAltImageTypeList[data.currentAltImage];

                // Listeners
                element.on('$destroy', methods.destroy);
                element.bind('error', function () {

                    // Change the src
                    element.attr('src', data.currentAltImageUrl);

                    // Change the title (only if cozenAltImageTitle is set)
                    angular.isDefined(attrs.cozenAltImageTitle) ? element.attr('title', attrs.cozenAltImageTitle) : null;
                });
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
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
    "languagesExtended": [
        "Français",
        "English"
    ],
    "currentLanguage": "fr",
    "themes": [
        "tau",
        "atom"
    ],
    "dev": false,
    "debug": false,
    "logs": {
        "enabled": false,
        "format": "HH:mm:ss.SSS"
    },
    "api": {
        "url": "http://cozen.com/"
    },
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
        "modelLengthType": "always"
    },
    "textarea": {
        "modelLengthType": "always",
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
        },
        "spellCheck": false
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
        "timeout": {
            "time": 0,
            "bar": false
        }
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
        "bottom": 20,
        "timeout": {
            "time": 8000,
            "bar": true
        },
        "autoDestroy": false
    },
    "googleAnalytics": {
        "activated": true,
        "trackerDefaultName": "t0",
        "cookieDefaultName": "gaCookie",
        "cookieDefaultDomain": "auto",
        "cookieExpires": 28800,
        "trackingId": ""
    },
    "btnLazyTest": {
        "log": false,
        "icon": {
            "class": "fa-font"
        },
        "position": {
            "top": "8px",
            "left": "8px"
        },
        "service": {
            "lang": "en",
            "gender": "male",
            "domain": "cozen.com",
            "length": 5,
            "syllables": 3,
            "word": "drow",
            "prefix": "Mrs.",
            "password": "Soleil123",
            "words": 15
        }
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
            'CONFIG',
            'cozenEnhancedLogs'
        ];

        function Cloudinary(Upload, CONFIG, cozenEnhancedLogs) {
            return {
                upload: upload
            };

            function upload(file, scope, commonData) {

                // Init to default values
                scope.cozenBtnHasUploadError = false;
                scope._hasUploadingSomething = false;

                // No file, no upload
                if (Methods.isNullOrEmpty(file)) {
                    return;
                }
                scope.cozenBtnIsUploading = true;

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

                        // Avoid to block the process
                        try {
                            file.name = data.original_filename;
                        }
                        catch (e) {
                        }
                        try {
                            file.fullName = file.$ngfName;
                        }
                        catch (e) {
                        }

                        // Other information
                        file.width        = data.width;
                        file.height       = data.height;
                        file.format       = data.format;
                        file.url          = data.url;
                        file.bytesSize    = data.bytes;
                        file.readableSize = Methods.getHumanFileSize(data.bytes, true);

                        // Tell that this is finish
                        scope.cozenBtnIsUploading    = false;
                        scope._hasUploadingSomething = true;
                        cozenEnhancedLogs.info.functionCalled('cozenBtn', 'upload');

                        // Update form validity
                        if (scope._cozenBtnUploadRequired) {
                            var btn = scope._methods.getForm()[scope._cozenBtnFormCtrl][scope._cozenBtnFormModel][scope._cozenBtnForm][scope._cozenBtnName];
                            if (!Methods.isNullOrEmpty(btn)) {
                                btn.$setValidity('isUploadSet', true);
                            }
                        }

                        // Callback function
                        if (Methods.isFunction(scope.cozenBtnOnUploadSuccess)) {
                            cozenEnhancedLogs.info.functionCalled('cozenBtn', 'cozenBtnOnUpload');
                            scope.cozenBtnOnUploadSuccess({
                                model: scope.cozenBtnUploadModel,
                                file : data
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        file.result                  = data;
                        scope.cozenBtnHasUploadError = true;
                        scope._uploadErrorLabel      = 'btn_upload_error_occurred';

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
 * @param {boolean}  cozenBtnIsUploading          > Override variable to know if the btn is uploading (read-only)
 * @param {boolean}  cozenBtnHasUploadError       > Override variable to know if the btn has an upload error (read-only)
 * @param {function} cozenBtnOnUploadSuccess      > Callback function called on upload success (return: {model, file})
 *
 * [Attributes params]
 * @param {number}  cozenBtnId                                         > Id of the button
 * @param {string}  cozenBtnSize                = normal               > Size of the button
 * @param {string}  cozenBtnSizeSmall                                  > Shortcut for small size
 * @param {string}  cozenBtnSizeNormal                                 > Shortcut for normal size
 * @param {string}  cozenBtnSizeLarge                                  > Shortcut for large size
 * @param {string}  cozenBtnType                = default              > Type of the button (change the color)
 * @param {string}  cozenBtnTypePrimary                                > Shortcut for primary type
 * @param {string}  cozenBtnTypeTransparent                            > Shortcut for transparent type
 * @param {string}  cozenBtnTypeCold                                   > Shortcut for cold type
 * @param {string}  cozenBtnTypePurple                                 > Shortcut for purple type
 * @param {string}  cozenBtnTypeGreen                                  > Shortcut for green type
 * @param {string}  cozenBtnTypeGoogle                                 > Shortcut for google type
 * @param {string}  cozenBtnTypeFacebook                               > Shortcut for facebook type
 * @param {string}  cozenBtnTypeDefault                                > Shortcut for default type
 * @param {string}  cozenBtnTypeInfo                                   > Shortcut for info type
 * @param {string}  cozenBtnTypeSuccess                                > Shortcut for success type
 * @param {string}  cozenBtnTypeWarning                                > Shortcut for warning type
 * @param {string}  cozenBtnTypeError                                  > Shortcut for error type
 * @param {string}  cozenBtnIconLeft                                   > Add an icon the to left (write the class)
 * @param {string}  cozenBtnIconRight                                  > Add an icon the to right (write the class)
 * @param {boolean} cozenBtnAutoSizing          = false                > Shortcut to activate the auto sizing (instead of 100% width)
 * @param {string}  cozenBtnClass                                      > Custom class
 * @param {string}  cozenBtnImgLeft                                    > URL/path to the left img
 * @param {boolean} cozenBtnIsUpload            = false                > Active the upload mod
 * @param {string}  cozenBtnUpperLabel                                 > Add a label on the top of the btn
 * @param {string}  cozenBtnRequiredTooltip     = btn_required_tooltip > Text to display for the tooltip of the required element
 * @param {boolean} cozenBtnUploadRequired      = false                > Required upload model
 * @param {string}  cozenBtnPreviewIcon         = fa fa-fw fa-eye      > Preview icon on the right
 * @param {boolean} cozenBtnPreview             = true                 > Enable or disable the preview
 * @param {boolean} cozenBtnUploadInfoIcon      = true                 > Display an info icon to show the upload requirements
 * @param {boolean} cozenBtnUploadProgress      = true                 > Display or hide the progress percentage
 * @param {boolean} cozenBtnUploadAlert         = true                 > Display or hide the alerts
 * @param {boolean} cozenBtnUploadErrorDesign   = true                 > Change the design if there is an error with the upload
 * @param {boolean} cozenBtnUploadSuccessDesign = true                 > Change the design if there is an success with the upload
 *
 */
(function (angular, document) {
    'use strict';

    angular
        .module('cozenLib.btn', [])
        .directive('cozenBtn', cozenBtn);

    cozenBtn.$inject = [
        'CozenThemes',
        'CONFIG',
        'rfc4122',
        'CloudinaryUpload',
        'cozenEnhancedLogs',
        '$rootScope'
    ];

    function cozenBtn(CozenThemes, CONFIG, rfc4122, CloudinaryUpload, cozenEnhancedLogs, $rootScope) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnOnClick        : '&',
                cozenBtnActive         : '=?',
                cozenBtnDisabled       : '=?',
                cozenBtnLoader         : '=?',
                cozenBtnUploadConfig   : '=?',
                cozenBtnUploadModel    : '=?',
                cozenBtnLabel          : '=?',
                cozenBtnIsUploading    : '=?',
                cozenBtnHasUploadError : '=?',
                cozenBtnOnUploadSuccess: '&'
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
                scope._cozenBtnId                  = angular.isDefined(attrs.cozenBtnId) ? attrs.cozenBtnId : '';
                scope._cozenBtnIconLeft            = angular.isDefined(attrs.cozenBtnIconLeft) ? attrs.cozenBtnIconLeft : '';
                scope._cozenBtnIconRight           = angular.isDefined(attrs.cozenBtnIconRight) ? attrs.cozenBtnIconRight : '';
                scope._cozenBtnImgLeft             = angular.isDefined(attrs.cozenBtnImgLeft) ? attrs.cozenBtnImgLeft : '';
                scope._cozenBtnIsUpload            = angular.isDefined(attrs.cozenBtnIsUpload) ? JSON.parse(attrs.cozenBtnIsUpload) : false;
                scope._cozenBtnName                = data.uuid;
                scope._cozenBtnUpperLabel          = angular.isDefined(attrs.cozenBtnUpperLabel) ? attrs.cozenBtnUpperLabel : '';
                scope._cozenBtnRequiredConfig      = CONFIG.required;
                scope._cozenBtnRequiredTooltip     = angular.isDefined(attrs.cozenBtnRequiredTooltip) ? attrs.cozenBtnRequiredTooltip : 'btn_required_tooltip';
                scope._cozenBtnUploadRequired      = angular.isDefined(attrs.cozenBtnUploadRequired) ? JSON.parse(attrs.cozenBtnUploadRequired) : false;
                scope._cozenBtnPreviewIcon         = angular.isDefined(attrs.cozenBtnPreviewIcon) ? attrs.cozenBtnPreviewIcon : 'fa fa-fw fa-eye';
                scope._cozenBtnUploadInfoIcon      = angular.isDefined(attrs.cozenBtnUploadInfoIcon) ? JSON.parse(attrs.cozenBtnUploadInfoIcon) : true;
                scope._cozenBtnPreview             = angular.isDefined(attrs.cozenBtnPreview) ? JSON.parse(attrs.cozenBtnPreview) : true;
                scope._cozenBtnUploadProgress      = angular.isDefined(attrs.cozenBtnUploadProgress) ? JSON.parse(attrs.cozenBtnUploadProgress) : true;
                scope._cozenBtnUploadAlert         = angular.isDefined(attrs.cozenBtnUploadAlert) ? JSON.parse(attrs.cozenBtnUploadAlert) : true;
                scope._cozenBtnUploadErrorDesign   = angular.isDefined(attrs.cozenBtnUploadErrorDesign) ? JSON.parse(attrs.cozenBtnUploadErrorDesign) : true;
                scope._cozenBtnUploadSuccessDesign = angular.isDefined(attrs.cozenBtnUploadSuccessDesign) ? JSON.parse(attrs.cozenBtnUploadSuccessDesign) : true;

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
                scope.cozenBtnHasUploadError = false;
                scope.cozenBtnIsUploading    = false;
                scope._hasUploadingSomething = false;
                scope._uploadingText         = '0%';

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

                // Watch for a broadcast event to simulate a fake click
                $rootScope.$on('cozenBtnFakeClick', function ($event, data) {
                    if (data.cozenBtnId == scope._cozenBtnId) {
                        methods.onClick();
                    }
                });

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = CozenThemes.getActiveTheme();
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
                if (scope._cozenBtnUploadErrorDesign && scope.cozenBtnHasUploadError) {
                    classList.push('upload-error');
                }
                if (scope._cozenBtnUploadSuccessDesign && scope._hasUploadingSomething) {
                    classList.push('upload-success');
                }
                return classList;
            }

            function onClick($event) {
                if (!Methods.isNullOrEmpty($event)) {
                    $event.stopPropagation();
                }
                if (scope.cozenBtnDisabled) {
                    return;
                }
                if (scope.cozenBtnLoader) {
                    return;
                }
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClick');
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
                        scope.cozenBtnHasUploadError = true;
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
        'CozenThemes',
        'CONFIG',
        'cozenEnhancedLogs'
    ];

    function cozenBtnCheck(CozenThemes, CONFIG, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnCheckModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnCheckModel != 'boolean') {
                    cozenEnhancedLogs.error.attributeIsNotBoolean(data.directive, 'Model');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
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
 * @name cozen-btn-lazy-test
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {function} cozenBtnLazyTestOnClick > Callback function called on click
 *
 * [Attributes params]
 * @param {string} cozenBtnLazyTestId    = uuid      > Id of the button
 * @param {string} cozenBtnLazyTestLabel = Lazy test > Label on the button
 * @param {string} cozenBtnLazyTestTop               > Override the position on the top
 * @param {string} cozenBtnLazyTestLeft              > Override the position on the left
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.btnLazyTest', [])
        .directive('cozenBtnLazyTest', cozenBtnLazyTest);

    cozenBtnLazyTest.$inject = [
        'CozenThemes',
        'CONFIG',
        'cozenEnhancedLogs',
        'rfc4122'
    ];

    function cozenBtnLazyTest(CozenThemes, CONFIG, cozenEnhancedLogs, rfc4122) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenBtnLazyTestOnClick: '&'
            },
            templateUrl: 'directives/btn-lazy-test/btnLazyTest.template.html'
        };

        function link(scope, element, attrs) {

            // Methods declaration
            var methods = {
                init        : init,
                destroy     : destroy,
                getMainClass: getMainClass,
                getMainStyle: getMainStyle,
                onClick     : onClick
            };

            // Internal data
            var data = {
                directive: 'cozenBtnLazyTest',
                uuid     : rfc4122.v4()
            };

            // Do stuff on creation
            methods.init();

            function init() {
                if (CONFIG.dev) {
                    scope._isReady = false;

                    // Public methods
                    scope._methods = {
                        getMainClass: getMainClass,
                        getMainStyle: getMainStyle,
                        onClick     : onClick
                    };

                    // Default values (attributes)
                    scope._cozenBtnLazyTestId    = angular.isDefined(attrs.cozenBtnLazyTestId) ? attrs.cozenBtnLazyTestId : data.uuid;
                    scope._cozenBtnLazyTestLabel = angular.isDefined(attrs.cozenBtnLazyTestLabel) ? attrs.cozenBtnLazyTestLabel : 'Lazy test';

                    // Init stuff
                    element.on('$destroy', methods.destroy);
                    scope._activeTheme               = CozenThemes.getActiveTheme();
                    scope._cozenBtnLazyTestIconClass = CONFIG.btnLazyTest.icon.class;

                    // Display the template
                    scope._isReady = true;
                }
                else {
                    cozenEnhancedLogs.info.customMessage('btnLazyTest', 'Hey ! The logs are still activated but the dev mod is not active. The directive will be destroyed.');
                    methods.destroy();
                }
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
                scope.$destroy();
                element.remove();
            }

            function getMainClass() {
                var classList = [
                    scope._activeTheme
                ];
                return classList;
            }

            function getMainStyle() {
                var styleObj  = {};
                styleObj.top  = angular.isDefined(attrs.cozenBtnLazyTestTop) ? attrs.cozenBtnLazyTestTop : CONFIG.btnLazyTest.position.top;
                styleObj.left = angular.isDefined(attrs.cozenBtnLazyTestLeft) ? attrs.cozenBtnLazyTestLeft : CONFIG.btnLazyTest.position.left;
                return styleObj;
            }

            function onClick($event) {
                $event.stopPropagation();
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClick');
                if (Methods.isFunction(scope.cozenBtnLazyTestOnClick)) {
                    scope.cozenBtnLazyTestOnClick();
                }
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
        'CozenThemes',
        'CONFIG',
        '$rootScope',
        'rfc4122',
        'cozenEnhancedLogs'
    ];

    function cozenBtnRadio(CozenThemes, CONFIG, $rootScope, rfc4122, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();
                $rootScope.$on(data.groupEvent.onChange, methods.onGroupChanged);

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnRadioModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
                    return true;
                }
                else if (typeof scope.cozenBtnRadioModel != 'boolean') {
                    cozenEnhancedLogs.error.attributeIsNotBoolean(data.directive, 'Model');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenBtnRadioGroup)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Group');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
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
                        cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
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
        'CozenThemes',
        'CONFIG',
        'cozenEnhancedLogs'
    ];

    function cozenBtnToggle(CozenThemes, CONFIG, cozenEnhancedLogs) {
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

                // isReady fix a bug with the popup after second display (the toggle wasn't visible)
                scope._isReady = false;

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onClick     : onClick,
                    getTabIndex : getTabIndex
                };

                // Check required stuff
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
                scope._activeTheme = CozenThemes.getActiveTheme();
                scope._isReady     = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenBtnToggleModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
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
 * @description
 * Transform the text as lowercase and then add uppercase
 * Note: You should use yourText.trim() before calling the filter to avoid unexpected behavior
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .filter('cozenCapitalize', cozenCapitalize);

    function cozenCapitalize() {
        return cozenCapitalizeFilter;

        /**
         * @param {string}  text                  > The text you want to convert
         * @param {boolean} all           = false > Check for the whole text
         * @param {boolean} firstCharOnly = false > Capitalize only the first letter
         */
        function cozenCapitalizeFilter(text, all, firstCharOnly) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            if (!Methods.isNullOrEmpty(text)) {
                if (firstCharOnly) {
                    text = text.toLowerCase();
                    text = text[0].toUpperCase() + text.slice(1);
                }
                else {

                    // For the case of '-', save each index of the '-' in an array
                    var indexArray = [];
                    for (var i = 0, length = text.length; i < length; i++) {
                        if (text[i] == '-') {
                            indexArray.push(i);
                        }
                    }

                    // Transform the text with all letters capitalized
                    var tmpText = '';
                    text.replace(reg, function (txt) {
                        tmpText += txt[0].toUpperCase() + txt.substr(1).toLowerCase();
                    });
                    text = tmpText;

                    // Add the '-'
                    indexArray.forEach(function (index) {
                        text = PublicMethods.insertIntoString(text, index, '-');
                    });
                }
                return text;
            }
            else {
                return '';
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
 * @param {string}  cozenCompile                    > The text you want to convert
 * @param {boolean} cozenCompileRewriteHtml = false > Perform a replace of the text to avoid breaking HTML text
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenCompile', cozenCompile);

    cozenCompile.$inject = [
        '$compile',
        '$sce'
    ];

    function cozenCompile($compile, $sce) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {

            // Default values (attributes)
            scope.cozenCompileRewriteHtml = angular.isDefined(attrs.cozenCompileRewriteHtml) ? JSON.parse(attrs.cozenCompileRewriteHtml) : false;

            scope.$watch(
                function (scope) {

                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.cozenCompile);
                },
                function (value) {

                    // Rewrite the HTML
                    if (scope.cozenCompileRewriteHtml) {
                        value = $sce.valueOf(value);
                        value = value.replace(/&lt;/g, '<');
                        value = value.replace(/&gt;/g, '>');
                    }

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
        .provider('CozenConfig', CozenConfigProvider);

    CozenConfigProvider.$inject = [
        'CONFIG'
    ];

    function CozenConfigProvider(CONFIG) {

        this.debug = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('debug');
            }
            else {
                CONFIG.debug = value;
            }
            return this;
        };

        this.dev = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('dev');
            }
            else {
                CONFIG.dev = value;
            }
            return this;
        };

        this.apiUrl = function (value) {
            CONFIG.api.url = value;
            return this;
        };

        this.logsEnabled = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('logsEnabled');
            }
            else {
                CONFIG.logs.enabled = value;
            }
            return this;
        };

        this.logsFormat = function (value) {
            CONFIG.logs.format = value;
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

        this.inputModelLengthType = function (value) {
            var list = [
                'always',
                'never',
                'focus'
            ];
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('inputModelLengthType', list);
            }
            else {
                CONFIG.input.modelLengthType = value;
            }
            return this;
        };

        this.textareaModelLengthType = function (value) {
            var list = [
                'always',
                'never',
                'focus'
            ];
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('textareaModelLengthType', list);
            }
            else {
                CONFIG.textarea.modelLengthType = value;
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

        this.textareaSpellCheck = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('textareaSpellCheck');
            }
            else {
                CONFIG.textarea.spellCheck = value;
            }
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

        this.alertTimeoutTime = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('alertTimeoutTime');
            }
            else {
                CONFIG.alert.timeout.time = value;
            }
            return this;
        };

        this.alertTimeoutBar = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('alertTimeoutBar');
            }
            else {
                CONFIG.alert.timeout.bar = value;
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

        this.floatingFeedTimeoutTime = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('floatingFeedTimeoutTime');
            }
            else {
                CONFIG.floatingFeed.timeout.time = value;
            }
            return this;
        };

        this.floatingFeedAutoDestroy = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('floatingFeedAutoDestroy');
            }
            else {
                CONFIG.floatingFeed.autoDestroy = value;
            }
            return this;
        };

        this.floatingFeedTimeoutBar = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('floatingFeedTimeoutBar');
            }
            else {
                CONFIG.floatingFeed.timeout.bar = value;
            }
            return this;
        };

        this.$get = CozenConfig;

        CozenConfig.$inject = [
            'CONFIG'
        ];

        function CozenConfig(CONFIG) {
            return {
                getConfig: getConfig
            };

            function getConfig() {
                return CONFIG;
            }
        }
    }

})(window.angular);

/**
 * @ngdoc directive
 * @name cozen-date-now
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
        .directive('cozenDateNow', cozenDateNow);

    cozenDateNow.$inject = [
        '$filter'
    ];

    function cozenDateNow($filter) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            element.text($filter('cozenCapitalize')($filter('date')(new Date(), attrs.dateNow), true, true));
        }
    }
})(window.angular);

/**
 * @ngdoc directive
 * @name cozen-draw-chart
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 * Handle the creation of a google graph easily
 *
 * [Scope params]
 * @param {string}   cozenDrawChartId               > Id of the chart [required]
 * @param {object}   cozenDrawChartData             > Data for the chart [required]
 * @param {object}   cozenDrawChartOptions          > Options for the chart [required]
 * @param {string}   cozenDrawChartType             > Type of the chart [required]
 * @param {boolean}  cozenDrawChartHidden   = false > Hide the chart (display none)
 * @param {string}   cozenDrawChartBase64           > Get the graph base64 string (override value)
 * @param {function} cozenDrawChartOnBase64         > Callback function called when the base64 is ready {id, base64}
 *
 * [Attribute params]
 * @param {string} cozenDrawChartAnimationIn > Custom animation on enter
 *
 */
(function (angular, window, document) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenDrawChart', cozenDrawChart);

    cozenDrawChart.$inject = [
        '$interval',
        '$timeout',
        'cozenEnhancedLogs',
        '$rootScope'
    ];

    function cozenDrawChart($interval, $timeout, cozenEnhancedLogs, $rootScope) {
        return {
            link       : link,
            restrict   : 'E',
            scope      : {
                cozenDrawChartId      : '=?',
                cozenDrawChartData    : '&',
                cozenDrawChartOptions : '=?',
                cozenDrawChartType    : '=?',
                cozenDrawChartHidden  : '=?',
                cozenDrawChartBase64  : '=?',
                cozenDrawChartOnBase64: '&'
            },
            replace    : false,
            transclude : false,
            templateUrl: 'directives/utils/directives/draw-chart/drawChart.template.html'
        };

        function link(scope, element, attrs) {
            scope._isReady = false;

            // Methods
            var methods = {
                init     : init,
                destroy  : destroy,
                initChart: initChart,
                drawChart: drawChart,
                onResize : onResize
            };

            // Data
            var data = {
                chart        : null,
                options      : {},
                init         : false,
                directiveName: 'cozenDrawChart',
                colors       : {
                    red   : '#e74c3c',
                    yellow: '#f1c40f',
                    blue  : '#3498db',
                    cyan  : '#1abc9c',
                    purple: '#9b59b6',
                    black : '#2c3e50'
                },
                canResize    : true
            };

            methods.init();

            function init() {

                // Required stuff (checking)
                var requiredAttrs = [
                    'cozenDrawChartId',
                    'cozenDrawChartData',
                    'cozenDrawChartOptions',
                    'cozenDrawChartType'
                ];
                for (var i = 0, length = requiredAttrs.length; i < length; i++) {
                    if (angular.isUndefined(attrs[requiredAttrs[i]])) {
                        cozenEnhancedLogs.error.missingParameterDirective(data.directiveName, requiredAttrs[i]);
                        return;
                    }
                }

                // Default values (attributes)
                scope._cozenDrawChartAnimationIn = angular.isDefined(attrs.cozenDrawChartAnimationIn) ? attrs.cozenDrawChartAnimationIn : '';

                // Init stuff
                element.on('$destroy', methods.destroy);
                angular.isUndefined(attrs.cozenDrawChartHidden) ? scope.cozenDrawChartHidden = false : null;

                // Display the template
                scope._isReady = true;

                // Draw the graph
                google.charts.load('current', {packages: ['corechart']});
                google.charts.setOnLoadCallback(methods.initChart);

                // Resize it when the window change
                window.addEventListener('resize', methods.onResize);
                scope.$watch('cozenDrawChartOptions', function () {
                    methods.drawChart();
                });

                // Event to resize the graph
                $rootScope.$on('cozenDrawChart', methods.onResize);
            }

            // Properly destroy
            function destroy() {
                window.removeEventListener('resize', methods.onResize);
                element.off('$destroy', methods.destroy);
            }

            // Init the chart (default conf, creation, callback and watcher)
            function initChart() {
                data.options = {
                    animation          : {
                        duration: 1000,
                        easing  : 'out',
                        startup : true
                    },
                    backgroundColor    : {
                        fill   : 'transparent',
                        opacity: 100
                    },
                    colors             : [
                        data.colors.red,
                        data.colors.yellow,
                        data.colors.blue,
                        data.colors.cyan,
                        data.colors.purple
                    ],
                    fontName           : 'Hind',
                    fontSize           : 16,
                    legend             : {
                        alignment: 'center',
                        textStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : data.colors.black,
                            fontName: 'Hind'
                        }
                    },
                    focusTarget        : 'category',
                    tooltip            : {
                        isHtml   : true,
                        textStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : data.colors.black,
                            fontName: 'Hind'
                        }
                    },
                    hAxis              : {
                        titleTextStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 16,
                            color   : data.colors.black,
                            fontName: 'Hind'
                        },
                        textStyle     : {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : data.colors.black,
                            fontName: 'Hind'
                        }
                    },
                    vAxis              : {
                        titleTextStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 16,
                            color   : data.colors.black,
                            fontName: 'Hind'
                        },
                        textStyle     : {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : data.colors.black,
                            fontName: 'Hind'
                        }
                    },
                    theme              : 'material',
                    annotations        : {
                        textStyle    : {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : data.colors.black,
                            fontName: 'Hind',
                            opacity : 1
                        },
                        highContrast : true,
                        alwaysOutside: false,
                        stem         : {
                            color : data.colors.black,
                            length: 5
                        }
                    },
                    enableInteractivity: true
                };

                var domChart = null;
                var interval = $interval(function () {
                    domChart = document.getElementById(scope.cozenDrawChartId);
                    if (domChart != null && domChart != '') {
                        data.chartContainer = document.getElementById(scope.cozenDrawChartId);
                        data.chart          = new google.visualization[scope.cozenDrawChartType](data.chartContainer);

                        // Get the base64 image
                        if (!data.init) {
                            google.visualization.events.addListener(data.chart, 'ready', function () {

                                // The timeout fix a bug with custom font-family in the graph
                                $timeout(function () {
                                    scope.cozenDrawChartBase64 = data.chart.getImageURI();
                                    if (typeof scope.cozenDrawChartOnBase64 == 'function') {
                                        scope.cozenDrawChartOnBase64({
                                            id    : scope.cozenDrawChartId,
                                            base64: scope.cozenDrawChartBase64
                                        });
                                    }
                                    methods.onResize();
                                });
                            });
                        }

                        data.init = true;
                        $interval.cancel(interval);
                        methods.drawChart();
                    }
                }, 30);
            }

            // Draw the google graph
            function drawChart() {
                if (!data.init) {
                    return;
                }
                var options = angular.merge({}, data.options, scope.cozenDrawChartOptions);
                data.chart.draw(scope.cozenDrawChartData(), options);
            }

            // Resize the google graph to his container
            function onResize() {
                if (data.canResize) {
                    data.canResize = false;

                    // Draw
                    var container = document.getElementById(scope.cozenDrawChartId);
                    if (!Methods.isNullOrEmpty(container)) {
                        container             = container.firstChild.firstChild;
                        container.style.width = "100%";
                        methods.drawChart();
                    }

                    // Timeout to avoid too much call
                    $timeout(function () {
                        data.canResize = true;
                    }, 100);
                }

            }
        }
    }

})(window.angular, window, document);


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
 * @param {number}  cozenDropdownId                                                       > Id of the dropdown
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
        'CozenThemes',
        'CONFIG',
        '$window',
        '$rootScope',
        'rfc4122',
        '$filter',
        '$timeout',
        'cozenEnhancedLogs'
    ];

    function cozenDropdown(CozenThemes, CONFIG, $window, $rootScope, rfc4122, $filter, $timeout, cozenEnhancedLogs) {
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
                        cozenEnhancedLogs.warn.attributeNotMatched(data.directive, 'ModelEnhanced', 'last');
                    }
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenDropdownDisabled) ? scope.vm.cozenDropdownDisabled = false : null;
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
                scope._activeTheme           = CozenThemes.getActiveTheme();
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

                // Ask the parent to launch the cozenFormName event to get the data
                // -> Avoid problems when elements are added to the DOM after the form loading
                $rootScope.$broadcast('cozenFormChildInit');

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenDropdownModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
                    return true;
                }
                if (angular.isDefined(attrs.cozenDropdownName)) {
                    if (Methods.isNullOrEmpty(attrs.cozenDropdownName)) {
                        cozenEnhancedLogs.error.attributeIsEmpty(data.directive, 'Name');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
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
        'cozenEnhancedLogs',
        '$window',
        '$timeout'
    ];

    function cozenDropdownItemGroup(CONFIG, rfc4122, cozenEnhancedLogs, $window, $timeout) {
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
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
        'cozenEnhancedLogs',
        '$timeout'
    ];

    function cozenDropdownItemSearch(CONFIG, rfc4122, $rootScope, cozenEnhancedLogs, $timeout) {
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
        '$filter',
        'cozenEnhancedLogs'
    ];

    function cozenDropdownItemSimple(CONFIG, rfc4122, $rootScope, $window, $filter, cozenEnhancedLogs) {
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
                angular.isUndefined(attrs.cozenDropdownItemSimpleDisabled) ? scope.cozenDropdownItemSimpleDisabled = false : null;
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickItem');
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
                    cozenEnhancedLogs.info.broadcastEvent('$rootScope', 'cozenDropdownActiveChild');
                }
                $rootScope.$broadcast('cozenDropdownActiveChild', {
                    dropdown   : data.dropdown.name,
                    activeChild: activeChild
                });

                if (CONFIG.broadcastLog) {
                    cozenEnhancedLogs.info.broadcastEvent('$rootScope', 'cozenDropdownActive');
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
                    cozenEnhancedLogs.info.broadcastEvent('$rootScope', 'cozenDropdownSelected');
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
                        cozenEnhancedLogs.info.broadcastEvent('$rootScope', 'cozenDropdownItemDisabled');
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


(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenEnhancedLogs', cozenEnhancedLogs);

    cozenEnhancedLogs.$inject = [
        'CONFIG'
    ];

    function cozenEnhancedLogs(CONFIG) {

        // Internal methods
        var methods = {
            getConsoleColor           : getConsoleColor,
            getTime                   : getTime,
            saveTime                  : saveTime,
            getBase                   : getBase,
            getFormattedParamsInline  : getFormattedParamsInline,
            getFormattedParams        : getFormattedParams,
            getFormattedParamsKeysOnly: getFormattedParamsKeysOnly,
            getTabs                   : getTabs,
            sendLog                   : sendLog
        };

        // Common data
        var colors = {
            red   : '#c0392b',
            purple: '#8e44ad',
            black : '#2c3e50',
            orange: '#d35400',
            cyan  : '#16a085',
            blue  : '#2980b9'
        };
        var now    = 0;
        var timer  = [];

        // Custom style added to the console
        console.colors.red    = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('red'));
        };
        console.colors.purple = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('purple'));
        };
        console.colors.black  = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('black'));
        };
        console.colors.orange = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('orange'));
        };
        console.colors.cyan   = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('cyan'));
        };
        console.colors.blue   = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('blue'));
        };

        // Public methods
        return {
            error        : {
                missingParameterFn       : errorMissingParameterFn,
                missingParameterDirective: errorMissingParameterDirective,
                unexpectedBehaviorFn     : errorUnexpectedBehaviorFn,
                attributeIsNotFunction   : errorAttributeIsNotFunction,
                attributeIsNotBoolean    : errorAttributeIsNotBoolean,
                attributeIsEmpty         : errorAttributeIsEmpty,
                valueNotBoolean          : errorValueNotBoolean,
                valueNotNumber           : errorValueNotNumber,
                valueNotObject           : errorValueNotObject,
                valueNotInList           : errorValueNotInList,
                missingParameterWhen     : errorMissingParameterWhen,
                customMessage            : errorCustomMessage,
                requiredParameterFn      : errorRequiredParameterFn
            },
            info         : {
                customMessage        : infoCustomMessage,
                functionCalled       : infoFunctionCalled,
                customMessageEnhanced: infoCustomMessageEnhanced,
                stateRedirectTo      : infoStateRedirectTo,
                httpRequest          : infoHttpRequest,
                apiRoute             : infoApiRoute,
                changeRouteWithParams: infoChangeRouteWithParams,
                broadcastEvent       : infoBroadcastEvent,
                explodeObject        : infoExplodeObject,
                lazyLoadLog          : infoLazyLoadLog,
                lazyLoadLogObject    : infoLazyLoadLogObject,
                ga                   : {
                    baseRequest: infoGaBaseRequest,
                    pageView   : infoGaPageView,
                    event      : infoGaEvent
                }
            },
            warn         : {
                attributeNotMatched: warningAttributeNotMatched,
                customMessage      : warningCustomMessage
            },
            wrap         : {
                starting: wrapStarting,
                end     : wrapEnd
            },
            explodeObject: explodeObject
        };

        /// ERROR LOGS ///

        /**
         * Display a log message to inform that a function could not work properly due to a missing parameter
         * @param {string} fnName = anonymous > Specify the name of the function
         */
        function errorMissingParameterFn(fnName) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName)) {
                    fnName = 'anonymous';
                }
                var log = methods.getBase(fnName);
                log += console.colors.black('Error due to missing parameter');
                console.style(log);
            }
        }

        /**
         * Display a log message to inform that a function could not work properly due to a missing parameter
         * @param {string} directive > Specify the name of the directive [required]
         * @param {string} attr      > Name of the attribute [required]
         */
        function errorMissingParameterDirective(directive, attr) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(directive) || Methods.isNullOrEmpty(attr)) {
                    return;
                }
                var log = methods.getBase(directive);
                log += console.colors.black('Attribute <');
                log += console.colors.purple(attr);
                log += console.colors.black('> is required !');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a function didn't work well (return statement error usually)
         * @param {string} fnName > Specify the name of the function [required]
         * @param {string} text   > Specify the description for the error [required]
         */
        function errorUnexpectedBehaviorFn(fnName, text) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(text)) {
                    return;
                }
                var log = methods.getBase(fnName);
                log += console.colors.black(text);
                console.style(log);
            }
        }

        /**
         * Display a log error message when an attribute is not a function
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         */
        function errorAttributeIsNotFunction(target, attribute) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attribute <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> is not a function');
                console.style(log);
            }
        }

        /**
         * Display a log error message when an attribute is not a boolean
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         */
        function errorAttributeIsNotBoolean(target, attribute) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attribute <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> is not a boolean');
                console.style(log);
            }
        }

        /**
         * Display a log error message when an attribute is null or empty
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         */
        function errorAttributeIsEmpty(target, attribute) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attribute <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> is null or empty');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value is not a boolean
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         */
        function errorValueNotBoolean(target, value) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be <');
                log += console.colors.purple('true');
                log += console.colors.black('> or <');
                log += console.colors.purple('false');
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value is not a number
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         */
        function errorValueNotNumber(target, value) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be a <');
                log += console.colors.purple('number');
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value is not an object
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         */
        function errorValueNotObject(target, value) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be an <');
                log += console.colors.purple('object');
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value must be in the list
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         * @param {string} list   > Specify the list of available values [required]
         */
        function errorValueNotInList(target, value, list) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value) || Methods.isNullOrEmpty(list)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be a value from the list <');
                log += console.colors.purple(list);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a required parameter is missing on an specific element
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         * @param {string} element   > Specify the name of the context [required]
         */
        function errorMissingParameterWhen(target, attribute, element) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute) || Methods.isNullOrEmpty(element)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Missing key <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> when ' + element);
                console.style(log);
            }
        }

        /**
         * Display a log error message with a custom message (title/description)
         * @param {string} title > Specify the title of the message [required]
         * @param {string} text  > Specify the description of the message [required]
         */
        function errorCustomMessage(title, text) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(text)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black(text);
                console.style(log);
            }
        }

        /**
         * Display a error message to inform that this function have a missing required parameter
         * @param {string} fnName = anonymous > Specify the name of the function
         * @param {string} parameter          > Specify the name of the required parameter [required]
         */
        function errorRequiredParameterFn(fnName, parameter) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(parameter)) {
                    return;
                }
                if (Methods.isNullOrEmpty(fnName)) {
                    fnName = 'anonymous';
                }
                var log = methods.getBase(fnName);
                log += console.colors.black('Missing required parameter <');
                log += console.colors.purple(parameter);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /// INFO LOGS ///

        /**
         * Display a log info message with a custom message (title/description)
         * @param {string} title > Specify the title of the message [required]
         * @param {string} text  > Specify the description of the message [required]
         */
        function infoCustomMessage(title, text) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(text)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black(text);
                console.style(log);
            }
        }

        /**
         * Display a log info message when a function is called (debug & tracking purpose)
         * @param {string} from   > Specify the service, directive or controller name [required]
         * @param {string} fnName > Specify the name of the function [required]
         */
        function infoFunctionCalled(from, fnName) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(from) || Methods.isNullOrEmpty(fnName)) {
                    return;
                }
                var log = methods.getBase(from);
                log += console.colors.black('Function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> called');
                console.style(log);
            }
        }

        /**
         * Display a log info message with a custom message (title/description/variable)
         * @param {string} title      > Specify the title of the message [required]
         * @param {string} textBefore > Specify the text before the value [required]
         * @param {string} value      > Specify the value [required]
         * @param {string} textAfter  > Specify the text after the message
         */
        function infoCustomMessageEnhanced(title, textBefore, value, textAfter) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(textBefore) || Methods.isNullOrEmpty(value)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black(textBefore + ' <');
                log += console.colors.purple(value);
                log += console.colors.black('>');
                if (!Methods.isNullOrEmpty(textAfter)) {
                    log += console.colors.black(' ' + textAfter);
                }
                console.style(log);
            }
        }

        /**
         * Display a log info message for googleAnalyticsRequest service
         * @param {string} fnName  > Specify the name of the function executed [required]
         * @param {string} tracker > Specify the name of the tracker [required]
         */
        function infoTemplateForGoogleAnalyticsRequest(fnName, tracker) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(tracker)) {
                    return;
                }
                var log = methods.getBase('googleAnalyticsRequest');
                log += console.colors.black('Function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> executed for tracker <');
                log += console.colors.purple(tracker);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message when redirect to is called
         * @param {string} state    > Specify the name of the original state [required]
         * @param {string} newState > Specify the name of the new state [required]
         */
        function infoStateRedirectTo(state, newState) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(newState) || Methods.isNullOrEmpty(newState)) {
                    return;
                }
                var log = methods.getBase(state);
                log += console.colors.black('Prevent default for this state and redirect to <');
                log += console.colors.purple(newState);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message when redirect to is called
         * @param {object} request > Object with methods and url key [required]
         */
        function infoHttpRequest(request) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(request)) {
                    return;
                }
                var log = methods.getBase(request.methods);
                log += console.colors.black(request.url);
                console.style(log);
            }
        }

        /**
         * Display a log info message when an api route is called
         * @param {object} request > Object with methods and url key [required]
         */
        function infoApiRoute(request) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(request)) {
                    return;
                }
                var log = methods.getBase(request.methods);
                log += console.colors.black(request.url);
                console.style(log);
            }
        }

        /**
         * Display a log info message when the user change the current state
         * @param {string} title      > The name of the element [required]
         * @param {string} state      > The name of the new route [required]
         * @param {object} parameters > The object with the params included in the route [required]
         */
        function infoChangeRouteWithParams(title, state, parameters) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(state) || Methods.isNullOrEmpty(parameters)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black('Redirection to <');
                log += console.colors.purple(state);
                log += console.colors.black('>');
                log += methods.getFormattedParamsInline(parameters);
                console.style(log);
            }
        }

        /**
         * Display a log info message when you want to log an event
         * @param {string} title > The name of the element [required]
         * @param {string} event > The name of the event [required]
         */
        function infoBroadcastEvent(title, event) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(event)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black('Broadcasted event <');
                log += console.colors.purple(event);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message when the user change the current state
         * @param {string}  title           > The name of the element [required]
         * @param {string}  text            > The text you want to see above the object [required]
         * @param {object}  object          > The object you want to see in deep details [required]
         * @param {boolean} extended = true > Add more details (type)
         */
        function infoExplodeObject(title, text, object, extended) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(text) || Methods.isNullOrEmpty(object)) {
                    return;
                }
                if (Methods.isNullOrEmpty(extended)) {
                    extended = true;
                }
                var log = methods.getBase(title);
                log += console.colors.black(text);
                log += '\n';
                log += methods.getFormattedParams(object, extended);
                console.style(log);
            }
        }

        /**
         * Display a log info message dedicated to the info lazy services when the result is a simple value
         * @param {string} service > The name of the service which contain the function [required]
         * @param {string} fnName  > The name of the called function [required]
         * @param {string} result  > The result value of the called function [required]
         */
        function infoLazyLoadLog(service, fnName, result) {
            if (CONFIG.logs.enabled && CONFIG.dev && CONFIG.btnLazyTest.log) {
                if (Methods.isNullOrEmpty(service) || Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(result)) {
                    return;
                }
                var log = methods.getBase(service);
                log += console.colors.black('The function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> returned <');
                log += console.colors.purple(result);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message dedicated to the info lazy services when the result is an object
         * @param {string} service > The name of the service which contain the function [required]
         * @param {string} fnName  > The name of the called function [required]
         * @param {object} object  > The result object of the called function [required]
         */
        function infoLazyLoadLogObject(service, fnName, object) {
            if (CONFIG.logs.enabled && CONFIG.dev && CONFIG.btnLazyTest.log) {
                if (Methods.isNullOrEmpty(service) || Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(object)) {
                    return;
                }
                var log = methods.getBase(service);
                log += console.colors.black('The function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> returned an object');
                log += '\n';
                log += methods.getFormattedParams(object, true);
                console.style(log);
            }
        }

        /**
         * Display a log info message for googleAnalyticsRequest service
         * @param {string} fnName  > Specify the name of the function executed [required]
         * @param {string} tracker > Specify the name of the tracker [required]
         */
        function infoGaBaseRequest(fnName, tracker) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(tracker)) {
                    return;
                }
                var log = methods.getBase('cozenGoogleAnalyticsRequest');
                log += console.colors.black('Function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> executed for tracker <');
                log += console.colors.purple(tracker);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message for googleAnalyticsRequest service when hit type is page view
         * @param {string} fnName    > Specify the name of the function executed [required]
         * @param {string} tracker   > Specify the name of the tracker [required]
         * @param {string} pageTitle > Specify the name of the current page [required]
         */
        function infoGaPageView(fnName, tracker, pageTitle) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(tracker) || Methods.isNullOrEmpty(pageTitle)) {
                    return;
                }
                var log = methods.getBase('cozenGoogleAnalyticsRequest');
                log += console.colors.black('Function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> executed for tracker <');
                log += console.colors.purple(tracker);
                log += console.colors.black('> on page <');
                log += console.colors.purple(pageTitle);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message for googleAnalyticsRequest service when hit type is event
         * @param {string} fnName      > Specify the name of the function executed [required]
         * @param {string} tracker     > Specify the name of the tracker [required]
         * @param {object} eventObject > Specify the object for event [required]
         */
        function infoGaEvent(fnName, tracker, eventObject) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(tracker) || Methods.isNullOrEmpty(eventObject)) {
                    return;
                }
                var log = methods.getBase('cozenGoogleAnalyticsRequest');
                log += console.colors.black('Function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> executed for tracker <');
                log += console.colors.purple(tracker);
                log += console.colors.black('>');
                log += '\n';
                log += methods.getFormattedParams(eventObject);
                console.style(log);
            }
        }

        /// WARNING LOGS ///

        /**
         * Display a log warning message when an attribute as defined values but entered one is incorrect
         * @param {string} target       > Specify the name of the element [required]
         * @param {string} attribute    > Specify the name of the attribute [required]
         * @param {string} defaultValue > Specify the callback default value [required]
         */
        function warningAttributeNotMatched(target, attribute, defaultValue) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute) || Methods.isNullOrEmpty(defaultValue)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attribute <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> value is incorrect\nCallback of the default value <');
                log += console.colors.purple(defaultValue);
                log += console.colors.black('> was set');
                console.style(log);
            }
        }

        /**
         * Display a log warning message with a custom message (title/description)
         * @param {string} title > Specify the title of the message [required]
         * @param {string} text  > Specify the description of the message [required]
         */
        function warningCustomMessage(title, text) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(text)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black(text);
                console.style(log);
            }
        }

        /// WRAP LOGS ///

        /**
         * Start a series of logs
         * @param {string} target > Specify the name of the element [required]
         */
        function wrapStarting(target) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target)) {
                    return;
                }

                // Add
                timer.push({
                    target : target,
                    started: Date.now()
                });

                var log = methods.getBase(target);
                log += console.colors.black('Started initializing...');
                console.style(log);
            }
        }

        /**
         * End a series of logs
         * @param {string} target > Specify the name of the element [required]
         */
        function wrapEnd(target) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target)) {
                    return;
                }

                // Get the starting object
                var targetTimer = null, i = 0, length;
                for (length = timer.length; i < length; i++) {
                    if (timer[i].target == target) {
                        targetTimer = timer[i];
                        break;
                    }
                }

                var log = methods.getBase(target);
                if (!Methods.isNullOrEmpty(targetTimer)) {
                    timer.splice(i, 1);

                    // Get the diff time
                    var now  = Date.now();
                    var diff = now - targetTimer.started;

                    log += console.colors.black('Initialization completed in <');
                    log += console.colors.purple(diff);
                    log += console.colors.black('> milliseconds');
                }
                else {
                    log += console.colors.black('End');
                }
                console.style(log);
            }
        }

        /// OTHERS ///

        /**
         * Display an object
         * @param {object}  object          > The object you want to see in deep details [required]
         * @param {boolean} extended = true > Add more details (type)
         */
        function explodeObject(object, extended) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(object)) {
                    return;
                }
                if (Methods.isNullOrEmpty(extended)) {
                    extended = true;
                }
                console.style(methods.getFormattedParams(object, extended));
            }
        }

        /// INTERNAL METHODS ///

        function getConsoleColor(type) {
            var color = 'color:';
            switch (type) {
                case 'red':
                case 'values':
                    return color + colors.red;
                case 'purple':
                case 'fn':
                    return color + colors.purple;
                case 'orange':
                case 'time':
                    return color + colors.orange;
                case 'cyan':
                    return color + colors.cyan;
                case 'blue':
                    return color + colors.blue;
                case 'black':
                default:
                    return color + colors.black;
            }
        }

        function getTime() {
            return moment().format(CONFIG.logs.format);
        }

        function saveTime() {
            now = methods.getTime();
        }

        function getBase(target) {
            methods.saveTime();
            var base = '';
            base += console.colors.black('[');
            base += console.colors.red(target);
            base += console.colors.black('][');
            base += console.colors.orange(now);
            base += console.colors.black('] ');
            return base;
        }

        function getFormattedParamsInline(parameters) {
            var text = '', count = 0;
            if (!Methods.isNullOrEmpty(parameters) && Object.keys(parameters).length > 0) {
                text += '\n';
                Object.keys(parameters).forEach(function (key) {
                    if (count > 0) {
                        text += console.colors.blue(', ');
                    }
                    else {
                        text += console.colors.blue('{');
                    }
                    text += console.colors.blue(key);
                    text += console.colors.blue(': ');
                    text += console.colors.cyan(parameters[key]);
                    count++;
                });
                text += console.colors.blue('}');
            }
            return text;
        }

        function getFormattedParams(parameters, extended) {
            if (Methods.isNullOrEmpty(extended)) {
                extended = false;
            }
            var text             = '', count = 0;
            var longestKeyLength = Methods.getLongestKey(parameters).length;
            if (!Methods.isNullOrEmpty(parameters) && Object.keys(parameters).length > 0) {
                Object.keys(parameters).forEach(function (key) {
                    if (count > 0) {
                        text += '\n';
                    }
                    else {
                        text += console.colors.blue('{');
                        text += '\n';
                    }
                    text += '\t';
                    text += console.colors.blue(key);
                    text += Methods.returnSpacesString(key, longestKeyLength);
                    text += console.colors.blue(': ');

                    // Avoid to print the function
                    if (typeof parameters[key] == 'function') {
                        text += console.colors.orange('Not printable');
                    }

                    // Show us the content of the object
                    else if (typeof parameters[key] == 'object' && !Array.isArray(parameters[key])) {
                        text += console.colors.blue('{');
                        text += '\n';
                        text += methods.getFormattedParamsKeysOnly(parameters[key], extended, 2);
                        text += '\t';
                        text += console.colors.blue('}');
                    }
                    else {
                        text += console.colors.cyan(parameters[key]);
                    }

                    // Add the type
                    if (extended) {

                        // Avoid to print object if array
                        if (Array.isArray(parameters[key])) {
                            text += console.colors.blue(' <');
                            text += console.colors.purple('array');
                            text += console.colors.blue('>');
                        }

                        // Avoid to print the object
                        else if (typeof parameters[key] != 'object') {
                            text += console.colors.blue(' <');
                            text += console.colors.purple(typeof parameters[key]);
                            text += console.colors.blue('>');
                        }
                    }
                    count++;
                });
                text += '\n';
                text += console.colors.blue('}');
            }
            return text;
        }

        function getFormattedParamsKeysOnly(parameters, extended, tabs) {
            if (Methods.isNullOrEmpty(extended)) {
                extended = false;
            }
            var text             = '', count = 0;
            var longestKeyLength = Methods.getLongestKey(parameters).length;
            if (!Methods.isNullOrEmpty(parameters) && Object.keys(parameters).length > 0) {
                Object.keys(parameters).forEach(function (key) {
                    if (count > 0) {
                        text += '\n';
                    }
                    text += methods.getTabs(tabs);
                    text += console.colors.blue(key);
                    text += Methods.returnSpacesString(key, longestKeyLength);
                    text += console.colors.blue(': ');

                    // Avoid to print the function
                    if (typeof parameters[key] == 'function') {
                        text += console.colors.orange('Not printable');
                    }

                    // Show us the content of the object
                    else if (typeof parameters[key] == 'object' && !Array.isArray(parameters[key])) {
                        text += console.colors.blue('{');
                        text += '\n' + methods.getTabs(tabs + 1);
                        text += methods.getFormattedParamsKeysOnly(parameters[key], extended, tabs + 1);
                        text += console.colors.blue('}');
                    }
                    else {
                        text += console.colors.cyan(parameters[key]);
                    }

                    // Add the type
                    if (extended) {

                        // Avoid to print object if array
                        if (Array.isArray(parameters[key])) {
                            text += console.colors.blue(' <');
                            text += console.colors.purple('array');
                            text += console.colors.blue('>');
                        }

                        // Avoid to print the object
                        else if (typeof parameters[key] != 'object') {
                            text += console.colors.blue(' <');
                            text += console.colors.purple(typeof parameters[key]);
                            text += console.colors.blue('>');
                        }
                    }
                    count++;
                });
                text += '\n';
            }
            return text;
        }

        function getTabs(tabs) {
            var text = '';
            for (var i = 0; i < tabs; i++) {
                text += '\t';
            }
            return text;
        }

        function sendLog(type, text) {
            var icon;
            switch (type) {
                case 'info':
                    icon = 'background:url(http://fr.seaicons.com/wp-content/uploads/2016/05/Sign-Info-icon.png);';
                    break;
            }
            var newLog = '<img="' + icon + 'width:12px; height:12px;">';
            newLog     = '';
            console.style(newLog + text);
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
 * @param {number}  cozenFloatingFeedTimeout      = 8000          > Lifetime of the alerts before auto close [config.json]
 * @param {boolean} cozenFloatingFeedTimeoutBar   = true          > Show a progress bar for the lifetime of the alert [config.json]
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
        'CozenThemes',
        'rfc4122',
        'cozenEnhancedLogs',
        '$compile',
        '$templateRequest'
    ];

    function cozenFloatingFeed(CONFIG, $rootScope, CozenThemes, rfc4122, cozenEnhancedLogs, $compile, $templateRequest) {
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
                removeAll   : removeAll
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
                    getMainStyle: getMainStyle
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
                scope._cozenFloatingFeedTimeout      = angular.isDefined(attrs.cozenFloatingFeedTimeout) ? JSON.parse(attrs.cozenFloatingFeedTimeout) : CONFIG.floatingFeed.timeout.time;
                scope._cozenFloatingFeedTimeoutBar   = angular.isDefined(attrs.cozenFloatingFeedTimeoutBar) ? JSON.parse(attrs.cozenFloatingFeedTimeoutBar) : CONFIG.floatingFeed.timeout.bar;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = CozenThemes.getActiveTheme();

                // Watch for events
                $rootScope.$on('cozenFloatingFeedAdd', methods.add);
                $rootScope.$on('cozenFloatingFeedRemoveAll', methods.removeAll);
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

            // Add an alert
            function add($event, alert) {
                if (!Methods.isNullOrEmpty(alert)) {

                    // Check for potential error
                    if (!Methods.hasOwnProperty(alert, 'label')) {
                        cozenEnhancedLogs.error.missingParameterWhen(data.directive, 'label', 'adding alert');
                    }
                    else if (!Methods.hasOwnProperty(alert, 'type')) {
                        cozenEnhancedLogs.error.missingParameterWhen(data.directive, 'type', 'adding alert');
                    }

                    // Add the alert
                    else {
                        alert.addedOn                    = moment().unix();
                        alert.display                    = true;
                        alert.uuid                       = rfc4122.v4();
                        scope._cozenFloatingFeedIconLeft = scope._cozenFloatingFeedIconLeft ? CONFIG.alert.iconLeft[alert.type] : '';

                        // The alert object must be accessible through the scope for the template
                        scope._newAlert = angular.copy(alert);

                        // Convert the template and append the alert
                        $templateRequest('directives/alert/floatingFeed.alert.template.html').then(function (html) {
                            var newAlert = $compile(html)(scope);
                            angular.element(document.getElementById(scope._cozenFloatingFeedId)).append(newAlert);
                        });
                    }
                }
                else {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'alert');
                }
            }

            // Remove all alerts
            function removeAll() {
                $rootScope.$broadcast('cozenAlertHideMatching', 'floating-feed-');
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
 * @param {number} cozenFormId    = uuid > Id of the form
 * @param {string} cozenFormName         > Name of the form [required]
 * @param {string} cozenFormCtrl         > Name of the controller [required]
 * @param {string} cozenFormModel        > Name of the model [required]
 * @param {string} cozenFormClass        > Add custom class
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.form', [])
        .directive('cozenForm', cozenForm);

    cozenForm.$inject = [
        '$rootScope',
        'cozenEnhancedLogs',
        'rfc4122'
    ];

    function cozenForm($rootScope, cozenEnhancedLogs, rfc4122) {
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
                directive: 'cozenForm',
                uuid     : rfc4122.v4()
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
                scope._cozenFormId    = angular.isDefined(attrs.cozenFormId) ? attrs.cozenFormId : data.uuid;
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Name');
                    return true;
                }
                if (Methods.isNullOrEmpty(attrs.cozenFormCtrl)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Ctrl');
                    return true;
                }
                if (Methods.isNullOrEmpty(attrs.cozenFormModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
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
        .module('cozenLib')
        .provider('CozenGoogleAnalytics', CozenGoogleAnalyticsProvider);

    CozenGoogleAnalyticsProvider.$inject = [
        'CONFIG'
    ];

    function CozenGoogleAnalyticsProvider(CONFIG) {

        this.activated = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('activated');
            }
            else {
                CONFIG.googleAnalytics.activated = value;
            }
            return this;
        };

        this.trackerDefaultName = function (value) {
            CONFIG.googleAnalytics.trackerDefaultName = value;
            return this;
        };

        this.cookieDefaultName = function (value) {
            CONFIG.googleAnalytics.cookieDefaultName = value;
            return this;
        };

        this.cookieDefaultDomain = function (value) {
            CONFIG.googleAnalytics.cookieDefaultDomain = value;
            return this;
        };

        this.cookieExpires = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('cookieExpires');
            }
            else {
                CONFIG.googleAnalytics.cookieExpires = value;
            }
            return this;
        };

        this.googleAnalyticsTrackingId = function (value) {
            CONFIG.googleAnalytics.trackingId = value;
            return this;
        };

        this.$get = CozenGoogleAnalytics;

        CozenGoogleAnalytics.$inject = [
            'CONFIG'
        ];

        function CozenGoogleAnalytics(CONFIG) {
            return {
                getGoogleAnalyticsConfig: getGoogleAnalyticsConfig
            };

            function getGoogleAnalyticsConfig() {
                return CONFIG.googleAnalytics;
            }
        }
    }

})(window.angular);
/**
 * @name cozenGoogleAnalyticsRequest
 * @description
 * A service to handle more easily multiple tracker
 * The purpose is to manually trigger which types you want
 * This is not a service for automatic tracking
 *
 * [Hit types]
 * pageview, screenview, event, transaction, item, social, exception, and timing
 *
 */
(function (angular, document) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenGoogleAnalyticsRequest', cozenGoogleAnalyticsRequest);

    cozenGoogleAnalyticsRequest.$inject = [
        'PublicMethods',
        '$location',
        'cozenEnhancedLogs',
        'CONFIG'
    ];

    function cozenGoogleAnalyticsRequest(PublicMethods, $location, cozenEnhancedLogs, CONFIG) {

        // Private data
        var _data = {
            trackerDefaultName : CONFIG.googleAnalytics.trackerDefaultName,
            cookieDefaultName  : CONFIG.googleAnalytics.cookieDefaultName,
            cookieDefaultDomain: CONFIG.googleAnalytics.cookieDefaultDomain,
            cookieExpires      : CONFIG.googleAnalytics.cookieExpires
        };

        return {
            create       : create,
            addCustomData: addCustomData,
            pageView     : pageView,
            event        : event
        };

        /**
         * Create the initial tracking (used to know if the user is new or returning)
         * Also collects information about the device such as screen resolution, viewport size, and document encoding
         * @param {string}  cookieDomain  = auto > none while you are working on localhost, auto otherwise
         * @param {string}  trackerName   = t0   > The name of the GA tracker
         * @param {string}  userId               > The userId
         * @param {boolean} cookieStorage = true > Define if the GA should keep a track of the cookie
         */
        function create(cookieDomain, trackerName, userId, cookieStorage) {
            if (CONFIG.googleAnalytics.activated) {

                // Default values (avoid ES6 shortcuts for cordova)
                if (PublicMethods.isNullOrEmpty(cookieDomain)) {
                    cookieDomain = 'auto';
                }
                if (PublicMethods.isNullOrEmpty(trackerName)) {
                    trackerName = _data.trackerDefaultName;
                }
                cozenEnhancedLogs.info.ga.baseRequest('create', trackerName);

                // Create the tracker
                var tracker = {
                    trackingId   : CONFIG.googleAnalytics.trackingId,
                    name         : trackerName,
                    userId       : userId,
                    cookieName   : _data.cookieDefaultName,
                    cookieDomain : cookieDomain,
                    cookieExpires: _data.cookieExpires
                };

                // Disable the storage if cookieStorage is false
                if (cookieStorage === false) {
                    tracker = angular.merge({}, tracker, {
                        storage: 'none'
                    });
                }
                cozenEnhancedLogs.explodeObject(tracker);

                // Create the tracker
                ga('create', tracker);
            }
        }

        /**
         * Add custom data to the tracker (like dimension or metric)
         * @param {object} customData       > Object of dimension and/or metric
         * @param {string} trackerName = t0 > The name of the GA tracker
         */
        function addCustomData(customData, trackerName) {
            if (CONFIG.googleAnalytics.activated) {

                // Default values
                if (PublicMethods.isNullOrEmpty(trackerName)) {
                    trackerName = _data.trackerDefaultName;
                }
                cozenEnhancedLogs.info.ga.baseRequest('addCustomData', trackerName);
                cozenEnhancedLogs.explodeObject(customData);

                // Update the tracker with custom dimension or metric
                ga(trackerName + '.set', customData);
            }
        }

        /**
         * Send a pageview hit
         * @param {string} trackerName = t0   > The name of the tracker
         * @param {string} pageUrl     = auto > The path portion of a URL. This value should start with a slash (/) character (Default: $location.url())
         * @param {string} title       = auto > The title of the page (Default: document.title)
         */
        function pageView(trackerName, pageUrl, title) {
            if (CONFIG.googleAnalytics.activated) {

                // Default values
                if (PublicMethods.isNullOrEmpty(trackerName)) {
                    trackerName = _data.trackerDefaultName;
                }
                if (PublicMethods.isNullOrEmpty(pageUrl)) {
                    pageUrl = $location.url();
                }
                if (PublicMethods.isNullOrEmpty(title)) {
                    title = document.title;
                }
                enhancedLogs.info.ga.pageView('googleAnalyticsRequest', trackerName, title);

                // Send a pageview hit
                ga(trackerName + '.send', {
                    hitType: 'pageview',
                    page   : pageUrl,
                    title  : title
                });
            }
        }

        /**
         * Send an event hit
         * @param {string} trackerName = t0   > The name of the tracker
         * @param {object} eventObject = auto >
         */
        function event(trackerName, eventObject) {
            if (CONFIG.googleAnalytics.activated) {

                // Default values
                if (PublicMethods.isNullOrEmpty(trackerName)) {
                    trackerName = _data.trackerDefaultName;
                }
                if (PublicMethods.isNullOrEmpty(eventObject)) {
                    cozenEnhancedLogs.error.requiredParameterFn('event', 'eventObject');
                    return;
                }
                cozenEnhancedLogs.info.ga.event('event', trackerName, eventObject);

                // Add the hit type
                eventObject = angular.merge({}, {
                    hitType: 'event'
                }, eventObject);

                // Send a pageview hit
                ga(trackerName + '.send', eventObject);
            }
        }
    }

})(window.angular, window.document);
/**
 * @ngdoc service
 * @name cozenLib.cozenHttp
 * @requires $http
 * @requires CONFIG
 * @requires $q
 * @requires cozenEnhancedLogs
 **/
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenHttp', cozenHttp);

    cozenHttp.$inject = [
        '$http',
        'CONFIG',
        '$q',
        'cozenEnhancedLogs'
    ];

    function cozenHttp($http, CONFIG, $q, cozenEnhancedLogs) {

        return {
            requestGet   : requestGet,
            requestPost  : requestPost,
            requestPut   : requestPut,
            requestCustom: requestCustom
        };

        /**
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestGet
         * @methodOf cozenLib.cozenHttp
         * @description
         * Decorate the http get request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   url             > Suffix added after the CONFIG.api.url
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
         */
        function requestGet(url, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: 'GET',
                url    : CONFIG.api.url + url,
                data   : {
                    session: null,
                    data   : null
                }
            });
            $http.get(CONFIG.api.url + url)
                .then(function (response) {
                    deferred.resolve(response);
                    if (Methods.isFunction(callbackSuccess)) {
                        callbackSuccess(response);
                    }
                })
                .catch(function (response) {
                    deferred.reject(response, 200);
                    if (Methods.isFunction(callbackError)) {
                        callbackError(response);
                    }
                })
            ;
            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestPost
         * @methodOf dsiegisApp.egisHttp
         * @description
         * Decorate the http post request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   url             > Suffix added after the CONFIG.api.url
         * @param {object}   params          > Data for the body of the http request
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
         */
        function requestPost(url, params, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: 'POST',
                url    : CONFIG.api.url + url,
                data   : {
                    session: {},
                    data   : params
                }
            });
            $http.post(CONFIG.api.url + url, {
                data   : params,
                session: {}
            }).then(function (response) {
                deferred.resolve(response);
                if (Methods.isFunction(callbackSuccess)) {
                    callbackSuccess(response);
                }
            }).catch(function (response) {
                deferred.reject(response, 200);
                if (Methods.isFunction(callbackError)) {
                    callbackError(response);
                }
            });
            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestPut
         * @methodOf cozenLib.cozenHttp
         * @description
         * Decorate the http put request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   url             > Suffix added after the CONFIG.api.url
         * @param {object}   params          > Data for the body of the http request
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
         */
        function requestPut(url, params, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: 'PUT',
                url    : CONFIG.api.url + url,
                data   : {
                    session: {},
                    data   : params
                }
            });
            $http.put(CONFIG.api.url + url, {
                data   : params,
                session: {}
            }).then(function (response) {
                deferred.resolve(response);
                if (Methods.isFunction(callbackSuccess)) {
                    callbackSuccess(response);
                }
            }).catch(function (response) {
                deferred.reject(response, 200);
                if (Methods.isFunction(callbackError)) {
                    callbackError(response);
                }
            });
            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestCustom
         * @methodOf cozenLib.cozenHttp
         * @description
         * Decorate a custom http request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   method          > Methods used by the http request (get, post, put...)
         * @param {string}   url             > Full url to work with
         * @param {object}   params          > Data for the body of the http request
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
         */
        function requestCustom(method, url, params, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: method,
                url    : url,
                data   : {
                    session: {},
                    data   : params
                }
            });
            $http({
                methods: method,
                url    : url,
                data   : params,
                session: {}
            }).then(function (response) {
                deferred.resolve(response);
                if (Methods.isFunction(callbackSuccess)) {
                    callbackSuccess();
                }
            }).catch(function (response) {
                deferred.reject(response, 200);
                if (Methods.isFunction(callbackError)) {
                    callbackError();
                }
            });
            return deferred.promise;
        }
    }

}(window.angular));

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
        'CozenThemes',
        'cozenEnhancedLogs'
    ];

    function cozenIconInfo(CozenThemes, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenIconInfoTooltipLabel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
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
 * @param {number}  cozenInputId                                        > Id of the input
 * @param {string}  cozenInputTooltip                                   > Text of the tooltip
 * @param {string}  cozenInputTooltipPlacement = auto right             > Change the position of the tooltip
 * @param {string}  cozenInputTooltipTrigger   = outsideClick           > Type of trigger to show the tooltip
 * @param {boolean} cozenInputRequired         = false                  > Required input
 * @param {boolean} cozenInputErrorDesign      = true                   > Add style when error
 * @param {boolean} cozenInputSuccessDesign    = true                   > Add style when success
 * @param {string}  cozenInputPattern                                   > Pattern HTML5 to check for error
 * @param {string}  cozenInputPatternEmail                              > Shortcut for email pattern
 * @param {string}  cozenInputPatternLetter                             > Shortcut for letter pattern
 * @param {string}  cozenInputPatternName                               > Shortcut for name pattern
 * @param {string}  cozenInputPatternWord                               > Shortcut for word pattern
 * @param {string}  cozenInputPatternWords                              > Shortcut for words pattern
 * @param {string}  cozenInputSize             = normal                 > Size of the button
 * @param {string}  cozenInputSizeSmall                                 > Shortcut for small size
 * @param {string}  cozenInputSizeNormal                                > Shortcut for normal size
 * @param {string}  cozenInputSizeLarge                                 > Shortcut for large size
 * @param {string}  cozenInputPrefix                                    > Add a prefix
 * @param {string}  cozenInputSuffix                                    > Add a suffix
 * @param {string}  cozenInputType             = text                   > Type of the input
 * @param {string}  cozenInputTypeText                                  > Shortcut for text type
 * @param {string}  cozenInputTypeNumber                                > Shortcut for number type
 * @param {string}  cozenInputTypePassword                              > Shortcut for password type
 * @param {string}  cozenInputPlaceholder                               > Text for the placeholder
 * @param {number}  cozenInputMin              = 0                      > Minimum length
 * @param {number}  cozenInputMax              = 1000                   > Maximum length
 * @param {number}  cozenInputMinLength        = 0                      > Minimum char length
 * @param {number}  cozenInputMaxLength        = 100                    > Maximum char length
 * @param {string}  cozenInputIconLeft                                  > Text for the icon left (font)
 * @param {string}  cozenInputIconRight                                 > Text for the icon right (font)
 * @param {string}  cozenInputName             = uuid                   > Name of the input
 * @param {boolean} cozenInputValidator        = dirty                  > Define after what type of event the input must add more ui color
 * @param {boolean} cozenInputValidatorAll                              > Shortcut for all type
 * @param {boolean} cozenInputValidatorTouched                          > Shortcut for touched type
 * @param {boolean} cozenInputValidatorDirty                            > Shortcut for dirty type
 * @param {boolean} cozenInputValidatorEmpty   = true                   > Display ui color even if input empty
 * @param {boolean} cozenInputValidatorIcon    = true                   > Add (and change) the icon right if success/error
 * @param {string}  cozenInputAutoComplete     = on                     > Allow auto complete (on/off)
 * @param {string}  cozenInputLabel                                     > Add a label on the top of the input
 * @param {string}  cozenInputRequiredTooltip  = input_required_tooltip > Text to display for the tooltip of the required element
 * @param {string}  cozenInputClass                                     > Additional class
 * @param {string}  cozenInputSpellCheck       = false                  > Disable the spell checking
 * @param {string}  cozenInputModelLengthType  = always                 > Show the number of char to match the length (always, never, focus) [config.json]
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
        'CozenThemes',
        'CONFIG',
        'rfc4122',
        '$timeout',
        '$interval',
        '$filter',
        '$rootScope',
        'cozenEnhancedLogs'
    ];

    function cozenInput(CozenThemes, CONFIG, rfc4122, $timeout, $interval, $filter, $rootScope, cozenEnhancedLogs) {
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
                scope._cozenInputId               = angular.isDefined(attrs.cozenInputId) ? attrs.cozenInputId : '';
                scope._cozenInputTooltip          = angular.isDefined(attrs.cozenInputTooltip) ? attrs.cozenInputTooltip : '';
                scope._cozenInputTooltipTrigger   = angular.isDefined(attrs.cozenInputTooltipTrigger) ? attrs.cozenInputTooltipTrigger : 'outsideClick';
                scope._cozenInputRequired         = angular.isDefined(attrs.cozenInputRequired) ? JSON.parse(attrs.cozenInputRequired) : false;
                scope._cozenInputErrorDesign      = angular.isDefined(attrs.cozenInputErrorDesign) ? JSON.parse(attrs.cozenInputErrorDesign) : true;
                scope._cozenInputSuccessDesign    = angular.isDefined(attrs.cozenInputSuccessDesign) ? JSON.parse(attrs.cozenInputSuccessDesign) : true;
                scope._cozenInputPrefix           = angular.isDefined(attrs.cozenInputPrefix) ? attrs.cozenInputPrefix : '';
                scope._cozenInputSuffix           = angular.isDefined(attrs.cozenInputSuffix) ? attrs.cozenInputSuffix : '';
                scope._cozenInputPlaceholder      = angular.isDefined(attrs.cozenInputPlaceholder) ? attrs.cozenInputPlaceholder : '';
                scope._cozenInputMin              = angular.isDefined(attrs.cozenInputMin) ? JSON.parse(attrs.cozenInputMin) : 0;
                scope._cozenInputMax              = angular.isDefined(attrs.cozenInputMax) ? JSON.parse(attrs.cozenInputMax) : 1000;
                scope._cozenInputMinLength        = angular.isDefined(attrs.cozenInputMinLength) ? JSON.parse(attrs.cozenInputMinLength) : 0;
                scope._cozenInputMaxLength        = angular.isDefined(attrs.cozenInputMaxLength) ? JSON.parse(attrs.cozenInputMaxLength) : 100;
                scope._cozenInputIconLeft         = angular.isDefined(attrs.cozenInputIconLeft) ? attrs.cozenInputIconLeft : '';
                scope._cozenInputIconRight        = angular.isDefined(attrs.cozenInputIconRight) ? attrs.cozenInputIconRight : '';
                scope._cozenInputName             = angular.isDefined(attrs.cozenInputName) ? attrs.cozenInputName : data.uuid;
                scope._cozenInputValidatorEmpty   = angular.isDefined(attrs.cozenInputValidatorEmpty) ? JSON.parse(attrs.cozenInputValidatorEmpty) : true;
                scope._cozenInputValidatorIcon    = angular.isDefined(attrs.cozenInputValidatorIcon) ? JSON.parse(attrs.cozenInputValidatorIcon) : true;
                scope._cozenInputTooltipType      = scope._cozenInputType == 'password' ? 'html' : 'default';
                scope._cozenInputAutoComplete     = angular.isDefined(attrs.cozenInputAutoComplete) ? attrs.cozenInputAutoComplete : 'on';
                scope._cozenInputTooltipPlacement = angular.isDefined(attrs.cozenInputTooltipPlacement) ? attrs.cozenInputTooltipPlacement : 'auto right';
                scope._cozenInputLabel            = angular.isDefined(attrs.cozenInputLabel) ? attrs.cozenInputLabel : '';
                scope._cozenInputUuid             = data.uuid;
                scope._cozenInputModelLengthType  = angular.isDefined(attrs.cozenInputModelLengthType) ? attrs.cozenInputModelLengthType : CONFIG.input.modelLengthType;
                scope._cozenInputModelLength      = scope._cozenInputMaxLength;
                scope._cozenInputRequiredConfig   = CONFIG.required;
                scope._cozenInputRequiredTooltip  = angular.isDefined(attrs.cozenInputRequiredTooltip) ? attrs.cozenInputRequiredTooltip : 'input_required_tooltip';
                scope._cozenInputSpellCheck       = angular.isDefined(attrs.cozenInputSpellCheck) ? JSON.parse(attrs.cozenInputSpellCheck) : false;

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
                scope._activeTheme = CozenThemes.getActiveTheme();

                // When the user use the lazy load data generator from a preBuild service, set dirty and touched
                scope.$on('cozenLazyLoadDataGenerated', function ($event, data) {
                    if (scope._cozenInputForm == data.cozenFormName) {
                        var form  = methods.getForm();
                        var input = form[scope._cozenInputFormCtrl][scope._cozenInputFormModel][scope._cozenInputForm];
                        if (!Methods.isNullOrEmpty(input)) {
                            input = input[scope._cozenInputName];
                            if (!Methods.isNullOrEmpty(input)) {
                                input.$setDirty();
                                input.$setTouched();
                            }
                        }
                    }
                });

                // Override the default model
                scope.vm.cozenInputModel = angular.copy(scope._cozenInputPrefix + (Methods.isNullOrEmpty(scope.vm.cozenInputModel) ? '' : scope.vm.cozenInputModel) + scope._cozenInputSuffix);

                // When the form is ready, get the required intel
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
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
                    try {
                        scope.vm.cozenInputModel = parseInt(scope.vm.cozenInputModel);
                        if (typeof scope.vm.cozenInputModel != 'number') {
                            scope.vm.cozenInputModel = scope._cozenInputMin;
                        }
                    } catch (e) {
                        scope.vm.cozenInputModel = scope._cozenInputMin;
                    }
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
                if (Methods.isNullOrEmpty(scope.vm.cozenInputModel)) {
                    scope._cozenInputModelLength = 0;
                }
                else {
                    scope._cozenInputModelLength = scope._cozenInputMaxLength - scope.vm.cozenInputModel.length;
                }
            }
        }
    }

    cozenInputCtrl.$inject = [];

    function cozenInputCtrl() {
        var vm = this;
    }

})(window.angular);



/**
 * @name cozenJsToPdf
 * @description
 * A factory used to help the drawing of a jsPDF document
 * It helps to make easier pdf and avoid error
 * Of course, if you have a specific need, you can combine the stuff from jsPDF with this factory
 * You can have multiple instance at a time
 *
 * [Example steps]
 * Start by calling the init() function
 * Then call drawing functions as much as you want
 * Ex: drawTitle() drawTitle() drawText() drawTitle()...
 * Finally, print your document with print() function
 *
 * [Reminders]
 * Paper size points A4: 595x842
 * For more info: https://www.gnu.org/software/gv/manual/html_node/Paper-Keywords-and-paper-size-in-points.html
 *
 * jsPDF documentation: http://rawgit.com/MrRio/jsPDF/master/docs/
 * getStringUnitWidth * fontSize => return the width of a string (points)
 * setTextColor(r, g, b)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenJsToPdf', cozenJsToPdf);

    cozenJsToPdf.$inject = [
        'cozenEnhancedLogs'
    ];

    function cozenJsToPdf(cozenEnhancedLogs) {

        // Default configuration (could be override by init styles param)
        var defaultConfig = {
            pdfName : 'generated-pdf',
            title   : {
                size  : 40,
                family: 'courier',
                weight: 'bold',
                color : {
                    r: 26,
                    g: 188,
                    b: 156
                }
            },
            subtitle: {
                size  : 30,
                family: 'courier',
                weight: 'normal',
                color : {
                    r: 231,
                    g: 76,
                    b: 60
                }
            },
            text    : {
                size  : 16,
                family: 'courier',
                weight: 'normal',
                color : {
                    r: 155,
                    g: 89,
                    b: 182
                }
            }
        };

        // Internal functions
        var methods = {
            areParamsSet: areParamsSet,
            rgbToDecimal: rgbToDecimal,
            hexToRgb    : hexToRgb
        };

        // Public functions
        return {
            init           : init,
            drawTitle      : drawTitle,
            drawText       : drawText,
            drawImage      : drawImage,
            print          : print,
            setTextStyle   : setTextStyle,
            setFillColor   : setFillColor,
            getStringWidth : getStringWidth,
            getRowsQuantity: getRowsQuantity,
            explodeString  : explodeString,
            svgToBase64    : svgToBase64,
            svgToBase64Svg : svgToBase64Svg,
            setTextColor   : setTextColor
        };

        /**
         * Init a jsPDF doc
         * @param {object} config > Configuration for the jsPDF (see the jsPDF doc for that)
         * @param {object} styles > Override the configuration styles (merge)
         * @returns {object} jsPDF
         */
        function init(config, styles) {
            var doc           = new jsPDF(config);
            doc.jsToPdfConfig = angular.merge({}, defaultConfig, styles);
            return doc;
        }

        /**
         * Draw a title
         * @param {object} doc        > jsPDF document to work with [required]
         * @param {string|array} text > Text to display [required]
         * @param {number} x          > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y          > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @returns {object} jsPDF
         */
        function drawTitle(doc, text, x, y) {
            if (!methods.areParamsSet(doc, text, x, y)) {
                cozenEnhancedLogs.errorMissingParameterFn('drawTitle');
                return doc;
            }
            doc = setTextStyle(doc, doc.jsToPdfConfig.title.size, doc.jsToPdfConfig.title.family, doc.jsToPdfConfig.title.weight);
            doc.setTextColor(doc.jsToPdfConfig.title.color.r, doc.jsToPdfConfig.title.color.g, doc.jsToPdfConfig.title.color.b);
            doc.text(text, x, y);
            return doc;
        }

        /**
         * Draw a subtitle
         * @param {object} doc        > jsPDF document to work with [required]
         * @param {string|array} text > Text to display [required]
         * @param {number} x          > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y          > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @returns {object} jsPDF
         */
        function drawSubTitle(doc, text, x, y) {
            if (!methods.areParamsSet(doc, text, x, y)) {
                cozenEnhancedLogs.errorMissingParameterFn('drawSubTitle');
                return doc;
            }
            doc = setTextStyle(doc, doc.jsToPdfConfig.subtitle.size, doc.jsToPdfConfig.subtitle.family, doc.jsToPdfConfig.subtitle.weight);
            doc.setTextColor(doc.jsToPdfConfig.subtitle.color.r, doc.jsToPdfConfig.subtitle.color.g, doc.jsToPdfConfig.subtitle.color.b);
            doc.text(text, x, y);
            return doc;
        }

        /**
         * Draw a text
         * @param {object} doc        > jsPDF document to work with [required]
         * @param {string|array} text > Text to display [required]
         * @param {number} x          > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y          > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @returns {object} jsPDF
         */
        function drawText(doc, text, x, y) {
            if (!methods.areParamsSet(doc, text, x, y)) {
                cozenEnhancedLogs.errorMissingParameterFn('drawText');
                return doc;
            }
            doc.text(text, x, y);
            return doc;
        }

        /**
         * Draw an image
         * @param {object} doc              > jsPDF document to work with [required]
         * @param {string} imageData        > Image as data url [required]
         * @param {number} x                > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y                > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @param {number} width            > Width of the image [required]
         * @param {number} height           > Height of the image [required]
         * @param {string} type      = JPEG > Format of the image
         * @returns {object} jsPDF
         */
        function drawImage(doc, imageData, x, y, width, height, type) {
            if (!methods.areParamsSet(doc, imageData, x, y, width, height)) {
                cozenEnhancedLogs.errorMissingParameterFn('drawImage');
                return doc;
            }
            type = Methods.isNullOrEmpty(type) ? 'JPEG' : type;
            doc.addImage(imageData, type, x, y, width, height);
            return doc;
        }

        /**
         * Print the document
         * @param {object} doc > jsPDF document to work with [required]
         * @returns {object} jsPDF
         */
        function print(doc) {
            if (!methods.areParamsSet(doc)) {
                cozenEnhancedLogs.errorMissingParameterFn('print');
                return doc;
            }
            doc.save(doc.jsToPdfConfig.pdfName + '.pdf');
            return doc;
        }

        /**
         * Define the text style
         * @param {object} doc                > jsPDF document to work with [required]
         * @param {number} size   = 20        > Font size
         * @param {string} family = helvetica > Font family (helvetica, courier, times...)
         * @param {string} style  = normal    > Font style
         * @returns {object} jsPDF
         */
        function setTextStyle(doc, size, family, style) {
            if (!methods.areParamsSet(doc)) {
                cozenEnhancedLogs.errorMissingParameterFn('setTextStyle');
                return doc;
            }
            size   = Methods.isNullOrEmpty(size) ? 20 : size;
            family = Methods.isNullOrEmpty(family) ? 'helvetica' : family;
            style  = Methods.isNullOrEmpty(style) ? 'normal' : style;
            doc.setFontSize(size);
            doc.setFont(family, style);
            return doc;
        }

        /**
         * Define the color of the text (RGB or CMYK)
         * @param {object} doc            > jsPDF document to work with [required]
         * @param {number|string} ch1 = 0 > R/C from color format
         * @param {number|string} ch2 = 0 > G/M from color format
         * @param {number|string} ch3 = 0 > B/Y from color format
         * @param {number|string} ch4 = 1 > K from color format
         * @returns {object} jsPDF
         */
        function setFillColor(doc, ch1, ch2, ch3, ch4) {
            if (!methods.areParamsSet(doc)) {
                cozenEnhancedLogs.errorMissingParameterFn('setFillColor');
                return doc;
            }
            ch1 = Methods.isNullOrEmpty(ch1) ? 0 : ch1;
            ch2 = Methods.isNullOrEmpty(ch2) ? 0 : ch2;
            ch3 = Methods.isNullOrEmpty(ch3) ? 0 : ch3;
            ch4 = Methods.isNullOrEmpty(ch4) ? 1 : ch4;
            if (arguments.length <= 4) {
                for (var i = 1, length = 4; i < length; i++) {
                    arguments[i] = methods.rgbToDecimal(arguments[i]);
                }
                doc.setFillColor(ch1, ch2, ch3);
            }
            else {
                doc.setFillColor(ch1, ch2, ch3, ch4);
            }
            return doc;
        }

        /**
         * Return the width of a string
         * @param {object} doc           > jsPDF document to work with [required]
         * @param {string} text          > Text to work with [required]
         * @param {number} fontSize      > Font size [required]
         * @param {string} unit     = pt > The unit used with this doc
         * @returns {number}
         */
        function getStringWidth(doc, text, fontSize, unit) {
            if (!methods.areParamsSet(doc, text, fontSize)) {
                cozenEnhancedLogs.errorMissingParameterFn('getStringWidth');
                return 0;
            }
            unit = Methods.isNullOrEmpty(unit) ? 'pt' : unit;
            switch (unit) {
                case 'pt':
                    return parseInt((doc.getStringUnitWidth(text) * fontSize).toFixed(0));
            }
        }

        /**
         * Return the number of rows for a text
         * @param {object} doc           > jsPDF document to work with [required]
         * @param {number} rowWidth      > Width of a row [required]
         * @param {string} text          > Text to work with [required]
         * @param {number} fontSize      > Font size [required]
         * @param {string} unit     = pt > The unit used with this doc
         * @returns {number}
         */
        function getRowsQuantity(doc, rowWidth, text, fontSize, unit) {
            if (!methods.areParamsSet(doc, rowWidth, text, fontSize)) {
                cozenEnhancedLogs.errorMissingParameterFn('getRowsQuantity');
                return 0;
            }
            unit = Methods.isNullOrEmpty(unit) ? 'pt' : unit;
            switch (unit) {
                case 'pt':
                    var stringWidth = getStringWidth(doc, text, fontSize, unit);
                    return Math.ceil(stringWidth / rowWidth);
            }
        }

        /**
         * Explode a string into array if the limit of chars is detected
         * @param {string} text     > Text to work with [required]
         * @param {string} maxChars > Number of chars as delimiter [required]
         * @returns {Array} array of strings
         */
        function explodeString(text, maxChars) {
            if (!methods.areParamsSet(text, maxChars)) {
                cozenEnhancedLogs.errorMissingParameterFn('explodeString');
                return [];
            }
            var chunks = [];
            for (var i = 0, charsLength = text.length; i < charsLength; i += maxChars) {
                chunks.push(text.substring(i, i + maxChars));
            }
            return chunks;
        }

        /**
         * Convert the SVG to a base64 string
         * @param {string}   parentDomId > Id of the parent of the parent [required]
         * @param {canvas}   canvas      > Canvas to work with [required]
         * @param {function} callback    > Callback to get the base64 string => canvas.toDataURL() [required]
         */
        function svgToBase64(parentDomId, canvas, callback) {
            if (!methods.areParamsSet(parentDomId, canvas, callback)) {
                cozenEnhancedLogs.errorMissingParameterFn('svgToBase64');
                return;
            }
            var svg       = angular.element(document.querySelector('#' + parentDomId + ' svg'));
            var svg_xml   = (new XMLSerializer()).serializeToString(svg[0]);
            var img       = new Image();
            var ctx       = canvas.getContext('2d');
            canvas.height = svg[0].getBoundingClientRect().height;
            canvas.width  = svg[0].getBoundingClientRect().width;
            img.onload    = function () {
                ctx.drawImage(img, 0, 0);
                callback();
            };
            img.src       = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg_xml)));
        }

        /**
         * Convert the SVG to a base64 svg+xml string
         * @param {string} parentDomId > Id of the parent of the parent [required]
         * @returns {string}
         */
        function svgToBase64Svg(parentDomId) {
            if (!methods.areParamsSet(parentDomId)) {
                cozenEnhancedLogs.errorMissingParameterFn('svgToDataUrl');
                return '';
            }
            var svg     = angular.element(document.querySelector('#' + parentDomId + ' svg'));
            var svg_xml = (new XMLSerializer()).serializeToString(svg[0]);
            return 'data:image/svg+xml;base64,' + window.btoa(svg_xml);
        }

        /**
         * Set the color of the text (three ways)
         * @param {object}              doc > jsPDF document to work with [required]
         * @param {number|array|string} r   > Red color or array of color ([r, g b]) or hexadecimal (short/long) [required]
         * @param {number}              g   > Green color
         * @param {number}              b   > Blue color
         * @returns {object} jsPDF
         */
        function setTextColor(doc, r, g, b) {
            if (!methods.areParamsSet(doc, r)) {
                cozenEnhancedLogs.errorMissingParameterFn('setTextColor');
                return doc;
            }
            if (methods.hexToRgb(r)) {
                r = methods.hexToRgb(r);
            }
            if (Array.isArray(r) && r.length == 3) {
                doc.setTextColor(r[0], r[1], r[2]);
            }
            else if (arguments.length == 4) {
                doc.setTextColor(r, g, b);
            }

            return doc;
        }

        /////////// INTERNAL FUNCTIONS ///////////

        /**
         * Check if arguments are set
         * @returns {boolean}
         */
        function areParamsSet() {
            for (var i = 0, length = arguments.length; i < length; i++) {
                if (arguments[i] == null) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Convert RGB unit to decimal (0 to 1)
         * @param {number} value > Value to convert [required]
         * @returns {number}
         */
        function rgbToDecimal(value) {
            if (!methods.areParamsSet(value)) {
                cozenEnhancedLogs.errorMissingParameterFn('rgbToDecimal');
                return 0;
            }
            if (typeof value == 'number' && value > 1) {
                value = value / 255;
            }
            return value;
        }

        /**
         * Convert an hexadecimal color to rgb (could be a shortcut)
         * @param {string} hex > Color of type hexadecimal [required]
         * @returns {Array|boolean} rgb or false
         */
        function hexToRgb(hex) {
            if (!methods.areParamsSet(hex)) {
                cozenEnhancedLogs.errorMissingParameterFn('hexToRgb');
                return false;
            }
            var color;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                color = hex.substring(1).split('');
                if (color.length == 3) {
                    color = [
                        color[0],
                        color[0],
                        color[1],
                        color[1],
                        color[2],
                        color[2]
                    ];
                }
                color = '0x' + color.join('');
                return [
                    (color >> 16) & 255,
                    (color >> 8) & 255,
                    color & 255
                ];
            }
            return false;
        }
    }

})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenLanguage', cozenLanguage);

    cozenLanguage.$inject = [
        'CONFIG',
        'cozenEnhancedLogs',
        '$translate',
        'tmhDynamicLocale'
    ];

    function cozenLanguage(CONFIG, cozenEnhancedLogs, $translate, tmhDynamicLocale) {
        return {
            getCurrentLanguage   : getCurrentLanguage,
            updateCurrentLanguage: updateCurrentLanguage,
            getAvailableLanguages: getAvailableLanguages,
            isLanguageAvailable  : isLanguageAvailable,
            getExtendedLabel     : getExtendedLabel
        };

        /**
         * Return the current language
         * @return {string}
         */
        function getCurrentLanguage() {
            if (CONFIG.dev) {
                cozenEnhancedLogs.info.customMessageEnhanced('cozenLanguage', 'The current language is', CONFIG.currentLanguage);
            }
            return CONFIG.currentLanguage;
        }

        /**
         * Update the current language
         * This will update the provider used by the cozen-lib to handle the new lang
         * @param {string} language > Key that correspond to the new language (e.g: en)
         */
        function updateCurrentLanguage(language) {
            if (isLanguageAvailable(language)) {
                CONFIG.currentLanguage = language;
                $translate.use(CONFIG.currentLanguage);
                tmhDynamicLocale.set(CONFIG.currentLanguage);
                moment.locale(CONFIG.currentLanguage);
                cozenEnhancedLogs.info.customMessageEnhanced('cozenLanguage', 'The new active language is', CONFIG.currentLanguage);
            }
            else {
                cozenEnhancedLogs.error.valueNotInList('updateCurrentLanguage', language, CONFIG.currentLanguage);
            }
        }

        /**
         * Return the list of available languages (e.g: [fr, en, ...]
         * @param {boolean} verbose = false > If set to true, the list return is an array of objects (e.g: {key: fr, label: Français}
         * @return {Array} Array of string or objects depending of verbose mod
         */
        function getAvailableLanguages(verbose) {
            var languages = [];
            if (verbose) {
                CONFIG.languages.forEach(function (language, index) {
                    languages.push({
                        key    : language,
                        label  : CONFIG.languagesExtended[index],
                        current: language == CONFIG.currentLanguage
                    });
                });
            }
            else {
                languages = CONFIG.languages;
            }
            if (CONFIG.dev) {
                cozenEnhancedLogs.info.functionCalled('cozenLanguage', 'getAvailableLanguages');
                cozenEnhancedLogs.explodeObject(languages);
            }
            return languages;
        }

        /**
         * Check if the language is available (in the list of languages from the config)
         * @param {string} language > Key that correspond to the new language (e.g: en)
         * @return {boolean}
         */
        function isLanguageAvailable(language) {
            return Methods.isInList(CONFIG.languages, language);
        }

        /**
         * Return the extended version of a language key (e.g: fr return Français)
         * @param {string} language > Key that correspond to the new language (e.g: en)
         * @return {string}
         */
        function getExtendedLabel(language) {
            if (isLanguageAvailable(language)) {
                for (var i = 0, length = CONFIG.languages.length; i < length; i++) {
                    if (CONFIG.languages[i] == language) {
                        return CONFIG.languagesExtended[i];
                    }
                }
            }
            else {
                cozenEnhancedLogs.error.valueNotInList('getExtendedLabel', language, CONFIG.currentLanguage);
                return language;
            }
        }
    }

})(window.angular);


(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.constant', [])
        .constant('cozenLazyLoadConstant', {
            last       : {
                lastName   : 'O\'Connor',
                firstName  : 'Cozen',
                email      : 'cozen.oconnor@cozen.com',
                gender     : null,
                nationality: null,
                domain     : null,
                length     : null,
                syllables  : null,
                word       : null,
                prefix     : null,
                birthday   : '16/4/1994',
                words      : null,
                avatar     : 'https://2.gravatar.com/avatar/8ffac0953a8cbb1555386654e45266a6'
            },
            cozenChance: new Chance()
        });

})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.internalService', [])
        .factory('cozenLazyLoadInternal', cozenLazyLoadInternal);

    cozenLazyLoadInternal.$inject = [
        'CONFIG',
        'cozenLazyLoadConstant',
        'cozenEnhancedLogs',
        '$rootScope',
        '$timeout'
    ];

    function cozenLazyLoadInternal(CONFIG, cozenLazyLoadConstant, cozenEnhancedLogs, $rootScope, $timeout) {
        return {
            sendBroadcastForm    : sendBroadcastForm,
            sendBroadcastBtnClick: sendBroadcastBtnClick,
            getLastLastName      : getLastLastName,
            getLastFirstName     : getLastFirstName,
            getLastEmail         : getLastEmail,
            getLastGender        : getLastGender,
            getLastNationality   : getLastNationality,
            getLastDomain        : getLastDomain,
            getLastLength        : getLastLength,
            getLastSyllables     : getLastSyllables,
            getLastWord          : getLastWord,
            getLastPrefix        : getLastPrefix,
            getLastWords         : getLastWords,
            getLastBirthday      : getLastBirthday,
            getLastAvatar        : getLastAvatar
        };

        /// INTERNAL METHODS ///

        function sendBroadcastForm(cozenFormName) {
            if (!Methods.isNullOrEmpty(cozenFormName)) {
                cozenEnhancedLogs.info.broadcastEvent('sendBroadcastForm', 'cozenLazyLoadDataGenerated');
                $rootScope.$broadcast('cozenLazyLoadDataGenerated', {
                    cozenFormName: cozenFormName
                });
            }
        }

        function sendBroadcastBtnClick(cozenBtnId, cozenFormName) {
            if (!Methods.isNullOrEmpty(cozenFormName)) {
                sendBroadcastForm(cozenFormName);
            }
            if (!Methods.isNullOrEmpty(cozenBtnId)) {
                cozenEnhancedLogs.info.broadcastEvent('sendBroadcastBtnClick', 'cozenBtnFakeClick');
                $timeout(function () {
                    $rootScope.$broadcast('cozenBtnFakeClick', {
                        cozenBtnId: cozenBtnId
                    });
                });
            }
        }

        function getLastLastName() {
            return cozenLazyLoadConstant.last.lastName;
        }

        function getLastFirstName() {
            return cozenLazyLoadConstant.last.firstName;
        }

        function getLastEmail() {
            return cozenLazyLoadConstant.last.email;
        }

        /// INTERNAL METHODS WITH DEFAULT VALUES ON CONFIG ///

        function getLastGender() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.gender)) {
                cozenLazyLoadConstant.last.gender = CONFIG.btnLazyTest.service.gender;
            }
            return cozenLazyLoadConstant.last.gender;
        }

        function getLastNationality() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.lang)) {
                cozenLazyLoadConstant.last.lang = CONFIG.btnLazyTest.service.lang;
            }
            return cozenLazyLoadConstant.last.lang;
        }

        function getLastDomain() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.domain)) {
                cozenLazyLoadConstant.last.domain = CONFIG.btnLazyTest.service.domain;
            }
            return cozenLazyLoadConstant.last.domain;
        }

        function getLastLength() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.length)) {
                cozenLazyLoadConstant.last.length = CONFIG.btnLazyTest.service.length;
            }
            return cozenLazyLoadConstant.last.length;
        }

        function getLastSyllables() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.syllables)) {
                cozenLazyLoadConstant.last.syllables = CONFIG.btnLazyTest.service.syllables;
            }
            return cozenLazyLoadConstant.last.syllables;
        }

        function getLastWord() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.word)) {
                cozenLazyLoadConstant.last.word = CONFIG.btnLazyTest.service.word;
            }
            return cozenLazyLoadConstant.last.word;
        }

        function getLastPrefix() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.prefix)) {
                cozenLazyLoadConstant.last.prefix = CONFIG.btnLazyTest.service.prefix;
            }
            return cozenLazyLoadConstant.last.prefix;
        }

        function getLastWords() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.words)) {
                cozenLazyLoadConstant.last.words = CONFIG.btnLazyTest.service.words;
            }
            return cozenLazyLoadConstant.last.words;
        }

        function getLastBirthday() {
            return cozenLazyLoadConstant.last.birthday;
        }

        function getLastAvatar() {
            return cozenLazyLoadConstant.last.avatar;
        }
    }

})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.memoryService', [])
        .factory('cozenLazyLoadMemory', cozenLazyLoadMemory);

    cozenLazyLoadMemory.$inject = [
        'cozenLazyLoadConstant',
        'cozenLazyLoadInternal',
        'cozenEnhancedLogs'
    ];

    function cozenLazyLoadMemory(cozenLazyLoadConstant, cozenLazyLoadInternal, cozenEnhancedLogs) {
        return {
            getMemoryEmail: getMemoryEmail
        };

        /// MEMORY METHODS (use saved data) ///

        /**
         * Return an email address as <firstname.lastname@domain> by fetching the last data available
         * @returns {string} email address
         */
        function getMemoryEmail() {
            var firstName                    = cozenLazyLoadInternal.getLastFirstName();
            var lastName                     = cozenLazyLoadInternal.getLastLastName();
            var domain                       = cozenLazyLoadInternal.getLastDomain();
            cozenLazyLoadConstant.last.email = (firstName + '.' + lastName + '@' + domain).toLowerCase();
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadMemory', 'getMemoryEmail', cozenLazyLoadConstant.last.email);
            return cozenLazyLoadConstant.last.email;
        }
    }

})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad', [
            'cozenLib.lazyLoad.constant',
            'cozenLib.lazyLoad.internalService',
            'cozenLib.lazyLoad.memoryService',
            'cozenLib.lazyLoad.preBuildService',
            'cozenLib.lazyLoad.randomService'
        ]);

})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.preBuildService', [])
        .factory('cozenLazyLoadPreBuild', cozenLazyLoadPreBuild);

    cozenLazyLoadPreBuild.$inject = [
        'cozenLazyLoadInternal',
        'cozenLazyLoadConstant',
        'cozenLazyLoadRandom',
        'cozenLazyLoadMemory',
        'cozenEnhancedLogs',
        '$filter',
        'CONFIG'
    ];

    function cozenLazyLoadPreBuild(cozenLazyLoadInternal, cozenLazyLoadConstant, cozenLazyLoadRandom, cozenLazyLoadMemory,
                                   cozenEnhancedLogs, $filter, CONFIG) {
        return {
            getPreBuildSimpleUser: getPreBuildSimpleUser
        };

        /// PRE BUILD METHODS (use other services to create ready to be used objects) ///

        /**
         * Return a simple user object with most common keys required for a register
         * @param {string} cozenFormName        > If set, a broadcast message will be send to force the touch and dirty on form's elements
         * @param {string} cozenBtnId           > If set, a broadcast message will be send to the button to simulate a click (usually, the submit one)
         * @param {string} gender        = male > Define the gender (male, female) [config.json]
         * @param {string} nationality   = en   > Define the lang (en, it) [config.json]
         * @return {object} firstName, lastName, email, username
         */
        function getPreBuildSimpleUser(cozenFormName, cozenBtnId, gender, nationality) {

            // Override the arguments if necessary
            if (Methods.isNullOrEmpty(gender)) {
                gender = cozenLazyLoadRandom.getRandomGender();
            }
            cozenLazyLoadConstant.last.gender = gender;
            if (Methods.isNullOrEmpty(nationality)) {
                nationality = cozenLazyLoadRandom.getRandomNationality();
            }
            cozenLazyLoadConstant.last.nationality = nationality;

            // Log
            cozenLazyLoadRandom.getRandomDomain();
            var _firstName      = cozenLazyLoadRandom.getRandomFirstName(gender, nationality);
            var _lastName       = cozenLazyLoadRandom.getRandomLastName(nationality);
            var _prefix         = cozenLazyLoadRandom.getRandomNamePrefix(gender, true);
            var _usernameLength = Methods.getRandomFromRange(2, 14);
            var simpleUser      = {
                firstName    : _firstName,
                lastName     : _lastName,
                fullName     : _firstName + ' ' + _lastName,
                prefix       : _prefix,
                email        : cozenLazyLoadMemory.getMemoryEmail(),
                username     : $filter('cozenCapitalize')(cozenLazyLoadRandom.getRandomWord(_usernameLength, true, true)),
                gender       : gender,
                nationality  : nationality,
                password     : CONFIG.btnLazyTest.service.password,
                checkPassword: CONFIG.btnLazyTest.service.password,
                birthday     : cozenLazyLoadRandom.getRandomBirthday(false, true)
            };
            cozenEnhancedLogs.info.lazyLoadLogObject('cozenLazyLoadPreBuild', 'getPreBuildSimpleUser', simpleUser);
            cozenLazyLoadInternal.sendBroadcastForm(cozenFormName);
            cozenLazyLoadInternal.sendBroadcastBtnClick(cozenBtnId);

            // Return the simple user object
            return simpleUser;
        }
    }

})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('CozenLazyLoad', CozenLazyLoadProvider);

    CozenLazyLoadProvider.$inject = [
        'CONFIG'
    ];

    function CozenLazyLoadProvider(CONFIG) {

        this.log = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('btnLazyTestLog');
            }
            else {
                CONFIG.btnLazyTest.log = value;
            }
            return this;
        };

        this.iconClass = function (value) {
            CONFIG.btnLazyTest.icon.class = value;
            return this;
        };

        this.positionTop = function (value) {
            CONFIG.btnLazyTest.position.top = value;
            return this;
        };

        this.positionLeft = function (value) {
            CONFIG.btnLazyTest.position.left = value;
            return this;
        };

        this.serviceLang = function (value) {
            var list = [
                'en',
                'it'
            ];
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('serviceLang', list);
            }
            else {
                CONFIG.btnLazyTest.service.lang = value;
            }
            return this;
        };

        this.serviceMale = function (value) {
            var list = [
                'male',
                'female'
            ];
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('serviceMale', list);
            }
            else {
                CONFIG.btnLazyTest.service.male = value;
            }
            return this;
        };

        this.serviceDomain = function (value) {
            CONFIG.btnLazyTest.service.domain = value;
            return this;
        };

        this.serviceLength = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('serviceLength');
            }
            else {
                CONFIG.btnLazyTest.service.length = value;
            }
            return this;
        };

        this.serviceSyllables = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('serviceSyllables');
            }
            else {
                CONFIG.btnLazyTest.service.syllables = value;
            }
            return this;
        };

        this.serviceWord = function (value) {
            CONFIG.btnLazyTest.service.word = value;
            return this;
        };

        this.servicePrefix = function (value) {
            CONFIG.btnLazyTest.service.prefix = value;
            return this;
        };

        this.servicePassword = function (value) {
            CONFIG.btnLazyTest.service.password = value;
            return this;
        };

        this.serviceWords = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('serviceWords');
            }
            else {
                CONFIG.btnLazyTest.service.words = value;
            }
            return this;
        };

        this.$get = CozenLazyLoad;

        CozenLazyLoad.$inject = [
            'CONFIG'
        ];

        function CozenLazyLoad(CONFIG) {
            return {
                getCozenLazyLoadConfig: getCozenLazyLoadConfig
            };

            function getCozenLazyLoadConfig() {
                return CONFIG.btnLazyTest;
            }
        }
    }

})(window.angular);
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.randomService', [])
        .factory('cozenLazyLoadRandom', cozenLazyLoadRandom);

    cozenLazyLoadRandom.$inject = [
        'cozenLazyLoadConstant',
        'cozenLazyLoadInternal',
        'cozenEnhancedLogs'
    ];

    function cozenLazyLoadRandom(cozenLazyLoadConstant, cozenLazyLoadInternal, cozenEnhancedLogs) {
        return {
            getRandomLastName   : getRandomLastName,
            getRandomFirstName  : getRandomFirstName,
            getRandomEmail      : getRandomEmail,
            getRandomDomain     : getRandomDomain,
            getRandomWord       : getRandomWord,
            getRandomNamePrefix : getRandomNamePrefix,
            getRandomBirthday   : getRandomBirthday,
            getRandomSentence   : getRandomSentence,
            getRandomGender     : getRandomGender,
            getRandomNationality: getRandomNationality,
            getRandomAvatar     : getRandomAvatar
        };

        /// RANDOM METHODS ///

        /**
         * Return a random last name
         * @param {string} nationality = en > Define the lang (en, it) [config.json]
         * @return {string} lastName
         */
        function getRandomLastName(nationality) {
            if (Methods.isNullOrEmpty(nationality)) {
                nationality = cozenLazyLoadInternal.getLastNationality();
            }
            else {
                cozenLazyLoadConstant.last.nationality = nationality;
            }
            cozenLazyLoadConstant.last.lastName = cozenLazyLoadConstant.cozenChance.last({
                nationality: nationality
            });
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomLastName', cozenLazyLoadConstant.last.lastName);
            return cozenLazyLoadConstant.last.lastName;
        }

        /**
         * Return a random first name
         * @param {string} gender      = male > Define the gender (male, female) [config.json]
         * @param {string} nationality = en   > Define the lang (en, it) [config.json]
         * @return {string} firstName
         */
        function getRandomFirstName(gender, nationality) {
            if (Methods.isNullOrEmpty(gender)) {
                gender = cozenLazyLoadInternal.getLastGender();
            }
            else {
                cozenLazyLoadConstant.last.gender = gender;
            }
            if (Methods.isNullOrEmpty(nationality)) {
                nationality = cozenLazyLoadInternal.getLastNationality();
            }
            else {
                cozenLazyLoadConstant.last.nationality = nationality;
            }
            cozenLazyLoadConstant.last.firstName = cozenLazyLoadConstant.cozenChance.first({
                gender     : gender,
                nationality: nationality
            });
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomFirstName', cozenLazyLoadConstant.last.firstName);
            return cozenLazyLoadConstant.last.firstName;
        }

        /**
         * Return a random email
         * @param {string} domain = cozen.com > Define the domain after the @ [config.json]
         * @return {string} email
         */
        function getRandomEmail(domain) {
            if (Methods.isNullOrEmpty(domain)) {
                domain = getRandomDomain();
            }
            cozenLazyLoadConstant.last.domain = domain;
            cozenLazyLoadConstant.last.email  = cozenLazyLoadConstant.cozenChance.email({
                domain: domain
            }).toLowerCase();
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomEmail', cozenLazyLoadConstant.last.email);
            return cozenLazyLoadConstant.last.email;
        }

        /**
         * Return a random domain
         * Note that you can't combine length and syllables (to use syllables, send length as null in parameters)
         * @param {number} length    = 5 > The length of the characters for the prefix domain name
         * @param {number} syllables = 3 > The number of syllables for the prefix domain name
         * @returns {string} domain
         */
        function getRandomDomain(length, syllables) {
            var firstWord                     = getRandomWord(length, syllables);
            var secondWord                    = cozenLazyLoadConstant.cozenChance.tld();
            cozenLazyLoadConstant.last.domain = firstWord + '.' + secondWord;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomDomain', cozenLazyLoadConstant.last.domain);
            return cozenLazyLoadConstant.last.domain;
        }

        /**
         * Return a random word
         * Note that you can't combine length and syllables (to use syllables, send length as null in parameters)
         * @param {number} length    = 5 > The length of the characters for the prefix domain name
         * @param {number} syllables = 3 > The number of syllables for the prefix domain name
         * @returns {string} word
         */
        function getRandomWord(length, syllables) {
            if (Methods.isNullOrEmpty(length)) {
                if (!Methods.isNullOrEmpty(syllables)) {
                    cozenLazyLoadConstant.last.syllables = syllables;
                    cozenLazyLoadConstant.last.word      = cozenLazyLoadConstant.cozenChance.word({
                        syllables: syllables
                    });
                }
                else {
                    cozenLazyLoadConstant.last.word = cozenLazyLoadConstant.cozenChance.word();
                }
            }
            else {
                cozenLazyLoadConstant.last.length = length;
                cozenLazyLoadConstant.last.word   = cozenLazyLoadConstant.cozenChance.word({
                    length: length
                });
            }
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomWord', cozenLazyLoadConstant.last.word);
            return cozenLazyLoadConstant.last.word;
        }

        /**
         * Return a random prefix
         * @param {string} gender = male  > Define the gender (male, female) [config.json]
         * @param {string} full   = false > Return the prefix as a complete word (no shorthand)
         * @return {string} prefix
         */
        function getRandomNamePrefix(gender, full) {
            var prefix;
            if (Methods.isNullOrEmpty(full)) {
                full = false;
            }
            if (Methods.isNullOrEmpty(gender)) {
                prefix = cozenLazyLoadConstant.cozenChance.prefix({
                    full: full
                });
            }
            else {
                prefix = cozenLazyLoadConstant.cozenChance.prefix({
                    gender: gender,
                    full  : full
                });
            }
            cozenLazyLoadConstant.last.prefix = prefix;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomNamePrefix', prefix);
            return prefix;
        }

        /**
         * Return a random birthday
         * @param {boolean} string    = false > Return the birthday as a string
         * @param {boolean} timestamp = false > Return the birthday as a timestamp
         * @return {string|date|number} birthday
         */
        function getRandomBirthday(string, timestamp) {
            var birthday;
            if (Methods.isNullOrEmpty(string)) {
                string = false;
            }
            if (Methods.isNullOrEmpty(timestamp)) {
                timestamp = false;
            }
            birthday = cozenLazyLoadConstant.cozenChance.birthday({
                string: string
            });
            if (timestamp) {
                birthday = moment(birthday).unix();
            }
            cozenLazyLoadConstant.last.birthday = birthday;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomBirthday', birthday);
            return birthday;
        }

        /**
         * Return a random sentence
         * @param {number} words = 15 > The number of words [config.json]
         * @param {number} min        > Start for a random range of words
         * @param {number} max        > End for a random range of words
         * @return {string} sentence
         */
        function getRandomSentence(words, min, max) {
            var sentence;
            if (Methods.isNullOrEmpty(words)) {
                words = cozenLazyLoadInternal.getLastWords();
            }
            if (!Methods.isNullOrEmpty(min) && !Methods.isNullOrEmpty(max)) {
                words = Methods.getRandomFromRange(min, max);
            }
            sentence                         = cozenLazyLoadConstant.cozenChance.sentence({
                words: words
            });
            cozenLazyLoadConstant.last.words = words;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomSentence', sentence);
            return sentence;
        }

        /**
         * Return a random gender (male, female)
         * @returns {string} gender
         */
        function getRandomGender() {
            var genders                       = [
                'male',
                'female'
            ];
            var index                         = Methods.getRandomFromRange(0, genders.length - 1);
            var gender                        = genders[index];
            cozenLazyLoadConstant.last.gender = gender;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomGender', gender);
            return gender;
        }

        /**
         * Return a random nationality (en, it)
         * @returns {string} nationality
         */
        function getRandomNationality() {
            var nationalities                      = [
                'en',
                'it'
            ];
            var index                              = Methods.getRandomFromRange(0, nationalities.length - 1);
            var nationality                        = nationalities[index];
            cozenLazyLoadConstant.last.nationality = nationality;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomNationality', nationality);
            return nationality;
        }

        /**
         * Return a random avatar from Gravatar
         * @param {string} fileExtension > Force to have an avatar with a specific file extension
         * @param {string} email         > Get the avatar for this user email
         * @returns {string} avatar
         */
        function getRandomAvatar(fileExtension, email) {
            var avatar;
            if (!Methods.isNullOrEmpty(email)) {
                avatar = cozenLazyLoadConstant.cozenChance.avatar({
                    email: email
                });
            }
            else if (!Methods.isNullOrEmpty(fileExtension)) {
                avatar = cozenLazyLoadConstant.cozenChance.avatar({
                    fileExtension: fileExtension
                });
            }
            else {
                avatar = cozenLazyLoadConstant.cozenChance.avatar();
            }
            cozenLazyLoadConstant.last.avatar = avatar;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomAvatar', avatar);
            return avatar;
        }
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
        'CozenThemes',
        'CONFIG',
        '$window',
        '$rootScope',
        'cozenEnhancedLogs'
    ];

    function cozenList(CozenThemes, CONFIG, $window, $rootScope, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();
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
        '$window',
        'cozenEnhancedLogs'
    ];

    function cozenListItemMedia3(CONFIG, rfc4122, $rootScope, $window, cozenEnhancedLogs) {
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Header');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3Label)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenListItemMedia3SubLabel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'SubLabel');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickItem');
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
        '$window',
        'cozenEnhancedLogs'
    ];

    function cozenListItemSimple(CONFIG, rfc4122, $rootScope, $window, cozenEnhancedLogs) {
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
                    return true;
                }
                else if (scope.cozenListItemSimpleBtnRight && angular.isUndefined(attrs.cozenListItemSimpleBtnRightOnClick)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'BtnRightOnClick');
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
                    cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickItem');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickBtnRight');
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
                    cozenEnhancedLogs.error.attributeIsNotFunction(data.directive, 'cozenOnBlurCallback');
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
        '$rootScope',
        'cozenEnhancedLogs'
    ];

    function cozenOnClickService($window, $rootScope, cozenEnhancedLogs) {

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
                    cozenEnhancedLogs.error.attributeIsNotFunction(data.directive, 'cozenOnFocusCallback');
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
 * @param {string}   cozenOnRepeatFinish         > Name of the event sent when the ng-repeat has finished
 * @param {object}   cozenOnRepeatFinishData     > Data to add in the finish and in the callback
 * @param {function} cozenOnRepeatFinishCallback > Callback function called on finish
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

            // Default values (attributes)
            scope._cozenOnRepeatFinish     = Methods.isNullOrEmpty(attrs.cozenOnRepeatFinish) ? 'cozenRepeatFinished' : attrs.cozenOnRepeatFinish;
            scope._cozenOnRepeatFinishData = scope.$eval(attrs.cozenOnRepeatFinishData);

            // Check if the current element is the last
            if (scope.$last === true) {
                $timeout(function () {

                    // Notify parents of the complete process
                    scope.$emit(scope._cozenOnRepeatFinish, {
                        data: scope._cozenOnRepeatFinishData
                    });

                    // Execute the callback method
                    scope._cozenOnRepeatFinishCallback = scope.$eval(attrs.cozenOnRepeatFinishCallback);
                    if (Methods.isFunction(scope._cozenOnRepeatFinishCallback)) {
                        scope._cozenOnRepeatFinishCallback({
                            data: scope._cozenOnRepeatFinishData
                        });
                    }
                });
            }
        }
    }

})(window.angular);


/**
 * @description
 *
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
        'CozenThemes',
        'cozenEnhancedLogs'
    ];

    function cozenPagination(CONFIG, CozenThemes, cozenEnhancedLogs) {
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
                scope._activeTheme         = CozenThemes.getActiveTheme();
                scope.cozenPaginationBlock = 0;

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenPaginationModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
                    return true;
                }
                else if (Methods.isNullOrEmpty(attrs.cozenPaginationTotalElements)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'TotalElements');
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
                if (oldModel != scope.cozenPaginationModel) {
                    cozenEnhancedLogs.info.functionCalled(data.directive, 'onClick' + Methods.capitalizeFirstLetter(type) + page);
                    if (Methods.isFunction(scope.cozenPaginationOnChange)) {
                        scope.cozenPaginationOnChange();
                    }
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
        'CozenThemes',
        'CONFIG',
        'cozenEnhancedLogs'
    ];

    function cozenPanel(CozenThemes, CONFIG, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();
                methods.startWatching();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenPanelLabel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickHeader');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickBigIconLeft');
            }

            function onClickBigIconRight($event) {
                $event.stopPropagation();
                if (scope.cozenPanelDisabled) {
                    return;
                }
                if (Methods.isFunction(scope.cozenPanelOnClickBigIconRight)) {
                    scope.cozenPanelOnClickBigIconRight();
                }
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClickBigIconRight');
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
        'CozenThemes',
        'CONFIG',
        'cozenEnhancedLogs'
    ];

    function cozenPills(CozenThemes, CONFIG, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();

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
        '$window',
        '$timeout',
        'cozenEnhancedLogs'
    ];

    function cozenPillsItemSimple(CONFIG, rfc4122, $window, $timeout, cozenEnhancedLogs) {
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Label');
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onClick');
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
        'CozenThemes',
        'CONFIG',
        '$window',
        '$timeout',
        'rfc4122',
        '$animate',
        'cozenEnhancedLogs'
    ];

    function cozenPopup(CozenThemes, CONFIG, $window, $timeout, rfc4122, $animate, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Name');
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
                            name: scope._cozenPopupName,
                            data: scope.cozenPopupData
                        });
                    }
                    cozenEnhancedLogs.info.functionCalled(data.directive, 'OnHide');
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

                        // Safe apply required because the $animate.addClass callback is not trigger if the pointer is not on the popup
                        // This tricky fix force the apply and the callback is then well called
                        // Without it, the popup will not hide if the user close it from clicking on the outside container
                        Methods.safeApply(scope);
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
                            name: scope._cozenPopupName,
                            data: params.data
                        });
                    }
                    cozenEnhancedLogs.info.functionCalled(data.directive, 'OnShow');
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
    isNullOrEmptyStrict       : isNullOrEmptyStrict,
    safeApply                 : safeApply,
    isFunction                : isFunction,
    getConsoleColor           : getConsoleColor,
    capitalizeFirstLetter     : capitalizeFirstLetter,
    isRegExpValid             : isRegExpValid,
    getElementPaddingTopBottom: getElementPaddingTopBottom,
    hasOwnProperty            : hasOwnProperty,
    hasDuplicates             : hasDuplicates,
    getLongestKey             : getLongestKey,
    returnSpacesString        : returnSpacesString,
    dataMustBeBoolean         : dataMustBeBoolean,
    dataMustBeNumber          : dataMustBeNumber,
    dataMustBeObject          : dataMustBeObject,
    dataMustBeInThisList      : dataMustBeInThisList,
    getRandomFromRange        : getRandomFromRange,
    getRandomBoolean          : getRandomBoolean,
    getHumanFileSize          : getHumanFileSize
};

// Common data
var Data = {
    red   : '#c0392b',
    purple: '#8e44ad',
    black : '#2c3e50',
    orange: '#d35400',
    green : '#27ae60'
};

// Check if a value is in the list
function isInList(list, value) {
    return list.indexOf(value) != -1;
}

// Check if a value is null, empty or undefined
function isNullOrEmpty(element) {
    return element == null || element == '' || element == 'undefined';
}

// Check if a value is null, empty or undefined
function isNullOrEmptyStrict(element) {
    return element === null || element === '' || element === 'undefined';
}

// Force a digest in angular app safely
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

// Check if the function is a real function
function isFunction(fn) {
    return typeof fn === 'function';
}

// Just a function to get access of the colors for the console
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

// Capitalize only the first letter of a string
function capitalizeFirstLetter(string) {
    if (Methods.isNullOrEmpty(string) || typeof string != 'string') {
        return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Check if the regexp is valid
function isRegExpValid(regexp, value) {
    return !(!new RegExp(regexp).test(value) || isNullOrEmpty(value));
}

function getElementPaddingTopBottom(element) {
    var styles = window.getComputedStyle(element);
    return parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
}

// Check if an object have a property to avoid using not own property
function hasOwnProperty(obj, prop) {
    if (isNullOrEmpty(obj) || isNullOrEmpty(prop)) {
        return false;
    }
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

// Check if an array have duplicated keys
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

// Return the longest of an object
function getLongestKey(object) {
    var longest = '';
    for (var key in object) {
        if (key.length > longest.length) {
            longest = key;
        }
    }
    return longest;
}

// Return a string filled with spaces
// The spaces quantity is defined by checking the difference between the key length and a max length
function returnSpacesString(key, maxLength) {
    var diff = maxLength - key.length;
    var text = '';
    for (var i = 0; i < diff; i++) {
        text += ' ';
    }
    return text;
}

// Use it to tell the dev that a entered value is not a boolean [Deprecated, use enhancedLogs]
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

// Use it to tell the dev that a entered value is not a number [Deprecated, use enhancedLogs]
function dataMustBeNumber(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cnumber%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a entered value is not an object [Deprecated, use enhancedLogs]
function dataMustBeObject(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cobject%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a key is not in the list so that's a terrible error !! [Deprecated, use enhancedLogs]
function dataMustBeInThisList(attribute, list) {
    console.error('%c<%c' + attribute + '%c> must be a correct value from this list <%c' + list + '%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Return a random number from a range (both included)
function getRandomFromRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
    var boolean = getRandomFromRange(0, 1);
    return boolean == 1;
}

function getHumanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + 'B';
    }
    var units = si
        ? ['kB',
            'MB',
            'GB',
            'TB',
            'PB',
            'EB',
            'ZB',
            'YB']
        : ['KiB',
            'MiB',
            'GiB',
            'TiB',
            'PiB',
            'EiB',
            'ZiB',
            'YiB'];
    var u     = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + '' + units[u];
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
        'CozenThemes',
        'cozenEnhancedLogs'
    ];

    function cozenIconRequired(CozenThemes, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();
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
        .value('CozenShortcuts', {
            shift: false,
            ctrl : false,
            alt  : false
        })
        .directive('cozenShortcut', cozenShortcut);

    cozenShortcut.$inject = [
        '$window',
        'CozenShortcuts',
        'CONFIG'
    ];

    function cozenShortcut($window, CozenShortcuts, CONFIG) {
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
                            if (CONFIG.logs.enabled && CozenShortcuts.shift != newValue) {
                                CozenShortcuts.shift = newValue;
                                methods.shortcutsLog();
                            }
                            break;

                        // Ctrl
                        case 17:
                            if (CONFIG.logs.enabled && CozenShortcuts.ctrl != newValue) {
                                CozenShortcuts.ctrl = newValue;
                                methods.shortcutsLog();
                            }
                            break;

                        // Alt
                        case 18:
                            if (CONFIG.logs.enabled && CozenShortcuts.alt != newValue) {
                                CozenShortcuts.alt = newValue;
                                methods.shortcutsLog();
                            }
                            break;
                    }
                });
            }

            function shortcutsLog() {
                var log = '';
                Object.keys(CozenShortcuts).forEach(function (key) {
                    log += '%c[%c' + Methods.capitalizeFirstLetter(key) + ' %c' + CozenShortcuts[key] + '%c]';
                });
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
 * @param {boolean}  cozenTextareaDisabled        = false         > Disable the textarea
 * @param {function} cozenTextareaOnChange                        > Callback function called on change
 * @param {string}   cozenTextareaTooltipMaxWidth = max-width-200 > Max width of the tooltip
 * @param {string}   cozenTextareaPlaceholder                     > Text for the placeholder
 * @param {function} cozenTextareaOnEnter                         > Callback function called when enter is pressed and the textarea is focused
 * @param {function} cozenTextareaOnCapsEnter                     > Callback function called when enter and maj is pressed and the textarea is focused
 *
 * [Attributes params]
 * @param {number}  cozenTextareaId                                           > Id of the textarea
 * @param {string}  cozenTextareaTooltip                                      > Text of the tooltip
 * @param {string}  cozenTextareaTooltipPlacement = auto right                > Change the position of the tooltip [config.json]
 * @param {string}  cozenTextareaTooltipTrigger   = outsideClick              > Type of trigger to show the tooltip [config.json]
 * @param {string}  cozenTextareaTooltipClass                                 > Add a custom class on the tooltip
 * @param {boolean} cozenTextareaRequired         = false                     > Required textarea [config.json]
 * @param {boolean} cozenTextareaErrorDesign      = true                      > Add style when error [config.json]
 * @param {boolean} cozenTextareaSuccessDesign    = true                      > Add style when success [config.json]
 * @param {string}  cozenTextareaSize             = normal                    > Size of the button
 * @param {string}  cozenTextareaSizeSmall                                    > Shortcut for small size
 * @param {string}  cozenTextareaSizeNormal                                   > Shortcut for normal size
 * @param {string}  cozenTextareaSizeLarge                                    > Shortcut for large size
 * @param {number}  cozenTextareaMinLength        = 0                         > Minimum char length [config.json]
 * @param {number}  cozenTextareaMaxLength        = 200                       > Maximum char length [config.json]
 * @param {string}  cozenTextareaName             = uuid                      > Name of the textarea
 * @param {boolean} cozenTextareaValidator        = dirty                     > Define after what type of event the textarea must add more ui color [config.json]
 * @param {boolean} cozenTextareaValidatorAll                                 > Shortcut for all type
 * @param {boolean} cozenTextareaValidatorTouched                             > Shortcut for touched type
 * @param {boolean} cozenTextareaValidatorDirty                               > Shortcut for dirty type
 * @param {boolean} cozenTextareaValidatorEmpty   = true                      > Display ui color even if textarea empty [config.json]
 * @param {boolean} cozenTextareaElastic          = true                      > Auto resize the textarea depending of his content [config.json]
 * @param {number}  cozenTextareaRows             = 2                         > Number of rows [config.json]
 * @param {string}  cozenTextareaLabel                                        > Add a label on the top of the textarea
 * @param {string}  cozenTextareaRequiredTooltip  = textarea_required_tooltip > Text to display for the tooltip of the required element
 * @param {string}  cozenTextareaClass                                        > Custom class
 * @param {string}  cozenTextareaTooltipType      = default                   > Type of the tooltip
 * @param {string}  cozenTextareaModelLengthType  = always                    > Show the number of char to match the length (always, never, focus) [config.json]
 * @param {boolean} cozenTextareaSpellCheck       = false                     > Disable the spell checking [config.json]
 *
 * [Attributes params - whenHeightGreaterThan]
 * @param {string}  cozenTextareaWhenHeightGreaterThan         = 100  > The height you want to be check in pixels
 * @param {string}  cozenTextareaWhenHeightGreaterThanClass           > The class you which to toggle if the height is greater than
 * @param {boolean} cozenTextareaWhenHeightGreaterThanDisabled = true > Enable/disable the check (to improve performances)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.textarea', [])
        .directive('cozenTextarea', cozenTextarea);

    cozenTextarea.$inject = [
        'CozenThemes',
        'CONFIG',
        'rfc4122',
        '$interval',
        'cozenEnhancedLogs',
        '$rootScope',
        'CozenShortcuts'
    ];

    function cozenTextarea(CozenThemes, CONFIG, rfc4122, $interval, cozenEnhancedLogs, $rootScope, CozenShortcuts) {
        return {
            link            : link,
            restrict        : 'E',
            replace         : false,
            transclude      : false,
            scope           : {
                cozenTextareaModel          : '=?',
                cozenTextareaDisabled       : '=?',
                cozenTextareaOnChange       : '&',
                cozenTextareaTooltipMaxWidth: '=?',
                cozenTextareaPlaceholder    : '=?',
                cozenTextareaOnEnter        : '&',
                cozenTextareaOnCapsEnter    : '&'
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
                updateModelLength: updateModelLength,
                onKeyDown        : onKeyDown
            };

            var data = {
                directive: 'cozenTextarea',
                uuid     : rfc4122.v4()
            };

            methods.init();

            function init() {

                // Show only when the textarea know his parent (all the stuff is prepared)
                scope.cozenTextareaHasParentKnowledge = false;

                // Public functions
                scope._methods = {
                    getMainClass: getMainClass,
                    onChange    : onChange,
                    onKeyDown   : onKeyDown
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
                angular.isUndefined(attrs.cozenTextareaPlaceholder) ? scope.vm.cozenTextareaPlaceholder = '' : null;

                // Default values (attributes)
                scope._cozenTextareaId                            = angular.isDefined(attrs.cozenTextareaId) ? attrs.cozenTextareaId : '';
                scope._cozenTextareaTooltip                       = angular.isDefined(attrs.cozenTextareaTooltip) ? attrs.cozenTextareaTooltip : '';
                scope._cozenTextareaTooltipTrigger                = angular.isDefined(attrs.cozenTextareaTooltipTrigger) ? attrs.cozenTextareaTooltipTrigger : CONFIG.textarea.tooltip.trigger;
                scope._cozenTextareaTooltipClass                  = angular.isDefined(attrs.cozenTextareaTooltipClass) ? attrs.cozenTextareaTooltipClass : '';
                scope._cozenTextareaRequired                      = angular.isDefined(attrs.cozenTextareaRequired) ? JSON.parse(attrs.cozenTextareaRequired) : CONFIG.textarea.required;
                scope._cozenTextareaErrorDesign                   = angular.isDefined(attrs.cozenTextareaErrorDesign) ? JSON.parse(attrs.cozenTextareaErrorDesign) : CONFIG.textarea.errorDesign;
                scope._cozenTextareaSuccessDesign                 = angular.isDefined(attrs.cozenTextareaSuccessDesign) ? JSON.parse(attrs.cozenTextareaSuccessDesign) : CONFIG.textarea.successDesign;
                scope._cozenTextareaMinLength                     = angular.isDefined(attrs.cozenTextareaMinLength) ? attrs.cozenTextareaMinLength : CONFIG.textarea.minLength;
                scope._cozenTextareaMaxLength                     = angular.isDefined(attrs.cozenTextareaMaxLength) ? attrs.cozenTextareaMaxLength : CONFIG.textarea.maxLength;
                scope._cozenTextareaName                          = angular.isDefined(attrs.cozenTextareaName) ? attrs.cozenTextareaName : data.uuid;
                scope._cozenTextareaValidatorEmpty                = angular.isDefined(attrs.cozenTextareaValidatorEmpty) ? JSON.parse(attrs.cozenTextareaValidatorEmpty) : CONFIG.textarea.validator.empty;
                scope._cozenTextareaValidatorIcon                 = angular.isDefined(attrs.cozenTextareaValidatorIcon) ? JSON.parse(attrs.cozenTextareaValidatorIcon) : true;
                scope._cozenTextareaTooltipPlacement              = angular.isDefined(attrs.cozenTextareaTooltipPlacement) ? attrs.cozenTextareaTooltipPlacement : CONFIG.textarea.tooltip.placement;
                scope._cozenTextareaElastic                       = angular.isDefined(attrs.cozenTextareaElastic) ? JSON.parse(attrs.cozenTextareaElastic) : CONFIG.textarea.elastic;
                scope._cozenTextareaRows                          = angular.isDefined(attrs.cozenTextareaRows) ? JSON.parse(attrs.cozenTextareaRows) : CONFIG.textarea.rows;
                scope._cozenTextareaLabel                         = angular.isDefined(attrs.cozenTextareaLabel) ? attrs.cozenTextareaLabel : '';
                scope._cozenTextareaUuid                          = data.uuid;
                scope._cozenTextareaModelLengthType               = angular.isDefined(attrs.cozenTextareaModelLengthType) ? attrs.cozenTextareaModelLengthType : CONFIG.textarea.modelLengthType;
                scope._cozenTextareaModelLength                   = scope._cozenTextareaMaxLength;
                scope._cozenTextareaRequiredConfig                = CONFIG.required;
                scope._cozenTextareaRequiredTooltip               = angular.isDefined(attrs.cozenTextareaRequiredTooltip) ? attrs.cozenTextareaRequiredTooltip : 'textarea_required_tooltip';
                scope._cozenTextareaTooltipType                   = angular.isDefined(attrs.cozenTextareaTooltipType) ? attrs.cozenTextareaTooltipType : 'default';
                scope._cozenTextareaSpellCheck                    = angular.isDefined(attrs.cozenTextareaSpellCheck) ? JSON.parse(attrs.cozenTextareaSpellCheck) : CONFIG.textarea.spellCheck;
                scope._cozenTextareaWhenHeightGreaterThan         = angular.isDefined(attrs.cozenTextareaWhenHeightGreaterThan) ? JSON.parse(attrs.cozenTextareaWhenHeightGreaterThan) : 100;
                scope._cozenTextareaWhenHeightGreaterThanClass    = angular.isDefined(attrs.cozenTextareaWhenHeightGreaterThanClass) ? attrs.cozenTextareaWhenHeightGreaterThanClass : '';
                scope._cozenTextareaWhenHeightGreaterThanDisabled = angular.isDefined(attrs.cozenTextareaWhenHeightGreaterThanDisabled) ? JSON.parse(attrs.cozenTextareaWhenHeightGreaterThanDisabled) : true;

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = CozenThemes.getActiveTheme();

                // When the user use the lazy load data generator from a preBuild service, set dirty and touched
                scope.$on('cozenLazyLoadDataGenerated', function ($event, data) {
                    if (scope._cozenTextareaForm == data.cozenFormName) {
                        var form     = methods.getForm();
                        var textarea = form[scope._cozenTextareaFormCtrl][scope._cozenTextareaFormModel][scope._cozenTextareaForm];
                        if (!Methods.isNullOrEmpty(textarea)) {
                            textarea = textarea[scope._cozenTextareaName];
                            if (!Methods.isNullOrEmpty(textarea)) {
                                textarea.$setDirty();
                                textarea.$setTouched();
                            }
                        }
                    }
                });

                // When the form is ready, get the required intel
                scope.$on('cozenFormName', function (event, eventData) {
                    scope._cozenTextareaForm              = eventData.name;
                    scope._cozenTextareaFormCtrl          = eventData.ctrl;
                    scope._cozenTextareaFormModel         = eventData.model;
                    scope.cozenTextareaHasParentKnowledge = true;

                    // Force to dirty and touched if the model is not empty
                    // The interval is required because the digest is random so a timeout wasn't enough
                    var intervalCount = 0;
                    var interval      = $interval(function () {
                        var form = methods.getForm();
                        try {
                            var textarea = form[scope._cozenTextareaFormCtrl][scope._cozenTextareaFormModel][scope._cozenTextareaForm];
                            if (!Methods.isNullOrEmpty(textarea)) {
                                textarea = textarea[scope._cozenTextareaName];
                                if (!Methods.isNullOrEmpty(textarea)) {
                                    if (!Methods.isNullOrEmpty(scope.vm.cozenTextareaModel)) {
                                        textarea.$setDirty();
                                        textarea.$setTouched();
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

                // Ask the parent to launch the cozenFormName event to get the data
                // -> Avoid problems when elements are added to the DOM after the form loading
                $rootScope.$broadcast('cozenFormChildInit');
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenTextareaModel)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Model');
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
                    textarea      = textarea[scope._cozenTextareaFormCtrl][scope._cozenTextareaFormModel];
                    if (!Methods.isNullOrEmpty(textarea)) {
                        textarea = textarea[scope._cozenTextareaForm];
                        if (!Methods.isNullOrEmpty(textarea)) {
                            textarea = textarea[scope._cozenTextareaName];
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
                        }
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
                cozenEnhancedLogs.info.functionCalled(data.directive, 'onChange');
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

            function onKeyDown($event) {
                switch ($event.keyCode) {

                    // Enter
                    case 13:
                        if (CozenShortcuts.shift) {
                            if (Methods.isFunction(scope.vm.cozenTextareaOnCapsEnter)) {
                                scope.vm.cozenTextareaOnCapsEnter({
                                    name : scope._cozenTextareaName,
                                    model: scope.vm.cozenTextareaModel
                                });
                            }
                            scope.$emit('cozenTextareaOnCapsEnter', {
                                name : scope._cozenTextareaName,
                                model: scope.vm.cozenTextareaModel
                            });
                            cozenEnhancedLogs.info.broadcastEvent(data.directive, 'cozenTextareaOnCapsEnter');
                        }
                        else {
                            if (Methods.isFunction(scope.vm.cozenTextareaOnEnter)) {
                                scope.vm.cozenTextareaOnEnter({
                                    name : scope._cozenTextareaName,
                                    model: scope.vm.cozenTextareaModel
                                });
                            }
                            scope.$emit('cozenTextareaOnEnter', {
                                name : scope._cozenTextareaName,
                                model: scope.vm.cozenTextareaModel
                            });
                            cozenEnhancedLogs.info.broadcastEvent(data.directive, 'cozenTextareaOnEnter');
                        }
                        break;
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
        .provider('CozenThemes', CozenThemesProvider);

    CozenThemesProvider.$inject = [
        'CONFIG'
    ];

    function CozenThemesProvider(CONFIG) {
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

        this.$get = CozenThemes;

        CozenThemes.$inject = [];

        function CozenThemes() {
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
        'CozenThemes',
        'cozenEnhancedLogs'
    ];

    function cozenTooltip(CozenThemes, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();

                // Display the template
                scope._isReady = true;
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenTooltipLabel)) {
                    if (!scope.cozenTooltipDisabled) {
                        cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'cozenTooltipLabel');
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
        'CozenThemes',
        'cozenEnhancedLogs'
    ];

    function cozenUploadInfo($filter, CozenThemes, cozenEnhancedLogs) {
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
                scope._activeTheme = CozenThemes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenUploadInfoConfig)) {
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'Config');
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
        'CONFIG',
        'cozenEnhancedLogs'
    ];

    function cozenView(CONFIG, cozenEnhancedLogs) {
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
                    cozenEnhancedLogs.error.missingParameterDirective(data.directive, 'cozenViewScrollBarHeight');
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
 * @ngdoc directive
 * @name cozen-when-height-greater-than
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {string}  cozenWhenHeightGreaterThan         = 100   > The height you want to be check in pixels
 * @param {string}  cozenWhenHeightGreaterThanClass            > The class you which to toggle if the height is greater than
 * @param {boolean} cozenWhenHeightGreaterThanDisabled = false > Enable/disable the check (to improve performances)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenWhenHeightGreaterThan', cozenWhenHeightGreaterThan);

    cozenWhenHeightGreaterThan.$inject = [];

    function cozenWhenHeightGreaterThan() {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            scope.disabled = angular.isDefined(attrs.cozenWhenHeightGreaterThanDisabled) ? JSON.parse(attrs.cozenWhenHeightGreaterThanDisabled) : false;
            if (!scope.disabled && !Methods.isNullOrEmpty(attrs.cozenWhenHeightGreaterThanClass)) {

                // Watch every digest and update the height
                scope.$watch(function () {
                    scope.__height = element.height();
                });

                // Watch for the height property and get called when it change
                scope.$watch('__height', function (newHeight, oldHeight) {
                    if (newHeight > attrs.cozenWhenHeightGreaterThan) {
                        element.addClass(attrs.cozenWhenHeightGreaterThanClass);
                    }
                    else {
                        element.removeClass(attrs.cozenWhenHeightGreaterThanClass);
                    }
                });
            }
        }
    }
})(window.angular);

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