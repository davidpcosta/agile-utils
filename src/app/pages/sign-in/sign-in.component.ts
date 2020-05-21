import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  routeSub: Subscription;
  sessionId: string;
  session: any;

  defaultDeck: number[] = [0.5, 1, 2, 3, 5, 8, 13, 21];
  projectName: string = '';
  userName: string = '';

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.sessionId = params.sessionId;
      console.log('sessionId', this.sessionId);

      if (this.sessionId) {
        let fetchTask: Observable<any> = this.firestore.collection('sessions').doc(this.sessionId).valueChanges();
        fetchTask.subscribe(data => {
          this.projectName = data.projectName;
          this.session = data;
        });
      }
    });


  }

  login() {
    console.log('login', this.userName, this.projectName);


    
    if (this.userName.length > 0 && this.projectName.length > 0) {

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
    else {
      alert('Please fill your name and project name! :)');
    }
  }

  logout() {
    this.auth.signOut();
  }

  createSession(userUid: string) {
    if (this.sessionId) {
      this.addToExistingSession(userUid);
    }
    else {
      this.createNewSession(userUid);
    }
  }

  addToExistingSession(userUid: string) {
    const session = this.firestore.collection('sessions').doc(this.sessionId);
    
    const user = {
      uid: userUid,
      name: this.userName
    }
    this.session.users.push(user);
    console.log(this.session);

    this.firestore.collection('sessions').doc(this.sessionId).set(this.session)
    .then(data => {
      console.log(data);
      this.router.navigate([`/planning/${this.sessionId}`]);
    })
    .catch(error => {
      alert('Sorry! No idea what happened! Check console log.');
      console.error(error);
    });
    
  }

  createNewSession(userUid: string) {
    const sessionsCollection = this.firestore.collection('sessions');
    const session = {
      projectName: this.projectName,
      users: [{
        uid: userUid,
        name: this.userName
      }],
      deck: this.defaultDeck
    };
    sessionsCollection.add(session)
    .then(data => {
      const sessionId = data.id;
      this.router.navigate([`/planning/${sessionId}`]);
    })
    .catch(error => {
      alert('Sorry! No idea what happened! Check console log.');
      console.error(error);
    });
  }
}
