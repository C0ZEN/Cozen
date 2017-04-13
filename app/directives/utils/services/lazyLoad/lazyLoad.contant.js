(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.constant', [])
        .constant('cozenLazyLoadConstant', {
            last       : {
                lastName   : 'O\'Connor',
                firstName  : 'Cozen',
                email      : 'cozen.oconnor@cozen.com',
                gender     : null,
                nationality: null,
                domain     : null,
                length     : null,
                syllables  : null,
                word       : null,
                prefix     : null,
                birthday   : '16/4/1994',
                words      : null
            },
            cozenChance: new Chance()
        });

})(window.angular);