import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { PlanningService } from 'src/app/services/planning.service';

@Component({
  selector: 'page-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  routeSub: Subscription;

  showVotes: boolean = false;


  session: any;

  deck: number[];
  users: any[];

  currentUser: any;

  selectedCard: number;
  hasAllVotes: boolean;
  inviteUrl: string;


  constructor(
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private planningService: PlanningService
  ) { }

  ngOnInit() {

    this.routeSub = this.route.params.subscribe(params => {
      const sessionId = params.sessionId;
      this.planningService.setSessionId(sessionId);

      this.inviteUrl = this.planningService.getInviteUrl();
      this.startSessionObserver();
      this.startUsersObserver();


      this.auth.user.subscribe(user => {
        this.planningService.setUserUid(user.uid);
        this.startMyUserObserver();
      });
    });
  }

  vote() {
    if (!this.selectedCard) {
      alert('Pick a card!');
    }
    this.planningService.vote(this.selectedCard);
  }

  clearVote() {
    this.planningService.clearMyVote().then(() => {
      this.selectedCard = 0;
    });
  }

  private startSessionObserver() {
    this.planningService.observeSession().subscribe(session => {
      this.session = session;
    });
  }

  private startUsersObserver() {
    this.planningService.observeUsers().subscribe(users => {
      this.users = [];
      users.forEach(user => {
        this.users.push(user);
      });
      this.hasEverbodyVoted();
    });
  }

  private startMyUserObserver() {
    this.planningService.observeMyUser().subscribe(user => {
      this.currentUser = user;
      this.selectedCard = this.currentUser.vote;
    });
  }

  private hasEverbodyVoted() {
    let hasAllVotes = true;
    if (this.users.length > 0) {
      this.users.forEach(user => {
        if (!user.vote) {
          hasAllVotes = false;
          return true;
        }
      });
    }
    this.hasAllVotes = hasAllVotes;
  }

}
