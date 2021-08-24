import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { map } from "rxjs/operators";
import { ResolveType } from "../guards/_guard";
import { PlainObject } from "../interfaces/plain-object.interface";
import { ApiService } from "../services/api.service";

@Injectable({
  providedIn: 'root'
})
export class InitialCheckSessionResolver implements Resolve<PlainObject> {
  constructor(
    private apiService: ApiService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<PlainObject> {
    return this.apiService.checkUserSession().pipe(
      map((response) => {
        return response.user;
      })
    );
  }
}