(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('AlertCtrl', AlertCtrl);

    AlertCtrl.$inject = [];

    function AlertCtrl() {
        var vm = this;
    }

})(window.angular);
