import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() user:any;
  @Input() showVotes: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
