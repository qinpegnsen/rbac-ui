import { NgModule } from '@angular/core';
import { OrganizationComponent } from './organization/organization.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from "../../shared/shared.module";
import {HomePComponent} from './home-p/home-p.component';
import {NavigationComponent} from './navigation/navigation.component';
import {TableComponent} from './table/table.component';
import { RightpageComponent } from './rightpage/rightpage.component';


const appChildRoutes: Routes = [
  {path: 'rightpage', component: RightpageComponent},
]
const routes:Routes = [
  {
    path: '', component: OrganizationComponent,children:appChildRoutes
  }
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OrganizationComponent,
    TableComponent,
    NavigationComponent,
    HomePComponent,
    RightpageComponent
  ]
})
export class OrganizationModule { }
