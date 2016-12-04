(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .provider('Config', ConfigProvider);

    ConfigProvider.$inject = [
        'CONFIG'
    ];

    function ConfigProvider(CONFIG) {

        this.scrollsBar = function (value) {
            if (typeof value != 'boolean') {
                console.error('%c<%cscrollsBar%c> must be <%ctrue%c> or <%cfalse%c>',
                    getConsoleColor(),
                    getConsoleColor('red'),
                    getConsoleColor(),
                    getConsoleColor('purple'),
                    getConsoleColor(),
                    getConsoleColor('purple'),
                    getConsoleColor()
                );
            } else {
                CONFIG.config.scrollsBar = value;
            }
            return this;
        };

        this.debug = function (value) {
            if (typeof value != 'boolean') {
                console.error('%c<%cdebug%c> must be <%ctrue%c> or <%cfalse%c>',
                    getConsoleColor(),
                    getConsoleColor('red'),
                    getConsoleColor(),
                    getConsoleColor('purple'),
                    getConsoleColor(),
                    getConsoleColor('purple'),
                    getConsoleColor()
                );
            } else {
                CONFIG.config.debug = value;
            }
            return this;
        };

        this.scrollsBarConfig = function (config) {
            if (typeof config != 'object') {
                console.error('%c<%cscrollsBarConfig%c> must be an <%cobject%c>',
                    getConsoleColor(),
                    getConsoleColor('red'),
                    getConsoleColor(),
                    getConsoleColor('purple'),
                    getConsoleColor()
                );
            } else {
                CONFIG.config.scrollsBarConfig = config;
            }
            return this;
        };

        this.$get = Config;

        Config.$inject = [];

        function Config() {
            return {};
        }
    }

})(window.angular);