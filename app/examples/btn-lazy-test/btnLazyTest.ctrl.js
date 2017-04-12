(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('BtnLazyTestCtrl', BtnLazyTestCtrl);

    BtnLazyTestCtrl.$inject = [
        'cozenEnhancedLogs',
        'cozenLazyLoadRandom'
    ];

    function BtnLazyTestCtrl(cozenEnhancedLogs, cozenLazyLoadRandom) {
        var vm = this;

        vm.getLastName = function () {
            var lastName = cozenLazyLoadRandom.getLastName();
            cozenEnhancedLogs.info.customMessageEnhanced('BtnLazyTestCtrl', 'getLastName', lastName, 'executed');
        }
    }

})(window.angular);

