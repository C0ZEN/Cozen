(function (angular) {
    'use strict';

    angular
        .module('cozenLib.popup.factory', [])
        .factory('cozenPopupFactory', cozenPopupFactory);

    cozenPopupFactory.$inject = [
        '$rootScope'
    ];

    function cozenPopupFactory($rootScope) {
        return {
            show: show,
            hide: hide
        };

        function show(params) {
            $rootScope.$broadcast('cozenPopupShow', params);
        }

        function hide(params) {
            $rootScope.$broadcast('cozenPopupHide', params);
        }
    }

})(window.angular);

