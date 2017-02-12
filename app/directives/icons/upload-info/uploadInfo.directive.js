/**
 * @ngdoc directive
 * @name cozen-upload-info
 * @restrict E
 * @replace false
 * @transclude false
 * @description
 *
 * [Scope params]
 * @param {object}  cozenUploadInfoConfig         > Label of the tooltip [required]
 * @param {boolean} cozenUploadInfoDisplay = true > Hide or show the info icon
 *
 */
(function (angular) {
    'use strict';

    angular
        .module('cozenLib.icons.uploadInfo', [])
        .directive('cozenUploadInfo', cozenUploadInfo);

    cozenUploadInfo.$inject = [
        '$filter',
        'Themes'
    ];

    function cozenUploadInfo($filter, Themes) {
        return {
            link       : link,
            restrict   : 'E',
            replace    : false,
            transclude : false,
            scope      : {
                cozenUploadInfoConfig : '=?',
                cozenUploadInfoDisplay: '=?'
            },
            templateUrl: 'directives/icons/upload-info/uploadInfo.template.html'
        };

        function link(scope, element, attrs) {
            var methods = {
                init    : init,
                destroy : destroy,
                hasError: hasError
            };

            var data = {
                directive: 'cozenUploadInfo'
            };

            methods.init();

            function init() {

                // Checking required stuff
                if (methods.hasError()) {
                    return;
                }

                // Default values (scope)
                angular.isUndefined(attrs.cozenUploadInfoDisplay) ? scope.cozenUploadInfoDisplay = true : null;

                // Forge the label
                scope.cozenUploadInfoLabel = '<span>';
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'pattern')) {

                    // Remove dots and comma, split types into one array
                    var types = scope.cozenUploadInfoConfig.pattern;
                    types     = types.replace(/\./g, '');
                    types     = types.split(',');

                    // Title
                    if (types.length > 1) {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_types');
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_type');
                    }

                    // Add the types
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    for (var i = 0, length = types.length; i < length; i++) {
                        scope.cozenUploadInfoLabel += types[i].toUpperCase();
                        if (i < length - 1) {
                            scope.cozenUploadInfoLabel += ', ';
                        }
                    }
                    scope.cozenUploadInfoLabel += '</span><br>';
                }
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxSize')) {
                    scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_maxSize');
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.maxSize;
                    scope.cozenUploadInfoLabel += '</span><br>';
                }
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minHeight') || Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxHeight')) {
                    scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_height');
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minHeight')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.minHeight;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += ' x ';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxHeight')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.maxHeight;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += '</span><br>';
                }
                if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minWidth') || Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxWidth')) {
                    scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_width');
                    scope.cozenUploadInfoLabel += '<span class="cozen-upload-info-value">';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'minWidth')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.minWidth;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += ' x ';
                    if (Methods.hasOwnProperty(scope.cozenUploadInfoConfig, 'maxWidth')) {
                        scope.cozenUploadInfoLabel += scope.cozenUploadInfoConfig.maxWidth;
                    }
                    else {
                        scope.cozenUploadInfoLabel += $filter('translate')('cozen_icons_uploadInfo_undefined');
                    }
                    scope.cozenUploadInfoLabel += '</span><br>';
                }

                // Init stuff
                element.on('$destroy', methods.destroy);
                scope._activeTheme = Themes.getActiveTheme();
            }

            function hasError() {
                if (Methods.isNullOrEmpty(attrs.cozenUploadInfoConfig)) {
                    Methods.directiveErrorRequired(data.directive, 'Config');
                    return true;
                }
                return false;
            }

            function destroy() {
                element.off('$destroy', methods.destroy);
            }
        }
    }

})(window.angular);


