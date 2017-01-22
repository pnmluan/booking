import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home';
import { AboutComponent } from './components/about';
import { IntrodutionComponent } from './components/introdution';
import { SearchResultComponent } from './components/search-result';
import { ListTicketComponent } from './components/ticket';
import { PageNotFoundComponent } from './components/page-not-found';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'search-result/:session_token', component: SearchResultComponent },
	{ path: 'list-tickets', component: ListTicketComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'introdution', component: IntrodutionComponent },
	// {
	//   path: 'detail', loadChildren: () => System.import('./+detail').then((comp: any) => {
	//     return comp.default;
	//   })
	//   ,
	// },
	{ path: '**', component: PageNotFoundComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES);