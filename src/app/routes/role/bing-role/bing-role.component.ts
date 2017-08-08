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
    //存放的数据
     public items:Array<object>;
     //临时的数组用来存放编码，之后截取
     public string;


  @ViewChild('defaultRoles')
  public mySelectRoles: SelectComponent;//设置默认选中的角色

  constructor(private ajax: AjaxService) {
    this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.myModel = '';
    this.modelWithValue = '5554441234';
    this.formControlInput.setValue('5555551234');
  }
  ngOnInit() {
    this.getBingRoleList()
    //查询当前系统下的角色列表
    this.ajax.get({
      url: "/role/list",
      data: {
        sysCode: this.sysCode
      },
      success: (data) => {
        let obj={},temp=[];//这里必须得声明临时变量来转换一下，要不然不能push
        for(var i=0;i<data.length;i++){
          obj={
            id:data[i]['roleCode'],
            text:data[i]['roleName']
          }
          temp.push(obj);
        }
        this.items = temp;

      },
      error: (data) => {
         console.log('根据系统编码变化的角色列表错误');
      }
    });
  }

  // Color Picker
  colorDemo1 = '#555555';
  colorDemo2 = '#555555';
  colorDemo3 = '#555555';
  colorDemo4 = '#555555';

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
  public _disabledV: string = '0';
  public disabled: boolean = false;

  public get disabledV(): string {
    return this._disabledV;
  }

  public set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(obj,value): void {


  }

  /**
   * 获取到当前角色组已经绑定的角色
   */
  getBingRoleList(){
    this.ajax.post({
      url: "/roleGroup/roleList",
      data: {
        sysCode: this.sysCode,
        roleGroupCode: this.roleGroupCode
      },
      success: (data) => {
        console.log(data)

        let tempY=[],tempN=[],obj={}//这里必须得声明临时变量来转换一下，要不然不能push
        for(var i=0;i<data.data.length;i++){
          console.log(data.data[i].isHas)
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

        console.log('tempY',tempY)
        console.log('tempN',tempN)

        // this.items = temp;
      },
      error: (data) => {
        console.log('根据系统编码变化的角色列表错误');
      }
    });
  }



  public removed(obj,value: any): void {

}

  public typed(value: any): void {
    console.log('New search input: ', value);
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
