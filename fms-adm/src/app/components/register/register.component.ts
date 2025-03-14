import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { fullNameValidator } from '../../shared/validators/fullname-validator';
import { LoginService } from '../../services/login.service';
import { LoadingService } from '../../services/loading.service';
import { RegisterModel } from '../../models/register-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [DialogModule, StepsModule, CommonModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Input() displayModal = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  userForm: FormGroup;
  addressForm: FormGroup;
  loginForm: FormGroup;

  activeStepIndex = 0;

  aLinkStyle = 'aLinkStyle';

  steps = [
    { label: 'Informações' },
    { label: 'Confirmação' },
    { label: 'Finalização' }
  ];

  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.userForm = new FormGroup({

    });
    this.addressForm = new FormGroup({

    });
    this.loginForm = new FormGroup({
      fullname: new FormControl('', [Validators.required, fullNameValidator()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordValidator]),
    });
  }

  nextStep() {
    if (this.activeStepIndex < this.steps.length - 1) {
      switch (this.activeStepIndex) {
        case 0:
          if (!this.loginForm.valid) {
            this.loginForm.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Preencha os dados obrigatórios para continuar!' });
            break;
          }
          this.loadingService.show();
          this.loginService.verifyEmailExists(this.loginForm.get('email')?.value)
            .subscribe({
              next: () => {
                this.loadingService.hide();
                this.activeStepIndex++;
              },
              error: (err) => {
                console.log(err);
                this.loadingService.hide();
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: err });
              },
            });
          break;
        case 1:
          this.activeStepIndex++;
          break;
        case 2:
          this.activeStepIndex++;
          break;
        default:
          break;
      }
    }
  }

  prevStep() {
    if (this.activeStepIndex > 0) {
      this.activeStepIndex--;
    }
  }

  close() {
    this.displayModal = false;
    this.activeStepIndex = 0;
    this.displayModalChange.emit(this.displayModal);
  }

  finish() {
    // Finalização da ação aqui
    this.loadingService.show();
    const registerModel = new RegisterModel(this.loginForm.get('fullname')?.value, this.loginForm.get('email')?.value, this.loginForm.get('password')?.value, 1);
    this.loginService.register(registerModel)
      .subscribe({
        next: (response) => {
          this.loadingService.hide();

          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: response });
          this.router.navigate(['/sidebar']);
        },
        error: (err) => {
          this.loadingService.hide();
          console.log(err);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: err });
        }
      });
    this.close();
  }
}
