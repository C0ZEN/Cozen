(function (angular) {
    'use strict';

    angular
        .module('cozenLibApp')
        .provider('Config', ConfigProvider);

    ConfigProvider.$inject = [
        'CONFIG'
    ];

    function ConfigProvider(CONFIG) {

        this.debug = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('debug');
            else CONFIG.config.debug = value;
            return this;
        };

        this.scrollsBar = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('scrollsBar');
            else CONFIG.config.scrollsBar = value;
            return this;
        };

        this.scrollsBarConfig = function (config) {
            if (typeof config != 'object') Methods.dataMustBeObject('scrollsBarConfig');
            else CONFIG.config.scrollsBarConfig = config;
            return this;
        };

        this.dropdownAutoCloseOthers = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('dropdownAutoCloseOthers');
            else CONFIG.config.dropdown.autoCloseOthers = value;
            return this;
        };

        this.inputDisplayModelLength = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('inputDisplayModelLength');
            else CONFIG.config.input.displayModelLength = value;
            return this;
        };

        this.textareaDisplayModelLength = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaDisplayModelLength');
            else CONFIG.config.textarea.displayModelLength = value;
            return this;
        };

        this.dropdownDisplayModelLength = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('dropdownDisplayModelLength');
            else CONFIG.config.dropdown.displayModelLength = value;
            return this;
        };

        this.requiredType = function (value) {
            var list = ['star', 'icon'];
            if (!Methods.isInList(list, value)) Methods.dataMustBeInThisList('requiredType', list);
            else CONFIG.config.required.type = value;
            return this;
        };

        this.requiredIcon = function (value) {
            CONFIG.config.required.icon = value;
            return this;
        };

        this.$get = Config;

        Config.$inject = [];

        function Config() {
            return {};
        }
    }

})(window.angular);
