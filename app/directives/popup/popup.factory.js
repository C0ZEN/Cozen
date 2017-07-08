(function (angular) {
    'use strict';

    angular
        .module('cozenLib.popup.factory', [])
        .factory('cozenPopupFactory', cozenPopupFactory);

    cozenPopupFactory.$inject = [
        '$rootScope'
    ];

    // jscs:disable jsDoc
    function cozenPopupFactory($rootScope) {

        // jscs:enable jsDoc
        return {
            hide: hide,
            show: show
        };

        function show(params) {
            $rootScope.$broadcast('cozenPopupShow', params);
        }

        function hide(params) {
            $rootScope.$broadcast('cozenPopupHide', params);
        }
    }

})(window.angular);

