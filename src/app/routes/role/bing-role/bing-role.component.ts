import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
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
     public items;

    // public items: Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    // 'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    // 'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    // 'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    // 'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    // 'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    // 'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    // 'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    // 'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    // 'Zagreb', 'Zaragoza', 'Łódź'];
  public  newArrRoleName=[];
  public  newArrRoleCode=[];
  constructor(private ajax: AjaxService) {
    this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.myModel = '';
    this.modelWithValue = '5554441234';
    this.formControlInput.setValue('5555551234');
  }

  ngOnInit() {
    this.ajax.get({
      url: "/role/listpage",
      data: {
        sysCode: this.sysCode
      },
      success: (data) => {


        for(var i=0;i<data.voList.length;i++){
          this.newArrRoleName.push(data.voList[i]['roleName'])
          this.newArrRoleCode.push(data.voList[i]['roleCode'])
        }

        this.items=this.newArrRoleName;

        console.log(this.newArrRoleCode)
        console.log(this.newArrRoleName)


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

  public selected(value: any): void {
    let roleText= value.text;
    for(var j=0;j<roleText.length;j++){
      console.log(roleText[j])
    }
    // for(var i=0;i<this.newArrRoleName.length;i++){
    //
    // }
    // console.log('Selected value is: ', value.text);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    console.log('New search input: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
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
