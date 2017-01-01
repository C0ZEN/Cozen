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
            .state('examples.btnToggle', {
                abstract: true,
                url     : '/btn-toggle',
                template: '<ui-view/>'
            })
            .state('examples.btnToggle.default', {
                url         : '/default',
                templateUrl : 'examples/btn-toggle/templates/btnToggle.default.html',
                controller  : 'BtnToggleCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'btnToggle - Default'}
            });
    }

})(window.angular);
