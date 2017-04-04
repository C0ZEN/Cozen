/**
 * @name cozenEnhancedLogs
 * @description
 * Just a factory to show better ui logs
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenEnhancedLogs', cozenEnhancedLogs);

    cozenEnhancedLogs.$inject = [
        'CONFIG'
    ];

    function cozenEnhancedLogs(CONFIG) {

        // Internal methods
        var methods = {
            getConsoleColor           : getConsoleColor,
            getTime                   : getTime,
            saveTime                  : saveTime,
            getBase                   : getBase,
            getFormattedParamsInline  : getFormattedParamsInline,
            getFormattedParams        : getFormattedParams,
            getFormattedParamsKeysOnly: getFormattedParamsKeysOnly,
            getTabs                   : getTabs,
            sendLog                   : sendLog
        };

        // Common data
        var colors = {
            red   : '#c0392b',
            purple: '#8e44ad',
            black : '#2c3e50',
            orange: '#d35400',
            cyan  : '#16a085',
            blue  : '#2980b9'
        };
        var now    = 0;

        // Custom style added to the console
        console.colors.red    = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('red'));
        };
        console.colors.purple = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('purple'));
        };
        console.colors.black  = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('black'));
        };
        console.colors.orange = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('orange'));
        };
        console.colors.cyan   = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('cyan'));
        };
        console.colors.blue   = function (text) {
            return console.style.wrap(text, methods.getConsoleColor('blue'));
        };

        // Public methods
        return {
            error: {
                missingParameterFn       : errorMissingParameterFn,
                missingParameterDirective: errorMissingParameterDirective,
                unexpectedBehaviorFn     : errorUnexpectedBehaviorFn,
                attributeIsNotFunction   : errorAttributeIsNotFunction,
                attributeIsNotBoolean    : errorAttributeIsNotBoolean,
                attributeIsEmpty         : errorAttributeIsEmpty,
                valueNotBoolean          : errorValueNotBoolean,
                valueNotNumber           : errorValueNotNumber,
                valueNotObject           : errorValueNotObject,
                valueNotInList           : errorValueNotInList,
                missingParameterWhen     : errorMissingParameterWhen
            },
            info : {
                customMessage                    : infoCustomMessage,
                functionCalled                   : infoFunctionCalled,
                customMessageEnhanced            : infoCustomMessageEnhanced,
                templateForGoogleAnalyticsRequest: infoTemplateForGoogleAnalyticsRequest,
                stateRedirectTo                  : infoStateRedirectTo,
                httpRequest                      : infoHttpRequest,
                apiRoute                         : infoApiRoute,
                changeRouteWithParams            : infoChangeRouteWithParams,
                broadcastEvent                   : infoBroadcastEvent,
                explodeObject                    : infoExplodeObject
            },
            warn : {
                attributeNotMatched: warningAttributeNotMatched
            },
            wrap : {
                starting: wrapStarting,
                end     : wrapEnd
            }
        };

        /// ERROR LOGS ///

        /**
         * Display a log message to inform that a function could not work properly due to a missing parameter
         * @param {string} fnName = anonymous > Specify the name of the function
         */
        function errorMissingParameterFn(fnName) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName)) {
                    fnName = 'anonymous';
                }
                var log = methods.getBase(fnName);
                log += console.colors.black('Error due to missing parameter');
                console.style(log);
            }
        }

        /**
         * Display a log message to inform that a function could not work properly due to a missing parameter
         * @param {string} directive > Specify the name of the directive [required]
         * @param {string} attr      > Name of the attribute [required]
         */
        function errorMissingParameterDirective(directive, attr) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(directive) || Methods.isNullOrEmpty(attr)) {
                    return;
                }
                var log = methods.getBase(directive);
                log += console.colors.black('Attribute <');
                log += console.colors.purple(attr);
                log += console.colors.black('> is required !');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a function didn't work well (return statement error usually)
         * @param {string} fnName > Specify the name of the function [required]
         * @param {string} text   > Specify the description for the error [required]
         */
        function errorUnexpectedBehaviorFn(fnName, text) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(text)) {
                    return;
                }
                var log = methods.getBase(fnName);
                log += console.colors.black(text);
                console.style(log);
            }
        }

        /**
         * Display a log error message when an attribute is not a function
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         */
        function errorAttributeIsNotFunction(target, attribute) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attr <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> is not a function');
                console.style(log);
            }
        }

        /**
         * Display a log error message when an attribute is not a boolean
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         */
        function errorAttributeIsNotBoolean(target, attribute) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attr <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> is not a boolean');
                console.style(log);
            }
        }

        /**
         * Display a log error message when an attribute is null or empty
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         */
        function errorAttributeIsEmpty(target, attribute) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attr <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> is null or empty');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value is not a boolean
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         */
        function errorValueNotBoolean(target, value) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be <');
                log += console.colors.purple('true');
                log += console.colors.black('> or <');
                log += console.colors.purple('false');
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value is not a number
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         */
        function errorValueNotNumber(target, value) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be an <');
                log += console.colors.purple('number');
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value is not an object
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         */
        function errorValueNotObject(target, value) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be an <');
                log += console.colors.purple('object');
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a value must be in the list
         * @param {string} target > Specify the name of the element [required]
         * @param {string} value  > Specify the name of the attribute [required]
         * @param {string} list   > Specify the list of available values [required]
         */
        function errorValueNotInList(target, value, list) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(value) || Methods.isNullOrEmpty(list)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('<');
                log += console.colors.purple(value);
                log += console.colors.black('> must be a value from the list <');
                log += console.colors.purple(list);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log error message when a required parameter is missing on an specific element
         * @param {string} target    > Specify the name of the element [required]
         * @param {string} attribute > Specify the name of the attribute [required]
         * @param {string} element   > Specify the name of the context [required]
         */
        function errorMissingParameterWhen(target, attribute, element) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute) || Methods.isNullOrEmpty(element)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Missing key <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> when ' + element);
                console.style(log);
            }
        }

        /// INFO LOGS ///

        /**
         * Display a log info message with a custom message (title/description)
         * @param {string} title > Specify the title of the message [required]
         * @param {string} text  > Specify the description of the message [required]
         */
        function infoCustomMessage(title, text) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(text)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black(text);
                methods.sendLog('blue', log);
            }
        }

        /**
         * Display a log info message when a function is called (debug & tracking purpose)
         * @param {string} from   > Specify the service, directive or controller name [required]
         * @param {string} fnName > Specify the name of the function [required]
         */
        function infoFunctionCalled(from, fnName) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(from) || Methods.isNullOrEmpty(fnName)) {
                    return;
                }
                var log = methods.getBase(from);
                log += console.colors.black('<');
                log += console.colors.purple(fnName);
                log += console.colors.black('> called');
                console.style(log);
            }
        }

        /**
         * Display a log info message with a custom message (title/description/variable)
         * @param {string} title      > Specify the title of the message [required]
         * @param {string} textBefore > Specify the text before the value [required]
         * @param {string} value      > Specify the value [required]
         * @param {string} textAfter  > Specify the text after the message [required]
         */
        function infoCustomMessageEnhanced(title, textBefore, value, textAfter) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(textBefore) || Methods.isNullOrEmpty(value) || Methods.isNullOrEmpty(textAfter)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black(textBefore + ' <');
                log += console.colors.purple(value);
                log += console.colors.black('> ' + textAfter);
                console.style(log);
            }
        }

        /**
         * Display a log info message for googleAnalyticsRequest service
         * @param {string} fnName  > Specify the name of the function executed [required]
         * @param {string} tracker > Specify the name of the tracker [required]
         */
        function infoTemplateForGoogleAnalyticsRequest(fnName, tracker) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(fnName) || Methods.isNullOrEmpty(tracker)) {
                    return;
                }
                var log = methods.getBase('googleAnalyticsRequest');
                log += console.colors.black('Function <');
                log += console.colors.purple(fnName);
                log += console.colors.black('> executed for tracker <');
                log += console.colors.purple(tracker);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message when redirect to is called
         * @param {string} state    > Specify the name of the original state [required]
         * @param {string} newState > Specify the name of the new state [required]
         */
        function infoStateRedirectTo(state, newState) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(newState) || Methods.isNullOrEmpty(newState)) {
                    return;
                }
                var log = methods.getBase(state);
                log += console.colors.black('Prevent default for this state and redirect to <');
                log += console.colors.purple(newState);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message when redirect to is called
         * @param {object} request > Object with methods and url key [required]
         */
        function infoHttpRequest(request) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(request)) {
                    return;
                }
                var log = methods.getBase(request.methods);
                log += console.colors.black(request.url);
                console.style(log);
            }
        }

        /**
         * Display a log info message when an api route is called
         * @param {object} request > Object with methods and url key [required]
         */
        function infoApiRoute(request) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(request)) {
                    return;
                }
                var log = methods.getBase(request.methods);
                log += console.colors.black(request.url);
                console.style(log);
            }
        }

        /**
         * Display a log info message when the user change the current state
         * @param {string} title      > The name of the element [required]
         * @param {string} state      > The name of the new route [required]
         * @param {object} parameters > The object with the params included in the route [required]
         */
        function infoChangeRouteWithParams(title, state, parameters) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(state) || Methods.isNullOrEmpty(parameters)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black('Redirection to <');
                log += console.colors.purple(state);
                log += console.colors.black('>');
                log += methods.getFormattedParamsInline(parameters);
                console.style(log);
            }
        }

        /**
         * Display a log info message when you want to log an event
         * @param {string} title > The name of the element [required]
         * @param {string} event > The name of the event [required]
         */
        function infoBroadcastEvent(title, event) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(event)) {
                    return;
                }
                var log = methods.getBase(title);
                log += console.colors.black('Broadcasted event <');
                log += console.colors.purple(event);
                log += console.colors.black('>');
                console.style(log);
            }
        }

        /**
         * Display a log info message when the user change the current state
         * @param {string}  title           > The name of the element [required]
         * @param {string}  text            > The text you want to see above the object [required]
         * @param {object}  object          > The object you want to see in deep details [required]
         * @param {boolean} extended = true > Add more details (type)
         */
        function infoExplodeObject(title, text, object, extended) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(title) || Methods.isNullOrEmpty(text) || Methods.isNullOrEmpty(object)) {
                    return;
                }
                if (Methods.isNullOrEmpty(extended)) {
                    extended = true;
                }
                var log = methods.getBase(title);
                log += console.colors.black(text);
                log += methods.getFormattedParams(object, extended);
                console.style(log);
            }
        }

        /// WARNING LOGS ///

        /**
         * Display a log warning message when an attribute as defined values but entered one is incorrect
         * @param {string} target       > Specify the name of the element [required]
         * @param {string} attribute    > Specify the name of the attribute [required]
         * @param {string} defaultValue > Specify the callback default value [required]
         */
        function warningAttributeNotMatched(target, attribute, defaultValue) {
            if (CONFIG.logs.enabled) {
                if (Methods.isNullOrEmpty(target) || Methods.isNullOrEmpty(attribute) || Methods.isNullOrEmpty(defaultValue)) {
                    return;
                }
                var log = methods.getBase(target);
                log += console.colors.black('Attr <');
                log += console.colors.purple(attribute);
                log += console.colors.black('> value is incorrect\nCallback of the default value <');
                log += console.colors.purple(defaultValue);
                log += console.colors.black('> was set');
                console.style(log);
            }
        }

        /// WRAP LOGS ///

        /**
         * Start a series of logs
         */
        function wrapStarting() {
            if (CONFIG.logs.enabled) {
                var log = methods.getBase(title);
                log += console.colors.black('Starting...');
                console.style(log);
            }
        }

        /**
         * End a series of logs
         */
        function wrapEnd() {
            if (CONFIG.logs.enabled) {
                var log = methods.getBase(title);
                log += console.colors.black('End');
                console.style(log);
            }
        }

        /// INTERNAL METHODS ///

        function getConsoleColor(type) {
            var color = 'color:';
            switch (type) {
                case 'red':
                case 'values':
                    return color + colors.red;
                case 'purple':
                case 'fn':
                    return color + colors.purple;
                case 'orange':
                case 'time':
                    return color + colors.orange;
                case 'cyan':
                    return color + colors.cyan;
                case 'blue':
                    return color + colors.blue;
                case 'black':
                default:
                    return color + colors.black;
            }
        }

        function getTime() {
            return moment().format(CONFIG.logs.format);
        }

        function saveTime() {
            now = methods.getTime();
        }

        function getBase(target) {
            methods.saveTime();
            var base = '';
            base += console.colors.black('[');
            base += console.colors.red(target);
            base += console.colors.black('][');
            base += console.colors.orange(now);
            base += console.colors.black('] ');
            return base;
        }

        function getFormattedParamsInline(parameters) {
            var text = '', count = 0;
            if (!Methods.isNullOrEmpty(parameters) && Object.keys(parameters).length > 0) {
                text += '\n';
                Object.keys(parameters).forEach(function (key) {
                    if (count > 0) {
                        text += console.colors.blue(', ');
                    }
                    else {
                        text += console.colors.blue('{');
                    }
                    text += console.colors.blue(key);
                    text += console.colors.blue(': ');
                    text += console.colors.cyan(parameters[key]);
                    count++;
                });
                text += console.colors.blue('}');
            }
            return text;
        }

        function getFormattedParams(parameters, extended) {
            if (Methods.isNullOrEmpty(extended)) {
                extended = false;
            }
            var text             = '', count = 0;
            var longestKeyLength = Methods.getLongestKey(parameters).length;
            if (!Methods.isNullOrEmpty(parameters) && Object.keys(parameters).length > 0) {
                text += '\n';
                Object.keys(parameters).forEach(function (key) {
                    if (count > 0) {
                        text += '\n';
                    }
                    else {
                        text += console.colors.blue('{');
                        text += '\n';
                    }
                    text += '\t';
                    text += console.colors.blue(key);
                    text += Methods.returnSpacesString(key, longestKeyLength);
                    text += console.colors.blue(': ');

                    // Avoid to print the function
                    if (typeof parameters[key] == 'function') {
                        text += console.colors.orange('Not printable');
                    }

                    // Show us the content of the object
                    else if (typeof parameters[key] == 'object' && !Array.isArray(parameters[key])) {
                        text += console.colors.blue('{');
                        text += '\n';
                        text += methods.getFormattedParamsKeysOnly(parameters[key], extended, 2);
                        text += '\t';
                        text += console.colors.blue('}');
                    }
                    else {
                        text += console.colors.cyan(parameters[key]);
                    }

                    // Add the type
                    if (extended) {

                        // Avoid to print object if array
                        if (Array.isArray(parameters[key])) {
                            text += console.colors.blue(' <');
                            text += console.colors.purple('array');
                            text += console.colors.blue('>');
                        }

                        // Avoid to print the object
                        else if (typeof parameters[key] != 'object') {
                            text += console.colors.blue(' <');
                            text += console.colors.purple(typeof parameters[key]);
                            text += console.colors.blue('>');
                        }
                    }
                    count++;
                });
                text += '\n';
                text += console.colors.blue('}');
            }
            return text;
        }

        function getFormattedParamsKeysOnly(parameters, extended, tabs) {
            if (Methods.isNullOrEmpty(extended)) {
                extended = false;
            }
            var text             = '', count = 0;
            var longestKeyLength = Methods.getLongestKey(parameters).length;
            if (!Methods.isNullOrEmpty(parameters) && Object.keys(parameters).length > 0) {
                Object.keys(parameters).forEach(function (key) {
                    if (count > 0) {
                        text += '\n';
                    }
                    text += methods.getTabs(tabs);
                    text += console.colors.blue(key);
                    text += Methods.returnSpacesString(key, longestKeyLength);
                    text += console.colors.blue(': ');

                    // Avoid to print the function
                    if (typeof parameters[key] == 'function') {
                        text += console.colors.orange('Not printable');
                    }

                    // Show us the content of the object
                    else if (typeof parameters[key] == 'object' && !Array.isArray(parameters[key])) {
                        text += console.colors.blue('{');
                        text += '\n' + methods.getTabs(tabs - 1);
                        text += methods.getFormattedParamsKeysOnly(parameters[key], extended);
                        text += console.colors.blue('}');
                    }
                    else {
                        text += console.colors.cyan(parameters[key]);
                    }

                    // Add the type
                    if (extended) {

                        // Avoid to print object if array
                        if (Array.isArray(parameters[key])) {
                            text += console.colors.blue(' <');
                            text += console.colors.purple('array');
                            text += console.colors.blue('>');
                        }

                        // Avoid to print the object
                        else if (typeof parameters[key] != 'object') {
                            text += console.colors.blue(' <');
                            text += console.colors.purple(typeof parameters[key]);
                            text += console.colors.blue('>');
                        }
                    }
                    count++;
                });
                text += '\n';
            }
            return text;
        }

        function getTabs(tabs) {
            var text = '';
            for (var i = 0; i < tabs; i++) {
                text += '\t';
            }
            return text;
        }

        function sendLog(color, text) {
            var wrap = console.style.wrap;
            console.style('<css="background-color:' + colors[color] + ';">' + text + '</css>');
        }
    }

})(window.angular);