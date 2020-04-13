import { style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Letter } from 'src/app/models/letter.model';
import { GameService } from 'src/app/services/game.service';
import { LettersStoreService } from 'src/app/services/letter-store.service';
import { letterFalling, found } from 'src/app/animations.module';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
  animations: [
    trigger('falling', [
      transition(':enter', useAnimation(letterFalling)),
      transition('* => found', useAnimation(found)),
      transition(':leave', [style({ opacity: 0 })])
    ])
  ]
})

export class LetterComponent {

  private fallingState: string;
  private zIndexes: string[];
  private scales: string[];
  private easings: string[];

  @Input() letter: Letter;
  fallingParams: { fallingSpeed: string; xStart: string; xEnd: string; yEnd: string; zIndex: string; scale: string; };

  @HostBinding('@falling') get fn() {
    return {
      value: this.fallingState,
      params: this.fallingParams
    }
  };

  @HostListener('@falling.done', ['$event']) captureDoneEvent($event) {
    this.hitTest(this.letter, this.fallingState, $event);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    return this.letterFound(event.key);
  }

  @HostListener('tap', ['$event'])
  handleClickEvent(event) {
    return this.letterFound(this.letter.item);
  }

  constructor(
    public game: GameService,
    private store: LettersStoreService
  ) {
    this.letter = {
      item: 'b', //ʕ•ᴥ•ʔ
      id: 'nope',
      isAnimated: false,
      isFound: false,
      isLost: false
    }
    this.fallingState = 'lost';
    this.zIndexes = ['499', '399', '299', '199', '99'];
    this.scales = ['1', '0.9', '0.8', '0.7', '0.6'];
    this.easings = ['cubic-bezier(0.55, 0, 1, 0.45)', 'cubic-bezier(0.32, 0, 0.67, 0)', 'cubic-bezier(0.12, 0, 0.39, 0)']
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
      yEnd: `calc(100% - ${(index + 1.7) * 3}em)`
    }
  }

  randomEase() {
    return this.easings[Math.floor(Math.random() * this.easings.length)];
  }

  letterFound(key) {
    if (
      this.game.started &&
      this.letter.item === key &&
      this.store.letters.filter(storeLetter => storeLetter.item === this.letter.item && storeLetter.isFound === false)
    ) {


      if (this.fallingState === 'found') {
        return
      }

      this.fallingState = 'found';
      const audio = new Audio(`../../../assets/audio/${this.letter.item}.mp3`);
      audio.volume = 0.4;
      audio.play();

      return false;
    }
  }

  setFallingParams() {
    const { zIndex, scale, yEnd } = this.pickRange();
    const xStart = this.randomPercentage();
    const xEnd = this.randomPercentage();

    const res = {
      fallingSpeed: this.game.randomRangeSecond(),
      fallingEase: this.randomEase(),
      xStart,
      xEnd,
      yEnd,
      zIndex,
      scale
    };
    return res;
  }

  hitTest(letter, state, event) {

    const { toState, fromState } = event;

    if (this.game.started) {

      if (fromState === 'lost' && toState === 'found' && state === 'found') {
        this.store.setFound(this.letter, true);
      }

      if (fromState === 'void' && toState === 'lost' && state === 'lost') {
        this.store.setLost(letter, true);
        const audio = new Audio(`../../../assets/audio/plouf.mp3`);
        audio.addEventListener('loadeddata', () => {
          audio.volume = 0.2;
          audio.play();
        });
      }

    }
  }

  ngOnInit() {
    this.fallingParams = this.setFallingParams();
  }
}
