import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  routeSub: Subscription;
  showVotes: boolean = false;
  sessionId: string;
  session: any;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.sessionId = params.sessionId;
      console.log('sessionId', this.sessionId);
      
    });

    let fetchTask: Observable<any> = this.firestore.collection('sessions').doc(this.sessionId).valueChanges();
    fetchTask.subscribe(data => {
      this.session = data;
      this.showVotes = this.hasAllVotes();
    });
  }

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  hasAllVotes(): boolean {

    let allVotes = true;
    if (this.session && this.session.users) {
      this.session.users.forEach(user => {
        console.log(user);
        
        if (!user.vote) {
          allVotes = false;
          return false;
        }
      });
    }
    console.log('showVote', allVotes);
    return allVotes;
  }

}
