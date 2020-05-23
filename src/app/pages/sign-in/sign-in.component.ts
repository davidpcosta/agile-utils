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
  session: any;

  projectName: string = '';
  userName: string = '';

  constructor(
    private signInService: SignInService,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {

      // Retrieve existing session is exists
      this.sessionId = params.sessionId;
      if (this.sessionId) {
        let fetchTask: Observable<any> = this.firestore.collection('sessions').doc(this.sessionId).valueChanges();
        fetchTask.subscribe(data => {
          if (data) {
            this.projectName = data.projectName;
            this.session = data;
          }
        });
      }
    });


  }

  login() {
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
        alert('Sorry! No idea what happened! Check console log.');
        console.error(error);
      });
  }

  logout() {
    this.auth.signOut();
  }

  createSession(userUid: string) {
    if (this.session) {
      this.addToExistingSession(userUid);
    }
    else {
      this.createNewSession(userUid);
    }
  }

  addToExistingSession(userUid: string) {
    const newUser = {
      name: this.userName
    };

    let usersRef = this.firestore.collection('sessions').doc(this.sessionId).collection('users');
    console.log(userUid);

    usersRef.doc(userUid).set(newUser)
      .then(data => {
        console.log(data);

        this.router.navigate([`/planning/${this.sessionId}`]);
      })
      .catch(error => {
        alert('Sorry! No idea what happened! Check console log.');
        console.error(error);
      });

  }

  async createNewSession(userUid: string) {

    let session = await this.signInService.createNewSession(userUid, this.userName, this.projectName);
    if (session.sessionId) {
      console.log('YEP');
      this.router.navigate([`/planning/${session.sessionId}`]);
    }
    
      
  }
}
