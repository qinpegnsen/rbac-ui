import { Injectable } from '@angular/core';
import {CookieService} from "angular2-cookie/core";
import {any} from "codelyzer/util/function";
import {isNullOrUndefined} from "util";

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

  foreachPushMenu(items:Array<menuVO>) {
    let menuItems:Array<MenuItem> = [],menuItem:MenuItem;
    console.log("█ items ►►►",  items);
    items.forEach((item) => {
      menuItem = new MenuItem();
      //设置菜单显示名称
      menuItem.text = item.menuName;
      //判断菜单是否有下级
      if (item.menuUrl == "#") {
        menuItem.alert = "child";
        menuItem.submenu = this.foreachPushMenu(item.subMenuList);
      }
      else menuItem.link = item.menuUrl;

      //判断菜单图标是否为空
      if (!isNullOrUndefined(item.menuIcon)) menuItem.icon = item.menuIcon;

      menuItems.push(menuItem);
    });
    return menuItems;
  }

  /**
   * 设置权限菜单信息
   * @param items
   */
  addMenu(items:Array<menuVO>) {
    let menuItems:Array<MenuItem> = [],menuItem:MenuItem;

    menuItems = this.foreachPushMenu(items);

    /*items.forEach((item) => {
      menuItem = new MenuItem();
      menuItem.text = item.menuName;
      //判断菜单是否有下级
      if (item.menuUrl == "#") {
        menuItem.alert = "child";
        console.log("█ item.subMenuList ►►►",  item.subMenuList);
      }
      else menuItem.link = item.menuUrl;

      //判断菜单图标是否为空
      if (!isNullOrUndefined(item.menuIcon)) menuItem.icon = item.menuIcon;

      menuItems.push(menuItem);
    });*/
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
