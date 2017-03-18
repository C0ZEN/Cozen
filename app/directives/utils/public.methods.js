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
    broadcastLog              : broadcastLog
};

var Data = {
    red   : '#c0392b',
    purple: '#8e44ad',
    black : '#2c3e50',
    orange: '#d35400',
    green : '#27ae60'
};

function isInList(list, value) {
    return list.indexOf(value) != -1;
}

function isNullOrEmpty(element) {
    return element == null || element == '' || element == 'undefined';
}

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

function isFunction(fn) {
    return typeof fn === 'function';
}

function directiveErrorRequired(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is required',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

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

function capitalizeFirstLetter(string) {
    if (Methods.isNullOrEmpty(string) || typeof string != 'string') {
        return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function directiveErrorFunction(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is not a function',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function directiveErrorBoolean(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is not a boolean',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function isRegExpValid(regexp, value) {
    return !(!new RegExp(regexp).test(value) || isNullOrEmpty(value));
}

function getElementPaddingTopBottom(element) {
    var styles = window.getComputedStyle(element);
    return parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
}

function directiveErrorEmpty(directive, param) {
    console.error('%c[%c' + directive + '%c] Attr <%c' + param + '%c> is null or empty',
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

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

function dataMustBeNumber(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cnumber%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

function dataMustBeObject(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cobject%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

function dataMustBeInThisList(attribute, list) {
    console.error('%c<%c' + attribute + '%c> must be a correct value from this list <%c' + list + '%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

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

function missingKeyLog(directive, key, when) {
    console.error('%c[%c' + directive + '%c] Missing key <%c' + key + '%c> when ' + when,
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor()
    );
}

function changeRouteLog(directive, route, params) {
    var now = moment().format('HH:mm:ss');
    console.log('%c[%c' + directive + '%c][%c' + now + '%c] Redirection to <%c' + route + '%c>' + getFormattedParams(params),
        getConsoleColor(),
        getConsoleColor('directive'),
        getConsoleColor(),
        getConsoleColor('time'),
        getConsoleColor(),
        getConsoleColor('fn'),
        getConsoleColor(),
        getConsoleColor('fn')
    );

    function getFormattedParams(params) {
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
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

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