(function (angular) {
    'use strict';

    angular
        .module('test')
        .run(run);

    run.$inject = [
        '$rootScope'
    ];

    function run($rootScope) {
        $rootScope.sendObjectLog = function () {
            Methods.infoObjectLog('Main', 'Object log test', {
                title      : 'Cozen',
                description: 'Front-End Developer',
                nationality: 'French'
            });
        }
    }

})(window.angular);
