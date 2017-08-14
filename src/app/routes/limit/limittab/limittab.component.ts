import { Component, OnInit , Input ,OnChanges,SimpleChanges} from '@angular/core';
import {Page} from "../../../core/page/page";
import {Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {isNull,isNullOrUndefined} from "util";
import {LimttabService} from "./limttab.service";
declare var $:any;

//修改状态弹窗
const swal = require('sweetalert');

@Component({
  selector: 'app-limittab',
  templateUrl: './limittab.component.html',
  styleUrls: ['./limittab.component.scss'],
  providers: []
})
export class LimittabComponent implements OnInit,OnChanges {
  private menuData:Page = new Page();
  private operationData:Page = new Page();
  private controlData:Page = new Page();
  private tableButtonConfig:Array<object>;  //列表按钮配置
  private tableButtonConfig1:Array<object>;  //页面添加列表按钮配置
  private tableButtonConfig2:Array<object>;  //功能添加列表按钮配置
  private tableButtonConfig3:Array<object>;  //文件添加列表按钮配置
  private tableButtonConfig4:Array<object>;  //页面元素列表中的修改按钮配置
  private tableButtonConfig5:Array<object>;  //功能操作列表中的修改按钮配置
  private tableButtonConfig6:Array<object>;  //文件控制列表中的修改按钮配置
  private buttonConfig;//页面列表中的添加按钮
  private childpageCode; //页面编码，查询子集用
  private childpageTitList:Array<any> = []; //菜单级别面包屑
  private show = true;//判断页面元素是否有下级
  @Input()
  public sysCode;//获取系统编码

  @Input()
  public menuCode;//获取权限菜单编码

  @Input()
  public pageCode;//获取页面元素编码
  constructor(private ajax:AjaxService, private router:Router, private limttabService:LimttabService) {
    let _this = this;

    /**
     * 多按钮配置
     * @type {{title: string, type: string, size: string}[]}
     */
      //修改权限菜单的按钮
    this.tableButtonConfig = [
      {
        title: "修改菜单",
        type: "update",
        size: "xs",
        //iconsClass:"icon-handbag",
        //btnClass:"btn btn-success",
      }
    ];
    //添加页面元素按钮
    this.tableButtonConfig1 = [
      {
        text: "添加元素",
        title: "添加",
        type: "add",
      }
    ];
    //添加功能按钮
    this.tableButtonConfig2 = [
      {
        text: "添加功能",
        title: "添加",
        type: "add",
      }
    ];
    //添加文件控制按钮
    this.tableButtonConfig3 = [
      {
        text: "添加文件",
        title: "添加",
        type: "add",
      }
    ];
    //页面元素列表中的添加按钮
    this.buttonConfig = [
      {
        title: "添加页面",
        type: "add",
        size: 'xs',
      }
    ];
    //页面元素列表中的修改按钮
    this.tableButtonConfig4 = [
      {
        title: "修改页面",
        type: "update",
        size: 'xs',
      }
    ];
    //功能操作列表中的修改按钮
    this.tableButtonConfig5 = [
      {
        title: "修改功能操作",
        type: "update",
        size: 'xs',
      }
    ];
    //文件控制列表中的修改按钮
    this.tableButtonConfig6 = [
      {
        title: "修改文件",
        type: "update",
        size: 'xs',
      }
    ];
  }


  ngOnInit() {
    this.pageMenus(); //页面元素信息加载
    this.operationDatas()//功能操作信息加载
  }

  /**
   * 查询子集菜单列表
   */
  queryChildMenuList(hasSon?, childCode?, pageName?, isTit?:boolean) {
    let me = this, num = 0;
    if(hasSon == "N"){
      me.show = false;
    }else {
      me.show = true;
      if (isNullOrUndefined(childCode)) {
        this.childpageCode = null, this.childpageTitList = []; //清空子集查询
      } else {
        me.childpageCode = childCode;
        let item = {name: pageName, code: childCode};
        if (!isTit) me.childpageTitList.push(item); //非点击面包屑路径时，添加面包屑
        else { //点击面包屑路径时，提出点击地址后的面包屑路径
          for (var i = 0; i < me.childpageTitList.length; i++) {  //获取点击面包屑的路径地址下标
            if (item.code == me.childpageTitList[i].code) num = i;
          }
          me.childpageTitList.splice(num + 1); //剔除下标后的路径
        }
      }
      let myData = {
        curPage: 1,
        pageSize: 4,
        sysCode: this.sysCode,
        menuCode: this.menuCode,
        preCode: this.childpageCode
      };
      me.menuData = new Page(me.limttabService.getPageMenus(myData));
    }

  }

  /**
   * 返回上一级菜单列表
   */
  goBackMenu() {
    let num = this.childpageTitList.length;
    if (num - 2 < 0) this.queryChildMenuList();
    else this.queryChildMenuList(this.childpageTitList[num - 2].code, this.childpageTitList[num - 2].name, true);
  }

  /**
   * 查询页面元素分页列表
   * **/
  public pageMenus(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    let myData = {
      curPage: activePage,
      pageSize: '3',
      sysCode: this.sysCode,
      menuCode: this.menuCode
    };
    let pageMenus = me.limttabService.getPageMenus(myData);
    me.menuData = new Page(pageMenus);
  }


  /**
   * 钩子，输入属性变化的时候调用页面元素
   * **/
  ngOnChanges(changes:SimpleChanges):void {
    //当sysCode变化的时候再次调动
    if (changes["sysCode"] && this.sysCode) {
      this.pageMenus();
      this.operationDatas();
      this.controlDatas();
      this.childpageCode = null, this.childpageTitList = []; //当系统发生变化时清空子集查询
    } else if (changes["menuCode"] && this.menuCode) {
      this.queryPageByMenuCode(); //通过菜单编码查询页面元素
      this.queryOptByMenuCode();  //通过菜单编码查询功能操作
      this.controlDatas();        //通过菜单编码查询文件控制
      this.childpageCode = null, this.childpageTitList = []; //当权限菜单发生变化时清空子集查询

    }
  }


  /**
   * 根据菜单编码查询页面元素列表
   * @param event
   */
  public queryPageByMenuCode(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    this.ajax.get({
      url: "/limitPage/listpage",
      data: {
        curPage: activePage,
        pageSize: '3',
        menuCode: this.menuCode,
      },
      success: (data) => {

        if (!isNull(data)) {
          me.menuData = new Page(data);
        }
      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }

  /**
   * 根据系统编码功能操作分页列表
   * **/
  public operationDatas(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    this.ajax.get({
      url: "/limitOpt/listpage",
      data: {
        curPage: activePage,
        pageSize: '3',
        sysCode: this.sysCode
      },
      success: (data) => {
        if (!isNull(data)) {
          me.operationData = new Page(data);
        }
      },
      error: (data) => {
        console.log('权限操作分页列表错误');
      }
    });
  }

  /**
   * 根据菜单编码查询功能操作分页列表
   * @param event
   */
  public queryOptByMenuCode(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;
    console.log("█ +++++++++++++ ►►►", "+++++++++");
    this.ajax.get({
      url: "/limitOpt/listpage",
      data: {
        curPage: activePage,
        pageSize: '3',
        sysCode: this.sysCode,
        menuCode: this.menuCode
      },
      success: (data) => {
        console.log(data)
        console.log(this.sysCode)
        console.log(this.menuCode)
        if (!isNull(data)) {
          me.operationData = new Page(data);
        }
        console.log("█ 11111111111 ►►►","11111111111" );

      },
      error: (data) => {
        console.log('data', data);
      }
    });
  }


  /**
   * 文件控制分页列表
   * **/
  public controlDatas(event?:PageEvent) {
    let me = this, activePage = 1;
    if (typeof event !== "undefined") activePage = event.activePage;

    this.ajax.get({
      url: "/limitFile/listpage",
      data: {
        curPage: activePage,
        pageSize: '3',
        sysCode: this.sysCode,
        menuCode: this.menuCode
      },
      success: (data) => {
        if (!isNull(data)) {
          me.controlData = new Page(data);

        }
      },
      error: (data) => {
        console.log("文件控制错误");
      }
    });
  }


  /**
   * 修改页面元素状态
   */
  upPagedateState(data) {
    if (data.isUse == "Y") {
      data.isUse = "N"
    } else if (data.isUse == "N") {
      data.isUse = "Y"
    }
    this.ajax.post({
      url: '/limitPage/updateState',
      data: {
        'pageCode': data.pageCode,
        'state': data.isUse
      },
      success: () => {
        if (data.isUse == "Y") {
          swal('启动成功', '', 'success');
        } else if (data.isUse == "N") {
          swal('停用成功', '', 'success');
        }
      },
      error: (data) => {
        swal('修改页面元素状态失败', 'error');
      }
    });
  }


  /**
   * 修改功能操作状态
   */
  upOptdateState(data) {
    if (data.isUse == "Y") {
      data.isUse = "N"
    } else if (data.isUse == "N") {
      data.isUse = "Y"
    }
    this.ajax.post({
      url: '/limitOpt/updateState',
      data: {
        'optCode': data.optCode,
        'state': data.isUse
      },
      success: () => {
        if (data.isUse == "Y") {
          swal('启动成功', '', 'success');
        } else if (data.isUse == "N") {
          swal('停用成功', '', 'success');
        }
      },
      error: (data) => {
        swal('修改功能操作状态失败', 'error');
      }
    });
  }


  /**
   * 修改文件控制状态
   */
  upFiledateState(data) {
    if (data.isUse == "Y") {
      data.isUse = "N"
    } else if (data.isUse == "N") {
      data.isUse = "Y"
    }
    this.ajax.post({
      url: '/limitFile/updateState',
      data: {
        'fileCode': data.fileCode,
        'state': data.isUse
      },
      success: () => {
        if (data.isUse == "Y") {
          swal('启动成功', '', 'success');
        } else if (data.isUse == "N") {
          swal('停用成功', '', 'success');
        }
      },
      error: (data) => {
        swal('修改文件控制状态失败', 'error');
      }
    });
  }
}
