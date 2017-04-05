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
        'cozenEnhancedLogs'
    ];

    function cozenGoogleAnalyticsRequest(PublicMethods, $location, cozenEnhancedLogs) {

        // Private data
        var _data = {
            trackerDefaultName: 't0'
        };

        return {
            create       : create,
            addCustomData: addCustomData,
            pageView     : pageView
        };

        /**
         * Create the initial tracking (used to know if the user is new or returning)
         * Also collects information about the device such as screen resolution, viewport size, and document encoding
         * @param {string} cookieDomain = auto > none while you are working on localhost, auto otherwise
         * @param {string} trackerName  = t0   > The name of the GA tracker
         * @param {string} userId              > The userId
         */
        function create(cookieDomain, trackerName, userId) {

            // Default values (avoid ES6 shortcuts for cordova)
            if (PublicMethods.isNullOrEmpty(cookieDomain)) {
                cookieDomain = 'auto';
            }
            if (PublicMethods.isNullOrEmpty(trackerName)) {
                trackerName = _data.trackerDefaultName;
            }
            cozenEnhancedLogs.infoTemplateForGoogleAnalyticsRequest('create', trackerName);

            // Create the tracker
            ga('create', {
                trackingId  : 'UA-85736401-1',
                cookieDomain: cookieDomain,
                name        : trackerName,
                userId      : userId
            });
        }

        /**
         * Add custom data to the tracker (like dimension or metric)
         * @param {object} customData       > Object of dimension and/or metric
         * @param {string} trackerName = t0 > The name of the GA tracker
         */
        function addCustomData(customData, trackerName) {

            // Default values
            if (PublicMethods.isNullOrEmpty(trackerName)) {
                trackerName = _data.trackerDefaultName;
            }
            cozenEnhancedLogs.infoTemplateForGoogleAnalyticsRequest('addCustomData', trackerName);

            // Update the tracker with custom dimension or metric
            ga(trackerName + '.set', customData);
        }

        /**
         * Send a pageview hit
         * @param {string} trackerName = t0   > The name of the tracker
         * @param {string} pageUrl     = auto > The path portion of a URL. This value should start with a slash (/) character (Default: $location.url())
         * @param {string} title       = auto > The title of the page (Default: document.title)
         */
        function pageView(trackerName, pageUrl, title) {

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
            cozenEnhancedLogs.infoTemplateForGoogleAnalyticsRequest('pageview', trackerName);

            // Send a pageview hit
            ga(trackerName + '.send', {
                hitType: 'pageview',
                page   : pageUrl,
                title  : title
            });
        }
    }

})(window.angular, window.document);