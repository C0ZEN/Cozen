(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('TestCtrl', TestCtrl);

    TestCtrl.$inject = [];

    function TestCtrl() {
        var vm = this;

        vm.True  = true;
        vm.wrong = 'wrong';

        console.log('--- START TEST LOGS ---');
    }

})(window.angular);

