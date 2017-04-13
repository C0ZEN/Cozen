(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.userMixins', [
            'cozenLib.lazyLoad.userMixins.user'
        ])
        .factory('cozenLazyLoadMixins', cozenLazyLoadMixins);

    cozenLazyLoadMixins.$inject = [
        'cozenLazyLoadMixinUser'
    ];

    function cozenLazyLoadMixins(cozenLazyLoadMixinUser) {
        return {
            getUserMixin: cozenLazyLoadMixinUser.getUserMixin
        };
    }

})(window.angular);