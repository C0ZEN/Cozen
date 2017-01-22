(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('CloudinaryUpload', CloudinaryUploadProvider);

    CloudinaryUploadProvider.$inject = [
        'CONFIG'
    ];

    function CloudinaryUploadProvider(CONFIG) {

        // Default values
        var data = {
            url      : 'https://api.cloudinary.com/',
            version  : 'v1_1/',
            cloudName: 'cozen',
            action   : '/upload'
        };


        this.url = function (url) {
            data.url = url;
            return this;
        };

        this.version = function (version) {
            data.version = version;
            return this;
        };

        this.cloudName = function (cloudName) {
            data.cloudName = cloudName;
            return this;
        };

        this.action = function (action) {
            data.action = action;
            return this;
        };

        this.$get = Cloudinary;

        Cloudinary.$inject = [
            'Upload',
            'CONFIG'
        ];

        function Cloudinary(Upload, CONFIG) {
            return {
                upload: upload
            };

            function upload($files, scope, commonData) {
                scope._hasUploadError = false;
                if (!$files) return;
                scope._isUploading = true;

                angular.forEach($files, function (file) {
                    if (file && !file.$error) {

                        // Upload it
                        file.upload = Upload.upload({
                            url : data.url + data.version + data.cloudName + data.action,
                            data: angular.merge({
                                context: 'photo=' + file.$ngfName,
                                file   : file
                            }, commonData)
                        }).progress(function (e) {
                            scope._uploadingText = Math.round((e.loaded * 100.0) / e.total) + '%';
                        }).success(function (data, status, headers, config) {
                            file.result        = data;
                            scope._isUploading = false;
                            if (CONFIG.debug) Methods.directiveCallbackLog(data.directive, 'upload');
                        }).error(function (data, status, headers, config) {
                            file.result             = data;
                            scope._hasUploadError   = true;
                            scope._uploadErrorLabel = 'btn_upload_error_occurred';
                        });
                    }
                });
            }
        }
    }

})(window.angular);
