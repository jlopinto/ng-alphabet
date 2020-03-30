import { Component, Input, OnInit, ViewChild, HostBinding } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-result-menu',
  templateUrl: './result-menu.component.html',
  styleUrls: ['./result-menu.component.scss']
})

export class ResultMenuComponent implements OnInit {

  @Input() result;
  resultLevels;
  resultLabel;
  rate

  @HostBinding('class') classAttribute: string;

  constructor(
    public game: GameService
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
    this.classAttribute = 'modal fade show';
  }

  setResultLabel() {
    const { success, challenge } = this.result;
    const rate = success.length ? (success.length * 100) / challenge.length : success.length;
    this.resultLabel = this.resultLevels.find(level => level.minrate <= rate);
    this.rate = this.resultLabel.index;
  }

  restartGame() {
    this.game.start();
  }
}
