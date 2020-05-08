import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostBinding, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fade, fadeModals } from 'src/app/animations.module';
import { GameService } from 'src/app/services/game.service';
import { LettersStoreService } from 'src/app/services/letter-store.service';

@Component({
    selector: 'app-scene',
    templateUrl: './scene.component.html',
    styleUrls: ['./scene.component.scss'],
    animations: [trigger('fadeModals', [
        transition(':enter', useAnimation(fadeModals, { params: { opacityStart: 0, opacityEnd: 1, translateYStart: '-100px', translateYEnd: '0' } })),
        transition(':leave', useAnimation(fadeModals, { params: { animSpeed: '.2s', opacityStart: 1, opacityEnd: 0, translateYStart: '0', translateYEnd: '-100px' } }))
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

export class SceneComponent {
    sub: any;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (this.game.started) {
            switch (event.keyCode) {
                case 27:
                    event.preventDefault();
                    this.game.end('stop');
                    break;

                default:
                    break;
            }
        } else {
            switch (event.keyCode) {
                case 32:
                    event.preventDefault();
                    if (!this.showConfigMenu) {
                        this.game.start();
                    }

                    break;

                default:
                    break;
            }
        }
    }

    @HostListener('tap', ['$event'])
    handleClickEvent(event) {
        if (this.game.started && event.tapCount === 2) {
            event.preventDefault();
            this.game.end();
            return false;
        }
    }

    @HostBinding('class.modal-open') showConfigMenu: boolean = false;

    constructor(
        public store: LettersStoreService,
        public game: GameService,
        private route: ActivatedRoute
    ) {
        this.showConfigMenu = false;
    }

    ngOnInit() {
        this.sub = this.route.paramMap.subscribe((params) => {
            let paramChallenge = params.get('challenge');
            if (paramChallenge && paramChallenge !== this.game.challenge) {
                this.store.setChallenge(paramChallenge.substr(0, 48));
                this.game.saveLocalPrefs();
            } else {
                this.store.setChallenge(this.game.challenge);
            }
            this.store.init(this.game);
        })

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    toggleConfMenu(event) {
        this.showConfigMenu = event;
    }

    trackByFn = (_i, item) => item.id;
}
