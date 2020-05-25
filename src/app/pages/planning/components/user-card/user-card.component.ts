import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() user:any;
  @Input() showCard: boolean = false;
  @Input() isOwner: boolean = false;
  @Output() kickEmitter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  kick() {
    this.kickEmitter.emit(this.user);
  }

}
