import {Component, Input, OnInit} from '@angular/core';
import {AppStore} from "../store/app-store";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  // path: any;
  _path: Array<any>;
  @Input() set path(value) {
    console.log(value);
    this._path = value;
  }
  get path() {
    return this._path;
  }
  @Input() list_data: Array<any>;
  constructor(private store: Store<AppStore>) {
    // this.store.select('path').subscribe((res) => this.path = res);
  }

  ngOnInit() {
    this.store.select('path').subscribe((res) => this.path = res as Array<any>);
    // this.path = this.store.select('path');
  }

}
