import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Letter } from 'src/app/models/letter.model';
import { GameService } from 'src/app/services/game.service';
import { LettersStoreService } from 'src/app/services/letter-store.service';
import { fallingEnter, fallingLeave } from 'src/app/transitions.module';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
  animations: [
    trigger('falling', [
      transition(':enter', useAnimation(fallingEnter)),
      transition(':leave', useAnimation(fallingLeave))
    ])
  ]
})

export class LetterComponent {

  private fallingState: string;
  private zIndexes: string[];
  private scales: string[];

  @Input() letter: Letter;

  @HostBinding('@falling') get fn() {
    return {
      value: this.fallingState,
      params: this.setFallingParams()
    }
  };

  @HostListener('@falling.done', ['$event']) captureDoneEvent($event) {
    this.hitTest(this.letter, this.fallingState, $event);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    return this.letterFound(event.key.toLowerCase(), event);
  }

  @HostListener('tap', ['$event'])
  handleClickEvent(event) {
    return this.letterFound(this.letter.item, event);
  }

  constructor(
    private game: GameService,
    private store: LettersStoreService
  ) {
    this.fallingState = 'lost';
    this.zIndexes = ['499', '399', '299', '199', '99'];
    this.scales = ['1', '0.9', '0.8', '0.7', '0.6'];
  }

  randomPercentage() {
    const min = 10;
    const max = 90;
    const res = Math.floor(Math.random() * (max - min + 1) + min);
    return res + '%';
  }

  pickRange() {

    const index = Math.floor(Math.random() * this.zIndexes.length);
    return {
      zIndex: this.zIndexes[index],
      scale: this.scales[index],
      yEnd: `calc(100% - ${(index + 1) * 3}em)`
    }
  }

  letterFound(key, event) {
    if (
      this.game.started &&
      this.letter.item === key &&
      this.store.letters.filter(storeLetter => storeLetter.item === this.letter.item && storeLetter.isFound === false)
    ) {
      event.preventDefault();
      this.fallingState = 'found';
      const audio = new Audio(`../../../assets/audio/${this.letter.item}.mp3`);
      audio.volume = 0.6;
      audio.play();
      this.store.setFound(this.letter, true);
    }
  }

  setFallingParams() {
    const { zIndex, scale, yEnd } = this.pickRange();
    const res = {
      fallingSpeed: this.game.randomRangeSecond(),
      xStart: this.randomPercentage(),
      xEnd: this.randomPercentage(),
      yEnd,
      zIndex,
      scale
    };
    return res;
  }

  hitTest(letter, state, event) {
    const { toState } = event;
    if (this.game.started && state == 'lost' && toState == 'lost') {
      this.store.setLost(letter, true);
      const audio = new Audio(`../../../assets/audio/plouf.mp3`);
      audio.addEventListener('loadeddata', () => {
        audio.volume = 0.2;
        audio.play();
      });
    }
  }
}
