(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('PillsCtrl', PillsCtrl);

    PillsCtrl.$inject = [];

    function PillsCtrl() {
        var vm = this;
    }

})(window.angular);

