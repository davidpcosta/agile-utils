import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  private defaultDeck: number[] = [0.5, 1, 2, 3, 5, 8, 13, 21];

  sessionsRef: any;
  sessionRef: any;
  usersRef: any;

  constructor(private firestore: AngularFirestore) {
    this.sessionsRef = this.firestore.collection('sessions');
  }

  retrieveExistingSession(sessionId: string) {
    const observable = this.sessionsRef.doc(sessionId).valueChanges();
    observable.subscribe(session => {
      if (session) {
        this.sessionRef = this.sessionsRef.doc(sessionId);
        this.usersRef = this.sessionRef.collection('users');
      }
    });
    return observable;
  }

  async createNewSession(ownerUserUid: string, ownerUserName: string, projectName: string) {
    let sessionId: string;
    const newSession = {
      projectName: projectName,
      ownerUserUid: ownerUserUid,
      deck: this.defaultDeck
    };

    // Create new session    
    await this.sessionsRef.add(newSession)
      .then(data => {
        if (!data) return;
        sessionId = data.id;
      })
      .catch(error => {
        console.error('Creating session:', error);
      });

    // Add user to created session
    await this.sessionsRef.doc(sessionId).collection('users').doc(ownerUserUid).set({ name: ownerUserName })
      .catch(error => {
        console.error('Adding user:', error);
      });

    return { sessionId: sessionId };
  }

  async addUserToExistingSession(userUid: string, userName: string) {
    if (!this.sessionRef) throw new Error('Existing session not found!');

    await this.usersRef.doc(userUid).set({ name: userName })
      .catch(error => {
        console.error(error);
        return false;
      });

    return true;
  }
  
}
