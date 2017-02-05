(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('AlertCtrl', AlertCtrl);

    AlertCtrl.$inject = [
        'cozenFloatingFeedFactory'
    ];

    function AlertCtrl(cozenFloatingFeedFactory) {
        var vm          = this;
        vm.floatingFeed = cozenFloatingFeedFactory;
    }

})(window.angular);
