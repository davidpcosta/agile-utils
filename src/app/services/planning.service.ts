import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  sessionId: string;
  userUid: string;

  sessionRef: any;
  usersRef: any;
  userRef: any;

  constructor(
    private firestore: AngularFirestore,
    private window: Window
  ) { }

  private initFirebaseRefs() {
    this.validateSessionId();
    this.sessionRef = this.firestore.collection('sessions').doc(this.sessionId);
    this.usersRef = this.sessionRef.collection('users');
  }

  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
    this.validateSessionId();
    this.initFirebaseRefs();
  }

  setUserUid(userUid: string) {
    this.userUid = userUid;
    this.validateUserUid();
    this.userRef = this.usersRef.doc(userUid);
  }

  vote(card: number) {
    this.validateUserUid();
    return this.userRef.update({ vote: card });
  }

  clearMyVote() {
    this.validateUserUid();
    return this.userRef.update({ vote: 0 });
  }

  observeSession() {
    this.validateSessionId();
    return this.sessionRef.valueChanges();
  }

  observeUsers() {
    this.validateSessionId();
    return this.usersRef.valueChanges();
  }

  observeMyUser() {
    this.validateUserUid();
    return this.userRef.valueChanges();
  }

  getInviteUrl() {
    this.validateSessionId();
    const baseUrl = this.window.location.origin;
    return `${baseUrl}/signin/${this.sessionId}`;
  }

  private validateSessionId() {
    if (!this.sessionId) throw new Error('sessionId not defined');
  }

  private validateUserUid() {
    if (!this.userUid) throw new Error('userUid not defined');
  }

}
