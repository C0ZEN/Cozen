(function (angular, window) {
    'use strict';

    if (typeof module !== 'undefined' &&
        typeof exports !== 'undefined' &&
        module.exports === exports) {
        module.exports = 'cozen-lib';
    }

    /**
     * @ngdoc overview
     * @name cozenLib
     * @description
     * # cozenLib
     *
     * Main module of the application.
     */
    angular
        .module('cozenLib', [
            'ngAnimate',
            'ngAria',
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'ui.router',
            'pascalprecht.translate',
            'ui.bootstrap',
            'ui.bootstrap.tooltip',
            'ngScrollbars',
            'uuid',
            'monospaced.elastic',

            'cozenLib.alert',
            'cozenLib.btn',
            'cozenLib.btnCheck',
            'cozenLib.btnRadio',
            'cozenLib.btnToggle',
            'cozenLib.dropdown',
            'cozenLib.form',
            'cozenLib.input',
            'cozenLib.list',
            'cozenLib.pagination',
            'cozenLib.panel',
            'cozenLib.popup',
            'cozenLib.textarea',
            'cozenLib.tooltip',
            'cozenLib.view'
        ]);

})(window.angular, window);
