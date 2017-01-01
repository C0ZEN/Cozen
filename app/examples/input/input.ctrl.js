(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('InputCtrl', InputCtrl);

    InputCtrl.$inject = [];

    function InputCtrl() {
        var vm            = this;
        vm.model0         = 'Un texte';
        vm.model1         = 'model1';
        vm.model2         = 'model2';
        vm.model3         = 'model3';
        vm.model4         = null;
        vm.model5         = '';
        vm.passwordConfig = {
            minLength: 8
        }
    }

})(window.angular);

