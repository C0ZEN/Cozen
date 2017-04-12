(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.randomService', [])
        .factory('cozenLazyLoadRandom', cozenLazyLoadRandom);

    cozenLazyLoadRandom.$inject = [
        'cozenLazyLoadConstant',
        'cozenLazyLoadInternal'
    ];

    function cozenLazyLoadRandom(cozenLazyLoadConstant, cozenLazyLoadInternal) {
        return {
            getLastName : getRandomLastName,
            getFirstName: getRandomFirstName,
            getEmail    : getRandomEmail
        };

        /// RANDOM METHODS ///

        /**
         * Return a random last name
         * @param {string} nationality = en > Define the lang (en, it) [config.json]
         * @return {string} lastName
         */
        function getRandomLastName(nationality) {
            if (Methods.isNullOrEmpty(nationality)) {
                nationality = cozenLazyLoadInternal.getLastNationality();
            }
            else {
                cozenLazyLoadConstant.last.nationality = nationality;
            }
            cozenLazyLoadConstant.last.lastName = chance.last({
                nationality: nationality
            });
            return cozenLazyLoadConstant.last.lastName;
        }

        /**
         * Return a random first name
         * @param {string} gender      = male > Define the gender (male, female) [config.json]
         * @param {string} nationality = us   > Define the lang (us, it) [config.json]
         * @return {string} firstName
         */
        function getRandomFirstName(gender, nationality) {
            if (Methods.isNullOrEmpty(gender)) {
                gender = cozenLazyLoadInternal.getLastGender();
            }
            else {
                cozenLazyLoadConstant.last.gender = gender;
            }
            if (Methods.isNullOrEmpty(nationality)) {
                nationality = cozenLazyLoadInternal.getLastNationality();
            }
            else {
                cozenLazyLoadConstant.last.nationality = nationality;
            }
            cozenLazyLoadConstant.last.firstName = Chance.first({
                gender     : gender,
                nationality: nationality
            });
            return cozenLazyLoadConstant.last.firstName;
        }

        /**
         * Return a random email
         * @param {string} domain = cozen.com > Define the domain after the @ [config.json]
         * @return {string} email
         */
        function getRandomEmail(domain) {
            if (Methods.isNullOrEmpty(domain)) {
                domain = cozenLazyLoadInternal.getLastDomain();
            }
            else {
                cozenLazyLoadConstant.last.domain = domain;
            }
            cozenLazyLoadConstant.last.email = Chance.email({
                domain: domain
            });
            return cozenLazyLoadConstant.last.email;
        }
    }

})(window.angular);