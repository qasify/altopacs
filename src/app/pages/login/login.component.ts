import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputFieldComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errors: { email?: string; password?: string } = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  async handleSubmit() {
    if (this.loginForm.invalid) {
      this.errors = {
        email: this.email?.hasError('required') ? 'Email is required' : this.email?.hasError('email') ? 'Invalid email format' : undefined,
        password: this.password?.hasError('required') ? 'Password is required' : undefined
      };
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    try {
      const response = await this.authService.login({ login: email, pass: password }).toPromise();
      if (response) {
        this.authService.setAuthenticatedUser({
          userId: response.userId,
          token: response.token,
        });
        this.router.navigate(['/home']);
      } else {
        this.errors = {
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        };
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.isLoading = false;
    }
  }
}
