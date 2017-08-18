import {Component, Input, OnInit} from '@angular/core';
import {isArray} from "rxjs/util/isArray";
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
  treeLists:any;
  @Input() result;
  @Input() pre_arr;
  constructor(private store: Store<AppStore>,private org:OrgService) {

  }
  /*@Input() set treeLists(value: any) {
   if (isArray(this._treeLists) && !this._treeLists.length) {
   this.active_tree_cell = value.title;
   }
   this._treeLists = value;
   }
   get treeLists() {
   return this._treeLists;1
   }*/

  itemClick(name, deptCode) {
    this.store.dispatch({type: 'ACTIVE', payload: name});
    this.store.select('active').subscribe((res) => this.active_tree_cell = res as string);
    console.log(name);
    this.forPath(name, deptCode);
    this.getStaff(deptCode)
    //console.log(name)
  }
  ngOnInit() {
  }
  toggle(name) {
    /*this.active_tree_cell = name;
    this.forPath(name, this.obj.root);*/
    /*this.store.select('path').subscribe((res) => {
     console.log(res);});*/
  }

  getStaff(deptCode) {
    this.org.getOrgList('/staff/list?deptCode=' + deptCode).subscribe((res) => {
      this.store.dispatch({type: 'STAFF_ADD', payload: res});
    })
  }

  forPath(target:string, deptCode) {
    this.store.dispatch({type: 'PATH_ADD', payload: [target]});
    this.store.dispatch({type: 'LIST_ADD', payload: this.pre_arr[deptCode]})
    /*for (let a in obj) {
      if (a == "name") {
        this.path[obj.index] = obj[a];
        if (obj[a] === target) {
          this.path.length = obj.index + 1;
          const arr = [];
          for (let i = 0; i < this.path.length; i++) {
            arr.push(this.path[i]);
          }
          this.store.dispatch({type: 'PATH_ADD', payload: arr});
        }
      } else if (typeof (obj[a]) == "object") {
        this.forPath(target, obj[a]);
      }
    }*/
  }
}
