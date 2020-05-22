import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'page-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  routeSub: Subscription;

  showVotes: boolean = false;
  userUid: string;
  sessionId: string;
  session: any;
  deck: number[];
  users: any[];
  currentUser: any;
  selectedCard: number;
  hasAllVotes: boolean;

  baseUrl: string;
  inviteUrl: string;

  sessionRef: any;
  usersRef: any;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private window: Window
  ) {
    this.baseUrl = this.window.location.origin;
  }

  ngOnInit(): void {





    this.routeSub = this.route.params.subscribe(params => {
      this.sessionId = params.sessionId;

      // Init firebase references
      this.sessionRef = this.firestore.doc(`sessions/${this.sessionId}`);
      this.usersRef = this.sessionRef.collection('users');


      // Build invite URL
      this.inviteUrl = `${this.baseUrl}/signin/${this.sessionId}`;


      if (this.sessionId) {

        // Observe session info
        this.sessionRef.valueChanges().subscribe(session => {
          this.session = session;
        });

        // Observe users
        this.usersRef.valueChanges().subscribe(users => {
          this.users = [];
          users.forEach(user => {
            this.users.push(user);
          });

          // Check if all users has voted
          this.hasAllVotes = this.verifyAllVotes();
        });
      }
    });

    // Observe current user info
    this.auth.user.subscribe(user => {
      this.userUid = user.uid;
      this.currentUser = this.usersRef.doc(this.userUid).valueChanges().subscribe(user => {
        this.currentUser = user;
        this.selectedCard = this.currentUser.vote;
      });
    });
  }



  vote(): void {
    const userRef = this.usersRef.doc(this.userUid);
    if (this.selectedCard) {
      userRef.update({ vote: this.selectedCard });
    }
    else {
      alert('Pick a card!')
    }
  }

  clearVote(): void {
    const userRef = this.usersRef.doc(this.userUid);
    userRef.update({ vote: 0 });
    this.selectedCard = 0;
  }

  private verifyAllVotes(): boolean {
    let hasAllVotes = true;
    if (this.users.length > 0) {
      this.users.forEach(user => {
        if (!user.vote) {
          hasAllVotes = false;
          return true;
        }
      });
    }
    return hasAllVotes;
  }

}
