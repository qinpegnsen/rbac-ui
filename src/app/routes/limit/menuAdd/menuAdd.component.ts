import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {ActivatedRoute,Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
const swal = require('sweetalert');
@Component({
  selector: 'app-rightpage',
  templateUrl: './menuAdd.component.html',
  styleUrls: ['./menuAdd.component.scss'],
  providers:[SettingsService]
})
export class MenuAddComponent implements OnInit {
  private queryId:number;
  private limitForm = {
    sysCode:'',
    menuName: '',
    menuUrl: '',
    preMenuCode: '',
    menuIcon: '',
    level: '',
    remarks: '',
    ord:''
  }

  // 构造 初始化
  constructor(private ajax:AjaxService, public settings: SettingsService,private router:Router, private routeInfo: ActivatedRoute,private route: ActivatedRoute) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    //获取路由的参数
    this.queryId=this.routeInfo.snapshot.queryParams['id'];

    //获取菜单编码
    /*this.route.params.subscribe(params => {
      console.log("█ params ►►►", params );
      this.limitForm.sysCode = params['sysCode'];
    });*/

    this.limitForm.sysCode=this.routeInfo.snapshot.queryParams['sysCode'];
    console.log("█ sysCode ►►►", this.limitForm.sysCode );

  }



  // 取消
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }



  addRoleGroup(value){
    console.log(value);

    //添加页面元素列表
    if(this.queryId==2){
      console.log(value);
      this.ajax.post({
        url: '/limitPage/add',
        data: {
          'sysCode':this.limitForm.sysCode ,
          'pageName':value.pageName ,
          'preCode': value.preCode,
          'icon': value.icon,
          'level': value.level,
          'remarks':value.remarks,
          'ord':value.ord
        },
        success: (res) => {
          console.log("█ res ►►►",  res);
          if (res.success){
            this.router.navigate(['/main/limit'],{ replaceUrl: true }); //路由跳转
            swal('提交成功！', '列表已自动更新...', 'success');
            //this.outputvalue.emit(true);//提交成功后向父组件传值
          }else{
            let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          console.log("error");
        }
      });
    }
    //添加功能操作列表
    else if(this.queryId==4){
      this.ajax.post({
        url: '/limitOpt/add',
        data: {
          'sysCode':this.limitForm.sysCode ,
          'optName':value.optName ,
          'tacklUrl': value.tacklUrl,
          'preCode': value.preCode,
          'preType': value.preType,
          'ord':value.ord,
          'remarks':value.remarks
        },
        success: (res) => {
          console.log("█ res ►►►",  res);
          if (res.success){
            this.router.navigate(['/main/limit'],{ replaceUrl: true }); //路由跳转
            swal('提交成功！', '列表已自动更新...', 'success');
            //this.outputvalue.emit(true);//提交成功后向父组件传值
          }else{
            let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          console.log("error");
        }
      });
    }
    //添加文件控制列表
    else if(this.queryId==6){
      this.ajax.post({
        url: '/limitFile/add',
        data: {
          'sysCode':this.limitForm.sysCode ,
          'fileName':value.fileName ,
          'fileUrl': value.fileUrl,
          'type': value.type
        },
        success: (res) => {
          console.log("█ res ►►►",  res);
          if (res.success){
            this.router.navigate(['/main/limit'],{ replaceUrl: true }); //路由跳转
            swal('提交成功！', '列表已自动更新...', 'success');
            //this.outputvalue.emit(true);//提交成功后向父组件传值
          }else{
            let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          console.log("error");
        }
      });
    }


    //添加菜单
    let me = this;
    let submitUrl = '/limitMenu/add';
    console.log("█ submitUrl ►►►", submitUrl );

    me.ajax.post({
      url: submitUrl,
      data: me.limitForm,
      success: (res) => {
        console.log("█ res ►►►",  res);
        if (res.success){
          this.router.navigate(['/main/limit'],{ replaceUrl: true }); //路由跳转
          swal('提交成功！', '列表已自动更新...', 'success');
          //this.outputvalue.emit(true);//提交成功后向父组件传值
        }else{
          let errorMsg = res.data.substring(res.data.indexOf('$$')+2,res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (res) => {
        console.log("post limit error");
      }
    })
  }

}
