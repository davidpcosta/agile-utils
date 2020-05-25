import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { PlanningService } from 'src/app/services/planning.service';

@Component({
  selector: 'page-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  routeSub: Subscription;

  userUid: string;
  session: any;
  deck: number[];
  users: any[];
  currentUser: any;
  inviteUrl: string;

  selectedCard: number;
  hasAllVotes: boolean = false;
  isShowCards: boolean = false;
  isOwner: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
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
        this.userUid = user.uid;
        this.planningService.setUserUid(user.uid);
        this.startMyUserObserver();

        // TODO: Refactor
        this.isOwner = this.session && this.session.ownerUserUid == this.userUid;
      });
    });
  }

  vote() {
    if (!this.selectedCard) {
      alert('Pick a card!');
      return;
    }
    this.planningService.vote(this.selectedCard);
  }

  clearVote() {
    this.planningService.clearMyVote().then(() => {
      this.selectedCard = 0;
    });
  }

  exit() {
    this.planningService.exit(this.userUid).then(() => {
      this.redirectToSignInPage();
    });
  }

  handleKickEvent(user: any) {
    console.log(user);
    this.planningService.exit(user.id);
  }

  async showCards() {
    this.isShowCards = await this.planningService.showCards();
  }

  async newRound() {
    await this.planningService.newRound(this.users);
  }

  private startSessionObserver() {
    this.planningService.observeSession().subscribe(session => {
      this.session = session;
      this.isShowCards = session.showCards;

      // TODO: Refactor
      this.isOwner = this.session && this.session.ownerUserUid == this.userUid;
    });
  }

  private startUsersObserver() {
    this.planningService.observeUsers().subscribe(users => {
      this.users = [];
      users.forEach(snapshot => {
        const id = snapshot.payload.doc.id;
        const data = snapshot.payload.doc.data();
        const user = { id, ...data};
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

  private redirectToSignInPage() {
    this.router.navigate(['/signin']);
  }
}
