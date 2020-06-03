import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'sign-in-page',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  routeSub: Subscription;

  isLoading: boolean = false;
  isExistingSession: boolean = false;
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
      if (sessionId) { // Retrieve existing session is exists
        this.retrieveExistingSession(sessionId);
      }
    });
  }

  handleLoginClick() {
    // Validate fields
    if (this.userName.length == 0 || this.projectName.length == 0) {
      alert('Please fill your name and project name! :)');
      return;
    }

    this.startLoading();
    this.auth.signInAnonymously()
      .then(data => {
        const uid = data.user.uid;
        if (uid) {
          this.createSession(uid);
        }
      })
      .catch(error => {
        alert('Sorry! Error with anonymous login.');
        this.stopLoading();
      });
  }

  private retrieveExistingSession(sessionId: string) {
    this.startLoading()
    this.signInService.retrieveExistingSession(sessionId).subscribe(session => {
      if (!session) {
        alert('Error retrieving existing session! :(');
      } else {
        this.sessionId = sessionId;
        this.projectName = session.projectName;
        this.isExistingSession = true;
      }
      this.stopLoading()
    });
  }

  private createSession(userUid: string) {
    if (this.sessionId) {
      this.addToExistingSession(this.sessionId, userUid, this.userName);
    }
    else {
      this.createNewSession(userUid);
    }
  }

  private async createNewSession(userUid: string) {
    this.signInService.createNewSession(userUid, this.userName, this.projectName)
    .then(data => {
      if (data) {
        this.sessionId = data.id;
        this.addToExistingSession(this.sessionId, userUid, this.userName);
      }
    })
    .catch(() => {
      alert('Error adding user to existing session!');
    });
  }

  private async addToExistingSession(sessionId: string,  userUid: string, userName: string) {
    this.signInService.addUserToExistingSession(sessionId, userUid, userName)
    .then(() => {
      this.redirectToPlanningBoard(this.sessionId);
    })
    .catch(() => {
      alert('Error adding user to existing session!');
    })
    .finally(() => {
      this.stopLoading()
    });
    
    
  }

  private redirectToPlanningBoard(sessionId: string) {
    this.router.navigate([`/planning/${sessionId}`]);
  }

  private startLoading() {
    this.isLoading = true;
  }
  
  private stopLoading() {
    this.isLoading = false;
  }
  
}
