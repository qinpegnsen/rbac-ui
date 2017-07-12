import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonsComponent} from "./buttons/buttons.component";
import {TestComponent} from "./test/test.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ButtonsComponent,
    TestComponent
  ],
  exports:[
    ButtonsComponent,
    TestComponent
  ]
})
export class RzhButtonsModule {
}
