import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

// Third party
import { SelectModule } from 'angular2-select';

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
import { PageNotFoundComponent } from './components/page-not-found';
import { HeaderComponent } from './components/header';
import { SearchResultComponent } from './components/search-result';
import { BannerComponent } from './components/home/banner';
import { NewsComponent } from './components/home/news';
import { CommentComponent } from './components/home/comment/comment.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
    HeaderComponent,
    SearchResultComponent,
    BannerComponent,
    NewsComponent,
    CommentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    ReactiveFormsModule,
    SelectModule

  ],
  providers: [
    Configuration,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
