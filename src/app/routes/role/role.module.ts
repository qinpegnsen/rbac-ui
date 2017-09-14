import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RoleComponent} from "./role/role.component";
import {RightpageComponent} from './rightpage/rightpage.component';
import {SharedModule} from "../../shared/shared.module";
import { RolemanComponent } from './roleman/roleman.component';
import { BingRoleComponent } from './bing-role/bing-role.component';
import { SelectModule } from 'ng2-select';
import { DisAuthComponent } from './dis-auth/dis-auth.component';
import { RoleListComponent } from './role-list/role-list.component';
import {RoleService} from "./role/role.service";

// 子路由，用于页面嵌套显示
const appChildRoutes: Routes = [
  {path: 'rightpage', component: RightpageComponent}
];

// 父路由，用于页面嵌套显示
const routes: Routes = [
  {path: '', redirectTo: 'roleGroup', pathMatch: 'full'},
  {path: 'roleGroup', component: RoleComponent,data:[{type:'roleGroup'}] ,children: appChildRoutes},
  {path: 'roleList', component: RoleListComponent,data:[{type:'roleList'}], children: appChildRoutes},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    SelectModule
  ],
  declarations: [RoleComponent,RightpageComponent, RolemanComponent, BingRoleComponent, DisAuthComponent, RoleListComponent],
  providers: [RoleComponent,RolemanComponent,RoleListComponent,RoleService],
})
export class RoleModule { }
