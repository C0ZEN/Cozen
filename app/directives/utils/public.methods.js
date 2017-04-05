'use strict';

var Methods = {
    isInList                  : isInList,
    isNullOrEmpty             : isNullOrEmpty,
    safeApply                 : safeApply,
    isFunction                : isFunction,
    getConsoleColor           : getConsoleColor,
    capitalizeFirstLetter     : capitalizeFirstLetter,
    isRegExpValid             : isRegExpValid,
    getElementPaddingTopBottom: getElementPaddingTopBottom,
    hasOwnProperty            : hasOwnProperty,
    hasDuplicates             : hasDuplicates,
    getLongestKey             : getLongestKey,
    returnSpacesString        : returnSpacesString,
    dataMustBeBoolean         : dataMustBeBoolean,
    dataMustBeNumber          : dataMustBeNumber,
    dataMustBeObject          : dataMustBeObject,
    dataMustBeInThisList      : dataMustBeInThisList
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

// Check if the regexp is valid
function isRegExpValid(regexp, value) {
    return !(!new RegExp(regexp).test(value) || isNullOrEmpty(value));
}

function getElementPaddingTopBottom(element) {
    var styles = window.getComputedStyle(element);
    return parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
}

// Check if an object have a property to avoid using not own property
function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

// Check if an array have duplicated keys
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
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

// Return a string filled with spaces
// The spaces quantity is defined by checking the difference between the key length and a max length
function returnSpacesString(key, maxLength) {
    var diff = maxLength - key.length;
    var text = '';
    for (var i = 0; i < diff; i++) {
        text += ' ';
    }
    return text;
}

// Use it to tell the dev that a entered value is not a boolean [Deprecated, use enhancedLogs]
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

// Use it to tell the dev that a entered value is not a number [Deprecated, use enhancedLogs]
function dataMustBeNumber(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cnumber%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a entered value is not an object [Deprecated, use enhancedLogs]
function dataMustBeObject(attribute) {
    console.error('%c<%c' + attribute + '%c> must be an <%cobject%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}

// Use it to tell the dev that a key is not in the list so that's a terrible error !! [Deprecated, use enhancedLogs]
function dataMustBeInThisList(attribute, list) {
    console.error('%c<%c' + attribute + '%c> must be a correct value from this list <%c' + list + '%c>',
        getConsoleColor(),
        getConsoleColor('red'),
        getConsoleColor(),
        getConsoleColor('purple'),
        getConsoleColor()
    );
}