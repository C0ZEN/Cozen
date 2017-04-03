(function (angular) {
    'use strict';

    angular
        .module('test')
        .run(run);

    run.$inject = [
        '$rootScope',
        'cozenEnhancedLogs'
    ];

    function run($rootScope, cozenEnhancedLogs) {

        // Request for the buttons on the main view
        $rootScope.sendObjectLog  = function () {
            Methods.infoObjectLog('Main', 'Object log test', {
                title      : 'Cozen',
                description: 'Front-End Developer',
                nationality: 'French'
            });
        };
        $rootScope.sendObjectLog2 = function () {
            Methods.infoObjectLog('Main', 'Object log test', {
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
    }

})(window.angular);
