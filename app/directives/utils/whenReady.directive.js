/*
 * The whenReady directive allows you to execute the content of a when-ready
 * attribute after the element is ready (i.e. when it's done loading all sub directives and DOM
 * content). See: http://stackoverflow.com/questions/14968690/sending-event-when-angular-js-finished-loading
 *
 * Execute multiple expressions in the when-ready attribute by delimiting them
 * with a semi-colon. when-ready="doThis(); doThat()"
 *
 * Optional: If the value of a wait-for-interpolation attribute on the
 * element evaluates to true, then the expressions in when-ready will be
 * evaluated after all text nodes in the element have been interpolated (i.e.
 * {{placeholders}} have been replaced with actual values).
 *
 * Optional: Use a ready-check attribute to write an expression that
 * specifies what condition is true at any given moment in time when the
 * element is ready. The expression will be evaluated repeatedly until the
 * condition is finally true. The expression is executed with
 * requestAnimationFrame so that it fires at a moment when it is least likely
 * to block rendering of the page.
 *
 * If wait-for-interpolation and ready-check are both supplied, then the
 * when-ready expressions will fire after interpolation is done *and* after
 * the ready-check condition evaluates to true.
 *
 * Caveats: if other directives exists on the same element as this directive
 * and destroy the element thus preventing other directives from loading, using
 * this directive won't work. The optimal way to use this is to put this
 * directive on an outer element.
 *
 * @ngdoc directive
 * @name cozen-when-ready
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * [Attributes params]
 * @param {function} cozenWhenReady                    > Callback functions called on ready
 * @param {boolean}  cozenWaitForInterpolation = false > Wait for the end of the interpolation
 * @param {function} cozenReadyCheck                   >
 *
 */

(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .directive('cozenWhenReady', cozenWhenReady);

    cozenWhenReady.$inject = [
        '$interpolate'
    ];

    function cozenWhenReady($interpolate) {
        return {
            link    : link,
            restrict: 'A',
            priority: 100000
        };

        function link(scope, element, attrs) {
            var expressions             = attrs.cozenWhenReady.split(';');
            var waitForInterpolation    = false;
            var hasReadyCheckExpression = false;

            function evalExpressions(expressions) {
                expressions.forEach(function (expression) {
                    scope.$eval(expression);
                });
            }

            if (attrs.cozenWhenReady.trim().length === 0) {
                return;
            }
            if (attrs.cozenWaitForInterpolation && scope.$eval(attrs.cozenWaitForInterpolation)) {
                waitForInterpolation = true;
            }
            if (attrs.cozenReadyCheck) {
                hasReadyCheckExpression = true;
            }
            if (waitForInterpolation || hasReadyCheckExpression) {
                requestAnimationFrame(function checkIfReady() {
                    var isInterpolated   = false;
                    var isReadyCheckTrue = false;
                    isInterpolated       = !(waitForInterpolation && element.text().indexOf($interpolate.startSymbol()) >= 0);
                    isReadyCheckTrue     = !(hasReadyCheckExpression && !scope.$eval(attrs.cozenReadyCheck));
                    if (isInterpolated && isReadyCheckTrue) {
                        evalExpressions(expressions);
                    } else {
                        requestAnimationFrame(checkIfReady);
                    }
                });
            } else {
                evalExpressions(expressions);
            }
        }
    }

})(window.angular);