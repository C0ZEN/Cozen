(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('PanelCtrl', PanelCtrl);

    PanelCtrl.$inject = [];

    function PanelCtrl() {
        var vm = this;
    }

})(window.angular);

