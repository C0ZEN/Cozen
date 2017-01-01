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
            .state('examples.tooltip', {
                abstract: true,
                url     : '/tooltip',
                template: '<ui-view/>'
            })
            .state('examples.tooltip.default', {
                url         : '/default',
                templateUrl : 'examples/tooltip/templates/tooltip.default.html',
                controller  : 'TooltipCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Tooltip - Default'}
            });
    }

})(window.angular);
