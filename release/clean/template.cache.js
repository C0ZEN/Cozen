angular.module('cozenLib').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('directives/alert/alert.template.html',
    "<div ng-if=_isReady ng-show=cozenAlertDisplay class=cozen-alert ng-class=_methods.getMainClass(); id=\"{{ _cozenAlertId }}\"><div ng-if=\"_cozenAlertIconLeft != ''\" class=\"cozen-alert-icon left\"><i class=\"{{ _cozenAlertIconLeft }}\"></i></div><span class=cozen-alert-label ng-style=\"{'text-align': _cozenAlertTextAlign}\">{{ _cozenAlertLabel | translate }}</span><div ng-if=_cozenAlertCloseBtn class=\"cozen-alert-icon right\" ng-click=_methods.onClose()><cozen-tooltip cozen-tooltip-label=\"'alert_close_btn_tooltip'\" cozen-tooltip-disabled=!_cozenAlertCloseBtnTooltip><i class=\"fa fa-times\"></i></cozen-tooltip></div></div>"
  );


  $templateCache.put('directives/btn-check/btnCheck.template.html',
    "<div ng-if=_isReady class=cozen-btn-check ng-class=_methods.getMainClass(); id=\"{{ _cozenBtnCheckId }}\"><cozen-tooltip cozen-tooltip-label=_cozenBtnCheckTooltip cozen-tooltip-disabled=\"_cozenBtnCheckTooltip == ''\"><div class=cozen-btn-check-container tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick($event)><label ng-if=\"_cozenBtnCheckLabel != ''\" class=cozen-btn-check-label ng-class=[_cozenBtnCheckSize]>{{ _cozenBtnCheckLabel | translate }}</label><div class=cozen-btn-check-square><i ng-show=cozenBtnCheckModel ng-class=\"{'bounceIn': cozenBtnCheckModel && _cozenBtnCheckAnimationOut,\r" +
    "\n" +
    "                          'bounceOut': !cozenBtnCheckModel && _cozenBtnCheckAnimationIn}\" class=\"cozen-btn-check-inner fa fa-check\"></i></div></div></cozen-tooltip></div>"
  );


  $templateCache.put('directives/btn-radio/btnRadio.template.html',
    "<div ng-if=_isReady class=cozen-btn-radio ng-class=_methods.getMainClass(); id=\"{{ _cozenBtnRadioId }}\"><cozen-tooltip cozen-tooltip-label=_cozenBtnRadioTooltip cozen-tooltip-disabled=\"_cozenBtnRadioTooltip == ''\"><div class=cozen-btn-radio-container tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick($event)><label ng-if=\"_cozenBtnRadioLabel != ''\" class=cozen-btn-radio-label ng-class=[_cozenBtnRadioSize]>{{ _cozenBtnRadioLabel | translate }}</label><div class=cozen-btn-radio-bubble><div ng-show=cozenBtnRadioModel ng-class=\"{'bounceIn': cozenBtnRadioModel && _cozenBtnRadioAnimationOut,\r" +
    "\n" +
    "                            'bounceOut': !cozenBtnRadioModel && _cozenBtnRadioAnimationIn}\" class=cozen-btn-radio-inner-bubble></div></div></div></cozen-tooltip></div>"
  );


  $templateCache.put('directives/btn-toggle/btnToggle.template.html',
    "<div ng-if=_isReady class=cozen-btn-toggle ng-class=_methods.getMainClass(); id=\"{{ _cozenBtnToggleId }}\"><cozen-tooltip cozen-tooltip-label=_cozenBtnToggleTooltip cozen-tooltip-disabled=\"_cozenBtnToggleTooltip == ''\"><div class=cozen-btn-toggle-container tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick($event)><label ng-if=\"_cozenBtnToggleLabel != ''\" class=cozen-btn-toggle-label ng-class=[_cozenBtnToggleSize]>{{ _cozenBtnToggleLabel | translate }}</label><div class=cozen-btn-toggle-switch ng-class=\"{'active': cozenBtnToggleModel,\r" +
    "\n" +
    "                            'transition': _cozenBtnToggleAnimation}\"></div></div></cozen-tooltip></div>"
  );


  $templateCache.put('directives/btn/btn.template.html',
    "<div ng-if=_isReady class=cozen-btn ng-class=_methods.getMainClass(); id=\"{{ _cozenBtnId }}\" tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick($event)><div ng-if=\"_cozenBtnIconLeft != '' && !cozenBtnLoader\" class=\"cozen-btn-icon left\"><i ng-class=[_cozenBtnIconLeft]></i></div><div ng-if=\"_cozenBtnImgLeft != '' && !cozenBtnLoader\" class=\"cozen-btn-img left\"><img ng-src=\"{{ _cozenBtnImgLeft }}\"></div><span ng-if=!cozenBtnLoader class=cozen-btn-label>{{ _cozenBtnLabel | translate }}</span><div ng-if=\"_cozenBtnIconRight != '' && !cozenBtnLoader\" class=\"cozen-btn-icon right\"><i ng-class=[_cozenBtnIconRight]></i></div><div ng-if=cozenBtnLoader class=cozen-btn-loader><span></span></div></div>"
  );


  $templateCache.put('directives/dropdown/dropdown.template.html',
    "<div ng-if=_isReady class=cozen-dropdown ng-class=_methods.getMainClass(); id=\"{{ _cozenDropdownId }}\"><div ng-if=\"_cozenDropdownLabel != ''\" class=cozen-dropdown-label><label class=label for=\"{{ _cozenDropdownUuid }}\">{{ _cozenDropdownLabel | translate }}</label><label ng-if=\"_cozenDropdownRequired && _cozenDropdownRequiredConfig.type == 'star'\" class=required-star>*</label><label ng-if=\"_cozenDropdownRequired && _cozenDropdownRequiredConfig.type == 'icon'\" class=required-icon><cozen-tooltip cozen-tooltip-label=_cozenDropdownRequiredTooltip cozen-tooltip-display=block cozen-tooltip-disabled=\"_cozenDropdownRequiredTooltip == ''\"><i class=\"{{ _cozenDropdownRequiredConfig.icon }}\"></i></cozen-tooltip></label></div><div class=cozen-dropdown-container ng-mouseenter=\"_methods.onHover($event, true)\" ng-mouseleave=\"_methods.onHover($event, false)\"><div ng-click=_methods.onClick($event); onclick=this.blur() tabindex=-1 class=cozen-dropdown-content><div ng-if=\"_cozenDropdownIconLeft != ''\" class=\"cozen-dropdown-icon left\"><i ng-class=[_cozenDropdownIconLeft]></i></div><input ng-model=vm.cozenDropdownModelEnhanced ng-required=_cozenDropdownRequired ng-change=_methods.onChange($event); type=text ng-disabled=vm.cozenDropdownDisabled placeholder=\"{{ _cozenDropdownPlaceholder | translate }}\" name=\"{{ _cozenDropdownName }}\" readonly onclick=this.blur() onkeydown=this.blur() ng-model-options=\"{allowInvalid: true}\" id=\"{{ _cozenDropdownUuid }}\"><div class=\"cozen-dropdown-icon right\"><i ng-class=_methods.getArrowClass();></i></div></div><div ng-show=_cozenDropdownCollapse class=cozen-dropdown-transclude ng-style=_methods.getTranscludeStyle() ng-scrollbars ng-scrollbars-disabled=!_cozenScrollBar ng-scrollbars-config=_cozenScrollBarConfig><div class=ng-transclude></div></div></div></div>"
  );


  $templateCache.put('directives/dropdown/items/group/dropdown.group.template.html',
    "<div ng-if=_isReady class=\"cozen-dropdown-item cozen-dropdown-item-group\" ng-class=_methods.getMainClass(); id=\"{{ _cozenDropdownItemGroupId }}\"><div class=\"cozen-dropdown-item-group-content left\"><div ng-if=\"_cozenDropdownItemGroupIconLeft != ''\" class=\"cozen-dropdown-item-group-icon left\"><i ng-class=[_cozenDropdownItemGroupIconLeft]></i></div><span class=cozen-dropdown-item-group-label>{{ _cozenDropdownItemGroupLabel | translate }}</span></div><div class=\"cozen-dropdown-item-group-transclude ng-transclude\"></div></div>"
  );


  $templateCache.put('directives/dropdown/items/search/dropdown.search.template.html',
    "<div ng-if=_isReady class=\"cozen-dropdown-item cozen-dropdown-item-search\" ng-class=_methods.getMainClass(); id=\"{{ _cozenDropdownItemSearchId }}\"><div class=\"cozen-dropdown-item-search-content left\"><div ng-if=\"_cozenDropdownItemSearchIconLeft != ''\" class=\"cozen-dropdown-item-search-icon left\"><i ng-class=[_cozenDropdownItemSearchIconLeft]></i></div><input ng-model=vm.cozenDropdownItemSearchModel ng-change=_methods.onChange($event); type=text placeholder=\"{{ _cozenDropdownItemSearchPlaceholder | translate }}\" ng-model-options=\"{allowInvalid: true}\"><div ng-if=\"_cozenDropdownItemSearchIconRight != ''\" class=\"cozen-dropdown-item-search-icon right\"><i ng-class=[_cozenDropdownItemSearchIconRight]></i></div></div><div ng-if=_cozenDropdownItemSearchEmpty class=cozen-dropdown-item-search-empty><span>{{ 'dropdown_search_empty' | translate }}</span></div></div>"
  );


  $templateCache.put('directives/dropdown/items/simple/dropdown.simple.template.html',
    "<div ng-if=\"_isReady && _cozenDropdownSearch.length > 0\" class=\"cozen-dropdown-item cozen-dropdown-item-simple\" ng-class=_methods.getMainClass(); id=\"{{ _cozenDropdownItemSimpleId }}\" tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick.item($event); onclick=this.blur() ng-mousemove=_methods.onHover($event);><div class=\"cozen-dropdown-item-simple-content left\"><div ng-if=\"_cozenDropdownItemSimpleIconLeft != ''\" class=\"cozen-dropdown-item-simple-icon left\"><i ng-class=[_cozenDropdownItemSimpleIconLeft]></i></div><span class=cozen-dropdown-item-simple-label>{{ _cozenDropdownItemSimpleLabel | translate }} <small ng-if=\"_cozenDropdownItemSimpleSubLabel != ''\">{{ _cozenDropdownItemSimpleSubLabel | translate }}</small></span><div ng-if=\"_cozenDropdownItemSimpleIconRight != ''\" class=\"cozen-dropdown-item-simple-icon right\"><i ng-class=[_cozenDropdownItemSimpleIconRight]></i></div></div><div ng-show=\"_cozenDropdownItemSimpleShowTick && cozenDropdownItemSimpleSelected\" class=\"cozen-dropdown-item-simple-tick right\"><i ng-class=[_cozenDropdownItemSimpleTickIcon]></i></div></div>"
  );


  $templateCache.put('directives/form/form.template.html',
    "<form ng-if=_isReady class=cozen-form name=\"{{ _cozenFormCtrl }}.{{ _cozenFormModel }}.{{ _cozenFormName }}\" id=\"{{ _cozenFormId }}\" cozen-when-ready=_methods.dispatchName(); cozen-wait-for-interpolation=true ng-transclude></form>"
  );


  $templateCache.put('directives/input/input.template.html',
    "<div ng-if=_isReady class=cozen-input ng-class=_methods.getMainClass() id=\"{{ _cozenInputId }}\"><div ng-if=\"_cozenInputLabel != ''\" class=cozen-input-label><label for=\"{{ _cozenInputName }}\" class=label>{{ _cozenInputLabel | translate }}</label><label ng-if=\"_cozenInputRequired && _cozenInputRequiredConfig.type == 'star'\" class=required-star>*</label><label ng-if=\"_cozenInputRequired && _cozenInputRequiredConfig.type == 'icon'\" class=required-icon><cozen-tooltip cozen-tooltip-label=_cozenInputRequiredTooltip cozen-tooltip-display=block cozen-tooltip-disabled=\"_cozenInputRequiredTooltip == ''\"><i class=\"{{ _cozenInputRequiredConfig.icon }}\"></i></cozen-tooltip></label><label ng-if=\"_cozenInputDisplayModelLength && vm.cozenInputModel.length > 0\" class=model-length ng-class=\"{'error': _cozenInputModelLength < 0}\">{{ _cozenInputModelLength }}</label></div><cozen-tooltip cozen-tooltip-label=_cozenInputTooltip cozen-tooltip-trigger=\"{{ _cozenInputTooltipTrigger }}\" cozen-tooltip-display=block cozen-tooltip-type=\"{{ _cozenInputTooltipType }}\" cozen-tooltip-placement=\"{{ _cozenInputTooltipPlacement }}\" cozen-tooltip-disabled=\"_cozenInputTooltip == ''\"><div class=cozen-input-content><div ng-if=\"_cozenInputIconLeft != ''\" class=\"cozen-input-icon left\"><i ng-class=[_cozenInputIconLeft]></i></div><input ng-model=vm.cozenInputModel ng-required=_cozenInputRequired ng-change=_methods.onChange($event); type=\"{{ _cozenInputType }}\" ng-disabled=vm.cozenInputDisabled placeholder=\"{{ _cozenInputPlaceholder | translate }}\" min=\"{{ _cozenInputMin }}\" max=\"{{ _cozenInputMax }}\" ng-minlength=_cozenInputMinLength ng-maxlength=_cozenInputMaxLength name=\"{{ _cozenInputName }}\" ng-pattern=_cozenInputPatternRegExp autocomplete=\"{{ _cozenInputAutoComplete }}\" onfocus=\"this.removeAttribute('readonly')\" readonly ng-model-options=\"{allowInvalid: true}\" id=\"{{ _cozenInputName }}\" cozen-string-to-number cozen-string-to-number-disabled=\"{{ _cozenInputType != 'number' }}\" spellcheck><div ng-if=\"_cozenInputType == 'number'\" class=cozen-input-arrows><div class=\"cozen-input-arrow up\" ng-mousedown=\"_methods.onArrowDown($event, 'up')\" ng-mouseup=_methods.onArrowUp($event)><div></div></div><div class=\"cozen-input-arrow down\" ng-mousedown=\"_methods.onArrowDown($event, 'down')\" ng-mouseup=_methods.onArrowUp($event)><div></div></div></div><div ng-if=_methods.isIconRightDisplay() class=\"cozen-input-icon right\"><i ng-class=_methods.getIconRightClass()></i></div></div></cozen-tooltip></div>"
  );


  $templateCache.put('directives/list/items/media3/list.media3.template.html',
    "<div ng-if=_isReady class=\"cozen-list-item cozen-list-item-media3\" ng-class=_methods.getMainClass(); id=\"{{ _cozenListItemMedia3Id }}\" tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick($event) ng-mousemove=_methods.onHover($event)><div ng-if=\"_cozenListItemMedia3Media != ''\" class=\"cozen-list-item-media3-content media\"><img ng-src=\"{{ _cozenListItemMedia3Media }}\"></div><div class=\"cozen-list-item-media3-content text\"><span class=cozen-list-item-media3-header>{{ _cozenListItemMedia3Header | translate }}</span> <span class=cozen-list-item-media3-label>{{ _cozenListItemMedia3Label | translate }}</span> <span class=cozen-list-item-media3-sub-label>{{ _cozenListItemMedia3SubLabel | translate }}</span></div></div>"
  );


  $templateCache.put('directives/list/items/simple/list.simple.template.html',
    "<div ng-if=_isReady class=\"cozen-list-item cozen-list-item-simple\" ng-class=_methods.getMainClass(); id=\"{{ _cozenListItemSimpleId }}\" tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick.item($event) ng-mousemove=_methods.onHover($event)><div class=\"cozen-list-item-simple-content left\"><div ng-if=\"_cozenListItemSimpleIconLeft != ''\" class=\"cozen-list-item-simple-icon left\"><i ng-class=[_cozenListItemSimpleIconLeft]></i></div><span class=cozen-list-item-simple-label>{{ _cozenListItemSimpleLabel | translate }} <small ng-if=\"_cozenListItemSimpleSubLabel != ''\">{{ _cozenListItemSimpleSubLabel | translate }}</small></span></div><div ng-if=cozenListItemSimpleBtnRight class=\"cozen-list-item-simple-content right\"><cozen-tooltip cozen-tooltip-label=_cozenListItemSimpleBtnRightTooltip cozen-tooltip-disabled=\"_cozenListItemSimpleBtnRightTooltip == ''\"><div ng-click=_methods.onClick.btnRight($event) class=cozen-list-item-simple-btn><i ng-class=[_cozenListItemSimpleBtnRightIcon]></i> <span>{{ _cozenListItemSimpleBtnRightLabel }}</span></div></cozen-tooltip></div></div>"
  );


  $templateCache.put('directives/list/list.template.html',
    "<div ng-if=_isReady class=cozen-list ng-class=_methods.getMainClass(); id=\"{{ _cozenListId }}\" ng-mouseenter=\"_methods.onHover($event, true)\" ng-mouseleave=\"_methods.onHover($event, false)\"><div class=cozen-list-transclude ng-transclude></div></div>"
  );


  $templateCache.put('directives/pagination/pagination.template.html',
    "<div ng-if=\"_isReady && _methods.show();\" class=cozen-pagination ng-class=_methods.getMainClass(); id=\"{{ _cozenPaginationId }}\"><div ng-if=_cozenPaginationFirst ng-click=\"_methods.onClick($event, 'first');\" ng-class=\"{'disabled': _methods.getPages().length <= 1 || cozenPaginationModel == 1}\" class=cozen-pagination-btn tabindex=\"{{ _methods.getPages().length <= 1 || cozenPaginationModel == 1 ? -1 : 0 }}\" cozen-tooltip cozen-tooltip-label=pagination_first cozen-tooltip-placement=\"auto bottom\" cozen-tooltip-disabled=\"!_cozenPaginationWithTooltips || cozenPaginationDisabled || _methods.getPages().length <= 1 || cozenPaginationModel == 1\"><i class=\"fa fa-chevron-left\"></i> <i class=\"fa fa-chevron-left\"></i></div><div ng-if=_cozenPaginationPrevious ng-click=\"_methods.onClick($event, 'previous');\" ng-class=\"{'disabled': _methods.getPages().length <= 1 || cozenPaginationModel == 1}\" class=cozen-pagination-btn tabindex=\"{{ _methods.getPages().length <= 1 || cozenPaginationModel == 1 ? -1 : 0 }}\" cozen-tooltip cozen-tooltip-label=pagination_previous cozen-tooltip-placement=\"auto bottom\" cozen-tooltip-disabled=\"!_cozenPaginationWithTooltips || cozenPaginationDisabled || _methods.getPages().length <= 1 || cozenPaginationModel == 1\"><i class=\"fa fa-chevron-left\"></i></div><div ng-if=\"_methods.getTotalPage() > 5 && _methods.previousBlock()\" ng-click=\"_methods.onClick($event, 'previous-block');\" tabindex=0 class=cozen-pagination-btn><span>...</span></div><div ng-repeat=\"page in _methods.getPages() track by $index\" ng-if=\"page <= _methods.getTotalPage();\" ng-click=\"_methods.onClick($event, 'page', page);\" ng-class=\"{'active': cozenPaginationModel == page}\" tabindex=\"{{ cozenPaginationModel == page ? -1 : 0 }}\" class=cozen-pagination-btn><span>{{ page }}</span></div><div ng-if=\"_methods.getTotalPage() > 5 && _methods.nextBlock()\" ng-click=\"_methods.onClick($event, 'next-block');\" tabindex=0 class=cozen-pagination-btn><span>...</span></div><div ng-if=_cozenPaginationNext ng-click=\"_methods.onClick($event, 'next');\" ng-class=\"{'disabled': _methods.getTotalPage() <= 1 || cozenPaginationModel == _methods.getTotalPage()}\" class=cozen-pagination-btn tabindex=\"{{ _methods.getTotalPage() <= 1 || cozenPaginationModel == _methods.getTotalPage() ? -1 : 0 }}\" cozen-tooltip cozen-tooltip-label=pagination_next cozen-tooltip-placement=\"auto bottom\" cozen-tooltip-disabled=\"!_cozenPaginationWithTooltips || cozenPaginationDisabled || _methods.getPages().length <= 1 || cozenPaginationModel == _methods.getTotalPage()\"><i class=\"fa fa-chevron-right\"></i></div><div ng-if=_cozenPaginationLast ng-click=\"_methods.onClick($event, 'last');\" ng-class=\"{'disabled': _methods.getTotalPage() <= 1 || cozenPaginationModel == _methods.getTotalPage()}\" class=cozen-pagination-btn tabindex=\"{{ _methods.getTotalPage() <= 1 || cozenPaginationModel == _methods.getTotalPage() ? -1 : 0 }}\" cozen-tooltip cozen-tooltip-label=pagination_last cozen-tooltip-placement=\"auto bottom\" cozen-tooltip-disabled=\"!_cozenPaginationWithTooltips || cozenPaginationDisabled || _methods.getPages().length <= 1 || cozenPaginationModel == _methods.getTotalPage()\"><i class=\"fa fa-chevron-right\"></i> <i class=\"fa fa-chevron-right\"></i></div></div>"
  );


  $templateCache.put('directives/panel/panel.template.html',
    "<div ng-if=_isReady class=cozen-panel ng-class=_methods.getMainClass(); id=\"{{ _cozenPanelId }}\"><div class=cozen-panel-header tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick.header($event);><div ng-if=\"_cozenPanelBigIconLeft != ''\" ng-click=_methods.onClick.bigIconLeft($event); class=\"cozen-panel-big-icon left\" ng-mouseenter=_methods.bigIconHover(true); ng-mouseleave=_methods.bigIconHover(false); cozen-tooltip cozen-tooltip-label=_cozenPanelBigIconLeftTooltip cozen-tooltip-placement=\"auto bottom\" cozen-tooltip-disabled=\"_cozenPanelBigIconLeftTooltip == ''\" tabindex=\"{{ _methods.getTabIndex(); }}\"><i ng-class=[_cozenPanelBigIconLeft]></i></div><div ng-if=\"_cozenPanelIconLeft != ''\" class=\"cozen-panel-icon left\"><i ng-class=[_cozenPanelIconLeft]></i></div><span class=cozen-panel-label>{{ _cozenPanelLabel | translate }} <small ng-if=\"_cozenPanelSubLabel != ''\">{{ _cozenPanelSubLabel | translate }}</small></span><div ng-if=\"_cozenPanelIconRight != ''\" class=\"cozen-panel-icon right\"><i ng-class=[_cozenPanelIconRight]></i></div><div ng-if=\"_cozenPanelBigIconRight != ''\" ng-click=_methods.onClick.bigIconRight($event); class=\"cozen-panel-big-icon right\" ng-mouseenter=_methods.bigIconHover(true); ng-mouseleave=_methods.bigIconHover(false); cozen-tooltip cozen-tooltip-label=_cozenPanelBigIconRightTooltip cozen-tooltip-placement=\"auto bottom\" cozen-tooltip-disabled=\"_cozenPanelBigIconRightTooltip == ''\" tabindex=\"{{ _methods.getTabIndex(); }}\"><i ng-class=[_cozenPanelBigIconRight]></i></div></div><div ng-show=\"cozenPanelOpen || _cozenPanelFrozen\" ng-style=_methods.getBodyStyles(); class=cozen-panel-body ng-scrollbars ng-scrollbars-disabled=!_cozenScrollBar ng-scrollbars-config=_cozenScrollBarConfig ng-transclude></div></div>"
  );


  $templateCache.put('directives/pills/items/simple/pills.simple.template.html',
    "<div ng-if=_isReady class=\"cozen-pills-item cozen-pills-item-simple\" ng-class=_methods.getMainClass(); id=\"{{ _cozenPillsItemSimpleId }}\" tabindex=\"{{ _methods.getTabIndex(); }}\" ng-click=_methods.onClick($event); onclick=this.blur()><div class=\"cozen-pills-item-simple-content left\"><div ng-if=\"_cozenPillsItemSimpleIconLeft != ''\" class=\"cozen-pills-item-simple-icon left\"><i ng-class=[_cozenPillsItemSimpleIconLeft]></i></div><span class=cozen-pills-item-simple-label>{{ _cozenPillsItemSimpleLabel | translate }}</span><div ng-if=\"_cozenPillsItemSimpleIconRight != ''\" class=\"cozen-pills-item-simple-icon right\"><i ng-class=[_cozenPillsItemSimpleIconRight]></i></div></div></div>"
  );


  $templateCache.put('directives/pills/pills.template.html',
    "<div ng-if=_isReady class=cozen-pills ng-class=_methods.getMainClass(); id=\"{{ _cozenPillsId }}\" ng-transclude></div>"
  );


  $templateCache.put('directives/popup/popup.template.html',
    "<div ng-if=_isReady ng-show=cozenPopupIsOpen class=cozen-popup ng-class=_methods.getMainClass(); id=\"{{ _cozenPopupId }}\"><div class=cozen-popup-container ng-mouseenter=_methods.onEnter(); ng-mouseleave=_methods.onLeave(); ng-class=_methods.getPopupClass();><div ng-if=_cozenPopupHeader class=cozen-popup-header><div ng-if=\"_cozenPopupHeaderPictoLeft != ''\" class=\"cozen-popup-header-img left\"><img ng-src=\"{{ _cozenPopupHeaderPictoLeft }}\"></div><div class=cozen-popup-header-title><span ng-if=\"_cozenPopupHeaderTitle != ''\" class=title>{{ _cozenPopupHeaderTitle | translate }}</span> <span ng-if=\"_cozenPopupHeaderSubTitle != ''\" class=sub-title>{{ _cozenPopupHeaderSubTitle | translate }}</span></div><div ng-if=_cozenPopupCloseBtn ng-click=\"_methods.hide(null, {name: _cozenPopupName});\" class=cozen-popup-header-close cozen-tooltip cozen-tooltip-label=\"'popup_close'\"><i class=\"fa fa-times\"></i></div></div><div class=cozen-popup-body ng-scrollbars ng-scrollbars-disabled=!_cozenScrollBar ng-scrollbars-config=_cozenScrollBarConfig><div class=ng-transclude></div></div><div ng-if=_cozenPopupFooter class=cozen-popup-footer></div></div></div>"
  );


  $templateCache.put('directives/textarea/textarea.template.html',
    "<div ng-if=_isReady class=cozen-textarea ng-class=_methods.getMainClass() id=\"{{ _cozenTextareaId }}\"><div ng-if=\"_cozenTextareaLabel != ''\" class=cozen-textarea-label><label for=\"{{ _cozenTextareaUuid }}\" class=label>{{ _cozenTextareaLabel | translate }}</label><label ng-if=\"_cozenTextareaRequired && _cozenTextareaRequiredConfig.type == 'star'\" class=required-star>*</label><label ng-if=\"_cozenTextareaRequired && _cozenTextareaRequiredConfig.type == 'icon'\" class=required-icon><cozen-tooltip cozen-tooltip-label=_cozenTextareaRequiredTooltip cozen-tooltip-display=block cozen-tooltip-disabled=\"_cozenTextareaRequiredTooltip == ''\"><i class=\"{{ _cozenTextareaRequiredConfig.icon }}\"></i></cozen-tooltip></label><label ng-if=\"_cozenTextareaDisplayModelLength && vm.cozenTextareaModel.length > 0\" class=model-length ng-class=\"{'error': _cozenTextareaModelLength < 0}\">{{ _cozenTextareaModelLength }}</label></div><cozen-tooltip cozen-tooltip-label=_cozenTextareaTooltip cozen-tooltip-trigger=\"{{ _cozenTextareaTooltipTrigger }}\" cozen-tooltip-display=block cozen-tooltip-placement=\"{{ _cozenTextareaTooltipPlacement }}\" cozen-tooltip-disabled=\"_cozenTextareaTooltip == ''\"><textarea ng-model=vm.cozenTextareaModel ng-required=_cozenTextareaRequired ng-change=_methods.onChange($event); ng-disabled=vm.cozenTextareaDisabled placeholder=\"{{ _cozenTextareaPlaceholder }}\" ng-minlength=_cozenTextareaMinLength ng-maxlength=_cozenTextareaMaxLength name=\"{{ _cozenTextareaName }}\" ng-model-options=\"{allowInvalid: true}\" msd-elastic msd-elastic-disabled=\"{{ !_cozenTextareaElastic }}\" rows=\"{{ _cozenTextareaRows }}\" id=\"{{ _cozenTextareaUuid }}\">\r" +
    "\n" +
    "        </textarea></cozen-tooltip></div>"
  );


  $templateCache.put('directives/tooltip/tooltip.template.html',
    "<div ng-if=_isReady class=cozen-tooltip ng-class=_methods.getMainClass(); ng-style=\"{'display': _cozenTooltipDisplay}\"><div ng-if=\"_cozenTooltipType == 'default'\" class=cozen-tooltip-default uib-tooltip=\"{{ cozenTooltipLabel | translate }}\" tooltip-class=\"{{ _activeTheme }}\" tooltip-placement=\"{{ _cozenTooltipPlacement }}\" tooltip-append-to-body=\"{{ _cozenTooltipBody }}\" tooltip-popup-close-delay=\"{{ _cozenTooltipCloseDelay }}\" tooltip-popup-delay=\"{{ _cozenTooltipDelay }}\" tooltip-trigger=\"'{{ _cozenTooltipTrigger }}'\" tooltip-enable=\"{{ !cozenTooltipDisabled }}\" ng-transclude></div><div ng-if=\"_cozenTooltipType == 'html'\" class=cozen-tooltip-html uib-tooltip-html=cozenTooltipLabel tooltip-class=\"{{ _activeTheme }}\" tooltip-placement=\"{{ _cozenTooltipPlacement }}\" tooltip-append-to-body=\"{{ _cozenTooltipBody }}\" tooltip-popup-close-delay=\"{{ _cozenTooltipCloseDelay }}\" tooltip-popup-delay=\"{{ _cozenTooltipDelay }}\" tooltip-trigger=\"'{{ _cozenTooltipTrigger }}'\" tooltip-enable=\"{{ !cozenTooltipDisabled }}\" ng-transclude></div></div>"
  );


  $templateCache.put('directives/view/view.template.html',
    "<div ng-if=_isReady class=cozen-view cozen-shortcut ng-scrollbars ng-scrollbars-disabled=!_cozenScrollBar ng-scrollbars-config=_cozenScrollBarConfig ng-transclude></div>"
  );

}]);
