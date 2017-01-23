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

        this.currentLanguage = function (value) {
            var list = CONFIG.languages;
            if (!Methods.isInList(list, value)) Methods.dataMustBeInThisList('currentLanguage', list);
            else CONFIG.currentLanguage = value;
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

        this.textareaRequired = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaRequired');
            else CONFIG.textarea.required = value;
            return this;
        };

        this.textareaErrorDesign = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaErrorDesign');
            else CONFIG.textarea.errorDesign = value;
            return this;
        };

        this.textareaSuccessDesign = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaSuccessDesign');
            else CONFIG.textarea.successDesign = value;
            return this;
        };

        this.textareaMinLength = function (value) {
            if (typeof value != 'number') Methods.dataMustBeNumber('textareaMinLength');
            else CONFIG.textarea.minLength = value;
            return this;
        };

        this.textareaMaxLength = function (value) {
            if (typeof value != 'number') Methods.dataMustBeNumber('textareaMaxLength');
            else CONFIG.textarea.maxLength = value;
            return this;
        };

        this.textareaValidatorType = function (value) {
            CONFIG.textarea.validator.type = value;
            return this;
        };

        this.textareaValidatorEmpty = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaValidatorEmpty');
            else CONFIG.textarea.validator.empty = value;
            return this;
        };

        this.textareaElastic = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('textareaElastic');
            else CONFIG.textarea.elastic = value;
            return this;
        };

        this.textareaRows = function (value) {
            if (typeof value != 'number') Methods.dataMustBeNumber('textareaRows');
            else CONFIG.textarea.rows = value;
            return this;
        };

        this.textareaTooltipPlacement = function (value) {
            CONFIG.validator.tooltip.placement = value;
            return this;
        };

        this.textareaTooltipTrigger = function (value) {
            CONFIG.validator.tooltip.trigger = value;
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

        this.btnToggleAnimation = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('btnToggleAnimation');
            else CONFIG.btnToggle.animation = value;
            return this;
        };

        this.btnToggleTooltipType = function (value) {
            CONFIG.btnToggle.tooltipType = value;
            return this;
        };

        this.btnToggleStartRight = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('btnToggleStartRight');
            else CONFIG.btnToggle.startRight = value;
            return this;
        };

        this.popupHeader = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupHeader');
            else CONFIG.popup.header = value;
            return this;
        };

        this.popupFooter = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupFooter');
            else CONFIG.popup.footer = value;
            return this;
        };

        this.popupAnimationInEnabled = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupAnimationInEnabled');
            else CONFIG.popup.animation.in.enabled = value;
            return this;
        };

        this.popupAnimationOutEnabled = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupAnimationOutEnabled');
            else CONFIG.popup.animation.out.enabled = value;
            return this;
        };

        this.popupAnimationInAnimation = function (value) {
            CONFIG.popup.animation.in.animation = value;
            return this;
        };

        this.popupAnimationOutAnimation = function (value) {
            CONFIG.popup.animation.out.animation = value;
            return this;
        };

        this.popupEasyClose = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupEasyClose');
            else CONFIG.popup.easyClose = value;
            return this;
        };

        this.popupCloseBtn = function (value) {
            if (typeof value != 'boolean') Methods.dataMustBeBoolean('popupCloseBtn');
            else CONFIG.popup.closeBtn = value;
            return this;
        };

        this.$get = Config;

        Config.$inject = [];

        function Config() {
            return {};
        }
    }

})(window.angular);
