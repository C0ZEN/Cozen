(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('BtnCtrl', BtnCtrl);

    BtnCtrl.$inject = [];

    function BtnCtrl() {
        var vm = this;
    }

})(window.angular);

