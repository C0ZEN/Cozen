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
            .state('examples.btnLazyTest', {
                abstract: true,
                url     : '/btn-lazy-test',
                template: '<ui-view/>'
            })
            .state('examples.btnLazyTest.default', {
                url         : '/default',
                templateUrl : 'examples/btn-lazy-test/templates/btnLazyTest.default.html',
                controller  : 'BtnLazyTestCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'BtnLazyTest - Default'}
            });
    }

})(window.angular);
