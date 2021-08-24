import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { CanActivateReturn } from './_guard';


@Injectable({
  providedIn: 'root'
})
export class SignedInGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.canActivate(route, state);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): CanActivateReturn {
    return this.apiService.checkUserSession().pipe(
      map((you) => {
        if (!you) {
          this.router.navigate(['/signin']);
        }
        return !!you;
      })
    );
  }
}
