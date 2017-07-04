import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EchartsComponent } from './echarts/echarts.component';
import {RouterModule, Routes} from '@angular/router';
import {Ng2Echarts} from 'ng2-echarts'; //加载图表模块

const routes: Routes = [
  {path: '', component: EchartsComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  declarations: [EchartsComponent,Ng2Echarts] //引入图表模块
})
export class EchartsModule { }
