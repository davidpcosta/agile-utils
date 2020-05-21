import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnInit {

  @Input() card: number;

  constructor() { }

  ngOnInit(): void {
  }

}
