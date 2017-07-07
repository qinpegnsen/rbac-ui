import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonsComponent} from "./buttons/buttons.component";
import {TestComponent} from "./test/test.component";
import {RouterModule, Routes} from "@angular/router";
const routes: Routes = [
  {path: '', component: TestComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: [
    ButtonsComponent,
    TestComponent
  ]
})
export class ButtonsModule {
}
