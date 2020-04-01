import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { GameService } from '../app/services/game.service';
import { LettersStoreService } from '../app/services/letter-store.service';
import { fadeModals, fade } from './transitions.module';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [trigger('fadeModals', [
    transition(':enter', useAnimation(fadeModals, { params: { opacityStart: 0, opacityEnd: 1, translateYStart: '-50px', translateYEnd: '0' } })),
    transition(':leave', useAnimation(fadeModals, { params: { animSpeed: '.2s', opacityStart: 1, opacityEnd: 0, translateYStart: '0', translateYEnd: '-50px' } }))
  ]),
  trigger('autoFadeBackdrop', [
    transition(':enter', useAnimation(fadeModals, { params: { opacityStart: 0, opacityEnd: '.5' } })),
    transition(':leave', useAnimation(fadeModals, { params: { animSpeed: '.2s', opacityStart: '.5', opacityEnd: 0 } }))
  ]),
  trigger('autoFade', [
    transition(':enter', useAnimation(fade, { params: { opacityStart: 0, opacityEnd: '.5' } })),
    transition(':leave', useAnimation(fade, { params: { animSpeed: '.2s', opacityStart: '.5', opacityEnd: 0 } }))
  ])]
})

export class AppComponent {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.game.started && event.keyCode === 27) {
      this.game.end();
      return;
    }
  }

  constructor(
    public store: LettersStoreService,
    public game: GameService) {
  }

  ngOnInit() {

  }

  trackByFn = (i, item) => item.id;
}
