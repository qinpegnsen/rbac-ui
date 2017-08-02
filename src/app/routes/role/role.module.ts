import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RoleComponent} from "./role/role.component";
import {RightpageComponent} from './rightpage/rightpage.component';
import {SharedModule} from "../../shared/shared.module";
import { RolemanComponent } from './roleman/roleman.component';


// 子路由，用于页面嵌套显示
const appChildRoutes: Routes = [
  {path: 'rightpage', component: RightpageComponent}

];

// 父路由，用于页面嵌套显示
const routes: Routes = [
  {path: 'roleGroup', component: RoleComponent, children: appChildRoutes},
  {path: 'role', component: RolemanComponent, children: appChildRoutes},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule
  ],
  declarations: [RoleComponent,RightpageComponent, RolemanComponent],
  providers: [],
})
export class RoleModule { }
