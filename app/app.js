(function (angular) {
  'use strict';

  /**
   * @ngdoc overview
   * @name cozenLibApp
   * @description
   * # cozenLibApp
   *
   * Main module of the application.
   */
  angular
    .module('cozenLibApp', [
      'ngAnimate',
      'ngAria',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ui.router'
    ])
    .config(config)
    .run(run);

  config.$inject = [
    '$locationProvider'
  ];

  // Global configuration
  function config($locationProvider) {

    // Configure the location provider
    $locationProvider.html5Mode({
      enabled    : false,
      requireBase: false
    });
  }

  run.$inject = [
    '$rootScope',
    '$state'
  ];

  function run($rootScope, $state) {
    $rootScope.$state = $state;
  }

})(window.angular);
