import {Component, HostBinding, OnInit} from '@angular/core';

@Component({
  selector: 'app-operationpage',
  templateUrl: './operationpage.component.html',
  styleUrls: ['./operationpage.component.scss']
})
export class OperationpageComponent implements OnInit {
  // @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.layout.offsidebarOpen; };

  constructor() { }

  ngOnInit() {
  }

  operationInfo(){

  }

}
