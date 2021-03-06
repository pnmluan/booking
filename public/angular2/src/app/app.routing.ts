import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home';
import { AboutComponent } from './components/about';
import { IntrodutionComponent } from './components/introdution';
import { PolicyComponent } from './components/policy';
import { TutorialComponent } from './components/tutorial';
import { SearchResultComponent } from './components/search-result';
import { ListTicketComponent, DetailTicketComponent, CartTicketComponent, PaymentTicketComponent } from './components/ticket';
import { PageNotFoundComponent } from './components/page-not-found';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'search-result/:session_token', component: SearchResultComponent },
	{ path: 'list-tickets',
		children: [
			{ path: ':clean_url', component: ListTicketComponent },
			{ path: '', component: ListTicketComponent }
		]
	},
	{ path: 'detail-ticket/:clean_url', component: DetailTicketComponent },
	{ path: 'cart-ticket', component: CartTicketComponent },
	{ path: 'payment-ticket', component: PaymentTicketComponent },
	{ path: 'about', component: AboutComponent },
	{ path: 'introdution', component: IntrodutionComponent },
	{ path: 'tutorial', component: TutorialComponent },
	{ path: 'policy', component: PolicyComponent },
	{ path: '**', component: PageNotFoundComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES);