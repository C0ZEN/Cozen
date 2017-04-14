(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.preBuildService', [])
        .factory('cozenLazyLoadPreBuild', cozenLazyLoadPreBuild);

    cozenLazyLoadPreBuild.$inject = [
        'cozenLazyLoadInternal',
        'cozenLazyLoadConstant',
        'cozenLazyLoadRandom',
        'cozenLazyLoadMemory',
        'cozenEnhancedLogs',
        '$filter',
        'CONFIG',
        '$rootScope'
    ];

    function cozenLazyLoadPreBuild(cozenLazyLoadInternal, cozenLazyLoadConstant, cozenLazyLoadRandom, cozenLazyLoadMemory,
                                   cozenEnhancedLogs, $filter, CONFIG, $rootScope) {
        return {
            getPreBuildSimpleUser: getPreBuildSimpleUser
        };

        /// PRE BUILD METHODS (use other services to create ready to be used objects) ///

        /**
         * Return a simple user object with most common keys required for a register
         * @param {string} cozenFormName        > If set, a broadcast message will be send to force the touch and dirty on form's elements
         * @param {string} gender        = male > Define the gender (male, female) [config.json]
         * @param {string} nationality   = en   > Define the lang (en, it) [config.json]
         * @return {object} firstName, lastName, email, username
         */
        function getPreBuildSimpleUser(cozenFormName, gender, nationality) {

            // Override the arguments if necessary
            if (Methods.isNullOrEmpty(gender)) {
                gender = cozenLazyLoadRandom.getRandomGender();
            }
            cozenLazyLoadConstant.last.gender = gender;
            if (Methods.isNullOrEmpty(nationality)) {
                nationality = cozenLazyLoadRandom.getRandomNationality();
            }
            cozenLazyLoadConstant.last.nationality = nationality;

            // Log
            cozenLazyLoadRandom.getRandomDomain();
            var _firstName = cozenLazyLoadRandom.getRandomFirstName(gender, nationality);
            var _lastName  = cozenLazyLoadRandom.getRandomLastName(nationality);
            var _prefix    = cozenLazyLoadRandom.getRandomNamePrefix(gender, true);
            var simpleUser = {
                firstName    : _firstName,
                lastName     : _lastName,
                fullName     : _firstName + ' ' + _lastName,
                prefix       : _prefix,
                email        : cozenLazyLoadMemory.getMemoryEmail(),
                username     : $filter('cozenCapitalize')(cozenLazyLoadRandom.getRandomWord(8, true, true)),
                gender       : gender,
                nationality  : nationality,
                password     : CONFIG.btnLazyTest.service.password,
                checkPassword: CONFIG.btnLazyTest.service.password,
                birthday     : cozenLazyLoadRandom.getRandomBirthday(false, true)
            };
            cozenEnhancedLogs.info.lazyLoadLogObject('cozenLazyLoadPreBuild', 'getPreBuildSimpleUser', simpleUser);

            // Broadcast event for a specific cozen form
            if (!Methods.isNullOrEmpty(cozenFormName)) {
                cozenEnhancedLogs.info.broadcastEvent('getPreBuildSimpleUser', 'cozenLazyLoadDataGenerated');
                $rootScope.$broadcast('cozenLazyLoadDataGenerated', {
                    cozenFormName: cozenFormName
                });
            }

            // Return the simple user object
            return simpleUser;
        }
    }

})(window.angular);