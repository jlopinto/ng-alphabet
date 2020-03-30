import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { fallingEnter, fallingLeave } from 'src/app/transitions.module';
import { ReturnStatement } from '@angular/compiler';


@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
  animations: [
    trigger('falling', [
      state('found', style({ opacity: 0 })),
      state('lost', style({ top: '100%', left: '{{xEnd}}' }), { params: { xEnd: '25%' } }),
      transition(':enter', useAnimation(fallingEnter)),
      transition(':leave', useAnimation(fallingLeave)),
      transition('lost => found', animate('1s'))
    ])
  ]
})

export class LetterComponent implements OnInit {

  private fallingState: string;

  @Input() letter: string;
  @HostBinding('@falling') get fn() {
    return {
      value: this.fallingState,
      params: {
        fallingSpeed: this.game.random(this.game.fallingSpeed, this.game.fallingSpeedRange) + 's',
        xStart: this.randomPercentage(),
        xEnd: this.randomPercentage(),
      }
    }
  };

  @HostListener('@falling.done', ['$event']) captureDoneEvent($event: AnimationEvent) {
    this.game.hitTest(this.letter, this.fallingState, $event);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.game.started && this.game.animatedLetters.includes(this.letter)) {
      event.preventDefault();
      const key = event.key.toLowerCase();
      if (this.letter == key && !this.game.successLetters.includes(this.letter)) {

        this.fallingState = 'found';
        const audio = new Audio(`../../../assets/audio/${this.letter}.mp3`);
        audio.play();
        this.game.successLetter(this.letter);

        return false;
      }
    }
  }

  @HostListener('tap', ['$event'])
  handleClickEvent(event: KeyboardEvent) {
    if (this.game.started) {
      if (this.game.animatedLetters.includes(this.letter) && !this.game.successLetters.includes(this.letter)) {
        this.fallingState = 'found';
        const audio = new Audio(`../../../assets/audio/${this.letter}.mp3`);
        audio.play();
      }
    }

  }

  constructor(private game: GameService) {
    this.fallingState = 'lost';
  }

  randomPercentage() {
    return Math.floor(Math.random() * 100) + '%';
  }

  ngOnInit() {

  }

}
