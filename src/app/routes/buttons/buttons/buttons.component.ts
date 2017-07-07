import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Button} from "selenium-webdriver";

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  private id: any;
  private type: any;
  private text: string; //按钮文字
  private size: any;   //按钮大小
  private labeled: boolean;  //是否开启label

  private class: any;
  @Input() config: any;
  @Output() callback = new EventEmitter<any>();

  //按钮样式
  public static buttonStyles = {
    "default": "btn-default",
    "primary": "btn-primary",
    "success": "btn-success",
    "info": "btn-info",
    "warning": "btn-warning",
    "danger": "btn-danger",
    "inverse": "btn-inverse",
    "green": "btn-green",
    "purple": "btn-purple",
    "purpleLight": "bg-purple-light",
    "pink": "btn-pink",
    "dark": "bg-gray-dark",
  };

  constructor() {

  }

  ngOnInit() {
    this.id = "buttons_" + Math.random().toString();  //生成随机id
    // this.size = this.genSize();   //获取按钮大小
    // this.labeled = this.config.labeled == true; //获取是否开启label
    this.class = "btn " + this.genClass();
    this.text = "测试";
  }

  /**
   * 调用事件
   */
  fireCallback() {
    this.callback.emit(Promise.resolve(this.id));
  }

  private genClass() {
    switch (this.config.type) {
      case "add":
        return ButtonsComponent.buttonStyles.info;
      case "agree":
        return ButtonsComponent.buttonStyles.success;
      case "back":
        return ButtonsComponent.buttonStyles.success;
      case "build":
        return ButtonsComponent.buttonStyles.purple;
      case "delete":
        return ButtonsComponent.buttonStyles.danger;
      case "details":
        return ButtonsComponent.buttonStyles.green;
      case "download":
        return ButtonsComponent.buttonStyles.default;
      case "end":
        return ButtonsComponent.buttonStyles.danger;
      case "reject":
        return ButtonsComponent.buttonStyles.danger;
      case "search":
        return ButtonsComponent.buttonStyles.primary;
      case "start":
        return ButtonsComponent.buttonStyles.success;
      case "stop":
        return ButtonsComponent.buttonStyles.warning;
      case "submit":
        return ButtonsComponent.buttonStyles.success;
      case "update":
        return ButtonsComponent.buttonStyles.primary;
      case "upload":
        return ButtonsComponent.buttonStyles.purpleLight;
      case "stop":
        return ButtonsComponent.buttonStyles.dark;
    }
  }

  private genSize() {
    switch (this.config.size) {
      case "lg":
        return "btn-lg";
      case "sm":
        return "btn-sm";
      case "xs":
        return "btn-xs";
      default :
        return "";
    }
  }


}
