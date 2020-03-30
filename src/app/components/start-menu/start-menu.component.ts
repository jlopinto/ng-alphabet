import { Component, OnInit, HostBinding } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.scss']
})

export class StartMenuComponent implements OnInit {

  @HostBinding('class') classAttribute: string;

  constructor(public gs: GameService) { }

  ngOnInit() {
    this.classAttribute = 'modal fade show';
  }

  startGame() {
    this.gs.start();
  }

}
