(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.constant', [])
        .constant('cozenLazyLoadConstant', {
            last       : {
                lastName   : 'O\'Connor',
                firstName  : 'Cozen',
                email      : 'cozen.oconnor@cozen.com',
                gender     : 'male',
                nationality: 'en',
                domain     : 'cozen.com'
            },
            cozenChance: new Chance()
        });

})(window.angular);