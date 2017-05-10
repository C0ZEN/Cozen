/**
 * @ngdoc directive
 * @name cozen-shortcut
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .value('CozenShortcuts', {
            shift: false,
            ctrl : false,
            alt  : false
        })
        .directive('cozenShortcut', cozenShortcut);

    cozenShortcut.$inject = [
        '$window',
        'CozenShortcuts',
        'CONFIG'
    ];

    function cozenShortcut($window, CozenShortcuts, CONFIG) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {
            var methods = {
                init          : init,
                destroy       : destroy,
                startListening: startListening,
                shortcutsLog  : shortcutsLog
            };

            var data = {
                directive: 'cozenShortcut'
            };

            methods.init();

            function init() {

                // Init stuff
                element.on('$destroy', methods.destroy);
                methods.startListening('keydown', true);
                methods.startListening('keyup', false);
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }

            function startListening(event, newValue) {
                $window.addEventListener(event, function ($event) {
                    switch ($event.keyCode) {

                        // Shift
                        case 16:
                            if (CONFIG.logs.enabled && CozenShortcuts.shift != newValue) {
                                CozenShortcuts.shift = newValue;
                                methods.shortcutsLog();
                            }
                            break;

                        // Ctrl
                        case 17:
                            if (CONFIG.logs.enabled && CozenShortcuts.ctrl != newValue) {
                                CozenShortcuts.ctrl = newValue;
                                methods.shortcutsLog();
                            }
                            break;

                        // Alt
                        case 18:
                            if (CONFIG.logs.enabled && CozenShortcuts.alt != newValue) {
                                CozenShortcuts.alt = newValue;
                                methods.shortcutsLog();
                            }
                            break;
                    }
                });
            }

            function shortcutsLog() {
                var log = '';
                Object.keys(CozenShortcuts).forEach(function (key) {
                    log += '%c[%c' + Methods.capitalizeFirstLetter(key) + ' %c' + CozenShortcuts[key] + '%c]';
                });
                console.log(log,
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor('directive'),
                    Methods.getConsoleColor('fn'),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor('directive'),
                    Methods.getConsoleColor('fn'),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor(),
                    Methods.getConsoleColor('directive'),
                    Methods.getConsoleColor('fn'),
                    Methods.getConsoleColor());
            }
        }
    }

})(window.angular);

