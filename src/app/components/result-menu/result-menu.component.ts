import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { LettersStoreService } from 'src/app/services/letter-store.service';

@Component({
  selector: 'app-result-menu',
  templateUrl: './result-menu.component.html',
  styleUrls: ['./result-menu.component.scss']
})

export class ResultMenuComponent implements OnInit {
  @Output() toggleConfMenu = new EventEmitter<boolean>();
  @Input() result;
  resultLevels;
  resultLabel;
  rate

  constructor(
    public game: GameService,
    private store: LettersStoreService
  ) {
    this.resultLabel = '';
    this.rate = 0;
    this.resultLevels = [
      {
        index: 5,
        minrate: 100,
        message: 'Wow super score !'
      },
      {
        index: 4,
        minrate: 75,
        message: 'Peux mieux faire !'
      },
      {
        index: 3,
        minrate: 50,
        message: 'Aïe, Aïe, Aïe ...'
      },
      {
        index: 2,
        minrate: 25,
        message: 'Je suis sur que tu peux mieux faire !'
      },
      {
        index: 1,
        minrate: 0,
        message: 'Tu as perdu ton clavier ?'
      }
    ]
  }

  ngOnInit() {
    this.setResultLabel();
  }

  setResultLabel() {
    const { success, challenge } = this.result;
    const rate = success.length ? (success.length * 100) / challenge.length : success.length;
    this.resultLabel = this.resultLevels.find(level => level.minrate <= rate);
    this.rate = this.resultLabel.index;
    const audio = new Audio(`../../../assets/audio/${this.rate}-5.mp3`);
    // Todo: better check/solution
    if (!this.result.reason) {
      audio.play();
    }

  }

  goToStart() {
    this.store.init(this.game.isRandom);
    this.game.ended = false;
  }

  restartGame() {
    this.game.start();
  }
}
