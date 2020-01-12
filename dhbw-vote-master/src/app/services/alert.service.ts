import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alerts = new Subject<any>();
  private keep = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keep) {
          // keep alerts for a single navigation only
          this.keep = false;
        } else {
          // clear
          this.alerts.next();
        }
      }
    });
  }

  private dispatch(type: string, message: string, keep: boolean) {
    this.keep = keep;
    this.alerts.next({ type, message });
  }

  success(message: string, keep: boolean) {
    this.dispatch('success', message, keep);
  }

  error(message: string, keep: boolean) {
    this.dispatch('error', message, keep);
  }

  getAlerts(): Observable<any> {
    return this.alerts.asObservable();
  }

}
