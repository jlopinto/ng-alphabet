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
      isUppercase: new FormControl(this.game.isUppercase),
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
      this.store.init(value);
    });

    this.configurationForm.controls.isUppercase.valueChanges.subscribe(value => {
      this.game.isUppercase = value;
    });
  }

  cancelConf() {
    this.toggleConfMenu.emit(false);
  }

  saveConf() {

    const { challenge, isRandom, isUppercase, spawnTimer, fallingSpeed } = this.configurationForm.controls;

    if (challenge.valid) {
      this.store.setChallenge(challenge.value);
    }

    this.store.init(isRandom.value);
    this.game.isUppercase = isUppercase.value;
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
