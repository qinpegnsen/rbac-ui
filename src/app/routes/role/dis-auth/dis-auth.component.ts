import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {FormControl} from "@angular/forms";
import {SelectComponent} from "ng2-select";
@Component({
  selector: 'app-dis-auth',
  templateUrl: './dis-auth.component.html',
  styleUrls: ['./dis-auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DisAuthComponent implements OnInit {
  @Input()
  public sysCode;
  @Input()
  public roleCode;
  @Output()
  public bingLimit=new EventEmitter();
  //存放的数据
  public items:Array<object>;
  //存储权限的编码

  @ViewChild('defaultLimits')
  public mySelectLimits: SelectComponent;//设置默认选中的角色数据数组集合
  private mySelectLimitsStr:string; //默认绑定好的角色数组的编码集

  constructor(private ajax: AjaxService) {
    this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.myModel = '';
    this.modelWithValue = '5554441234';
    this.formControlInput.setValue('5555551234');
  }
  ngOnInit() {
    /**
     * 查询所有的权限列表
     * tempY 已经绑定的权限
     * tempN 未绑定的权限
     */
    this.getRoleLimit()
  }
  /**
   * 获取到当前角色已经绑定的权限
   * tempY 已经为为当前的角色绑定的权限数组集合
   * tempN  还没有为当前的角色绑定的权限数组集合
   * obj 数组里面的对象
   */
  getRoleLimit(){
    let me = this;
    this.ajax.post({
      url: "/role/limitList",
      data: {
        sysCode: this.sysCode,
        roleCode: this.roleCode
      },
      success: (data) => {
        let tempY=[],temp=[],obj={}
        for(var i=0;i<data.length;i++){
          obj={
            id:data[i].limitCode,
            text:data[i].alias
          }
          temp.push(obj)
          if(data[i].isHas=="Y"){
            tempY.push(obj)
          }
        }
        this.items = temp;
        me.mySelectLimits.active = tempY;
        me.mySelectLimitsStr = me.itemsToString(tempY);
        this.bingLimit.emit(me.mySelectLimitsStr)
      },
      error: (data) => {
        console.log(this.sysCode)
        console.log(this.roleCode)
        console.log('查询角色绑定的权限错误');
      }
    });
  }
  // Color Picker
  colorDemo1 = '#555555';
  colorDemo2 = '#555555';
  colorDemo3 = '#555555';
  colorDemo4 = '#555555';

  // ng2Select

  public value: any = {};
  public _disabledV: string = '0';
  public disabled: boolean = false;

  public refreshValue(value: any): void {
    this.value = this.itemsToString(value);
    this.bingLimit.emit(this.value)
  }
  public itemsToString(value:Array<any> = []):string {
    return value
      .map((item:any) => {
        return item.id;
      }).join(',');
  }
  public get disabledV(): string {
    return this._disabledV;
  }

  public set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
    console.log(value)

  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
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
