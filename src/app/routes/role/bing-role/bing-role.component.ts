import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AjaxService} from "../../../core/services/ajax.service";
import {FormControl} from "@angular/forms";
@Component({
  selector: 'app-bing-role',
  templateUrl: './bing-role.component.html',
  styleUrls: ['./bing-role.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BingRoleComponent implements OnInit {
    @Input()
     public sysCode;
    @Output()
     public roleCodes=new EventEmitter();
    //存放的数据
     public items:Array<object>;
     //临时的数组用来存放编码，之后截取
     public string;

  constructor(private ajax: AjaxService) {
    this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.myModel = '';
    this.modelWithValue = '5554441234';
    this.formControlInput.setValue('5555551234');
  }
  ngOnInit() {
    //查询当前系统下的角色列表
    this.ajax.get({
      url: "/role/listpage",
      data: {
        sysCode: this.sysCode
      },
      success: (data) => {
        let obj={},temp=[];//这里必须得声明临时变量来转换一下，要不然不能push
        for(var i=0;i<data.voList.length;i++){
          obj={
            id:data.voList[i]['roleCode'],
            text:data.voList[i]['roleName']
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
