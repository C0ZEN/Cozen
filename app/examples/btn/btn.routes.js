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
            });
    }

})(window.angular);
