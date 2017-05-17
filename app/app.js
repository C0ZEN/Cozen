(function (angular) {
    'use strict';

    angular
        .module('test', [
            'cozenLib'
        ])
        .config(config);

    config.$inject = [
        '$locationProvider',
        '$translateProvider',
        'CONFIG',
        'CozenThemesProvider',
        'CozenConfigProvider',
        'CozenLazyLoadProvider',
        'CozenFloatingFeedProvider'
    ];

    // Global configuration
    function config($locationProvider, $translateProvider, CONFIG, CozenThemesProvider, CozenConfigProvider, CozenLazyLoadProvider,
                    CozenFloatingFeedProvider) {

        // Override the CONFIG for the Tau theme
        // ThemesProvider.setActiveTheme('tau');
        // ConfigProvider
        //     .scrollsBar(false)
        //     .debug(true)
        //     .dropdownAutoCloseOthers(true)
        //     .inputDisplayModelLength(true)
        //     .textareaDisplayModelLength(true)
        //     .dropdownDisplayModelLength(true)
        //     .requiredType('icon');

        // Override the CONFIG for the Atom theme
        CozenThemesProvider.setActiveTheme('atom');
        CozenConfigProvider
            .scrollsBar(false)
            .dev(true)
            .debug(true)
            .logsEnabled(true)
            .broadcastLog(true)
            .dropdownAutoCloseOthers(true)
            .inputModelLengthType('focus')
            .inputModelLengthType('focus')
            .dropdownDisplayModelLength(true)
            .requiredType('icon')
            .alertIconLeftDefault('fa fa-info-circle')
            .currentLanguage('fr')
            .popupAnimationInAnimation('zoomIn')
            .popupAnimationOutAnimation('zoomOut');
        CozenLazyLoadProvider.log(true);
        CozenFloatingFeedProvider.timeoutTime(3000);

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
        $translateProvider.preferredLanguage(CONFIG.currentLanguage);

        // Configure the locale for moment
        moment.locale(CONFIG.currentLanguage);
    }

})(window.angular);
