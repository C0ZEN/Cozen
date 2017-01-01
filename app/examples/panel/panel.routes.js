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
            .state('examples.panel', {
                abstract: true,
                url     : '/panel',
                template: '<ui-view/>'
            })
            .state('examples.panel.default', {
                url         : '/default',
                templateUrl : 'examples/panel/templates/panel.default.html',
                controller  : 'PanelCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Panel - Default'}
            });
    }

})(window.angular);
