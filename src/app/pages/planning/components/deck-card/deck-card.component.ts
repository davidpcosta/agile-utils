import { Component, OnInit, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessorBase } from './value-acessor-base';

@Component({
  selector: 'deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: DeckCardComponent, multi: true }
  ],
})
export class DeckCardComponent extends ValueAccessorBase<number> {

  @Input() card: number;
  @Input() userUid: string;
  @Input() sessionId: string;

  constructor() {
    super();
  }

  get selectedCard(): number {
    return super.value;
  }

  set selectedCard(value: number) {
    super.value = value;
  }

  pickCard() {
    console.log('card picked', this.card);
    this.selectedCard = this.card;
  }

}
