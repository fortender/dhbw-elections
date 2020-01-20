import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptors } from './http-interceptors';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VoteComponent } from './vote/vote.component';
import { ElectionResultsComponent } from './election-results/election-results.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VoteComponent,
    ElectionResultsComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    MaterialModule,
    ChartsModule
  ],
  providers: [
    httpInterceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
