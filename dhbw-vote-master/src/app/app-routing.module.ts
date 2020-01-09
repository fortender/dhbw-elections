import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { VoteComponent } from './vote/vote.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'vote', component: VoteComponent },
  {
    path: '',
    redirectTo: 'vote',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
