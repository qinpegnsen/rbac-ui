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
    url: '/sys/uploadSysLogo',
    itemAlias:"limitFile"
  }); //初始化上传方法

  constructor(private addSysService: AddSysService,public settings: SettingsService,
              private route: ActivatedRoute, private router:Router,private getUid:GetUidService,
              private Location: Location,private addAdminService:AddAdminService,
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
  fileChangeListener($event) {
    let that = this;
    let image: any = new Image();
    let file: File = $event.target.files[0];
    that.fileName = file.name;
    let myReader: FileReader = new FileReader();
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.myImg = image.src;
    };
    myReader.readAsDataURL(file);
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

        me.uploader.onBuildItemForm = function(fileItem, form){
          me.uuid = me.getUid.getUid();
          if (me.uuid) submitData.uuid = me.uuid;
          form.append('uuid', me.uuid);
        };
        me.uploader.onSuccessItem = function (item, response, status, headers) {
          let res = JSON.parse(response);
          if (res.success) {
            console.log("█ submitData ►►►",  submitData);
            me.addAdminService.submitRightPageData(submitUrl,submitData,true);
            me.sysPlatformComponent.queryDatas()//刷新父页面数据
          } else {
            AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
          }
        }
        /**
         * 上传失败处理
         * @param item 失败的文件列表
         * @param response 返回信息
         * @param status 状态码
         * @param headers 上传失败后服务器的返回的返回头
         */
        me.uploader.onErrorItem = function (item, response, status, headers) {
          AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
        };
        /**
         * 执行上传
         */
        me.uploader.uploadAll();

        //如果没有选择图片则直接提交
        if(isNullOrUndefined(me.uuid)){
          me.addAdminService.submitRightPageData(submitUrl,submitData,true);
          me.sysPlatformComponent.queryDatas()//刷新父页面数据
        }
            break;
      case "updateSystem":
        submitUrl = '/sys/update';
        me.uuid = null;//先置空

        me.uploader.onBuildItemForm = function(fileItem, form){
          me.uuid = me.getUid.getUid();
          if (me.uuid) submitData.uuid = me.uuid;
          form.append('uuid', me.uuid);
        };
        me.uploader.onSuccessItem = function (item, response, status, headers) {
          let res = JSON.parse(response);
          if (res.success) {
            console.log("█ submitData ►►►",  submitData);
            me.addAdminService.submitRightPageData(submitUrl,submitData,true);
            me.sysPlatformComponent.queryDatas()//刷新父页面数据
          } else {
            AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
          }
        }
        /**
         * 上传失败处理
         * @param item 失败的文件列表
         * @param response 返回信息
         * @param status 状态码
         * @param headers 上传失败后服务器的返回的返回头
         */
        me.uploader.onErrorItem = function (item, response, status, headers) {
          AppComponent.rzhAlt('error','上传失败', '图片上传失败！');
        };
        /**
         * 执行上传
         */
        me.uploader.uploadAll();

        //如果没有选择图片则直接提交
        if(isNullOrUndefined(me.uuid)){
          me.addAdminService.submitRightPageData(submitUrl,submitData,true);
          me.sysPlatformComponent.queryDatas()//刷新父页面数据
        }
        break;
    }
  }

  // 取消
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }
}
