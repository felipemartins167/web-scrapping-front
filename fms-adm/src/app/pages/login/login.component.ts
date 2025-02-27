import { Component } from '@angular/core';
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
import { ResponseModel } from '../../models/response-model';
import { TokenRefreshRequest } from '../../models/token-refresh-request';
import { LocalStorageVariables } from '../../shared/variables/local-storage-variables';
import { catchError, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Checkbox, ButtonModule, RippleModule, InputTextModule, ReactiveFormsModule, Toast, Ripple],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private messageService: MessageService, private loginService: LoginService, private loadingService: LoadingService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordValidator]),
    });
  }

  doLogin() {
    if (this.loginForm.valid) {
      const loginModel = new LoginModel();
      loginModel.email = this.loginForm.get('email')!.value;
      loginModel.password = this.loginForm.get('password')!.value;
      this.loadingService.show();
      this.loginService.login(loginModel)
        .subscribe({
          next: (response) => {
            this.loadingService.hide();

            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response });
            this.router.navigate(['/sidebar']);

          },
          error: ((err) => {
            this.loadingService.hide();
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.message });
          })
        });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, insira um login e uma senha válidos para continuar.' });
    }
  }

}
