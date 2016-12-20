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
            .state('examples.textarea', {
                abstract: true,
                url     : '/textarea',
                template: '<ui-view/>'
            })
            .state('examples.textarea.default', {
                url         : '/default',
                templateUrl : 'examples/textarea/templates/textarea.default.html',
                controller  : 'TextareaCtrl',
                controllerAs: 'vm',
                data        : {pageTitle: 'Textarea - Default'}
            });
    }

})(window.angular);
