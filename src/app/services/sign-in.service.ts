import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  private defaultDeck: string[] = ['1', '2', '3', '5', '8', '13', '21', '?'];

  sessionsRef: any;
  sessionRef: any;
  usersRef: any;

  constructor(private firestore: AngularFirestore) {
    this.sessionsRef = this.firestore.collection('sessions');
  }

  retrieveExistingSession(sessionId: string) {
    return this.sessionsRef.doc(sessionId).valueChanges();
  }

  createNewSession(ownerUserUid: string, ownerUserName: string, projectName: string) {
    return this.sessionsRef.add({
      projectName: projectName,
      ownerUserUid: ownerUserUid,
      deck: this.defaultDeck
    });
  }

  addUserToExistingSession(sessionId: string, userUid: string, userName: string) {
    this.sessionRef = this.sessionsRef.doc(sessionId);
    this.usersRef = this.sessionRef.collection('users');
    return this.usersRef.doc(userUid).set({ name: userName });
  }
  
}
