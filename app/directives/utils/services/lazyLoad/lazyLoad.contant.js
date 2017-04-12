(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.constant', [])
        .constant('cozenLazyLoadConstant', {
            last: {
                lastName   : null,
                firstName  : null,
                email      : null,
                gender     : null,
                nationality: null,
                domain     : null
            }
        });

})(window.angular);