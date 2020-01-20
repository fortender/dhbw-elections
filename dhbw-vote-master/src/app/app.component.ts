import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { AlertService } from './services/alert.service';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DHBW StuV Elections - Login';
  user: any;
  alert: any;

  isScreenSmall$: Observable<boolean>;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private alertService: AlertService) {
    this.authenticationService.currentUser.subscribe(user => this.user = user);
    this.alertService.getAlerts().subscribe(alert => this.alert = alert);
  }

  ngOnInit() {
    const checkScreenSize = () => document.body.offsetWidth < 560;
    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(debounceTime(500)).pipe(map(checkScreenSize));
    this.isScreenSmall$ = screenSizeChanged$.pipe(startWith(checkScreenSize()));
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
