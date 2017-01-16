import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Third party
import { SelectModule } from 'angular2-select';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import { MomentModule } from 'angular2-moment';
import { HTTP_INTERCEPTOR_PROVIDER } from 'ng2-http-interceptor';
import { LoadingAnimateModule, LoadingAnimateService } from 'ng2-loading-animate';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

 
// Create config options (see ILocalStorageServiceConfigOptions) for deets:
let localStorageServiceConfig = {
    prefix: 'my-app',
    storageType: 'localStorage'
};

import { Configuration } from './shared/app.configuration';
import { HttpClient } from './shared/http-client';


/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home';
import { AboutComponent } from './components/about';
import { IntrodutionComponent } from './components/introdution';
import { PageNotFoundComponent } from './components/page-not-found';
import { HeaderComponent } from './components/header';
import { SearchResultComponent } from './components/search-result';
import { BannerComponent } from './components/home/banner';
import { NewsComponent } from './components/home/news';
import { CommentComponent } from './components/home/comment';
import { CustomerComponent } from './components/customer';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    IntrodutionComponent,
    PageNotFoundComponent,
    HeaderComponent,
    SearchResultComponent,
    BannerComponent,
    NewsComponent,
    CommentComponent,
    CustomerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    ReactiveFormsModule,
    SelectModule,
    MomentModule,
    LoadingAnimateModule.forRoot(),
    Ng2Bs3ModalModule

  ],
  providers: [
    Configuration,
    HttpClient,
    ...HTTP_INTERCEPTOR_PROVIDER,
    LoadingAnimateService,
    LocalStorageService,
    {
      provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
