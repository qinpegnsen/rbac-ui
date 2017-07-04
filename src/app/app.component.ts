import { Component, HostBinding, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { SettingsService } from './core/settings/settings.service';
import {CookieService} from "_angular2-cookie@1.2.6@angular2-cookie";

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @HostBinding('class.layout-fixed') get isFixed() { return this.settings.layout.isFixed; };
    @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.layout.isCollapsed; };
    @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.layout.isBoxed; };
    @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.layout.useFullLayout; };
    @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.layout.hiddenFooter; };
    @HostBinding('class.layout-h') get horizontal() { return this.settings.layout.horizontal; };
    @HostBinding('class.aside-float') get isFloat() { return this.settings.layout.isFloat; };
    @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.layout.offsidebarOpen; };
    @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.layout.asideToggled; };
    @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.layout.isCollapsedText; };

    constructor(public settings: SettingsService, private cookieService:CookieService, private location:Location) { }

    ngOnInit() {
        $(document).on('click', '[href="#"]', e => e.preventDefault());
        //登录状态检测
        this.checkLogin();
    }

    private checkLogin(){
      let url = this.location.path();
      if(url !== "/pages/login"){
        let loginCookie = this.cookieService.get("aaa")
        if(!loginCookie){
          this.location.go("/pages/login")
        }
      }
    }
}
