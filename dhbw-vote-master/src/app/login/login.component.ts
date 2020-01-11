import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  @Input()
  error: string | null;

  redirectUrl: string;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this.authenticationService.isAuthenticated) {
      this.router.navigate(['vote']);
    }
    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      this.redirectUrl = paramMap.get('redirectUrl');
      this.error = paramMap.get('error');
    });
  }

  onSubmit(): void {
    // Check if form is valid
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const mail = loginData.mail;
      const pass = loginData.password;

      this.authenticationService.login(mail, pass).subscribe(result => {
        // Authentication successful, redirect to initial target url if specified
        if (this.redirectUrl) {
          this.router.navigateByUrl(this.redirectUrl);
        } else {
          this.router.navigate(['vote']);
        }
      }, error => {
        this.error = error.error.description || error.toString();
      });
    }
  }

}
