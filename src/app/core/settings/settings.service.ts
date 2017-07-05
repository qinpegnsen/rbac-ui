import {Injectable} from '@angular/core';
import {isNullOrUndefined} from 'util';
declare var $: any;

@Injectable()
export class SettingsService {

  public user: any;
  public app: any;
  public layout: any;

  constructor() {

    // User Settings
    // -----------------------------------
    this.user = {
      name: '爱馨',
      job: 'ng-developer',
      picture: 'assets/img/user/02.jpg'
    };

    // App Settings
    // -----------------------------------
    this.app = {
      name: '爱馨信息科技-系统权限管理平台',
      description: '系统权限管理平台',
      year: ((new Date()).getFullYear())
    };

    // Layout Settings
    // -----------------------------------
    this.layout = {
      isFixed: true,
      isCollapsed: false,
      isBoxed: false,
      isRTL: false,
      horizontal: false,
      isFloat: false,
      asideHover: false,
      theme: null,
      asideScrollbar: false,
      isCollapsedText: false,
      useFullLayout: false,
      hiddenFooter: false,
      offsidebarOpen: false,
      operationpageOpen: false,  //是否显示右侧操作页面  by 立坤
      asideToggled: false,
      viewAnimation: 'ng-fadeInUp'
    };

  }

  getAppSetting(name) {
    return name ? this.app[name] : this.app;
  }

  getUserSetting(name) {
    return name ? this.user[name] : this.user;
  }

  getLayoutSetting(name) {
    return name ? this.layout[name] : this.layout;
  }

  setAppSetting(name, value) {
    if (typeof this.app[name] !== 'undefined') {
      this.app[name] = value;
    }
  }

  setUserSetting(name, value) {
    if (typeof this.user[name] !== 'undefined') {
      this.user[name] = value;
    }
  }

  setLayoutSetting(name, value) {
    if (typeof this.layout[name] !== 'undefined') {
      return this.layout[name] = value;
    }
  }

  toggleLayoutSetting(name) {
    return this.setLayoutSetting(name, !this.getLayoutSetting(name));
  }

  /**
   * 显示右侧页面 by 立坤
   * width是定义pc端下宽度，不传默认宽度是50%，可以传“30%”表示百分比宽度，可以传“500px”表示固定宽度
   * @param width
   */
  showRightPage(width?) {
    let me = this;
    setTimeout(() => {
      if ($(window).width() > 768 && !isNullOrUndefined(width)) { //pc模式下,可以自定义宽度
        console.log("width",width);
        $('.rightpage').css('width', width);
      }
      me.layout.operationpageOpen = true;
    }, 10);
  }

}
