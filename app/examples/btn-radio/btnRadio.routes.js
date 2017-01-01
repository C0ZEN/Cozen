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
            .state('examples.btnRadio', {
                abstract: true,
                url     : '/btn-radio',
                template: '<ui-view/>'
            })
            .state('examples.btnRadio.default', {
                url         : '/default',
                templateUrl : 'examples/btn-radio/templates/btnRadio.default.html',
                controller  : 'BtnRadioCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'BtnRadio - Default'}
            });
    }

})(window.angular);
