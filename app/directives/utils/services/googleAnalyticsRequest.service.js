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