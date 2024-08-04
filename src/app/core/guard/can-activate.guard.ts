import { CanActivateChildFn } from '@angular/router';

export const canActivateGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
