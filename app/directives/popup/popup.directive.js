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
                cozenPopupOnShow: '&',
                cozenPopupOnHide: '&',
                cozenPopupIsOpen: '=?',
                cozenPopupData  : '=?'
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
                if (angular.isUndefined(attrs.cozenPopupIsOpen)) {
                    scope.cozenPopupIsOpen = false;
                }

                // Default values (attributes)
                scope._cozenPopupId              = angular.isDefined(attrs.cozenPopupId) ? attrs.cozenPopupId : data.uuid;
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

