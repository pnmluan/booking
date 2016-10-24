import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { PageNotFoundComponent } from './page-not-found';


export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // {
  //   path: 'detail', loadChildren: () => System.import('./+detail').then((comp: any) => {
  //     return comp.default;
  //   })
  //   ,
  // },
  { path: '**', component: PageNotFoundComponent },
];
