(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('CozenLazyLoad', CozenLazyLoadProvider);

    CozenLazyLoadProvider.$inject = [
        'CONFIG'
    ];

    function CozenLazyLoadProvider(CONFIG) {

        this.log = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('btnLazyTestLog');
            }
            else {
                CONFIG.btnLazyTest.log = value;
            }
            return this;
        };

        this.iconClass = function (value) {
            CONFIG.btnLazyTest.icon.class = value;
            return this;
        };

        this.positionTop = function (value) {
            CONFIG.btnLazyTest.position.top = value;
            return this;
        };

        this.positionLeft = function (value) {
            CONFIG.btnLazyTest.position.left = value;
            return this;
        };

        this.serviceLang = function (value) {
            var list = [
                'en',
                'it'
            ];
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('serviceLang', list);
            }
            else {
                CONFIG.btnLazyTest.service.lang = value;
            }
            return this;
        };

        this.serviceMale = function (value) {
            var list = [
                'male',
                'female'
            ];
            if (!Methods.isInList(list, value)) {
                Methods.dataMustBeInThisList('serviceMale', list);
            }
            else {
                CONFIG.btnLazyTest.service.male = value;
            }
            return this;
        };

        this.serviceDomain = function (value) {
            CONFIG.btnLazyTest.service.domain = value;
            return this;
        };

        this.serviceLength = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('serviceLength');
            }
            else {
                CONFIG.btnLazyTest.service.length = value;
            }
            return this;
        };

        this.serviceSyllables = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('serviceSyllables');
            }
            else {
                CONFIG.btnLazyTest.service.syllables = value;
            }
            return this;
        };

        this.serviceWord = function (value) {
            CONFIG.btnLazyTest.service.word = value;
            return this;
        };

        this.servicePrefix = function (value) {
            CONFIG.btnLazyTest.service.prefix = value;
            return this;
        };

        this.servicePassword = function (value) {
            CONFIG.btnLazyTest.service.password = value;
            return this;
        };

        this.serviceWords = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('serviceWords');
            }
            else {
                CONFIG.btnLazyTest.service.words = value;
            }
            return this;
        };

        this.$get = CozenLazyLoad;

        CozenLazyLoad.$inject = [
            'CONFIG'
        ];

        function CozenLazyLoad(CONFIG) {
            return {
                getCozenLazyLoadConfig: getCozenLazyLoadConfig
            };

            function getCozenLazyLoadConfig() {
                return CONFIG.btnLazyTest;
            }
        }
    }

})(window.angular);