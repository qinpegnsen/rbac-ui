import { Component, OnInit } from '@angular/core';
import { Location }from '@angular/common';
import {AjaxService} from "../../../core/services/ajax.service";
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';

const swal = require('sweetalert');

@Component({
  selector: 'app-add-sys',
  templateUrl: './add-sys.component.html',
  styleUrls: ['./add-sys.component.scss'],
  providers: [Location]
})
export class AddSysComponent implements OnInit {
  private pageTitle:string = '添加系统';
  private path: string;
  private system = {
    sysCode: '',
    sysName: '',
    sysLogo: '',
    sysUrl: '',
    crtime: '',
    uptime: '',
    remarks: ''
  };
  private sysDetail:boolean = false;

  constructor(private ajax: AjaxService,public settings: SettingsService,
              private route: ActivatedRoute, private router:Router,
              private Location: Location) {
    this.settings.showRightPage("28%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {

    //获取当前路由
    this.route.url.subscribe(urls => {
      this.path = urls[0].path;
      console.log("█ this.path ►►►",  this.path);
      switch(this.path) {
        //添加系统
        case "addSystem":
          console.log("█ \"添加系统\" ►►►",  "添加系统");
          this.pageTitle = "添加系统";
          break;

        //查看系统详情
        case "sysDetail":
          console.log("█ \"查看系统详情\" ►►►",  "查看系统详情");
          this.sysDetail = true;//属于查看详情，需要隐藏可编辑表单
          this.pageTitle = "系统详情";
          this.getSysCode();//获取系统代码(路由参数)
          this.getSystemDetail()//获取某个系统详情
          break;

        //修改系统信息
        case "updateSystem":
          console.log("█ \"修改系统信息\" ►►►",  "修改系统信息");
          this.pageTitle = "修改系统";
          this.getSysCode();//获取系统代码(路由参数)
          this.getSystemDetail()//获取某个系统详情
          break;
      }

      //console.log("█ this.addSystem || this.updateSystem ►►►",  this.addSystem || this.updateSystem);
    });
  }
  //获取系统代码(路由参数)
  getSysCode(){
    this.route.params.subscribe(params => {
      this.system.sysCode = params['sysCode'];
    });
  }


  //从详情去修改
  toUpdateSystem(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/system/sys-platform/updateSystem',this.system.sysCode], { replaceUrl: true });
  }

  //获取某个系统详情
  getSystemDetail(){
    this.ajax.get({
      url: '/sys/load',
      data:{
        sysCode: this.system.sysCode
      },
      success: (res) => {
        if(res.success){
          this.system = res.data;
        }
      },
      error: (res) => {
        console.log("get systemDetail error");
      }
    });
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
        submitUrl = '/sys/add';
            break;
      case "updateSystem":
        submitUrl = '/sys/update';
        break;
    }
    console.log("█ submitData ►►►",  submitData);
    me.ajax.post({
      url: submitUrl,
      data: submitData,
      success: (res) => {
        console.log("█ res ►►►",  res);
        if (res.success){
          this.cancel(); //路由跳转
          swal({
            title: '提交成功!',
            text: '列表已自动更新',
            type: 'success',
            timer: 2000, //关闭时间，单位：毫秒
            showConfirmButton: false  //不显示按钮
          });
          //this.outputvalue.emit(true);//提交成功后向父组件传值
        }else{
          let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post system error");
      }
    })
  }

  // 取消
  cancel(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.Location.back();
    this.router.navigate(['/main/system/sys-platform']);
  }
}
