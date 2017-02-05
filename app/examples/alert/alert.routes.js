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

        // Alert routes
        $stateProvider
            .state('examples.alert', {
                abstract: true,
                url     : '/alert',
                template: '<ui-view/>'
            })
            .state('examples.alert.default', {
                url         : '/default',
                templateUrl : 'examples/alert/templates/alert.default.html',
                controller  : 'AlertCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Alert - Default'}
            })
            .state('examples.alert.floatingFeed', {
                url         : '/floating-feed',
                templateUrl : 'examples/alert/templates/alert.floatingFeed.html',
                controller  : 'AlertCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Alert - Floating Feed'}
            });
    }

})(window.angular);
