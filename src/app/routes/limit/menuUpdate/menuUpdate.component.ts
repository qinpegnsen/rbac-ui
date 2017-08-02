import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
const swal = require('sweetalert');
@Component({
  selector: 'app-rightamend',
  templateUrl: './menuUpdate.component.html',
  styleUrls: ['./menuUpdate.component.scss'],
  providers:[SettingsService]
})
export class MenuUpdateComponent implements OnInit {

  private queryId;

  private limitForm = {
    menuCode:'',
    menuName:'',
    menuUrl:'',
    preMenuCode:'',
    menuIcon:'',
    level:'',
    remarks:'',
    ord:''
  }

  constructor(public ajax:AjaxService,public settings: SettingsService,private router:Router,private route: ActivatedRoute,private routeInfo: ActivatedRoute) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {

    //获取修改id
    this.queryId=this.routeInfo.snapshot.queryParams['id']

    //获取菜单编码
    this.route.params.subscribe(params => {
      this.limitForm.menuCode = params['menuCode'];
    });
  }

  // 取消
  cancel(){
    this.settings.closeRightPage(); //关闭右侧滑动页面
    this.router.navigate(['/main/limit']);
  }

  //修改

  submitLimitData(){
    let me = this;
    let submitUrl = '/limitMenu/update';
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
