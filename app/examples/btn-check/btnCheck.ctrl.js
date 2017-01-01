(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('BtnCheckCtrl', BtnCheckCtrl);

  BtnCheckCtrl.$inject = [];

    function BtnCheckCtrl() {
        var vm    = this;
        vm.model1 = true;
        vm.model2 = false;
        vm.model3 = false;
        vm.modelx = true;
    }

})(window.angular);

