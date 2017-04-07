(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('InputCtrl', InputCtrl);

    InputCtrl.$inject = [
        'rfc4122'
    ];

    function InputCtrl(rfc4122) {
        var vm            = this;
        vm.model0         = 'Un texte';
        vm.model1         = 'model1';
        vm.model2         = 'model2';
        vm.model3         = 'model3';
        vm.model4         = null;
        vm.model5         = '';
        vm.number         = 8;
        vm.passwordConfig = {
            minLength: 8
        };
        vm.newGroup       = {
            channels: []
        };
        vm.addChannel     = function (name) {
            vm.newGroup.channels.push({
                name   : name,
                default: true,
                id     : rfc4122.v4()
            });
        };
        vm.addChannel('fzefzef');
    }

})(window.angular);

