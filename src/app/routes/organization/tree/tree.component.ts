import {Component, Input, OnInit,Output,EventEmitter} from '@angular/core';
import {AppStore} from "../store/app-store";
import {Store} from "@ngrx/store";
import {OrgService} from "../server/org.service";
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  tree_status = [true];
  active_tree_cell: string;
  private _result: any;
  @Input() set result(value: any) {
    if (!this._result && value) {
      //console.log(value);
      if(value.length>0) {
        //console.log(value[0].deptCode);
        if (value[0].istop) {
          this.itemClick(value[0].deptName, value[0].deptCode, value[0].id)
        }
      }
    }
    this._result = value;
  };
  get result() {
    //console.log("█ this._result ►►►",  this._result);
    return this._result;
  }

  @Input() pre_arr;

  constructor(private store: Store<AppStore>,private org:OrgService) {

  }
  itemClick(name, deptCode: string, id: any) {
    this.store.dispatch({type: 'ADD_STAFF', payload: [{id: id,deptCode: deptCode}]})
    this.store.dispatch({type: 'ACTIVE', payload: name});
    this.store.select('active').subscribe((res) => this.active_tree_cell = res as string);
    //console.log(name);
    this.store.dispatch({type: 'QUERY', payload: false});
    this.forPath(name, deptCode);
    this.getStaff(deptCode)
  }
  ngOnInit() {
   /* this.store.select('updata').subscribe((res) => {
      if (res) {
       /!* this.store.select('addStaff').subscribe((res) => {
          this.getStaff(res[0].deptCode)
        });*!/
      }
    });*/
  }

  getStaff(deptCode) {
    this.org.getOrgList('/staff/list?deptCode=' + deptCode).subscribe((res) => {
      this.store.dispatch({type: 'STAFF_ADD', payload: res});
    })
  }

  forPath(target:string, deptCode) {
    this.store.dispatch({type: 'PATH_ADD', payload: [target]});
    if (this.pre_arr) {
      this.store.dispatch({type: 'LIST_ADD', payload: this.pre_arr[deptCode]});
    }

  }
}
