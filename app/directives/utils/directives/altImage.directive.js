/**
 * @ngdoc directive
 * @name cozen-alt-image
 * @scope
 * @restrict A
 * @replace false
 * @transclude false
 * @description
 * A simple directive used to replace the image src with a default one when an error with the image was found
 *
 * @param {string} cozenAltImageType  = veolia > Define what image should be display instead (from a cozenAltImageTypeList below)
 * @param {string} cozenAltImageTitle          > Override the default title (only if the alt image is trigger)
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .directive('cozenAltImage', cozenAltImage);

    cozenAltImage.$inject = [];

    function cozenAltImage() {
        return {
            required  : 'img',
            link      : link,
            restrict  : 'A',
            replace   : false,
            transclude: false
        };

        function link(scope, element, attrs) {

            // Methods declaration
            var methods = {
                init   : init,
                destroy: destroy
            };

            // Internal data
            var data = {
                cozenAltImageTypeList: {
                    veolia: 'assets/images/veolia/logo.jpg',
                    cross : 'assets/images/picto-supprimer-gris.png'
                },
                currentAltImage      : 'veolia',
                currentAltImageUrl   : ''
            };

            // Do stuff on creation
            methods.init();

            function init() {

                // Define the type (if cozenAltImageType is defined and the value found in object, update the default type)
                if (angular.isDefined(attrs.cozenAltImageType) &&
                    Methods.hasOwnProperty(data.cozenAltImageTypeList, attrs.cozenAltImageType)) {
                    data.currentAltImage = attrs.cozenAltImageType;
                }
                data.currentAltImageUrl = data.cozenAltImageTypeList[data.currentAltImage];

                // Listeners
                element.on('$destroy', methods.destroy);
                element.bind('error', function () {

                    // Change the src
                    element.attr('src', data.currentAltImageUrl);

                    // Change the title (only if cozenAltImageTitle is set)
                    angular.isDefined(attrs.cozenAltImageTitle) ? element.attr('title', attrs.cozenAltImageTitle) : null;
                });
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);