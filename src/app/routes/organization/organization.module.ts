import { NgModule } from '@angular/core';
import { OrganizationComponent } from './organization/organization.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from "../../shared/shared.module";
import {HomePComponent} from './home-p/home-p.component';
import {NavigationComponent} from './navigation/navigation.component';
import {TableComponent} from './table/table.component';
import { RightpageComponent } from './rightpage/rightpage.component';
import {OrgService} from './server/org.service';
import {TreeModule} from 'ng2-tree';
import { TreeComponent } from './tree/tree.component';
import {BingRoleComponent} from "../role/bing-role/bing-role.component";

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
    TreeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OrganizationComponent,
    TableComponent,
    NavigationComponent,
    HomePComponent,
    RightpageComponent,
    TreeComponent
  ],
  providers: [OrgService]
})
export class OrganizationModule { }
