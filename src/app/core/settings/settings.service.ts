import {Injectable} from "@angular/core";
import {isNullOrUndefined} from "util";
import {Location} from "@angular/common";
declare var $: any;

@Injectable()
export class SettingsService {

  public user: any;
  public app: any;
  public layout: any;

  constructor(private location: Location) {

    /**
     * 用户信息（当前登录用户）
     * 获取用户cookie信息并展示
     */
    let sessionInfo = sessionStorage.getItem('loginInfo');
    let loginInfo: any = JSON.parse(sessionInfo);
    let name = '游客', job = '无',orgName = '';
    if (!isNullOrUndefined(loginInfo)) {
      if (!isNullOrUndefined(loginInfo.mgrName)){
        name = loginInfo.mgrName;
      }else if(!isNullOrUndefined(loginInfo.state)){
        job = this.getUserJob(loginInfo);
      }
      if(!isNullOrUndefined(loginInfo.rbacOrganVO.orgName)){
        orgName = loginInfo.rbacOrganVO.orgName;
        console.log("-----loginInfo.rbacOrganVO:"+loginInfo.rbacOrganVO)
        console.log("-----loginInfo.rbacOrganVO.orgName:"+loginInfo.rbacOrganVO.orgName)
        console.log("-----orgName:"+orgName)
      }
    };
    this.user = {
      name: name,
      job: job,
      orgName: orgName,
      picture: 'assets/img/user/user.png'
    };


    // App Settings
    // -----------------------------------
    this.app = {
      name: '三楂红科技-系统权限管理平台',
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

  getUserJob(loginInfo){
    let job;
    if(loginInfo.state === 'SUPER'){
      if (loginInfo.orgCode === '#'){
        job = '系统超管';
      }else{
        job = '机构超管';
      }
    }else if(loginInfo.state == 'OPEN'){
      job = '机构管理员';
    };
    return job;
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
      if ($(window).width() > 768 && !isNullOrUndefined(width)) $('.rightpage').css('width', width); //pc模式下,可以自定义宽度
      me.layout.operationpageOpen = true;  //开启右侧页面
      $('html').removeClass('csstransforms3d'); //剔除动画效果，此效果和浮动冲突
      $('app-offsidebar').hide();
    }, 10);
  }

  /**
   * 关闭右侧页面 by 立坤
   * @param
   */
  closeRightPage() {
    this.layout.operationpageOpen = false; //关闭右侧滑动页面
    $('html').addClass('csstransforms3d'); //加入样式，动态滑动效果
    $('app-offsidebar').show();
  }

  /**
   * 关闭右侧页面并返回上级路由
   * 针对路由跳转的右弹窗
   * by 高洁
   */
  closeRightPageAndRouteBack(){
    this.closeRightPage();//关闭右侧滑动页面
    let that = this;
    setTimeout(function(){
      that.location.back();//返回上级路由
    },100)
  }
}
