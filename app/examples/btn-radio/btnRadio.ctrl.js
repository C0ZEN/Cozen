(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .controller('BtnRadioCtrl', BtnRadioCtrl);

    BtnRadioCtrl.$inject = [];

    function BtnRadioCtrl() {
        var vm    = this;
        vm.model1 = true;
        vm.model2 = false;
        vm.model3 = false;
        vm.modelx = true;
    }

})(window.angular);

