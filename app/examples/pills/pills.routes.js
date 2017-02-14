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

        // Btn routes
        $stateProvider
            .state('examples.pills', {
                abstract: true,
                url     : '/pills',
                template: '<ui-view/>'
            })
            .state('examples.pills.default', {
                url         : '/default',
                templateUrl : 'examples/pills/templates/pills.default.html',
                controller  : 'PillsCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Pills - Default'}
            });
    }

})(window.angular);
