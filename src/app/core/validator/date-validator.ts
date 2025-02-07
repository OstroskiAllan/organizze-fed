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

export const startDDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(control.value);

  return startDate < today ? { startDateInvalid: true } : null;
};

// Validador para garantir que a data de entrega seja maior que a de início e respeite a data atual se necessário
export const dateRRangeValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const dataInicio = formGroup.get('dataCriacao')?.value;
  const dataEntrega = formGroup.get('dataEntrega')?.value;
  const semDataInicio = formGroup.get('semDataInicio')?.value;
  const semDataEntrega = formGroup.get('semDataEntrega')?.value;

  if (semDataEntrega) return null; // Se não houver data de entrega, não precisa validar

  if (dataEntrega) {
    const entrega = new Date(dataEntrega);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Se houver data de início, verificar se a data de entrega é menor
    if (!semDataInicio && dataInicio) {
      const inicio = new Date(dataInicio);
      if (entrega < inicio) {
        return { dateRangeInvalid: true };
      }
    }

    // Se a opção "Data Atual" estiver marcada, impedir que a entrega seja maior que hoje
    if (semDataInicio && entrega > hoje) {
      return { endDateInvalid: true };
    }
  }

  return null;
};
