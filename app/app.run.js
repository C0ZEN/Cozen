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
    }

})(window.angular, window);
