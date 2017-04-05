/**
 * @ngdoc directive
 * @name cozen-draw-chart
 * @scope
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 * Handle the creation of a google graph easily
 *
 * [Scope params]
 * @param {string}   cozenDrawChartId               > Id of the chart [required]
 * @param {object}   cozenDrawChartData             > Data for the chart [required]
 * @param {object}   cozenDrawChartOptions          > Options for the chart [required]
 * @param {string}   cozenDrawChartType             > Type of the chart [required]
 * @param {boolean}  cozenDrawChartHidden   = false > Hide the chart (display none)
 * @param {string}   cozenDrawChartBase64           > Get the graph base64 string (override value)
 * @param {function} cozenDrawChartOnBase64         > Callback function called when the base64 is ready {id, base64}
 *
 */
(function (angular, window, document) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenDrawChart', cozenDrawChart);

    cozenDrawChart.$inject = [
        '$interval',
        '$timeout',
        'exportToPdfFactory'
    ];

    function cozenDrawChart($interval, $timeout, exportToPdfFactory) {
        return {
            link       : link,
            restrict   : 'E',
            scope      : {
                cozenDrawChartId      : '=?',
                cozenDrawChartData    : '&',
                cozenDrawChartOptions : '=?',
                cozenDrawChartType    : '=?',
                cozenDrawChartHidden  : '=?',
                cozenDrawChartBase64  : '=?',
                cozenDrawChartOnBase64: '&'
            },
            replace    : false,
            transclude : false,
            templateUrl: 'app/components/reporting/export-to-pdf/draw-chart/draw-chart.html'
        };

        function link(scope, element, attrs) {
            scope._isReady = false;

            // Methods
            var methods = {
                init     : init,
                destroy  : destroy,
                initChart: initChart,
                drawChart: drawChart,
                onResize : onResize
            };

            // Data
            var data = {
                chart        : null,
                options      : {},
                init         : false,
                directiveName: 'cozenDrawChart'
            };

            methods.init();

            function init() {

                // Required stuff (checking)
                var requiredAttrs = [
                    'cozenDrawChartId',
                    'cozenDrawChartData',
                    'cozenDrawChartOptions',
                    'cozenDrawChartType'
                ];
                for (var i = 0, length = requiredAttrs.length; i < length; i++) {
                    if (angular.isUndefined(attrs[requiredAttrs[i]])) {
                        cozenEnhancedLogs.errorMissingParameterDirective(data.directiveName, requiredAttrs[i]);
                        return;
                    }
                }

                // Init stuff
                element.on('$destroy', methods.destroy);
                if (angular.isUndefined(attrs.cozenDrawChartHidden)) {
                    scope.cozenDrawChartHidden = false;
                }

                // Display the template
                scope._isReady = true;

                // Draw the graph
                google.charts.load('current', {packages: ['corechart']});
                google.charts.setOnLoadCallback(methods.initChart);

                // Resize it when the window change
                window.addEventListener('resize', methods.onResize);
                scope.$watch('cozenDrawChartOptions', function () {
                    methods.drawChart();
                });
            }

            // Properly destroy
            function destroy() {
                window.removeEventListener('resize', methods.onResize);
                element.off('$destroy', methods.destroy);
            }

            // Init the chart (default conf, creation, callback and watcher)
            function initChart() {
                data.options = {
                    animation          : {
                        duration: 1000,
                        easing  : 'out',
                        startup : true
                    },
                    backgroundColor    : {
                        fill   : 'transparent',
                        opacity: 100
                    },
                    colors             : [
                        exportToPdfFactory.getColors().moderateRed,
                        exportToPdfFactory.getColors().moderateYellow,
                        exportToPdfFactory.getColors().moderateBlue,
                        exportToPdfFactory.getColors().moderateCyan,
                        exportToPdfFactory.getColors().moderatePurple
                    ],
                    fontName           : 'Hind',
                    fontSize           : 16,
                    legend             : {
                        alignment: 'center',
                        textStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : exportToPdfFactory.getColors().moderateBlack,
                            fontName: 'Hind'
                        }
                    },
                    focusTarget        : 'category',
                    tooltip            : {
                        isHtml   : true,
                        textStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : exportToPdfFactory.getColors().moderateBlack,
                            fontName: 'Hind'
                        }
                    },
                    hAxis              : {
                        titleTextStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 16,
                            color   : exportToPdfFactory.getColors().moderateBlack,
                            fontName: 'Hind'
                        },
                        textStyle     : {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : exportToPdfFactory.getColors().moderateBlack,
                            fontName: 'Hind'
                        }
                    },
                    vAxis              : {
                        titleTextStyle: {
                            bold    : false,
                            italic  : false,
                            fontSize: 16,
                            color   : exportToPdfFactory.getColors().moderateBlack,
                            fontName: 'Hind'
                        },
                        textStyle     : {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : exportToPdfFactory.getColors().moderateBlack,
                            fontName: 'Hind'
                        }
                    },
                    theme              : 'material',
                    annotations        : {
                        textStyle    : {
                            bold    : false,
                            italic  : false,
                            fontSize: 14,
                            color   : exportToPdfFactory.getColors().moderateBlack,
                            fontName: 'Hind',
                            opacity : 1
                        },
                        highContrast : true,
                        alwaysOutside: false,
                        stem         : {
                            color : exportToPdfFactory.getColors().moderateBlack,
                            length: 5
                        }
                    },
                    enableInteractivity: true
                };

                var domChart = null;
                var interval = $interval(function () {
                    domChart = document.getElementById(scope.cozenDrawChartId);
                    if (domChart != null && domChart != '') {
                        data.chartContainer = document.getElementById(scope.cozenDrawChartId);
                        data.chart          = new google.visualization[scope.cozenDrawChartType](data.chartContainer);

                        // Get the base64 image
                        if (!data.init) {
                            google.visualization.events.addListener(data.chart, 'ready', function () {

                                // The timeout fix a bug with custom font-family in the graph
                                $timeout(function () {
                                    scope.cozenDrawChartBase64 = data.chart.getImageURI();
                                    if (typeof scope.cozenDrawChartOnBase64 == 'function') {
                                        scope.cozenDrawChartOnBase64({
                                            id    : scope.cozenDrawChartId,
                                            base64: scope.cozenDrawChartBase64
                                        });
                                    }
                                });
                            });
                        }

                        data.init = true;
                        $interval.cancel(interval);
                        methods.drawChart();
                    }
                }, 30);
            }

            // Draw the google graph
            function drawChart() {
                if (!data.init) {
                    return;
                }
                var options = angular.merge({}, data.options, scope.cozenDrawChartOptions);
                data.chart.draw(scope.cozenDrawChartData(), options);
            }

            // Resize the google graph to his container
            function onResize() {
                var container = document.getElementById(scope.cozenDrawChartId);
                if (container != null) {
                    container             = container.firstChild.firstChild;
                    container.style.width = "100%";
                    methods.drawChart();
                }
            }
        }
    }

})(window.angular, window, document);

