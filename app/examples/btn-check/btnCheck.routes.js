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
            .state('examples.btnCheck', {
                abstract: true,
                url     : '/btn-check',
                template: '<ui-view/>'
            })
            .state('examples.btnCheck.default', {
                url         : '/default',
                templateUrl : 'examples/btn-check/templates/btnCheck.default.html',
                controller  : 'BtnCheckCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'BtnCheck - Default'}
            });
    }

})(window.angular);
