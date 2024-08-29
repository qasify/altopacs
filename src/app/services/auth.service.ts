import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

interface Credentials {
  login: string;
  pass: string;
}

interface UserResponse {
  token: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  private users = [
    {
      userId: '123',
      login: 'test@mail.com',
      pass: 'qwer'
    }
  ];

  constructor() {}

  login(credentials: Credentials): Observable<UserResponse | null> {
    const user = this.users.find(u => u.login === credentials.login && u.pass === credentials.pass);
    if (user) {
      this.loggedIn.next(true);
      return of({
        userId: user.userId,
        token: 'mytoken'
      });
    }
    return of(null);
  }

  setAuthenticatedUser(user: { userId: string; token: string }) {
    // Store authentication details (e.g., in localStorage or a state management solution)
  }


  // Observable to get the login status
  isLoggedIn$ = this.loggedIn.asObservable();


  logout() {
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}
