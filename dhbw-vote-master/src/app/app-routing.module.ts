import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { VoteComponent } from './vote/vote.component';
import { AuthGuard } from './guards/auth.guard';
import { ElectionResultsComponent } from './election-results/election-results.component';

const routes: Routes = [
  // { path: 'login/:redirectUrl', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'vote',
    component: VoteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'elections/:election_id/results',
    component: ElectionResultsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
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
