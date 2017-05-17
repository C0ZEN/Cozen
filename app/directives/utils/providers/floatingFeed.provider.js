(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('CozenFloatingFeed', CozenFloatingFeedProvider);

    CozenFloatingFeedProvider.$inject = [
        'CONFIG'
    ];

    function CozenFloatingFeedProvider(CONFIG) {

        this.width = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('width');
            }
            else {
                CONFIG.floatingFeed.width = value;
            }
            return this;
        };

        this.size = function (value) {
            CONFIG.floatingFeed.size = value;
            return this;
        };

        this.animationIn = function (value) {
            CONFIG.floatingFeed.animation.in = value;
            return this;
        };

        this.animationOut = function (value) {
            CONFIG.floatingFeed.animation.out = value;
            return this;
        };

        this.closeBtn = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('closeBtn');
            }
            else {
                CONFIG.floatingFeed.closeBtn = value;
            }
            return this;
        };

        this.iconLeft = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('iconLeft');
            }
            else {
                CONFIG.floatingFeed.iconLeft = value;
            }
            return this;
        };

        this.right = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('right');
            }
            else {
                CONFIG.floatingFeed.right = value;
            }
            return this;
        };

        this.bottom = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('bottom');
            }
            else {
                CONFIG.floatingFeed.bottom = value;
            }
            return this;
        };

        this.timeoutTime = function (value) {
            if (typeof value != 'number') {
                Methods.dataMustBeNumber('timeoutTime');
            }
            else {
                CONFIG.floatingFeed.timeout.time = value;
            }
            return this;
        };

        this.autoDestroy = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('autoDestroy');
            }
            else {
                CONFIG.floatingFeed.autoDestroy = value;
            }
            return this;
        };

        this.timeoutBar = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('timeoutBar');
            }
            else {
                CONFIG.floatingFeed.timeout.bar = value;
            }
            return this;
        };

        this.displayTypesDefault = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesDefault');
            }
            else {
                CONFIG.floatingFeed.displayTypes.default = value;
            }
            return this;
        };

        this.displayTypesInfo = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesInfo');
            }
            else {
                CONFIG.floatingFeed.displayTypes.info = value;
            }
            return this;
        };

        this.displayTypesSuccess = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesSuccess');
            }
            else {
                CONFIG.floatingFeed.displayTypes.success = value;
            }
            return this;
        };

        this.displayTypesWarning = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesWarning');
            }
            else {
                CONFIG.floatingFeed.displayTypes.warning = value;
            }
            return this;
        };

        this.displayTypesError = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesError');
            }
            else {
                CONFIG.floatingFeed.displayTypes.error = value;
            }
            return this;
        };

        this.displayTypesPurple = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesPurple');
            }
            else {
                CONFIG.floatingFeed.displayTypes.purple = value;
            }
            return this;
        };

        this.displayTypesGreen = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesGreen');
            }
            else {
                CONFIG.floatingFeed.displayTypes.green = value;
            }
            return this;
        };

        this.displayTypesBlue = function (value) {
            if (typeof value != 'boolean') {
                Methods.dataMustBeBoolean('displayTypesBlue');
            }
            else {
                CONFIG.floatingFeed.displayTypes.blue = value;
            }
            return this;
        };

        this.$get = CozenFloatingFeed;

        CozenFloatingFeed.$inject = [
            'CONFIG'
        ];

        function CozenFloatingFeed(CONFIG) {
            return {
                getDisplayTypes           : getDisplayTypes,
                enableAllDisplayTypes     : enableAllDisplayTypes,
                disableAllDisplayTypes    : disableAllDisplayTypes,
                rollbackOriginDisplayTypes: rollbackOriginDisplayTypes
            };

            /**
             * Return the current display types from the config
             * @return {CONFIG.floatingFeed.displayTypes|{default, info, success, warning, error, purple, green, blue}}
             */
            function getDisplayTypes() {
                return CONFIG.floatingFeed.displayTypes;
            }

            /**
             * Enable all alerts when using the floating feed
             */
            function enableAllDisplayTypes() {
                Object.keys(CONFIG.floatingFeed.displayTypes).map(function (type) {
                    CONFIG.floatingFeed.displayTypes[type] = true;
                });
            }

            /**
             * Disable all alerts when using the floating feed
             */
            function disableAllDisplayTypes() {
                Object.keys(CONFIG.floatingFeed.displayTypes).map(function (type) {
                    CONFIG.floatingFeed.displayTypes[type] = false;
                });
            }

            /**
             * Set the display types to their origin to work like anything append
             */
            function rollbackOriginDisplayTypes() {
                CONFIG.floatingFeed.displayTypes = {
                    default: true,
                    info   : true,
                    success: true,
                    warning: true,
                    error  : true,
                    purple : true,
                    green  : true,
                    blue   : true
                }
            }
        }
    }

})(window.angular);
