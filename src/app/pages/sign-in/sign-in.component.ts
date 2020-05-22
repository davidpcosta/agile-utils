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

  createNewSession(userUid: string) {

    const newSession = {
      projectName: this.projectName,
      userOwner: userUid,
      deck: this.defaultDeck
    };

    const newUser = {
      name: this.userName
    };

    const sessionsCollection = this.firestore.collection('sessions');
    sessionsCollection.add(newSession).then(data => {
      const newSessionId = data.id;
      data.collection('users').doc(userUid).set(newUser).then(data => {
        this.router.navigate([`/planning/${newSessionId}`]);
      })
        .catch(error => {
          alert('Sorry! No idea what happened! Check console log.');
          console.error(error);
        });
    })
      .catch(error => {
        alert('Sorry! No idea what happened! Check console log.');
        console.error(error);
      });
  }
}
