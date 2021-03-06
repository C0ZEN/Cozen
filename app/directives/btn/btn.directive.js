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
