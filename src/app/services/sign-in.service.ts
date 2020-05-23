import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  private defaultDeck: number[] = [0.5, 1, 2, 3, 5, 8, 13, 21];

  sessionsRef: any;

  constructor(private firestore: AngularFirestore) {
    this.sessionsRef = firestore.collection('sessions');
  }


  async createNewSession(ownerUserUid: string, ownerUserName: string, projectName: string) {

    const newSession = {
      projectName: projectName,
      ownerUserUid: ownerUserUid,
      deck: this.defaultDeck
    };

    const newUser = {
      name: ownerUserName
    };

    let sessionId: string;
    await this.sessionsRef.add(newSession)
    .then(data => {
      if (!data) return;
      sessionId = data.id;
    })
      .catch(error => {
        console.error('Creating session:', error);
      });

    await this.sessionsRef.doc(sessionId).collection('users').doc(ownerUserUid).set(newUser)
      .catch(error => {
        console.error('Adding user:', error);
      });

    return { sessionId: sessionId };
  }
}
