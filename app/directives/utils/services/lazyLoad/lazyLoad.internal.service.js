(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.internalService', [])
        .factory('cozenLazyLoadInternal', cozenLazyLoadInternal);

    cozenLazyLoadInternal.$inject = [
        'CONFIG',
        'cozenLazyLoadConstant'
    ];

    function cozenLazyLoadInternal(CONFIG, cozenLazyLoadConstant) {
        return {
            getLastLastName   : getLastLastName,
            getLastFirstName  : getLastFirstName,
            getLastEmail      : getLastEmail,
            getLastGender     : getLastGender,
            getLastNationality: getLastNationality,
            getLastDomain     : getLastDomain
        };

        /// INTERNAL METHODS WITH REQUIRED LAST DATA ///

        function getLastLastName() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.lastName)) {
                // @todo handle error
                return null;
            }
            return cozenLazyLoadConstant.last.lastName;
        }

        function getLastFirstName() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.firstName)) {
                // @todo handle error
                return null;
            }
            return cozenLazyLoadConstant.last.firstName;
        }

        function getLastEmail() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.email)) {
                // @todo handle error
                return null;
            }
            return cozenLazyLoadConstant.last.email;
        }

        /// INTERNAL METHODS WITH CONFIG CALLBACK WHEN LAST DATA EMPTY ///

        function getLastGender() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.gender)) {
                cozenLazyLoadConstant.last.gender = CONFIG.btnLazyTest.service.gender;
            }
            return cozenLazyLoadConstant.last.gender;
        }

        function getLastNationality() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.lang)) {
                cozenLazyLoadConstant.last.lang = CONFIG.btnLazyTest.service.lang;
            }
            return cozenLazyLoadConstant.last.lang;
        }

        function getLastDomain() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.domain)) {
                cozenLazyLoadConstant.last.domain = CONFIG.btnLazyTest.service.domain;
            }
            return cozenLazyLoadConstant.last.domain;
        }
    }

})(window.angular);