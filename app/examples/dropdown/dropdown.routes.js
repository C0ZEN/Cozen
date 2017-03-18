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
            .state('examples.dropdown', {
                abstract: true,
                url     : '/dropdown',
                template: '<ui-view/>'
            })
            .state('examples.dropdown.default', {
                url         : '/default',
                templateUrl : 'examples/dropdown/templates/dropdown.default.html',
                controller  : 'DropdownCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Dropdown - Default'}
            })
            .state('examples.dropdown.customHtml', {
                url         : '/custom-html',
                templateUrl : 'examples/dropdown/templates/dropdown.customHtml.html',
                controller  : 'DropdownCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Dropdown - Custom Html'}
            });
    }

})(window.angular);
