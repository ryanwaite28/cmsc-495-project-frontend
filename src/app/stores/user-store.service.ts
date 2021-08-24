import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlainObject } from '../interfaces/plain-object.interface';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private you: PlainObject;
  private changes: BehaviorSubject<PlainObject>;

  constructor() {
    this.changes = new BehaviorSubject<PlainObject>(undefined);
  }

  getChangesObs(): Observable<PlainObject> {
    return this.changes.asObservable();
  }

  setState(newState: PlainObject) {
    this.you = newState ? <PlainObject> { ...newState } : null;
    const newEvent = this.you ? { ...this.you } : null;
    this.changes.next(newEvent);
  }

  mergeState(newChanges: Partial<PlainObject>) {
    const newState = this.you ? { ...this.you } : {};
    Object.assign(newState, { ...newChanges });
    this.you = <PlainObject> newState;
    this.changes.next({ ...this.you });
  }
}
