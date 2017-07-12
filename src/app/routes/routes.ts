import { LayoutComponent } from '../layout/layout.component';
import {LoginComponent} from "./pages/login/login.component";
import {PagesComponent} from "./pages/pages/pages.component";
import {TestComponent} from "./buttons/test/test.component";


export const routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'datatables', loadChildren: './datatables/datatables.module#DatatablesModule' },
            { path: 'msg', loadChildren: './msg/msg.module#MsgModule' },
            { path: 'echarts', loadChildren: './echarts/echarts.module#EchartsModule' },
            { path: 'operationpage', loadChildren: './operationpage/operationpage.module#OperationpageModule' },
            { path: 'navtree', loadChildren: './navtree/navtree.module#NavtreeModule' },
            { path: 'buttons', component:TestComponent }
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
