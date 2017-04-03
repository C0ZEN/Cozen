(function (angular) {
    'use strict';

    angular
        .module('test')
        .run(run);

    run.$inject = [
        '$rootScope'
    ];

    function run($rootScope) {
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
        }
    }

})(window.angular);
