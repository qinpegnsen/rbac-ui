import {Component, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {SettingsService} from "../../../core/settings/settings.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AddSysService} from "./add-sys.service";
import {AddAdminService} from "../add-admin/add-admin.service";
import {SysPlatformComponent} from "../sys-platform/sys-platform.component";
import {FileUploader} from "ng2-file-upload";
import {AppComponent} from "../../../app.component";
import {GetUidService} from "../../../core/services/get-uid.service";
import {isNullOrUndefined} from "util";
import {MaskService} from "../../../core/services/mask.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {PatternService} from "../../../core/forms/pattern.service";

const swal = require('sweetalert');

@Component({
  selector: 'app-add-sys',
  templateUrl: './add-sys.component.html',
  styleUrls: ['./add-sys.component.scss'],
  providers: [Location,AddSysService,AddAdminService]
})
export class AddSysComponent implements OnInit {
  private pageTitle:string = '添加系统';
  private path: string;
  private uuid:string;//上传图片暗码
  private system = { };
  private sysDetail:boolean = false;
  private myImg: any;
  private upBrandImg:boolean = false;
  private fileName:string = '选择图片';
  public uploader:FileUploader = new FileUploader({
    // url: '/sys/uploadSysLogo',
    url: '/upload/basic/upload',
    itemAlias:"limitFile"
  }); //初始化上传方法

  constructor(private addSysService: AddSysService,
              public settings: SettingsService,
              private route: ActivatedRoute,
              private router:Router,
              public patterns: PatternService,
              private getUid:GetUidService,
              private Location: Location,
              private mask: MaskService,
              private addAdminService:AddAdminService,
              private sysPlatformComponent:SysPlatformComponent) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    let me = this;

    //获取当前路由
    me.route.url.subscribe(urls => {
      me.path = urls[0].path;
      console.log("█ me.path ►►►",  me.path);
      switch(me.path) {
        //添加系统
        case "addSystem":
          //console.log("█ \"添加系统\" ►►►",  "添加系统");
          me.pageTitle = "添加系统";
          break;

        //查看系统详情
        case "sysDetail":
          //console.log("█ \"查看系统详情\" ►►►",  "查看系统详情");
          me.sysDetail = true;//属于查看详情，需要隐藏可编辑表单
          me.pageTitle = "系统详情";
          me.getSysCode();//获取系统代码(路由参数)
          me.system = me.addSysService.getSystemDetail(this.system['sysCode'])//获取某个系统详情
          break;

        //修改系统信息
        case "updateSystem":
          //console.log("█ \"修改系统信息\" ►►►",  "修改系统信息");
          me.pageTitle = "修改系统";
          me.getSysCode();//获取系统代码(路由参数)
          me.system = me.addSysService.getSystemDetail(this.system['sysCode'])//获取某个系统详情
          break;
      }

    });
  }
  /**
   * 监听图片选择
   * @param $event
   */

  fileChangeListener() {
    // 当选择了新的图片的时候，把老图片从待上传列表中移除
    if(this.uploader.queue.length > 1) this.uploader.queue[0].remove();
    this.myImg = true;  //表示已经选了图片
  }
  /**
   * 获取系统代码(路由参数)
   */
  getSysCode(){
    this.route.params.subscribe(params => {
      this.system['sysCode'] = params['sysCode'];
    });
  }

  /**
   * 从详情去修改
   */
  toUpdateSystem(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/system/sys-platform/updateSystem',this.system['sysCode']], { replaceUrl: true });
  }

  //提交表单
  submitSysData(){
    let me = this;
    let submitUrl,submitData;
    submitUrl = '/sys/add';
    submitData = me.system;
    switch(this.path) {
      //添加系统
      case "addSystem":
        me.uuid = null;//先置空
        submitUrl = '/sys/add';
        me.upLoadImg(submitUrl,submitData);// 上传图片及提交数据
            break;
      case "updateSystem":
        submitUrl = '/sys/update';
        me.uuid = null;//先置空
        me.upLoadImg(submitUrl,submitData);// 上传图片及提交数据
        break;
    }
  }
  /**
   * 上传图片及提交数据
   * @param submitData
   * @param submitUrl
   */
  private upLoadImg(submitUrl,submitData){
    let me = this;
    me.mask.showMask();//上传图片比较慢，显示遮罩层
    //上传之前
    me.uploader.onBuildItemForm = function(fileItem, form){
      me.uuid = me.getUid.getUid();
      form.append('uuid', me.uuid);
    };
    //执行上传
    me.uploader.uploadAll();
    //上传成功
    me.uploader.onSuccessItem = function (item, response, status, headers) {
      let res = JSON.parse(response);
      if (res.success) {
        if(!isNullOrUndefined(me.uuid)) submitData.uuid = me.uuid;
      } else {
        AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
      }
    }
    // 上传失败
    me.uploader.onErrorItem = function (item, response, status, headers) {
      AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
    };
    //上传完成，不管成功还是失败
    me.uploader.onCompleteAll = function(){
      me.addAdminService.submitRightPageData(submitUrl,submitData,true);
      me.sysPlatformComponent.queryDatas()//刷新父页面数据
    }

    //如果没有选择图片则直接提交
    if(!me.uploader.isUploading){ // 图片已经传过了，但是数据提交失败了，改过之后可以直接提交
      if(!isNullOrUndefined(me.uuid)) submitData.uuid = me.uuid;
      me.addAdminService.submitRightPageData(submitUrl,submitData,true);
      me.sysPlatformComponent.queryDatas()//刷新父页面数据
    }
  }

  // 取消
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

}
