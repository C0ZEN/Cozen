(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad', [
            'cozenLib.lazyLoad.constant',
            'cozenLib.lazyLoad.internalService',
            'cozenLib.lazyLoad.randomService',
            'cozenLib.lazyLoad.memoryService'
        ]);

})(window.angular);