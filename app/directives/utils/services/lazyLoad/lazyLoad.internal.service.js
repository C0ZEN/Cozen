(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad.internalService', [])
        .factory('cozenLazyLoadInternal', cozenLazyLoadInternal);

    cozenLazyLoadInternal.$inject = [
        'CONFIG',
        'cozenLazyLoadConstant',
        'cozenEnhancedLogs',
        '$rootScope'
    ];

    function cozenLazyLoadInternal(CONFIG, cozenLazyLoadConstant, cozenEnhancedLogs, $rootScope) {
        return {
            sendBroadcastForm    : sendBroadcastForm,
            sendBroadcastBtnClick: sendBroadcastBtnClick,
            getLastLastName      : getLastLastName,
            getLastFirstName     : getLastFirstName,
            getLastEmail         : getLastEmail,
            getLastGender        : getLastGender,
            getLastNationality   : getLastNationality,
            getLastDomain        : getLastDomain,
            getLastLength        : getLastLength,
            getLastSyllables     : getLastSyllables,
            getLastWord          : getLastWord,
            getLastPrefix        : getLastPrefix,
            getLastWords         : getLastWords,
            getLastBirthday      : getLastBirthday,
            getLastAvatar        : getLastAvatar
        };

        /// INTERNAL METHODS ///

        function sendBroadcastForm(cozenFormName) {
            if (!Methods.isNullOrEmpty(cozenFormName)) {
                cozenEnhancedLogs.info.broadcastEvent('sendBroadcastForm', 'cozenLazyLoadDataGenerated');
                $rootScope.$broadcast('cozenLazyLoadDataGenerated', {
                    cozenFormName: cozenFormName
                });
            }
        }

        function sendBroadcastBtnClick(cozenBtnId) {
            if (!Methods.isNullOrEmpty(cozenBtnId)) {
                cozenEnhancedLogs.info.broadcastEvent('sendBroadcastBtnClick', 'cozenBtnFakeClick');
                $rootScope.$broadcast('cozenBtnFakeClick', {
                    cozenBtnId: cozenBtnId
                });
            }
        }

        function getLastLastName() {
            return cozenLazyLoadConstant.last.lastName;
        }

        function getLastFirstName() {
            return cozenLazyLoadConstant.last.firstName;
        }

        function getLastEmail() {
            return cozenLazyLoadConstant.last.email;
        }

        /// INTERNAL METHODS WITH DEFAULT VALUES ON CONFIG ///

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

        function getLastLength() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.length)) {
                cozenLazyLoadConstant.last.length = CONFIG.btnLazyTest.service.length;
            }
            return cozenLazyLoadConstant.last.length;
        }

        function getLastSyllables() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.syllables)) {
                cozenLazyLoadConstant.last.syllables = CONFIG.btnLazyTest.service.syllables;
            }
            return cozenLazyLoadConstant.last.syllables;
        }

        function getLastWord() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.word)) {
                cozenLazyLoadConstant.last.word = CONFIG.btnLazyTest.service.word;
            }
            return cozenLazyLoadConstant.last.word;
        }

        function getLastPrefix() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.prefix)) {
                cozenLazyLoadConstant.last.prefix = CONFIG.btnLazyTest.service.prefix;
            }
            return cozenLazyLoadConstant.last.prefix;
        }

        function getLastWords() {
            if (Methods.isNullOrEmpty(cozenLazyLoadConstant.last.words)) {
                cozenLazyLoadConstant.last.words = CONFIG.btnLazyTest.service.words;
            }
            return cozenLazyLoadConstant.last.words;
        }

        function getLastBirthday() {
            return cozenLazyLoadConstant.last.birthday;
        }

        function getLastAvatar() {
            return cozenLazyLoadConstant.last.avatar;
        }
    }

})(window.angular);