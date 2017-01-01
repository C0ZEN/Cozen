(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('DropdownCtrl', DropdownCtrl);

    DropdownCtrl.$inject = [];

    function DropdownCtrl() {
        var vm     = this;
        vm.onClick = function (id, index) {
            console.log(arguments);
        };
        vm.cars    = [
            {
                name: 'lambo',
                id  : 1
            },
            {
                name    : 'ferar',
                id      : 2,
                selected: true
            },
            {
                name: 'gtr',
                id  : 3
            }
        ];
        vm.names   = [
            {
                name: 'cozen',
                id  : 1
            },
            {
                name: 'djagataëlle',
                id  : 2
            },
            {
                name: 'O\'Connor',
                id  : 3
            }
        ];
    }

})(window.angular);

