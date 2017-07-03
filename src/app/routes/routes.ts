import { LayoutComponent } from '../layout/layout.component';
import {LoginComponent} from "./pages/login/login.component";
import {PagesComponent} from "./pages/pages/pages.component";

export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'datatables', loadChildren: './datatables/datatables.module#DatatablesModule' },
            { path: 'msg', loadChildren: './msg/msg.module#MsgModule' }
        ]
    },
    {
        path: 'pages',
        component: PagesComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent }
        ]
    },



    // Not found
    { path: '**', redirectTo: 'home' }

];
