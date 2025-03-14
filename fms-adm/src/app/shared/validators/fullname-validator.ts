import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { required: true };
    }

    const fullName = control.value.trim().split(' ');
    
    // Validação: Deve ter pelo menos duas palavras com mais de 1 caractere cada.
    if (fullName.length < 2 || fullName.some((name: string | any[]) => name.length < 2)) {
      return { invalidFullName: 'Informe nome e sobrenome válidos.' };
    }

    return null; // Nome válido.
  };
}