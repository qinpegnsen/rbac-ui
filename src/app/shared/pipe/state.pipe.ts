import { Pipe, PipeTransform } from '@angular/core';
import {RzhtoolsService} from "../../core/services/rzhtools.service";

@Pipe({
  name: 'rzhState'
})
export class StatePipe implements PipeTransform {

  constructor(private tools: RzhtoolsService) {  }

  transform(value: string, args?: any): any {
    let me = this, val;
    val = me.tools.getEnumDataValByKey(args,value);
    return val;
  }
}
