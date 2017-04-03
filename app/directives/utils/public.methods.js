'use strict';

var Methods = {
    isInList                  : isInList,
    isNullOrEmpty             : isNullOrEmpty,
    safeApply                 : safeApply,
    isFunction                : isFunction,
    directiveErrorRequired    : directiveErrorRequired,
    directiveCallbackLog      : directiveCallbackLog,
    getConsoleColor           : getConsoleColor,
    capitalizeFirstLetter     : capitalizeFirstLetter,
    directiveErrorFunction    : directiveErrorFunction,
    directiveErrorBoolean     : directiveErrorBoolean,
    isRegExpValid             : isRegExpValid,
    getElementPaddingTopBottom: getElementPaddingTopBottom,
    directiveErrorEmpty       : directiveErrorEmpty,
    directiveWarningUnmatched : directiveWarningUnmatched,
    dataMustBeBoolean         : dataMustBeBoolean,
    dataMustBeNumber          : dataMustBeNumber,
    dataMustBeObject          : dataMustBeObject,
    dataMustBeInThisList      : dataMustBeInThisList,
    hasOwnProperty            : hasOwnProperty,
    httpRequestLog            : httpRequestLog,
    firstLoadLog              : firstLoadLog,
    missingKeyLog             : missingKeyLog,
    changeRouteLog            : changeRouteLog,
    hasDuplicates             : hasDuplicates,
    broadcastLog              : broadcastLog,
    infoCustomLog             : infoCustomLog,
    infoSimpleLog             : infoSimpleLog,
    infoObjectLog             : infoObjectLog,
    getLongestKey             : getLongestKey
};

// Common data
var Data = {
    red   : '#c0392b',
    purple: '#8e44ad',
    black : '#2c3e50',
    orange: '#d35400',
    green : '#27ae60'
};

// Check if a value is in the list
function isInList(list, value) {
    return list.indexOf(value) != -1;
}

// Check if a value is null, empty or undefined
function isNullOrEmpty(element) {
    return element == null || element == '' || element == 'undefined';
}

// Force a digest in angular app safely
function safeApply(scope, fn) {
    var phase = scope.$root.$$phase;
    if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
            fn();
        }
    }
    else {
        scope.$apply(fn);
    }
}

// Check if the function is a real function
function isFunction(fn) {
    return typeof fn === 'function';
}

