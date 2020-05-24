import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  routeSub: Subscription;
  sessionId: string;

  projectName: string = '';
  userName: string = '';

  constructor(
    private signInService: SignInService,
    private auth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const { sessionId } = params;
      this.sessionId = sessionId;

      // Retrieve existing session is exists
      if (sessionId) {
        this.retrieveExistingSession(sessionId);
      }
    });
  }

  login() {
    // Validate fields
    if (this.userName.length == 0 || this.projectName.length == 0) {
      alert('Please fill your name and project name! :)');
      return;
    }
    this.auth.signInAnonymously()
      .then(data => {
        const uid = data.user.uid;
        if (uid) {
          this.createSession(uid);
        }
      })
      .catch(error => {
        alert('Sorry! Error with anonymous login.');
        console.error(error);
      });
  }

  private retrieveExistingSession(sessionId: string) {
    this.signInService.retrieveExistingSession(sessionId).subscribe(session => {
      if (!session) {
        alert('Error retrieving existing session! :(');
      }
      this.projectName = session.projectName;
    });
  }

  private createSession(userUid: string) {
    if (this.sessionId) {
      this.addToExistingSession(userUid);
    }
    else {
      this.createNewSession(userUid);
    }
  }

  private async createNewSession(userUid: string) {
    const { sessionId } = await this.signInService.createNewSession(userUid, this.userName, this.projectName);
    if (!sessionId) {
      alert('Error creating new session! :(');
      return
    }
    this.redirectToPlanningBoard(sessionId);
  }

  private async addToExistingSession(userUid: string) {
    const success = await this.signInService.addUserToExistingSession(userUid, this.userName);
    if (!success) {
      alert('Error adding user to existing session!');
      return;
    }
    this.redirectToPlanningBoard(this.sessionId);
  }

  private redirectToPlanningBoard(sessionId: string) {
    this.router.navigate([`/planning/${sessionId}`]);
  }
}
