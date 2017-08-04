import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import {OrganComponent} from "./organ/organ.component";
import { AddorganComponent } from './addorgan/addorgan.component';
import {SharedModule} from "../../shared/shared.module";


// 子路由，用于页面嵌套显示
const appChildRoutes: Routes = [
  {path: 'addOrgan', component: AddorganComponent},
  {path: 'updateOrgan/:orgCode', component: AddorganComponent},
  {path: 'orgDetail/:orgCode', component: AddorganComponent},
  {path: 'updateBoss/:orgCode', component: AddorganComponent},
  {path: 'updateType/:orgCode', component: AddorganComponent}
];
// 父路由，用于页面嵌套显示
const routes:Routes = [
  {path: '', component: OrganComponent, children: appChildRoutes}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [OrganComponent, AddorganComponent]
})
export class OrganModule { }
