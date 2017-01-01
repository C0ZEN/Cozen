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
            .state('examples.pagination', {
                abstract: true,
                url     : '/pagination',
                template: '<ui-view/>'
            })
            .state('examples.pagination.default', {
                url         : '/default',
                templateUrl : 'examples/pagination/templates/pagination.default.html',
                controller  : 'PaginationCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Pagination - Default'}
            });
    }

})(window.angular);
