/**
 * @ngdoc service
 * @name cozenLib.cozenHttp
 * @requires $http
 * @requires CONFIG
 * @requires $q
 * @requires cozenEnhancedLogs
 **/
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
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestGet
         * @methodOf cozenLib.cozenHttp
         * @description
         * Decorate the http get request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   url             > Suffix added after the CONFIG.api.url
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
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
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestPost
         * @methodOf cozenLib.cozenHttp
         * @description
         * Decorate the http post request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   url             > Suffix added after the CONFIG.api.url
         * @param {object}   params          > Data for the body of the http request
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
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
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestPut
         * @methodOf cozenLib.cozenHttp
         * @description
         * Decorate the http put request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   url             > Suffix added after the CONFIG.api.url
         * @param {object}   params          > Data for the body of the http request
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
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
         * @ngdoc method
         * @name cozenLib.cozenHttp#requestCustom
         * @methodOf cozenLib.cozenHttp
         * @description
         * Decorate a custom http request to use a deferred
         * Optionally called a success/error callback
         * @param {string}   method          > Methods used by the http request (get, post, put...)
         * @param {string}   url             > Full url to work with
         * @param {object}   params          > Data for the body of the http request
         * @param {function} callbackSuccess > Function called on success
         * @param {function} callbackError   > Function called on error
         * @returns {object} promise
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
