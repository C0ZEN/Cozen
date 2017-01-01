(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('PaginationCtrl', PaginationCtrl);

    PaginationCtrl.$inject = [];

    function PaginationCtrl() {
        var vm = this;
    }

})(window.angular);

