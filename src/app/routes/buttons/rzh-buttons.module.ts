import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonsComponent} from "./buttons/buttons.component";
import {ButtonDemoComponent} from "./buttonDemo/button-demo.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ButtonsComponent,
    ButtonDemoComponent
  ],
  exports:[
    ButtonsComponent,
    ButtonDemoComponent
  ]
})
export class RzhButtonsModule {
}
