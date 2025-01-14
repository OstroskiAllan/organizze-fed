// src/app/core/validator/date-validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador para garantir que a data de fim não seja anterior à data de início
export const dateRangeValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const start = formGroup.get('dataInicio')?.value;
  const end = formGroup.get('dataFim')?.value;
  const today = new Date().toISOString().split('T')[0];

  if (start && end && start > end) {
    return { dateRangeInvalid: true };
  }

  if (end && end < today) {
    return { endDateInvalid: true };
  }

  return null;
};

// Validador para garantir que a data de início não seja anterior à data atual
export const startDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.value;
  const today = new Date().toISOString().split('T')[0];

  if (start && start < today) {
    return { startDateInvalid: true };
  }
  return null;
};
