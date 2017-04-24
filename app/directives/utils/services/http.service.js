(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .factory('cozenHttp', cozenHttp);

    cozenHttp.$inject = [
        '$http',
        'CONFIG',
        '$q',
        'cozenEnhancedLogs'
    ];

    function cozenHttp($http, CONFIG, $q, cozenEnhancedLogs) {

        return {
            requestGet   : requestGet,
            requestPost  : requestPost,
            requestPut   : requestPut,
            requestCustom: requestCustom
        };

        /**
         * Get request
         * @param url
         * @param callbackSuccess
         * @param callbackError
         * @returns {Promise}
         */
        function requestGet(url, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: 'GET',
                url    : CONFIG.api.url + url,
                data   : {
                    session: null,
                    data   : null
                }
            });
            $http.get(CONFIG.api.url + url)
                .then(function (response) {
                    deferred.resolve(response);
                    if (Methods.isFunction(callbackSuccess)) {
                        callbackSuccess(response);
                    }
                })
                .catch(function (response) {
                    deferred.reject(response, 200);
                    if (Methods.isFunction(callbackError)) {
                        callbackError(response);
                    }
                })
            ;
            return deferred.promise;
        }

        /**
         * Post request
         * @param url
         * @param params
         * @param callbackSuccess
         * @param callbackError
         * @returns {Promise}
         */
        function requestPost(url, params, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: 'POST',
                url    : CONFIG.api.url + url,
                data   : {
                    session: {},
                    data   : params
                }
            });
            $http.post(CONFIG.api.url + url, {
                data   : params,
                session: {}
            }).then(function (response) {
                deferred.resolve(response);
                if (Methods.isFunction(callbackSuccess)) {
                    callbackSuccess(response);
                }
            }).catch(function (response) {
                deferred.reject(response, 200);
                if (Methods.isFunction(callbackError)) {
                    callbackError(response);
                }
            });
            return deferred.promise;
        }

        /**
         * Put request
         * @param url
         * @param params
         * @param callbackSuccess
         * @param callbackError
         * @returns {Promise}
         */
        function requestPut(url, params, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: 'PUT',
                url    : CONFIG.api.url + url,
                data   : {
                    session: {},
                    data   : params
                }
            });
            $http.put(CONFIG.api.url + url, {
                data   : params,
                session: {}
            }).then(function (response) {
                deferred.resolve(response);
                if (Methods.isFunction(callbackSuccess)) {
                    callbackSuccess(response);
                }
            }).catch(function (response) {
                deferred.reject(response, 200);
                if (Methods.isFunction(callbackError)) {
                    callbackError(response);
                }
            });
            return deferred.promise;
        }

        /**
         * Custom request
         * @param method
         * @param url
         * @param params
         * @param callbackSuccess
         * @param callbackError
         * @returns {Promise}
         */
        function requestCustom(method, url, params, callbackSuccess, callbackError) {
            var deferred = $q.defer();
            cozenEnhancedLogs.info.httpRequest({
                methods: method,
                url    : url,
                data   : {
                    session: {},
                    data   : params
                }
            });
            $http({
                methods: method,
                url    : url,
                data   : params,
                session: {}
            }).then(function (response) {
                deferred.resolve(response);
                if (Methods.isFunction(callbackSuccess)) {
                    callbackSuccess();
                }
            }).catch(function (response) {
                deferred.reject(response, 200);
                if (Methods.isFunction(callbackError)) {
                    callbackError();
                }
            });
            return deferred.promise;
        }
    }

}(window.angular));
