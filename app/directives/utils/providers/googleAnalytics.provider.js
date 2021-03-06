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