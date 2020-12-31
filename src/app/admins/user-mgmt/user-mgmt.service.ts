import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user';
import { map, flatMap, toArray, switchMap } from 'rxjs/operators';
import * as fromRoot from '../../reducers';
import { Store, select } from '@ngrx/store';
import { selectSSWS } from '../../auth/reducers/auth.reducer';
import { AuthProfilesService } from 'src/app/auth-profiles/auth-profiles.service';

@Injectable({
  providedIn: 'root'
})
export class UserMgmtService {

  baseUrl: string;
  ssws$: Observable<String>;

  constructor(private http: HttpClient, private store: Store<fromRoot.State>,
     private profileService: AuthProfilesService) {
    const activeProfile = this.profileService.getActiveProfile();
    this.baseUrl = `https://cors-anywhere.herokuapp.com/${activeProfile.oktaUrl}`;
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
