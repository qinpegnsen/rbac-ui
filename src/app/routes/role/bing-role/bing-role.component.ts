import {Component,ViewChild , EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {FormControl} from "@angular/forms";
import {SelectComponent} from "ng2-select";
@Component({
  selector: 'app-bing-role',
  templateUrl: './bing-role.component.html',
  styleUrls: ['./bing-role.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BingRoleComponent implements OnInit {
    //根据系统编码查询出当前系统下的角色
    @Input()
     public sysCode;

    @Output()
     public roleCodes=new EventEmitter();

    @Input()
    public roleGroupCode;

    //存放的数据，临时的数组用来存放编码，之后截取
     public items:Array<object>;

  @ViewChild('defaultRoles')
  public mySelectRoles: SelectComponent;//设置默认选中的角色数据数组集合
  private mySelectRolesStr:string; //默认绑定好的角色数组的编码集

  constructor(private ajax: AjaxService) {
    this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.myModel = '';
    this.modelWithValue = '5554441234';
    this.formControlInput.setValue('5555551234');
  }
  ngOnInit() {

    /**
     * 查询所有的角色列表
     * tempY 已经绑定的角色
     * tempN 未绑定的角色而
     */
    this.getBingRoleList()
  }

  // ng2Select
  /**
   * 对事件进行监听，然后发射
   * **/
  public refreshValue(value: any): void {
    this.value = this.itemsToString(value);
    this.roleCodes.emit(this.value)
  }
  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.id;
      }).join(',');
  }
  public value: any = {};


  /**
 * 获取到当前角色组已经绑定的角色
 * tempY 已经为为当前的角色组绑定的角色数组集合
 * tempN  还没有为当前的角色组绑定的角色数组集合
 * obj 数组里面的对象
 */
getBingRoleList(){
  let me = this;
  this.ajax.post({
    url: "/roleGroup/roleList",
    data: {
      sysCode: this.sysCode,
      roleGroupCode: this.roleGroupCode
    },
    success: (data) => {
      let tempY=[],tempN=[],obj={}
      for(var i=0;i<data.data.length;i++){
        obj={
          id:data.data[i].roleCode,
          text:data.data[i].roleName
        }
        if(data.data[i].isHas=="Y"){
          tempY.push(obj)
        }else{
          tempN.push(obj)
        }
      }
      this.items = tempN;
      me.mySelectRoles.active = tempY;
      me.mySelectRolesStr = me.itemsToString(tempY);
      this.roleCodes.emit(me.mySelectRolesStr)
    },
    error: (data) => {
      console.log('查询已经绑定的角色错误');
    }
  });
}


  // TextMask
  public myModel: string;
  public modelWithValue: string;
  public formControlInput: FormControl = new FormControl();
  public mask: Array<string | RegExp>;

  // Tags Input
  public validators = [this.startsWithAt, this.endsWith$];
  public transform(item: string): string {
    return `@${item}`;
  }
  public startsWithAt(control: FormControl) {
    if (control.value.charAt(0) !== '@') {
      return {
        'startsWithAt@': true
      };
    }
    return null;
  }
  public endsWith$(control: FormControl) {
    if (control.value.charAt(control.value.length - 1) !== '$') {
      return {
        'endsWith$': true
      };
    }
    return null;
  }
  public errorMessages = {
    'startsWithAt@': 'Your items need to start with "@"',
    'endsWith$': 'Your items need to end with "$"'
  };



}
