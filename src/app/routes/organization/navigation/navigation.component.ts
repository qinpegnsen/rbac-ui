import {Component, Input, OnInit} from '@angular/core';
import {AppStore} from "../store/app-store";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  private _path: Array<any>;
  @Input() set path(value) {
    this._path = value;
  }
  get path() {
    return this._path;
  }
  public list: any;
  constructor(private store: Store<AppStore>) {}
  ngOnInit() {
    this.store.select('path').subscribe((res) => this.path = res as Array<any>);
    this.store.select('list').subscribe((res) => this.list = res);
  }

}
