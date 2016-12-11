(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider) {

        // Btn routes
        $stateProvider
            .state('examples.list', {
                abstract: true,
                url     : '/list',
                template: '<ui-view/>'
            })
            .state('examples.list.default', {
                url         : '/default',
                templateUrl : 'examples/list/templates/list.default.html',
                controller  : 'ListCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'List - Default'}
            });
    }

})(window.angular);
