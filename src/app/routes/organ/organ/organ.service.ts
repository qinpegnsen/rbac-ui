import {Injectable} from "@angular/core";
import {AjaxService} from "../../../core/services/ajax.service";
import {isNull} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
const swal = require('sweetalert');

@Injectable()
export class OrganService {

  constructor(private tools:RzhtoolsService,private ajax: AjaxService) { }

  /**
   * 获取机构列表
   * @param activePage
   * @param searchKey
   * @returns {any}
     */
  getOrganListpage(activePage,searchKey) {
    let organs;
    this.ajax.get({
      url: "/organ/listpage",
      async:false,
      data: {
        curPage:activePage,
        orgName: searchKey,
        pageSize: '10'
      },
      success: (res) => {
        if (!isNull(res)) {
          organs = res;
        }
      },
      error: (res) => {
        console.log('organs', res);
      }
    });
    return organs;
  }


  login(){
    this.ajax.post({
      url: '/login/login',
      data: {
        'loginCode': '1001',
        'pwd': '888888'
      },
      success: (data) => {
        // this.router.navigate(['/datatables'],{ replaceUrl: true }); //路由跳转
        //this.table.draw(); //重新绘制表格
        //swal('登录成功！', '信息列表已自动更新...', 'success');
        console.log('data', data);
      },
      error: (data) => {
        //console.log('data', data);
      }
    });
  }

  /**
   * 修改机构状态
   * @param state
   * @param orgCode
     */
  changeState(state,orgCode){
    let title = '成功' + this.tools.getEnumDataValByKey('1008',state);
    let me = this;
    me.ajax.post({
      url: '/organ/updateState',
      async:false,
      data: {
        orgCode: orgCode,
        state: state
      },
      success: (data) => {
        swal({
          title: title,
          text: data.info,
          type: 'success',
          timer: 2000, //关闭时间，单位：毫秒
          showConfirmButton: false  //不显示按钮
        });
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }
}
