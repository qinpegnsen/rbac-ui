import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orgTypeName'
})
export class OrganTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 'LEAGUE':
        return "加盟";
      case 'DIRECT':
        return"直营";
      case 'COOPERATE':
        return "合作";
      case 'SUPER':
        return"超管";
      default:
        return"其他"
    }
  }

}
