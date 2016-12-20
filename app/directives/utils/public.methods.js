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
    getElementPaddingTopBottom: getElementPaddingTopBottom
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
    } else {
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
    if (Methods.isNullOrEmpty(string) || typeof string != 'string') return string;
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