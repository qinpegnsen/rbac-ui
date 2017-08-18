import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../../core/settings/settings.service";
import {ActivatedRoute,Router} from '@angular/router';

@Component({
  selector: 'app-rightpage',
  templateUrl: './rightpage.component.html',
  styleUrls: ['./rightpage.component.scss']
})
export class RightpageComponent implements OnInit {
  private queryId:number;//获取添加，修改的ID
  private limitForm = {};


  constructor(public settings: SettingsService,private router:Router,private routeInfo:ActivatedRoute) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }

  ngOnInit() {
    let _this = this;
    //获取路由的参数
    _this.queryId = _this.routeInfo.snapshot.queryParams['id'];
    _this.limitForm['deptName'] = '123';
  }
  /**
   * 关闭子页面（取消）
   */
  cancel(){
    this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }


}
