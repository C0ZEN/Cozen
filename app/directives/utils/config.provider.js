(function (angular) {
    'use strict';

    angular
        .module('cozenLib')
        .provider('Config', ConfigProvider);

    ConfigProvider.$inject = [
        'CONFIG'
    ];

    function ConfigProvider(CONFIG) {

        this.debug = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('debug');
            else CONFIG.debug = value;
            return this;
        };

        this.scrollsBar = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('scrollsBar');
            else CONFIG.scrollsBar = value;
            return this;
        };

        this.scrollsBarConfig = function (config) {
            if (typeof config != 'object') Methods.dataMustBeObject('scrollsBarConfig');
            else CONFIG.scrollsBarConfig = config;
            return this;
        };

        this.dropdownAutoCloseOthers = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('dropdownAutoCloseOthers');
            else CONFIG.dropdown.autoCloseOthers = value;
            return this;
        };

        this.inputDisplayModelLength = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('inputDisplayModelLength');
            else CONFIG.input.displayModelLength = value;
            return this;
        };

        this.textareaDisplayModelLength = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaDisplayModelLength');
            else CONFIG.textarea.displayModelLength = value;
            return this;
        };

        this.dropdownDisplayModelLength = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('dropdownDisplayModelLength');
            else CONFIG.dropdown.displayModelLength = value;
            return this;
        };

        this.requiredType = function (value) {
            var list = ['star', 'icon'];
            if (!Methods.isInList(list, value)) Methods.dataMustBeInThisList('requiredType', list);
            else CONFIG.required.type = value;
            return this;
        };

        this.requiredIcon = function (value) {
            CONFIG.required.icon = value;
            return this;
        };

        this.alertTextAlign = function (value) {
            CONFIG.alert.textAlign = value;
            return this;
        };

        this.alertCloseBtnEnabled = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertCloseBtnEnabled');
            else CONFIG.alert.closeBtn.enabled = value;
            return this;
        };

        this.alertCloseBtnTootlip = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertCloseBtnTootlip');
            else CONFIG.alert.closeBtn.tooltip = value;
            return this;
        };

        this.alertAnimationIn = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertAnimationIn');
            else CONFIG.alert.animation.in = value;
            return this;
        };

        this.alertAnimationOut = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('alertAnimationOut');
            else CONFIG.alert.animation.out = value;
            return this;
        };

        this.alertIconLeftDefault = function (value) {
            CONFIG.alert.iconLeft.default = value;
            return this;
        };

        this.alertIconLeftInfo = function (value) {
            CONFIG.alert.iconLeft.info = value;
            return this;
        };

        this.alertIconLeftSuccess = function (value) {
            CONFIG.alert.iconLeft.success = value;
            return this;
        };

        this.alertIconLeftWarning = function (value) {
            CONFIG.alert.iconLeft.warning = value;
            return this;
        };

        this.alertIconLeftError = function (value) {
            CONFIG.alert.iconLeft.error = value;
            return this;
        };

        this.$get = Config;

        Config.$inject = [];

        function Config() {
            return {};
        }
    }

})(window.angular);
