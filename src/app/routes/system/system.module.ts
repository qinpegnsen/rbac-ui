import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { SysPlatformComponent } from './sys-platform/sys-platform.component';
import {SharedModule} from "../../shared/shared.module";
import { AddSysComponent } from './add-sys/add-sys.component';
import { AdminsComponent } from './admins/admins.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import {SelectAreaComponent} from "../select-area/select-area/select-area.component";
import {SelectOrganComponent} from "../select-organ/select-organ/select-organ.component";


const appChildRoutes: Routes = [
  {path: 'addSystem', component: AddSysComponent},
  {path: 'sysDetail/:sysCode', component: AddSysComponent},
  {path: 'updateSystem/:sysCode', component: AddSysComponent},
];
const adminsChildRoutes: Routes = [
  {path: 'addAdmin', component: AddAdminComponent},
  {path: 'adminDetail/:mgrCode', component: AddAdminComponent},
  {path: 'updateAdmin/:mgrCode', component: AddAdminComponent},
  {path: 'updateState/:mgrCode', component: AddAdminComponent}
];
const routes: Routes = [
  {path: 'sys-platform', component: SysPlatformComponent, children: appChildRoutes},
  {path: 'admins', component: AdminsComponent, children: adminsChildRoutes}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [SysPlatformComponent, AddSysComponent, AdminsComponent, AddAdminComponent, SelectAreaComponent,SelectOrganComponent]
})
export class SystemModule { }
