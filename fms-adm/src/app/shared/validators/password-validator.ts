import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return { required: true }; // Campo obrigatório
  }

  // Validação: 5 a 20 caracteres
  if (value.length < 5 || value.length > 20) {
    return { length: true };
  }

  // Verifica se tem ao menos uma letra maiúscula
  if (!/[A-Z]/.test(value)) {
    return { uppercase: true };
  }

  // Verifica se tem ao menos uma letra minúscula
  if (!/[a-z]/.test(value)) {
    return { lowercase: true };
  }

  // Verifica se tem ao menos um número
  if (!/[0-9]/.test(value)) {
    return { number: true };
  }

  // Verifica se tem ao menos um caractere especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return { specialChar: true };
  }

  // Tudo certo
  return null;
}