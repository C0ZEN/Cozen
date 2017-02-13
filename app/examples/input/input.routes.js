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
            .state('examples.input', {
                abstract: true,
                url     : '/input',
                template: '<ui-view/>'
            })
            .state('examples.input.default', {
                url         : '/default',
                templateUrl : 'examples/input/templates/input.default.html',
                controller  : 'InputCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Input - Default'}
            })
            .state('examples.input.repeat', {
                url         : '/repeat',
                templateUrl : 'examples/input/templates/input.repeat.html',
                controller  : 'InputCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Input - Repeat'}
            });
    }

})(window.angular);
