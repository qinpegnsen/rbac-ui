import {Component, OnInit} from '@angular/core';
import {AppStore} from "../store/app-store";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {OrgService} from '../server/org.service';

@Component({
  selector: 'app-home-p',
  templateUrl: './home-p.component.html',
  styleUrls: ['./home-p.component.scss']
})
export class HomePComponent implements OnInit {
  public orgEmpExtVOList: Array<any>;
  public result;
  public pre_arr;
  private deptCode;
  constructor(private store:Store<AppStore>,
              private org:OrgService){}

  ngOnInit() {
    this.getOrgList('/dept/list');
    // 更新组织列表
    this.store.select('staff').subscribe((item) => {
      this.orgEmpExtVOList = item as Array<any>;
      console.log(this.orgEmpExtVOList);
    })
    // 初始化导航的路径
    this.store.dispatch({type: 'PATH_ADD', payload: ['']});
    this.store.select('updata').subscribe((res) => {
      if (res) {
        this.getOrgList('/dept/list');
      }
    });
  }

  /**
   * 获取组织列表
   * @param url
     */
  getOrgList(url:string) {
    this.org.getOrgList(url).subscribe((res) => {
      console.log("█ res ►►►", res );

      const {result, pre_arr} = this.toTreeDate(res);
      this.result = result;
      this.pre_arr = pre_arr;
      console.log("█ result ►►►", result );
      console.log("█ pre_arr ►►►", pre_arr );

    })
  }

  /**
   *  解析成树形的数据
   * @param data
   * @returns {{result: Array, pre_arr: {}}}
     */
  toTreeDate(data: any): {result: any, pre_arr: any} {
    const result = [];
    const org_arr = {};
    data.forEach((item) => {

    for (let a in item) {
      if (a === 'deptCode') {
        org_arr[item[a]] = item;
      }
    }
  });

    let i = 0;
    const pre_arr = {};
    data.forEach((item) => {
      for (let a in item) {
        if (a === 'preCode') {
          // 获取顶级
          if (item[a] === null  || item[a] === '' ) {
            item.istop = true;
            result[i] = item;
            i ++;
          } else {
            for (let key in org_arr) {
              if (item[a] === key) {
                if (pre_arr[key]) { // 如果重复
                  pre_arr[key].push(item);
                } else {
                  pre_arr[key] = [];
                  pre_arr[key].push(item);
                }
              }
            }
          }
        }
      }
    });
    return {result: result, pre_arr: pre_arr}
  }


}
