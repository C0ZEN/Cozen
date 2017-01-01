(function (angular) {
    'use strict';

    angular
        .module('test')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        // Main abstract route (parent)
        $stateProvider
            .state('main', {
                url        : '/main',
                templateUrl: 'examples/main.html',
                data       : {pageTitle: 'Main'}
            })
            .state('examples', {
                abstract: true,
                url     : '/examples',
                template: '<ui-view/>'
            });

        // Other routes
        $urlRouterProvider.otherwise('/main');
    }

})(window.angular);
