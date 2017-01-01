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

        // Popup routes
        $stateProvider
            .state('examples.popup', {
                abstract: true,
                url     : '/popup',
                template: '<ui-view/>'
            })
            .state('examples.popup.default', {
                url         : '/default',
                templateUrl : 'examples/popup/templates/popup.default.html',
                controller  : 'PopupCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Popup - Default'}
            });
    }

})(window.angular);
