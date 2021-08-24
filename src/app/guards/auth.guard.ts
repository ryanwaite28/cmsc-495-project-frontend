import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { map } from 'rxjs/operators';
import { CanActivateReturn } from './_guard';
import { UserStoreService } from '../stores/user-store.service';
import { ApiService } from '../services/api.service';
import { getRouteParamKey } from '../utils/chamber.utils';


@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private userStore: UserStoreService,
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    const canActivate = this.canActivate(route, state);
    return canActivate;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.apiService.checkUserSession().pipe(
      map((you) => {
        const canActivate = this.handleCanActivate(you, route);
        if (!canActivate) {
          this.router.navigate(['/signin']);
        }
        return canActivate;
      })
    );
  }

  handleCanActivate(you, route: ActivatedRouteSnapshot) {
    const checkAuth = this.checkAuth(you, route);
    if (checkAuth) {
      return true;
    } else {
      const errorMessage =
        route.data.canActivateErrorMessage ||
        'You do not have permission to access this page.';
      return false;
    }
  }

  checkAuth(you, route: ActivatedRouteSnapshot): boolean {
    if (!you) { return false; }
    const id = getRouteParamKey(route.data.authParamsProp, route, true);
    const userId = parseInt(id, 10);
    const youAreUser = userId === you.id;
    return youAreUser;
  }
}
