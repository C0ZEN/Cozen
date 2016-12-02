(function (angular) {
    'use strict';

    /**
     * @ngdoc overview
     * @name cozenLibApp
     * @description
     * # cozenLibApp
     *
     * Main module of the application.
     */
    angular
        .module('cozenLibApp', [
            'ngAnimate',
            'ngAria',
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'ui.router',
            'pascalprecht.translate'
        ])
        .config(config)
        .run(run);

    config.$inject = [
        '$locationProvider',
        '$translateProvider',
        'CONFIG',
        'ThemesProvider'
    ];

    // Global configuration
    function config($locationProvider, $translateProvider, CONFIG, ThemesProvider) {

        // Configure the location provider
        $locationProvider.html5Mode({
            enabled    : false,
            requireBase: false
        });

        // Configure the translate provider
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.concat.json'
        });
        $translateProvider.preferredLanguage(CONFIG.config.languages[0]);

        // Configure the locale for moment
        moment.locale(CONFIG.config.languages[0]);

        // Choose the theme
        ThemesProvider.setActiveTheme('tau');
    }

    run.$inject = [
        '$rootScope',
        '$state'
    ];

    function run($rootScope, $state) {
        $rootScope.$state = $state;
    }

})(window.angular);
