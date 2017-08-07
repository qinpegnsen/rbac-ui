import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LimitComponent} from "./limit/limit.component";
import { FileUploadModule } from 'ng2-file-upload';
import {RouterModule, Routes} from '@angular/router';
import {share} from "rxjs/operator/share";
import {SharedModule} from "../../shared/shared.module";
import { LimittabComponent } from './limittab/limittab.component';
import {MenuAddComponent} from "./menuAdd/menuAdd.component";
import {MenuUpdateComponent} from "./menuUpdate/menuUpdate.component";
import { LimitChildDirective } from './limit/limit-child.directive';

// 父路由，用于页面嵌套显示
const routes:Routes = [
  {
    path: '',
    component: LimitComponent, children: [
    {path: ""},
    {path: 'addMenu', component: MenuAddComponent}, // 子路由，添加菜单，用于页面嵌套显示
    {path: 'upMenu/:menuCode', component: MenuUpdateComponent}, // 子路由，修改菜单，用于页面嵌套显示
    {path: 'menuAdd', component: MenuAddComponent},//子路由，添加菜单ID,用于页面嵌套显示
    {path: 'menuUpdate', component: MenuUpdateComponent},//子路由，修改菜单ID,用于页面嵌套显示
  ]
  }
];

// 子路由，用于页面嵌套显示
//const appChildRoutes: Routes = [
//  {path: 'menuAdd', component: MenuAddComponent}
//];
//
//// 父路由，用于页面嵌套显示
//
//const routes: Routes = [
//  {path: '', component: LimitComponent, children: appChildRoutes},
//];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    FileUploadModule
  ],
  declarations: [LimitComponent, MenuAddComponent, MenuUpdateComponent, LimittabComponent, LimitChildDirective],
  providers: [LimitComponent,LimittabComponent]
})
export class LimitModule {
}
