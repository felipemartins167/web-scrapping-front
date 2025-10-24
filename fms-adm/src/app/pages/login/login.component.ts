import { Component, OnInit } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Ripple, RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { LoginModel } from '../../models/login-model';
import { LoginService } from '../../services/login.service';
import { LoadingService } from '../../services/loading.service';
import { Router } from '@angular/router';
import { RegisterComponent } from "../../components/register/register.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Checkbox, ButtonModule, RippleModule, InputTextModule, ReactiveFormsModule, Toast, Ripple, RegisterComponent],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  displayModalRegister: boolean = false;

  isAdmin: boolean = false;

  constructor(private messageService: MessageService, private loginService: LoginService, private loadingService: LoadingService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordValidator]),
    });
  }

  ngOnInit(): void {
    const actualRoute = this.router.url; // obtém diretamente a URL atual
    console.log(actualRoute);

    if (actualRoute.includes('/admin')) {
      this.isAdmin = true;
    }
  }

  doLogin() {
    if (this.loginForm.valid) {
      const loginModel = new LoginModel();
      loginModel.email = this.loginForm.get('email')!.value;
      loginModel.password = this.loginForm.get('password')!.value;
      this.loadingService.show();
      const environmentPage = this.isAdmin ? 1 : 3;
      localStorage.setItem('environment', environmentPage.toString());
      this.loginService.login(loginModel, environmentPage)
        .subscribe({
          next: (response) => {
            this.loadingService.hide();
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response });
            this.router.navigate(['/sidebar']);
          },
          error: ((err) => {
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.data.errorMessage });
          })
        });
    } else {
      this.loginForm.markAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, insira um login e uma senha válidos para continuar.' });
    }
  }

  showRegister() {
    console.log('Passou para mostrar os registros: ', this.displayModalRegister);
    this.displayModalRegister = true;
  }

}
