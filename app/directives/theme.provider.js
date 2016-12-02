(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .provider('Themes', ThemesProvider);

    ThemesProvider.$inject = [
        'CONFIG'
    ];

    function ThemesProvider(CONFIG) {
        var activeTheme = CONFIG.config.themes[0];

        this.setActiveTheme = function (theme) {
            if (!Methods.isInList(CONFIG.config.themes, theme)) {
                console.error('The theme <' + theme + '> is not in the list of available themes.\n' +
                    'To avoid error, the new active theme is <' + activeTheme + '>.');
            } else {
                activeTheme = theme;
            }
        };

        this.$get = Themes;

        Themes.$inject = [];

        function Themes() {
            return {
                getActiveTheme: getActiveTheme
            };

            function getActiveTheme() {
                return activeTheme;
            }
        }
    }

})(window.angular);