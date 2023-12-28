import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IUser } from '../models/IUser';
import { IUserRegistrationDto } from '../models/IUserRegistrationDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);
  private usersRef = collection(this.firestore, 'users');

  constructor(private auth: Auth) {}

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
}
