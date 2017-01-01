(function (angular) {
    'use strict';

    angular
        .module('test')
        .controller('PopupCtrl', PopupCtrl);

    PopupCtrl.$inject = [
        'cozenPopupFactory'
    ];

    function PopupCtrl(cozenPopupFactory) {
        var vm         = this;
        vm.togglePopup = function (name) {
            cozenPopupFactory.show({
                name: name
            });
        };
    }

})(window.angular);
