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
            'CONFIG',
            'cozenEnhancedLogs'
        ];

        function Cloudinary(Upload, CONFIG, cozenEnhancedLogs) {
            return {
                upload: upload
            };

            function upload(file, scope, commonData) {
                scope.cozenBtnHasUploadError = false;
                if (Methods.isNullOrEmpty(file)) {
                    return;
                }
                scope.cozenBtnIsUploading = true;

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
                        file.name                 = file.$ngfName;
                        file.width                = data.width;
                        file.height               = data.height;
                        file.format               = data.format;
                        file.url                  = data.url;
                        scope.cozenBtnIsUploading = false;
                        cozenEnhancedLogs.info.functionCalled('cozenBtn', 'upload');

                        // Update form validity
                        if (scope._cozenBtnUploadRequired) {
                            var btn = scope._methods.getForm()[scope._cozenBtnFormCtrl][scope._cozenBtnFormModel][scope._cozenBtnForm][scope._cozenBtnName];
                            if (!Methods.isNullOrEmpty(btn)) {
                                btn.$setValidity('isUploadSet', true);
                            }
                        }

                        // Callback function
                        if (Methods.isFunction(scope.cozenBtnOnUploadSuccess)) {
                            cozenEnhancedLogs.info.functionCalled('cozenBtn', 'cozenBtnOnUpload');
                            scope.cozenBtnOnUploadSuccess({
                                model: scope.cozenBtnUploadModel
                            });
                        }
                    }).error(function (data, status, headers, config) {
                        file.result                  = data;
                        scope.cozenBtnHasUploadError = true;
                        scope._uploadErrorLabel      = 'btn_upload_error_occurred';

                        // Update form validity
                        if (scope._cozenBtnUploadRequired) {
                            var btn = scope._methods.getForm()[scope._cozenBtnFormCtrl][scope._cozenBtnFormModel][scope._cozenBtnForm][scope._cozenBtnName];
                            if (!Methods.isNullOrEmpty(btn)) {
                                btn.$setValidity('isUploadSet', false);
                            }
                        }
                    });
                }
            }
        }
    }

})(window.angular);
