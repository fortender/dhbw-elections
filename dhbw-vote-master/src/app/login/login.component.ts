import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

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

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  onSubmit(): void {
    // Check if form is valid
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const mail = loginData.mail;
      const pass = loginData.password;
      this.authenticationService.login(mail, pass).subscribe(() => {
        this.error = 'E-Mail-Adresse oder Passwort falsch';
      });
    }
  }

}
