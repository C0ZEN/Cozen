(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('DropdownCtrl', DropdownCtrl);

    DropdownCtrl.$inject = [];

    function DropdownCtrl() {
        var vm       = this;
        vm.grgege    = 'ffzfzf';
        vm.onClick   = function (id, index) {
            console.log(arguments);
        };
        vm.form      = {};
        vm.cars      = [
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
        vm.names     = [
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
        vm.status    = [
            {
                id      : 'online',
                name    : 'other_status_online',
                selected: true,
                color   : '#2ecc71'
            },
            {
                id      : 'absent',
                name    : 'other_status_absent',
                selected: false,
                color   : '#e67e22'
            },
            {
                id      : 'busy',
                name    : 'other_status_busy',
                selected: false,
                color   : '#e74c3c'
            },
            {
                id      : 'off',
                name    : 'other_status_off',
                selected: false,
                color   : '#95a5a6'
            }
        ];
        vm.languages = [
            {
                key     : 'fr',
                label   : 'Français',
                selected: true
            },
            {
                key     : 'en',
                label   : 'English',
                selected: false
            }
        ]
    }

})(window.angular);

