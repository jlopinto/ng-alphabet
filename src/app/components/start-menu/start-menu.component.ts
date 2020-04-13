import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.scss']
})

export class StartMenuComponent implements OnInit {

  @Output() toggleConfMenu = new EventEmitter<boolean>();

  constructor(public game: GameService) { }

  ngOnInit() {

  }

  showConfMenu() {
    this.toggleConfMenu.emit(true);
  }

  startGame() {
    this.game.start();
  }
}
