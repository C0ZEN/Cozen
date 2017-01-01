(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('TooltipCtrl', TooltipCtrl);

    TooltipCtrl.$inject = [];

    function TooltipCtrl() {
        var vm = this;
    }

})(window.angular);

