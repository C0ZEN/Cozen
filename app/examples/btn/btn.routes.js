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
            .state('examples.btn', {
                abstract: true,
                url     : '/btn',
                template: '<ui-view/>'
            })
            .state('examples.btn.default', {
                url         : '/default',
                templateUrl : 'examples/btn/templates/btn.default.html',
                controller  : 'BtnCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Btn - Default'}
            })
            .state('examples.btn.primary', {
                url         : '/primary',
                templateUrl : 'examples/btn/templates/btn.primary.html',
                controller  : 'BtnCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Btn - Primary'}
            })
            .state('examples.btn.upload', {
                url         : '/upload',
                templateUrl : 'examples/btn/templates/btn.upload.html',
                controller  : 'BtnCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Btn - Upload'}
            });
    }

})(window.angular);
