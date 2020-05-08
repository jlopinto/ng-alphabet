import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';
import { LettersStoreService } from 'src/app/services/letter-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configuration-view',
  templateUrl: './configuration-view.component.html',
  styleUrls: ['./configuration-view.component.scss']
})
export class ConfigurationViewComponent implements OnInit {

  @Output() toggleConfMenu = new EventEmitter<boolean>();

  configurationForm: FormGroup;
  subscriptions: Subscription;

  constructor(
    public game: GameService,
    public store: LettersStoreService
  ) {
    this.subscriptions = new Subscription();
    this.configurationForm = new FormGroup({
      challengeCase: new FormControl(this.game.challengeCase),
      isRandom: new FormControl(this.game.isRandom),
      challenge: new FormControl(this.store.challenge, [
        Validators.required
      ]),
      spawnTimer: new FormControl(this.game.spawnSpeed / 1000),
      fallingSpeed: new FormControl(this.game.fallingSpeed)
    });
  }

  ngOnInit() {

    this.configurationForm.controls.isRandom.valueChanges.subscribe(value => {
      this.game.isRandom = value;
      this.store.init(this.game);
    });

    this.configurationForm.controls.challengeCase.valueChanges.subscribe(value => {
      this.game.challengeCase = value;
      this.store.init(this.game);
    });
  }

  cancelConf() {
    this.toggleConfMenu.emit(false);
  }

  saveConf() {

    const { challenge, isRandom, challengeCase, spawnTimer, fallingSpeed } = this.configurationForm.controls;

    if (challenge.valid) {
      this.store.setChallenge(challenge.value);
    }

    this.game.challengeCase = challengeCase.value;
    this.game.isRandom = isRandom.value;
    this.game.spawnSpeed = spawnTimer.value * 1000;
    this.game.fallingSpeed = fallingSpeed.value;
    this.toggleConfMenu.emit(false);
    this.game.saveLocalPrefs();
    return false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
