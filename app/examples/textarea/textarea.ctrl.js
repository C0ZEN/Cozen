(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('TextareaCtrl', TextareaCtrl);

    TextareaCtrl.$inject = [];

    function TextareaCtrl() {
        var vm    = this;
        vm.model0 = 'Un texte';
    }

})(window.angular);

