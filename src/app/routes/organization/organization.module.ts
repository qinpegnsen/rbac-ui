import { NgModule } from '@angular/core';
import { OrganizationComponent } from './organization/organization.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from "../../shared/shared.module";


const routes:Routes = [
  {
    path: '', component: OrganizationComponent
  }
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrganizationComponent]
})
export class OrganizationModule { }
