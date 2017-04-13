(function (angular) {
    'use strict';

    angular
        .module('cozenLib.lazyLoad', [
            'cozenLib.lazyLoad.constant',
            'cozenLib.lazyLoad.internalService',
            'cozenLib.lazyLoad.memoryService',
            'cozenLib.lazyLoad.preBuildService',
            'cozenLib.lazyLoad.randomService'
        ]);

})(window.angular);