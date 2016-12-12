(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .controller('BtnToggleCtrl', BtnToggleCtrl);

  BtnToggleCtrl.$inject = [];

    function BtnToggleCtrl() {
        var vm    = this;
        vm.model1 = true;
        vm.model2 = false;
        vm.model3 = false;
        vm.modelx = true;
    }

})(window.angular);

