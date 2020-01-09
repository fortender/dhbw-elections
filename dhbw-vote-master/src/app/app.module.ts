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

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    FormsModule,
    MaterialModule
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [
    httpInterceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
