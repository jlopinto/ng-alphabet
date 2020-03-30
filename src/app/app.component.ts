import { Component, HostListener } from '@angular/core';
import { GameService } from '../app/services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ng-alphabet';
  animatedLetters: string[];
  missedLetters: string[];
  successLetters: string[];
  alphabet: string[];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.game.started && event.keyCode === 27) {
      this.game.end('stopped');
      return;
    }
  }

  constructor(public game: GameService) {

    this.animatedLetters = [];
    this.successLetters = [];
    this.missedLetters = [];
    this.alphabet = [];

    this.game.getMissedLetters().subscribe(value => {
      this.missedLetters = value;
    });

    this.game.getAnimatedLetters().subscribe(value => {
      this.animatedLetters = value;
    });

    this.game.getSuccessLetters().subscribe(value => {
      this.successLetters = value;
    });

    this.game.getAlphabet().subscribe(value => {
      this.alphabet = value;
    });
  }

  ngOnInit() {

  }

  trackByFn(index, item) {
    console.log(item, index);
    return index;
  }
}
