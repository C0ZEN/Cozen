(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.randomService', [])
        .factory('cozenLazyLoadRandom', cozenLazyLoadRandom);

    cozenLazyLoadRandom.$inject = [
        'cozenLazyLoadConstant',
        'cozenLazyLoadInternal',
        'cozenEnhancedLogs',
        '$filter'
    ];

    function cozenLazyLoadRandom(cozenLazyLoadConstant, cozenLazyLoadInternal, cozenEnhancedLogs, $filter) {
        return {
            getRandomLastName : getRandomLastName,
            getRandomFirstName: getRandomFirstName,
            getRandomEmail    : getRandomEmail,
            getRandomDomain   : getRandomDomain,
            getRandomWord     : getRandomWord
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
            cozenLazyLoadConstant.last.lastName = cozenLazyLoadConstant.cozenChance.last({
                nationality: nationality
            });
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomLastName', cozenLazyLoadConstant.last.lastName);
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
            cozenLazyLoadConstant.last.firstName = cozenLazyLoadConstant.cozenChance.first({
                gender     : gender,
                nationality: nationality
            });
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomFirstName', cozenLazyLoadConstant.last.firstName);
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
            cozenLazyLoadConstant.last.email = cozenLazyLoadConstant.cozenChance.email({
                domain: domain
            }).toLowerCase();
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomEmail', cozenLazyLoadConstant.last.email);
            return cozenLazyLoadConstant.last.email;
        }

        /**
         * Return a random domain
         * Note that you can't combine length and syllables (to use syllables, send length as null in parameters)
         * @param {number} length    = 5 > The length of the characters for the prefix domain name
         * @param {number} syllables = 3 > The number of syllables for the prefix domain name
         * @returns {string} domain
         */
        function getRandomDomain(length, syllables) {
            var firstWord                     = getRandomWord(length, syllables);
            var secondWord                    = cozenLazyLoadConstant.cozenChance.tld();
            cozenLazyLoadConstant.last.domain = firstWord + '.' + secondWord;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomDomain', cozenLazyLoadConstant.last.domain);
            return cozenLazyLoadConstant.last.domain;
        }

        /**
         * Return a random word
         * Note that you can't combine length and syllables (to use syllables, send length as null in parameters)
         * @param {number} length    = 5 > The length of the characters for the prefix domain name
         * @param {number} syllables = 3 > The number of syllables for the prefix domain name
         * @returns {string} word
         */
        function getRandomWord(length, syllables) {
            if (Methods.isNullOrEmpty(length)) {
                if (!Methods.isNullOrEmpty(syllables)) {
                    cozenLazyLoadConstant.last.syllables = syllables;
                    cozenLazyLoadConstant.last.word      = cozenLazyLoadConstant.cozenChance.word({
                        syllables: syllables
                    });
                }
                else {
                    cozenLazyLoadConstant.last.word = cozenLazyLoadConstant.cozenChance.word();
                }
            }
            else {
                cozenLazyLoadConstant.last.length = length;
                cozenLazyLoadConstant.last.word   = cozenLazyLoadConstant.cozenChance.word({
                    length: length
                });
            }
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomWord', cozenLazyLoadConstant.last.word);
            return cozenLazyLoadConstant.last.word;
        }
    }

})(window.angular);