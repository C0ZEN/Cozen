(function (angular, window) {
    'use strict';

    angular
        .module('test', [
            'cozenLib'
        ])
        .config(config)
        .run(run);

    config.$inject = [
        '$locationProvider',
        '$translateProvider',
        'CONFIG',
        'ThemesProvider',
        'ConfigProvider'
    ];

    // Global configuration
    function config($locationProvider, $translateProvider, CONFIG, ThemesProvider, ConfigProvider) {

        // Configure the location provider
        $locationProvider.html5Mode({
            enabled    : false,
            requireBase: false
        });

        // Configure the translate provider
        $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.concat.json'
        });
        $translateProvider.preferredLanguage(CONFIG.languages[0]);

        // Configure the locale for moment
        moment.locale(CONFIG.languages[0]);

        // Choose the theme
        ThemesProvider.setActiveTheme('tau');

        // Override the CONFIG
        ConfigProvider
            .scrollsBar(false)
            .debug(true)
            .dropdownAutoCloseOthers(true)
            .inputDisplayModelLength(true)
            .textareaDisplayModelLength(true)
            .dropdownDisplayModelLength(true)
            .requiredType('icon');
    }

    run.$inject = [
        '$rootScope',
        '$state'
    ];

    function run($rootScope, $state) {
        $rootScope.$state      = $state;
        $rootScope.innerHeight = window.innerHeight;
    }

})(window.angular, window);