// Use it to tell the dev that a param required is missing
function directiveErrorRequired(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is required',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Use it to log a called of a function
function directiveCallbackLog(directive, fn) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + directive + '%c][%c' + now + '%c] Fn <%c' + fn + '%c> called',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Just a function to get access of the colors for the console
function getConsoleColor(type) {
    var color = 'color:';
    switch (type) {
        case 'red':
        case 'directive':
            return color + Data.red;
        case 'purple':
        case 'fn':
            return color + Data.purple;
        case 'orange':
        case 'time':
            return color + Data.orange;
        case 'green':
            return color + Data.green;
        default:
            return color + Data.black;
    }
}

// Capitalize only the first letter of a string
function capitalizeFirstLetter(string) {
    if (Methods.isNullOrEmpty(string) || typeof string != 'string') {
        return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Use it to tell the dev that a param set is not a function
function directiveErrorFunction(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is not a function',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a param set is not a boolean
function directiveErrorBoolean(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is not a boolean',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Check if the regexp is valid
function isRegExpValid(regexp, value) {
    return !(!new RegExp(regexp).test(value) || isNullOrEmpty(value));
}

function getElementPaddingTopBottom(element) {
    var styles = window.getComputedStyle(element);
    return parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
}

// Use it to tell the dev that a param value is null or empty but should be set
function directiveErrorEmpty(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is null or empty',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a entered value is incorrect and an callback value was assigned to avoid fatal error
function directiveWarningUnmatched(directive, param, value) {
    console.warn('%c[%c' + directive + '%c] Attr <%c' + param + '%c> value\'s was wrong\nThe default value <%c' + value + '%c> was set',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a entered value is not a boolean
function dataMustBeBoolean(attribute) {
    console.error('%c<%c' + attribute + '%c> must be <%ctrue%c> or <%cfalse%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a entered value is not a number
function dataMustBeNumber(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cnumber%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a entered value is not an object
function dataMustBeObject(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cobject%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a key is not in the list so that's a terrible error !!
function dataMustBeInThisList(attribute, list) {
    console.error('%c<%c' + attribute + '%c> must be a correct value from this list <%c' + list + '%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Check if an object have a property to avoid using not own property
function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

// Use it to show a request log to an API
function httpRequestLog(request) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + request.methods + '%c][%c' + now + '%c] ' + request.url,
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor()
    );
}

// Use it when you start your app
function firstLoadLog(isStarting) {
    var now  = moment().format('HH:mm:ss.SSS');
    var text = isStarting ? 'Starting' : 'Ready';
    console.log('%c[%c' + text + '%c][%c' + now + '%c]',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor()
    );
}

// Use it to send an error to the dev to tell him that something required is missing
function missingKeyLog(directive, key, when) {
    console.error('%c[%c' + directive + '%c] Missing key <%c' + key + '%c> when ' + when,
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Use it when you change a route in your app
function changeRouteLog(directive, route, params) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + directive + '%c][%c' + now + '%c] Redirection to <%c' + route + '%c>' + _getFormattedParams(params),
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor(),
        getConsoleColor('fn')
    );
}

// Check if an array have duplicated keys
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

// Use to log a broadcast event
function broadcastLog(scope, eventName) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + scope + '%c][%c' + now + '%c] Broadcasted event <%c' + eventName + '%c>',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// A custom log with dynamic text before and after a value
function infoCustomLog(target, textBefore, value, textAfter) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + target + '%c][%c' + now + '%c] ' + textBefore + ' <%c' + value + '%c> ' + textAfter,
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// A very simple log with a small text only
function infoSimpleLog(target, text) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + target + '%c][%c' + now + '%c] ' + text,
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor()
    );
}

// Use it to show the key of an object
function infoObjectLog(target, text, object) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + target + '%c][%c' + now + '%c] ' + text + _explodeObjectForLogs(object),
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

// Return the longest of an object
function getLongestKey(object) {
    var longest = '';
    for (var key in object) {
        if (key.length > longest.length) {
            longest = key;
        }
    }
    return longest;
}

/// INTERNAL FUNCTIONS ///

// Explode an object to use as a log
// The object will be as a simple line, no break is made
function _getFormattedParams(params) {
    var text = '', count = 0;
    if (!Methods.isNullOrEmpty(params) && Object.keys(params).length > 0) {
        text += '\nParams:%c ';
        Object.keys(params).forEach(function (key) {
            if (count > 0) {
                text += ', ';
            }
            else {
                text += '{'
            }
            text += key + ':' + params[key];
            count++;
        });
        text += '}';
    }
    else {
        text += '%c';
    }
    return text;
}

// Explode an object to use as a log
// Basically, this will create a structure as object with key vertically align and with respect of tabulations
// Note: this function do not handle multiple level (if a key is a object, it's fucked up)
function _explodeObjectForLogs(params) {
    var text             = '', count = 0;
    var longestKeyLength = getLongestKey(params).length;
    if (!Methods.isNullOrEmpty(params) && Object.keys(params).length > 0) {
        text += '\n';
        Object.keys(params).forEach(function (key) {
            if (count > 0) {
                text += ',\n';
            }
            else {
                text += '{%c\n'
            }
            text += '\t';
            text += key;
            text += _returnSpacesString(key, longestKeyLength);
            text += ': ';
            text += params[key];
            count++;
        });
        text += '\n%c}';
    }
    else {
        text += '%c';
    }
    return text;
}

// Return a string filled with spaces
// The spaces quantity is defined by checking the difference between the key length and a max length
function _returnSpacesString(key, maxLength) {
    var diff = maxLength - key.length;
    var text = '';
    for (var i = 0; i < diff; i++) {
        text += ' ';
    }
    return text;
}