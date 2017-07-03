import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsgComponent} from './msg/msg.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
const routes: Routes = [
  {path: '', component: MsgComponent},
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    CommonModule
  ],
  declarations: [MsgComponent],
  exports: [
    RouterModule
  ]
})
export class MsgModule {
}
