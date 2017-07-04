import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatatablesComponent} from './datatables/datatables.component';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {path: '', component: DatatablesComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  declarations: [DatatablesComponent]
})

export class DatatablesModule {
}
