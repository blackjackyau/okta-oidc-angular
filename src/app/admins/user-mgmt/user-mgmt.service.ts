import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../user/user';
import { environment } from '../../../environments/environment';
import { map, flatMap, toArray, switchMap } from 'rxjs/operators';
import { AppState } from '../../state/app.state';
import { Store, select } from '@ngrx/store';
import { selectSSWS } from '../../user/state';

@Injectable({
  providedIn: 'root'
})
export class UserMgmtService {

  baseUrl: string;
  ssws$: Observable<string>;

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.baseUrl = `https://cors-anywhere.herokuapp.com/${environment.oktaUrl}`;
    this.ssws$ = this.store.pipe(select(selectSSWS));
  }

  getUsers(): Observable<User[]> {
    return this.ssws$.pipe(
      switchMap(ssws => {
        return this.http.get<any[]>(`${this.baseUrl}/api/v1/users`,
          { headers: {Authorization: `SSWS ${ssws}`} }).pipe(
          flatMap(users => users),
          map(user => {
            return {
                    id: user.id,
                    userName: user.profile.login,
                    firstName: user.profile.firstName,
                    lastName: user.profile.lastName
                  };
          }),
          toArray()
        );
      })
    );

  }
}
