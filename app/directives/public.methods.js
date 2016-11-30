var Methods = {
  isInList              : isInList,
  isNullOrEmpty         : isNullOrEmpty,
  safeApply             : safeApply,
  isFunction            : isFunction,
  directiveErrorRequired: directiveErrorRequired
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
  console.error('[' + directive + '] Attribute <' + param + '> is required !');
}
