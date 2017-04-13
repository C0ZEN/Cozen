(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('BtnLazyTestCtrl', BtnLazyTestCtrl);

    BtnLazyTestCtrl.$inject = [
        'cozenLazyLoadRandom',
        'cozenLazyLoadMemory'
    ];

    function BtnLazyTestCtrl(cozenLazyLoadRandom, cozenLazyLoadMemory) {
        var vm                 = this;
        vm.leftCol1            = '30px';
        vm.defaultHeight       = 50;
        vm.espaceHeight        = 50;
        vm.cozenLazyLoadRandom = cozenLazyLoadRandom;
        vm.cozenLazyLoadMemory = cozenLazyLoadMemory;
    }

})(window.angular);

