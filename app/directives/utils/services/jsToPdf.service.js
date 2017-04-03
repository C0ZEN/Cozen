/**
 * @name cozenJsToPdf
 * @description
 * A factory used to help the drawing of a jsPDF document
 * It helps to make easier pdf and avoid error
 * Of course, if you have a specific need, you can combine the stuff from jsPDF with this factory
 * You can have multiple instance at a time
 *
 * [Example steps]
 * Start by calling the init() function
 * Then call drawing functions as much as you want
 * Ex: drawTitle() drawTitle() drawText() drawTitle()...
 * Finally, print your document with print() function
 *
 * [Reminders]
 * Paper size points A4: 595x842
 * For more info: https://www.gnu.org/software/gv/manual/html_node/Paper-Keywords-and-paper-size-in-points.html
 *
 * jsPDF documentation: http://rawgit.com/MrRio/jsPDF/master/docs/
 * getStringUnitWidth * fontSize => return the width of a string (points)
 * setTextColor(r, g, b)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenJsToPdf', cozenJsToPdf);

    cozenJsToPdf.$inject = [
        'enhancedLogs'
    ];

    function cozenJsToPdf(enhancedLogs) {

        // Default configuration (could be override by init styles param)
        var defaultConfig = {
            pdfName : 'generated-pdf',
            title   : {
                size  : 40,
                family: 'courier',
                weight: 'bold',
                color : {
                    r: 26,
                    g: 188,
                    b: 156
                }
            },
            subtitle: {
                size  : 30,
                family: 'courier',
                weight: 'normal',
                color : {
                    r: 231,
                    g: 76,
                    b: 60
                }
            },
            text    : {
                size  : 16,
                family: 'courier',
                weight: 'normal',
                color : {
                    r: 155,
                    g: 89,
                    b: 182
                }
            }
        };

        // Internal functions
        var methods = {
            areParamsSet: areParamsSet,
            rgbToDecimal: rgbToDecimal,
            hexToRgb    : hexToRgb
        };

        // Public functions
        return {
            init           : init,
            drawTitle      : drawTitle,
            drawText       : drawText,
            drawImage      : drawImage,
            print          : print,
            setTextStyle   : setTextStyle,
            setFillColor   : setFillColor,
            getStringWidth : getStringWidth,
            getRowsQuantity: getRowsQuantity,
            explodeString  : explodeString,
            svgToBase64    : svgToBase64,
            svgToBase64Svg : svgToBase64Svg,
            setTextColor   : setTextColor
        };

        /**
         * Init a jsPDF doc
         * @param {object} config > Configuration for the jsPDF (see the jsPDF doc for that)
         * @param {object} styles > Override the configuration styles (merge)
         * @returns {object} jsPDF
         */
        function init(config, styles) {
            var doc           = new jsPDF(config);
            doc.jsToPdfConfig = angular.merge({}, defaultConfig, styles);
            return doc;
        }

        /**
         * Draw a title
         * @param {object} doc        > jsPDF document to work with [required]
         * @param {string|array} text > Text to display [required]
         * @param {number} x          > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y          > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @returns {object} jsPDF
         */
        function drawTitle(doc, text, x, y) {
            if (!methods.areParamsSet(doc, text, x, y)) {
                enhancedLogs.errorMissingParameterFn('drawTitle');
                return doc;
            }
            doc = setTextStyle(doc, doc.jsToPdfConfig.title.size, doc.jsToPdfConfig.title.family, doc.jsToPdfConfig.title.weight);
            doc.setTextColor(doc.jsToPdfConfig.title.color.r, doc.jsToPdfConfig.title.color.g, doc.jsToPdfConfig.title.color.b);
            doc.text(text, x, y);
            return doc;
        }

        /**
         * Draw a subtitle
         * @param {object} doc        > jsPDF document to work with [required]
         * @param {string|array} text > Text to display [required]
         * @param {number} x          > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y          > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @returns {object} jsPDF
         */
        function drawSubTitle(doc, text, x, y) {
            if (!methods.areParamsSet(doc, text, x, y)) {
                enhancedLogs.errorMissingParameterFn('drawSubTitle');
                return doc;
            }
            doc = setTextStyle(doc, doc.jsToPdfConfig.subtitle.size, doc.jsToPdfConfig.subtitle.family, doc.jsToPdfConfig.subtitle.weight);
            doc.setTextColor(doc.jsToPdfConfig.subtitle.color.r, doc.jsToPdfConfig.subtitle.color.g, doc.jsToPdfConfig.subtitle.color.b);
            doc.text(text, x, y);
            return doc;
        }

        /**
         * Draw a text
         * @param {object} doc        > jsPDF document to work with [required]
         * @param {string|array} text > Text to display [required]
         * @param {number} x          > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y          > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @returns {object} jsPDF
         */
        function drawText(doc, text, x, y) {
            if (!methods.areParamsSet(doc, text, x, y)) {
                enhancedLogs.errorMissingParameterFn('drawText');
                return doc;
            }
            doc.text(text, x, y);
            return doc;
        }

        /**
         * Draw an image
         * @param {object} doc              > jsPDF document to work with [required]
         * @param {string} imageData        > Image as data url [required]
         * @param {number} x                > Coordinate (according doc.unit settings) x from the left of the page [required]
         * @param {number} y                > Coordinate (according doc.unit settings) y from the top of the page [required]
         * @param {number} width            > Width of the image [required]
         * @param {number} height           > Height of the image [required]
         * @param {string} type      = JPEG > Format of the image
         * @returns {object} jsPDF
         */
        function drawImage(doc, imageData, x, y, width, height, type) {
            if (!methods.areParamsSet(doc, imageData, x, y, width, height)) {
                enhancedLogs.errorMissingParameterFn('drawImage');
                return doc;
            }
            type = Methods.isNullOrEmpty(type) ? 'JPEG' : type;
            doc.addImage(imageData, type, x, y, width, height);
            return doc;
        }

        /**
         * Print the document
         * @param {object} doc > jsPDF document to work with [required]
         * @returns {object} jsPDF
         */
        function print(doc) {
            if (!methods.areParamsSet(doc)) {
                enhancedLogs.errorMissingParameterFn('print');
                return doc;
            }
            doc.save(doc.jsToPdfConfig.pdfName + '.pdf');
            return doc;
        }

        /**
         * Define the text style
         * @param {object} doc                > jsPDF document to work with [required]
         * @param {number} size   = 20        > Font size
         * @param {string} family = helvetica > Font family (helvetica, courier, times...)
         * @param {string} style  = normal    > Font style
         * @returns {object} jsPDF
         */
        function setTextStyle(doc, size, family, style) {
            if (!methods.areParamsSet(doc)) {
                enhancedLogs.errorMissingParameterFn('setTextStyle');
                return doc;
            }
            size   = Methods.isNullOrEmpty(size) ? 20 : size;
            family = Methods.isNullOrEmpty(family) ? 'helvetica' : family;
            style  = Methods.isNullOrEmpty(style) ? 'normal' : style;
            doc.setFontSize(size);
            doc.setFont(family, style);
            return doc;
        }

        /**
         * Define the color of the text (RGB or CMYK)
         * @param {object} doc            > jsPDF document to work with [required]
         * @param {number|string} ch1 = 0 > R/C from color format
         * @param {number|string} ch2 = 0 > G/M from color format
         * @param {number|string} ch3 = 0 > B/Y from color format
         * @param {number|string} ch4 = 1 > K from color format
         * @returns {object} jsPDF
         */
        function setFillColor(doc, ch1, ch2, ch3, ch4) {
            if (!methods.areParamsSet(doc)) {
                enhancedLogs.errorMissingParameterFn('setFillColor');
                return doc;
            }
            ch1 = Methods.isNullOrEmpty(ch1) ? 0 : ch1;
            ch2 = Methods.isNullOrEmpty(ch2) ? 0 : ch2;
            ch3 = Methods.isNullOrEmpty(ch3) ? 0 : ch3;
            ch4 = Methods.isNullOrEmpty(ch4) ? 1 : ch4;
            if (arguments.length <= 4) {
                for (var i = 1, length = 4; i < length; i++) {
                    arguments[i] = methods.rgbToDecimal(arguments[i]);
                }
                doc.setFillColor(ch1, ch2, ch3);
            }
            else {
                doc.setFillColor(ch1, ch2, ch3, ch4);
            }
            return doc;
        }

        /**
         * Return the width of a string
         * @param {object} doc           > jsPDF document to work with [required]
         * @param {string} text          > Text to work with [required]
         * @param {number} fontSize      > Font size [required]
         * @param {string} unit     = pt > The unit used with this doc
         * @returns {number}
         */
        function getStringWidth(doc, text, fontSize, unit) {
            if (!methods.areParamsSet(doc, text, fontSize)) {
                enhancedLogs.errorMissingParameterFn('getStringWidth');
                return 0;
            }
            unit = Methods.isNullOrEmpty(unit) ? 'pt' : unit;
            switch (unit) {
                case 'pt':
                    return parseInt((doc.getStringUnitWidth(text) * fontSize).toFixed(0));
            }
        }

        /**
         * Return the number of rows for a text
         * @param {object} doc           > jsPDF document to work with [required]
         * @param {number} rowWidth      > Width of a row [required]
         * @param {string} text          > Text to work with [required]
         * @param {number} fontSize      > Font size [required]
         * @param {string} unit     = pt > The unit used with this doc
         * @returns {number}
         */
        function getRowsQuantity(doc, rowWidth, text, fontSize, unit) {
            if (!methods.areParamsSet(doc, rowWidth, text, fontSize)) {
                enhancedLogs.errorMissingParameterFn('getRowsQuantity');
                return 0;
            }
            unit = Methods.isNullOrEmpty(unit) ? 'pt' : unit;
            switch (unit) {
                case 'pt':
                    var stringWidth = getStringWidth(doc, text, fontSize, unit);
                    return Math.ceil(stringWidth / rowWidth);
            }
        }

        /**
         * Explode a string into array if the limit of chars is detected
         * @param {string} text     > Text to work with [required]
         * @param {string} maxChars > Number of chars as delimiter [required]
         * @returns {Array} array of strings
         */
        function explodeString(text, maxChars) {
            if (!methods.areParamsSet(text, maxChars)) {
                enhancedLogs.errorMissingParameterFn('explodeString');
                return [];
            }
            var chunks = [];
            for (var i = 0, charsLength = text.length; i < charsLength; i += maxChars) {
                chunks.push(text.substring(i, i + maxChars));
            }
            return chunks;
        }

        /**
         * Convert the SVG to a base64 string
         * @param {string}   parentDomId > Id of the parent of the parent [required]
         * @param {canvas}   canvas      > Canvas to work with [required]
         * @param {function} callback    > Callback to get the base64 string => canvas.toDataURL() [required]
         */
        function svgToBase64(parentDomId, canvas, callback) {
            if (!methods.areParamsSet(parentDomId, canvas, callback)) {
                enhancedLogs.errorMissingParameterFn('svgToBase64');
                return;
            }
            var svg       = angular.element(document.querySelector('#' + parentDomId + ' svg'));
            var svg_xml   = (new XMLSerializer()).serializeToString(svg[0]);
            var img       = new Image();
            var ctx       = canvas.getContext('2d');
            canvas.height = svg[0].getBoundingClientRect().height;
            canvas.width  = svg[0].getBoundingClientRect().width;
            img.onload    = function () {
                ctx.drawImage(img, 0, 0);
                callback();
            };
            img.src       = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svg_xml)));
        }

        /**
         * Convert the SVG to a base64 svg+xml string
         * @param {string} parentDomId > Id of the parent of the parent [required]
         * @returns {string}
         */
        function svgToBase64Svg(parentDomId) {
            if (!methods.areParamsSet(parentDomId)) {
                enhancedLogs.errorMissingParameterFn('svgToDataUrl');
                return '';
            }
            var svg     = angular.element(document.querySelector('#' + parentDomId + ' svg'));
            var svg_xml = (new XMLSerializer()).serializeToString(svg[0]);
            return 'data:image/svg+xml;base64,' + window.btoa(svg_xml);
        }

        /**
         * Set the color of the text (three ways)
         * @param {object}              doc > jsPDF document to work with [required]
         * @param {number|array|string} r   > Red color or array of color ([r, g b]) or hexadecimal (short/long) [required]
         * @param {number}              g   > Green color
         * @param {number}              b   > Blue color
         * @returns {object} jsPDF
         */
        function setTextColor(doc, r, g, b) {
            if (!methods.areParamsSet(doc, r)) {
                enhancedLogs.errorMissingParameterFn('setTextColor');
                return doc;
            }
            if (methods.hexToRgb(r)) {
                r = methods.hexToRgb(r);
            }
            if (Array.isArray(r) && r.length == 3) {
                doc.setTextColor(r[0], r[1], r[2]);
            }
            else if (arguments.length == 4) {
                doc.setTextColor(r, g, b);
            }

            return doc;
        }

        /////////// INTERNAL FUNCTIONS ///////////

        /**
         * Check if arguments are set
         * @returns {boolean}
         */
        function areParamsSet() {
            for (var i = 0, length = arguments.length; i < length; i++) {
                if (arguments[i] == null) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Convert RGB unit to decimal (0 to 1)
         * @param {number} value > Value to convert [required]
         * @returns {number}
         */
        function rgbToDecimal(value) {
            if (!methods.areParamsSet(value)) {
                enhancedLogs.errorMissingParameterFn('rgbToDecimal');
                return 0;
            }
            if (typeof value == 'number' && value > 1) {
                value = value / 255;
            }
            return value;
        }

        /**
         * Convert an hexadecimal color to rgb (could be a shortcut)
         * @param {string} hex > Color of type hexadecimal [required]
         * @returns {Array|boolean} rgb or false
         */
        function hexToRgb(hex) {
            if (!methods.areParamsSet(hex)) {
                enhancedLogs.errorMissingParameterFn('hexToRgb');
                return false;
            }
            var color;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                color = hex.substring(1).split('');
                if (color.length == 3) {
                    color = [
                        color[0],
                        color[0],
                        color[1],
                        color[1],
                        color[2],
                        color[2]
                    ];
                }
                color = '0x' + color.join('');
                return [
                    (color >> 16) & 255,
                    (color >> 8) & 255,
                    color & 255
                ];
            }
            return false;
        }
    }

})(window.angular);