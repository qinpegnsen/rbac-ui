import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatatablesComponent} from './datatables/datatables.component';
import {Routes, RouterModule} from '@angular/router';
import {Ng2DatatableComponent} from './ng2-datatable/ng2-datatable.component';
import {DataTableModule} from "angular2-datatable";

const routes: Routes = [
  {path: 'datatable', component: DatatablesComponent},
  {path: 'ng2-datatable', component: Ng2DatatableComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DataTableModule,
    CommonModule
  ],
  declarations: [DatatablesComponent, Ng2DatatableComponent]
})

export class DatatablesModule {
}
