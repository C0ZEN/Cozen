(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('CozenThemes', CozenThemesProvider);

    CozenThemesProvider.$inject = [
        'CONFIG'
    ];

    function CozenThemesProvider(CONFIG) {
        var activeTheme = CONFIG.themes[0];

        this.setActiveTheme = function (theme) {
            if (!Methods.isInList(CONFIG.themes, theme)) {
                console.error('%cThe theme <%c' + theme + '%c> is not in the list of available themes.\n' +
                    'To avoid error, the new active theme is <%c' + activeTheme + '%c>.',
                    getConsoleColor(),
                    getConsoleColor('red'),
                    getConsoleColor(),
                    getConsoleColor('purple'),
                    getConsoleColor()
                );
            }
            else {
                activeTheme = theme;
            }
            return this;
        };

        this.$get = CozenThemes;

        CozenThemes.$inject = [];

        function CozenThemes() {
            return {
                getActiveTheme: getActiveTheme
            };

            function getActiveTheme() {
                return activeTheme;
            }
        }
    }

})(window.angular);