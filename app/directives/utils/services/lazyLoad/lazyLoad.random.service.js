(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.randomService', [])
        .factory('cozenLazyLoadRandom', cozenLazyLoadRandom);

    cozenLazyLoadRandom.$inject = [
        'cozenLazyLoadConstant',
        'cozenLazyLoadInternal',
        'cozenEnhancedLogs'
    ];

    function cozenLazyLoadRandom(cozenLazyLoadConstant, cozenLazyLoadInternal, cozenEnhancedLogs) {
        return {
            getRandomLastName   : getRandomLastName,
            getRandomFirstName  : getRandomFirstName,
            getRandomEmail      : getRandomEmail,
            getRandomDomain     : getRandomDomain,
            getRandomWord       : getRandomWord,
            getRandomNamePrefix : getRandomNamePrefix,
            getRandomBirthday   : getRandomBirthday,
            getRandomSentence   : getRandomSentence,
            getRandomGender     : getRandomGender,
            getRandomNationality: getRandomNationality
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
         * @param {string} nationality = en   > Define the lang (en, it) [config.json]
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
                domain = getRandomDomain();
            }
            cozenLazyLoadConstant.last.domain = domain;
            cozenLazyLoadConstant.last.email  = cozenLazyLoadConstant.cozenChance.email({
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

        /**
         * Return a random prefix
         * @param {string} gender = male  > Define the gender (male, female) [config.json]
         * @param {string} full   = false > Return the prefix as a complete word (no shorthand)
         * @return {string} prefix
         */
        function getRandomNamePrefix(gender, full) {
            var prefix;
            if (Methods.isNullOrEmpty(full)) {
                full = false;
            }
            if (Methods.isNullOrEmpty(gender)) {
                prefix = cozenLazyLoadConstant.cozenChance.prefix({
                    full: full
                });
            }
            else {
                prefix = cozenLazyLoadConstant.cozenChance.prefix({
                    gender: gender,
                    full  : full
                });
            }
            cozenLazyLoadConstant.last.prefix = prefix;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomNamePrefix', prefix);
            return prefix;
        }

        /**
         * Return a random birthday
         * @param {boolean} string    = false > Return the birthday as a string
         * @param {boolean} timestamp = false > Return the birthday as a timestamp
         * @return {string|date|number} birthday
         */
        function getRandomBirthday(string, timestamp) {
            var birthday;
            if (Methods.isNullOrEmpty(string)) {
                string = false;
            }
            if (Methods.isNullOrEmpty(timestamp)) {
                timestamp = false;
            }
            birthday = cozenLazyLoadConstant.cozenChance.birthday({
                string: string
            });
            if (timestamp) {
                birthday = moment(birthday).unix();
            }
            cozenLazyLoadConstant.last.birthday = birthday;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomBirthday', birthday);
            return birthday;
        }

        /**
         * Return a random sentence
         * @param {number} words = 15 > The number of words [config.json]
         * @param {number} min        > Start for a random range of words
         * @param {number} max        > End for a random range of words
         * @return {string} sentence
         */
        function getRandomSentence(words, min, max) {
            var sentence;
            if (Methods.isNullOrEmpty(words)) {
                words = cozenLazyLoadInternal.getLastWords();
            }
            if (!Methods.isNullOrEmpty(min) && !Methods.isNullOrEmpty(max)) {
                words = Methods.getRandomFromRange(min, max);
            }
            sentence                         = cozenLazyLoadConstant.cozenChance.sentence({
                words: words
            });
            cozenLazyLoadConstant.last.words = words;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomSentence', sentence);
            return sentence;
        }

        /**
         * Return a random gender (male, female)
         * @returns {string} gender
         */
        function getRandomGender() {
            var genders                       = [
                'male',
                'female'
            ];
            var index                         = Methods.getRandomFromRange(0, genders.length - 1);
            var gender                        = genders[index];
            cozenLazyLoadConstant.last.gender = gender;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomGender', gender);
            return gender;
        }

        /**
         * Return a random nationality (en, it)
         * @returns {string} nationality
         */
        function getRandomNationality() {
            var nationalities                      = [
                'en',
                'it'
            ];
            var index                              = Methods.getRandomFromRange(0, nationalities.length - 1);
            var nationality                        = nationalities[index];
            cozenLazyLoadConstant.last.nationality = nationality;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomNationality', nationality);
            return nationality;
        }

        /**
         * Return a random avatar from Gravatar
         * @param {string} fileExtension > Force to have an avatar with a specific file extension
         * @param {string} email         > Get the avatar for this user email
         * @returns {string} avatar
         */
        function getRandomAvatar(fileExtension, email) {
            var avatar;
            if (!Methods.isNullOrEmpty(email)) {
                avatar = cozenLazyLoadConstant.cozenChance.avatar({
                    email: email
                });
            }
            else if (!Methods.isNullOrEmpty(fileExtension)) {
                avatar = cozenLazyLoadConstant.cozenChance.avatar({
                    fileExtension: fileExtension
                });
            }
            else {
                avatar = cozenLazyLoadConstant.cozenChance.avatar();
            }
            cozenLazyLoadConstant.last.avatar = avatar;
            cozenEnhancedLogs.info.lazyLoadLog('cozenLazyLoadRandom', 'getRandomAvatar', avatar);
            return avatar;
        }
    }

})(window.angular);