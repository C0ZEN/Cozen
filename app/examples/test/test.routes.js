(function (angular) {
    'use strict';

    angular
        .module('test')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider) {

        // Test routes
        $stateProvider
            .state('examples.test', {
                abstract: true,
                url     : '/test',
                template: '<ui-view/>'
            })
            .state('examples.test.default', {
                url         : '/default',
                templateUrl : 'examples/test/templates/test.default.html',
                controller  : 'TestCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Test - Default'}
            });
    }

})(window.angular);
