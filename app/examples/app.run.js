(function (angular, window) {
    'use strict';

    angular
        .module('test')
        .run(run);

    run.$inject = [
        '$rootScope',
        '$state',
        'cozenEnhancedLogs'
    ];

    function run($rootScope, $state, cozenEnhancedLogs) {
        $rootScope.$state      = $state;
        $rootScope.innerHeight = window.innerHeight;

        // Logs
        cozenEnhancedLogs.wrap.starting('Run');
        cozenEnhancedLogs.info.changeRouteWithParams('App', 'app');
        cozenEnhancedLogs.info.changeRouteWithParams('App', 'app', '');
        cozenEnhancedLogs.info.changeRouteWithParams('App', 'app', {});
        cozenEnhancedLogs.info.changeRouteWithParams('App', 'app', {
            user: 'test'
        });
        cozenEnhancedLogs.info.changeRouteWithParams('App', 'app', {
            user: 'test',
            name: 'lol'
        });

        // Request for the buttons on the main view
        $rootScope.sendObjectLog  = function () {
            cozenEnhancedLogs.info.explodeObject('Main', 'Object log test', {
                title      : 'Cozen',
                description: 'Front-End Developer',
                nationality: 'French'
            });
        };
        $rootScope.sendObjectLog2 = function () {
            cozenEnhancedLogs.info.explodeObject('Main', 'Object log test', {
                title      : 'Cozen',
                description: 'Front-End Developer',
                nationality: {
                    country: 'France',
                    town   : 'Tourcoing',
                    stree  : 'Rue du Clinquet'
                }
            });
        };

        // Auto log for test
        cozenEnhancedLogs.info.customMessage('Run', 'Custom message example');
        cozenEnhancedLogs.info.customMessage('Run', 'Custom message example');
        cozenEnhancedLogs.info.changeRouteWithParams('Run', 'fake.route', {
            lang : 'fr',
            title: 'My fake route'
        });
        cozenEnhancedLogs.info.explodeObject('Run', 'fake.route', {
            lang    : 'fr',
            title   : 'My fake route',
            access  : 3,
            callback: function () {
            },
            cars    : [
                'lambo',
                'ferrari'
            ],
            types   : {
                lang  : 'fr',
                title : 'My fake route',
                access: 3,
                types : {
                    lang  : 'fr',
                    title : 'My fake route',
                    access: 3
                }
            },
            deazd   : "sfzef"
        });
        cozenEnhancedLogs.wrap.end('Run');
    }

})(window.angular, window);
