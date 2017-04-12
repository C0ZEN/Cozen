(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('BtnLazyTestCtrl', BtnLazyTestCtrl);

    BtnLazyTestCtrl.$inject = [];

    function BtnLazyTestCtrl() {
        var vm = this;
    }

})(window.angular);

