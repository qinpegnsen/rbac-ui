import { Injectable } from '@angular/core';
import {CookieService} from "angular2-cookie/core";
import {any} from "codelyzer/util/function";

//后台菜单返回格式
interface menuVO{
  sysCode:string;
  menuCode:string;
  menuName:string;
  menuUrl:string;
  menuIcon?:string;
  preMenuCode?:string;
  subMenuList?:Array<any>;
  level?:number;
  ord?:number;
  remarks?:string;
  isUse:string;
}

class MenuItem {
  text:string;  //菜单文字
  heading:boolean;  //
  link:string;     // internal route links
  elink:string;    // used only for external links
  target:string;   // anchor target="_blank|_self|_parent|_top|framename"
  icon:string;  //图标
  alert:string; //
  submenu:Array<any>;
}

@Injectable()
export class MenuService {

  constructor(private cookieService:CookieService) {
  }

  /**
   * 设置权限菜单信息
   * @param items
   */
  addMenu(items:Array<menuVO>) {
    let menuItems:Array<MenuItem> = [],menuItem:MenuItem;

    items.forEach((item) => {
      menuItem = new MenuItem();
      menuItem.text = item.menuName;
      menuItem.link = item.menuUrl;
      menuItem.icon = item.menuIcon;
      menuItems.push(menuItem);
    });
    this.cookieService.putObject('userMenu', menuItems); //保存menu信息至cookie
  }

  /**
   * 获取权限菜单
   * @returns {Array<any>}
   */
  getMenu() {
    return <Array<any>>this.cookieService.getObject("userMenu"); //cookie中取出
  }

}
