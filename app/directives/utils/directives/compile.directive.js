/**
 * @ngdoc directive
 * @name cozen-compile
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 *
 * @param {string}  cozenCompile                    > The text you want to convert
 * @param {boolean} cozenCompileRewriteHtml = false > Perform a replace of the text to avoid breaking HTML text
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenCompile', cozenCompile);

    cozenCompile.$inject = [
        '$compile',
        '$sce'
    ];

    function cozenCompile($compile, $sce) {
        return {
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {

            // Default values (attributes)
            scope.cozenCompileRewriteHtml = angular.isDefined(attrs.cozenCompileRewriteHtml) ? JSON.parse(attrs.cozenCompileRewriteHtml) : false;

            scope.$watch(
                function (scope) {

                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.cozenCompile);
                },
                function (value) {

                    // Rewrite the HTML
                    if (scope.cozenCompileRewriteHtml) {
                        value = $sce.valueOf(value);
                        value = value.replace(/&lt;/g, '<');
                        value = value.replace(/&gt;/g, '>');
                    }

                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        }
    }

})(window.angular);
