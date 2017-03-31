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
        '$animate',
        '$compile'
    ];

    function cozenFloatingFeed(CONFIG, $rootScope, Themes, rfc4122, $timeout, $animate, $compile) {
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
                scope._cozenFloatingFeedTimeout      = angular.isDefined(attrs.cozenFloatingFeedTimeout) ? JSON.parse(attrs.cozenFloatingFeedTimeout) : CONFIG.floatingFeed.timeout;

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
                    // if (scope._cozenFloatingFeedAnimationIn != '') {
                    //     var child       = element[0].querySelector('#float-feed-alert-0');
                    //     scope.hideFirst = false;
                    //     $animate.addClass(child, 'floating-alert-animation-in ' + scope._cozenFloatingFeedAnimationIn).then(function () {
                    //         $animate.removeClass(child, 'hidden floating-alert-animation-in ' + scope._cozenFloatingFeedAnimationIn);
                    //     });
                    // }
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

            // Add an alert
            function add($event, alert) {
                if (!Methods.isNullOrEmpty(alert)) {

                    // Check for potential error
                    if (!Methods.hasOwnProperty(alert, 'label')) {
                        Methods.missingKeyLog(data.directive, 'label', 'adding alert');
                    }
                    else if (!Methods.hasOwnProperty(alert, 'type')) {
                        Methods.missingKeyLog(data.directive, 'type', 'adding alert');
                    }
                    // Add the alert
                    else {
                        alert.addedOn                    = moment().unix();
                        alert.display                    = true;
                        alert.uuid                       = rfc4122.v4();
                        scope._cozenFloatingFeedIconLeft = scope._cozenFloatingFeedIconLeft ? CONFIG.alert.iconLeft[alert.type] : '';
                        scope._cozenFloatingAlerts.unshift(alert);
                        scope.hideFirst = true;

                        var newAlert = $compile("<cozen-alert cozen-alert-label='alert.label' " +
                            "cozen-alert-label-values='alert.labelValues' " +
                            "cozen-alert-size='{{ _cozenFloatingFeedSize }}' " +
                            "cozen-alert-type='{{ alert.type }}' " +
                            "cozen-alert-animation-in='false' " +
                            "cozen-alert-animation-out='{{ !Methods.isNullOrEmpty(_cozenFloatingFeedAnimationOut) }}' " +
                            "cozen-alert-animation-out-class='{{ _cozenFloatingFeedAnimationOut }}' " +
                            "cozen-alert-close-btn='{{ _cozenFloatingFeedCloseBtn }}' " +
                            "cozen-alert-icon-left='{{ _cozenFloatingFeedIconLeft }}' " +
                            "cozen-alert-close-btn-tooltip='false' " +
                            "cozen-alert-force-animation='true' " +
                            "cozen-alert-display='alert.display' " +
                            "cozen-alert-on-hide-done='_methods.onHideAlert(alert.uuid)' " +
                            "cozen-alert-class='cozen-floating-alert' " +
                            "cozen-alert-timeout='{{ _cozenFloatingFeedTimeout }}'>" +
                            "</cozen-alert>")(scope);
                        element.append(newAlert);
                    }
                }
                else {
                    Methods.directiveErrorRequired(data.directive, 'alert');
                }
            }

            // Remove all alerts
            function removeAll() {
                scope._cozenFloatingAlerts = [];
            }

            // Remove an alert
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

