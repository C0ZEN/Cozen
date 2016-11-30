(function (angular) {
  'use strict';

  angular
    .module('cozenLibApp')
    .config(config);

  config.$inject = [
    '$stateProvider',
    '$urlRouterProvider'
  ];

  function config($stateProvider, $urlRouterProvider) {

    // Main abstract route (parent)
    $stateProvider
      .state('examples', {
        url        : '/examples',
        templateUrl: 'examples/main.html',
        data       : {pageTitle: 'Examples'}
      });

    // Other routes
    $urlRouterProvider.otherwise('/examples');
  }

})(window.angular);
