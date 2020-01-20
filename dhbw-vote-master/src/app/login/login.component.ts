import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    mail: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^s\d{6}@student.dhbw-mannheim.de$/i)
    ]),
    password: new FormControl('', [Validators.required])
  });

  redirectUrl: string;

  submitted: boolean;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private alert: AlertService) { }

  ngOnInit() {
    if (this.authenticationService.isAuthenticated) {
      this.router.navigate(['vote']);
    }
    const route = this.activatedRoute.snapshot;
    this.redirectUrl = route.paramMap.get('redirectUrl') || '/vote';
  }

  onSubmit(): void {
    this.submitted = true;

    // Check if form is valid
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const mail = loginData.mail;
      const pass = loginData.password;

      this.authenticationService.login(mail, pass).subscribe(result => {
        // Authentication successful, redirect to target url
        this.router.navigate([this.redirectUrl]);
      }, error => {
        this.alert.error(error.error.errorDescription, false);
        this.submitted = false;
      });
    }
  }

}
