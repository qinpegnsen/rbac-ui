import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AjaxService} from "../../../../core/services/ajax.service";
import {isNullOrUndefined} from 'util';
declare var $: any;
@Component({
  selector: 'app-select-page',
  templateUrl: './select-page.component.html',
  styleUrls: ['./select-page.component.scss']
})
export class SelectPageComponent implements OnInit {
  /**
   * 输入属性menuCode  sysCode; 用来查询当前系统菜单下面的素所有的页面元素
   */
  @Input()
  menuCode:string;
  @Input()
  sysCode;

  /**
   * 把当前的选择的菜单编码发射出去
   * @type {EventEmitter}
   */
  @Output()
  curpageCode = new EventEmitter();

  public pageNameText:string=''//用来存储输入框里面的东西

  public pageLists:string;//用来存储当前系统当前菜单下面的所有的页面元素

  private show: boolean = false;//选择菜单得的下弹框默认是隐藏的，只有在聚焦的时候才会出现

  public selsectpageCode:string=''//用来存储输入框里面的东西

  public selsectPageCode:string=''//用来存储输入框里面的东西

  constructor(private ajax:AjaxService) { }

  ngOnInit() {
    /**
     * 点击区域选框外页面时，关闭选框
     * @type {SelectAreaComponent}
     * @private
     */
    let _this = this;
    $('body').click(function (e) {
      let event = e.target.attributes['class'];
      if (isNullOrUndefined(event) || isNullOrUndefined(event.nodeValue) || event.nodeValue.indexOf("rzh-sel-city") <= 0) _this.show = false; //关闭选框
    });
  }

  /**
   * 前台页面的聚焦事件，当聚焦的时候就会执行这个方法，然后调用下面页面列表getselectpage的方法
   */
  showSelectpage(){
    this.show=true;
    this.pageNameText=''
    this.pageLists=this.getSelectPage(this.sysCode,this.menuCode);
  }
  /**
   * 获取页面列表
   * @returns {any}
   */
  getSelectPage(sysCode,menuCode,pageCode?){
    let getpageCode=pageCode?pageCode:null;
    this.ajax.get({
      url: '/limitPage/list',
      async:false,
      data: {
        'sysCode': sysCode,
        'menuCode':menuCode,
        'preCode':getpageCode
      },
      success: (data) => {
        console.log(data)
        this.pageLists = data;
        if(data.length==0){
          this.show=false;
        }
      },
      error: (data) => {
        console.log("error");
      }
    });
    return this.pageLists;
  }

  /**
   * 页面元素点击的时候执行的方法
   */
  getpageName(pageCode,pageName,menuCode){
    if(this.pageNameText==''){
      this.pageNameText+='';
      this.pageNameText+=pageName;
    }else{
      this.pageNameText+='>';
      this.pageNameText+=pageName;
    }

    this.selsectpageCode=pageCode;

    this.pageLists=this.getSelectPage(this.sysCode,menuCode,pageCode);

  }

  /**
   * 点击刷新的时候清空文本区域，下拉的选项重新回到上一级
   */
  freshCitys(){
    this.pageNameText=''
    this.pageLists =this.getSelectPage(this.sysCode,this.menuCode);
  }

  /**
   * 点击确定的时候执行的方法，并且发射当前的页面编码
   */
  cityConfirm(){
    this.show=false;
    if (this.pageNameText == '') {
      this.selsectPageCode = ''
    }
    this.curpageCode.emit(this.selsectPageCode)
  }
}
