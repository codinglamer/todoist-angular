import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  query,
  where
} from '@angular/fire/firestore';
import { firstValueFrom, map, Observable, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUser } from '../models/IUser';
import { IUserRegistrationDto } from '../models/IUserRegistrationDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth) {
    this.authedUser$.next(JSON.parse(localStorage.getItem(this.authedUserKey)!));
  }

  private firestore = inject(Firestore);
  private usersRef = collection(this.firestore, 'users');
  private readonly authedUserKey = 'authedUser';

  authedUser$ = new ReplaySubject<IUser | null>(1);

  isUsernameAvailable(username: string | null): Observable<boolean> {
    const usersRefQuery = query(this.usersRef,
      where('username', '==', username));
    return (collectionData(usersRefQuery) as Observable<IUser[]>).pipe(
      map(users => users.length === 0)
    );
  }

  isEmailAvailable(email: string): Observable<boolean> {
    const usersRefQuery = query(this.usersRef,
      where('email', '==', email));
    return (collectionData(usersRefQuery) as Observable<IUser[]>).pipe(
      map(users => users.length === 0)
    );
  }

  async register(user: IUserRegistrationDto) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
    await addDoc(this.usersRef, {
      uid: userCredential.user.uid,
      email: user.email,
      username: user.username,
      displayName: user.displayName
    } as IUser);
    await sendEmailVerification(userCredential.user, {url: `${environment.appUrl}/login`});
  }

  async login(isEmail: boolean, emailOrUsername: string, password: string) {
    let email = emailOrUsername;
    if (!isEmail) {
      const usersRefQuery = query(this.usersRef,
        where('username', '==', emailOrUsername));
      email = await firstValueFrom<string>((collectionData(usersRefQuery) as Observable<IUser[]>).pipe(
        map(users => users[0]?.email)
      ));
    }

    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = userCredential.user.uid;

    const usersRefQuery = query(this.usersRef,
      where('uid', '==', uid)
    );
    const authedUser = await firstValueFrom<IUser>(
      (collectionData(usersRefQuery) as Observable<IUser[]>).pipe(
        map(users => users[0])
      )
    );
    this.authedUser$.next(authedUser);
    localStorage.setItem(this.authedUserKey, JSON.stringify(authedUser));
  }

  async logout() {
    this.authedUser$.next(null);
    localStorage.removeItem(this.authedUserKey);
  }
}
