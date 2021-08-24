import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { ResolveType } from "../guards/_guard";
import { PlainObject } from "../interfaces/plain-object.interface";
import { ApiService } from "../services/api.service";
import { UserStoreService } from "../stores/user-store.service";

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<PlainObject> {
  constructor(
    private apiService: ApiService,
    private userStore: UserStoreService,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): ResolveType<PlainObject> {
    return this.apiService.get_user_by_id(route.params.user_id).pipe(
      map((response) => {
        return response.user;
      }),
      catchError((error) => {
        return null;
      })
    );

    // return this.apiService.checkUserSession().pipe(
    //   map((response) => {
    //     return response.user;
    //   })
    // );
  }
}
