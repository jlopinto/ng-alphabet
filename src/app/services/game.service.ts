import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { LettersStoreService } from './letter-store.service';

@Injectable({
  providedIn: 'root'
})

export class GameService {

  started: boolean;
  paused: boolean;
  ended: boolean;
  challenge: string;

  loopID: any;
  spawnSpeed: number;
  fallingSpeed: number;
  fallingSpeedRange: number;
  challengeCase: string;
  isRandom: boolean;
  backgroundSound: HTMLAudioElement;
  runResult: object;
  gameEnd: any;

  constructor(
    private store: LettersStoreService
  ) {
    this.started = false;
    this.ended = false;
    this.paused = false;
    this.isRandom = true;
    this.challengeCase = 'isRandomCase';
    this.challenge = 'abcdefghijklmnopqrstuvwxyz';
    this.loopID = null;
    this.spawnSpeed = 5; //in seconds
    this.fallingSpeed = 15; //in seconds
    this.fallingSpeedRange = 1; //in seconds
    this.backgroundSound = new Audio(`../../../assets/audio/plage.mp3`);
    this.backgroundSound.volume = 0.1;
    this.runResult = [];
    this.loadLocalPrefs();
  }

  start() {
    this.store.init(this);
    this.started = true;
    this.ended = false;

    this.loop();
    this.backgroundSound.play();
    this.resolve();

  }

  loop() {
    this.animateLetter();
    this.loopID = setInterval(() => {
      this.animateLetter();
    },
      this.spawnSpeed
    );
  };

  end(reason?) {

    clearInterval(this.loopID);
    this.gameEnd.unsubscribe();
    this.ended = true;
    this.started = false;

    this.runResult = {
      reason,
      missed: this.store.letters
        .filter(letter => letter.isFound === false)
        .map(letter => {
          return {
            ...letter,
            isAnimated: false,
            isLost: true
          }
        }),
      success: this.store.letters.filter(letter => letter.isFound === true),
      challenge: this.store.letters,
      config: {
        spawnSpeed: this.spawnSpeed,
        fallingSpeed: this.fallingSpeed
      }
    }
    this.store.reset();
    this.backgroundSound.pause();
  }

  resolve() {
    this.gameEnd = combineLatest([this.store.animatedLetters$, this.store.leftLetters$]).subscribe(([animatedLetters, leftLetters]) => {
      if (!animatedLetters.length && !leftLetters.length) {
        this.end();
      }
    });
  }

  animateLetter() {

    this.store.leftLetters$.pipe(take(1)).subscribe(leftLetters => {
      if (leftLetters.length) {
        this.store.setAnimated(leftLetters[0], true);
      } else {
        clearInterval(this.loopID);
      }
    });
  }

  randomRangeSecond() {
    const min = this.fallingSpeed - this.fallingSpeedRange;
    const max = this.fallingSpeed + this.fallingSpeedRange;
    let res = Math.floor(Math.random() * (max - min + 1) + min);
    res = res <= 0 ? .5 : res;
    return res + 's';
  }

  loadLocalPrefs() {

    let prefs: any = localStorage.getItem('user_prefs') || false

    if (prefs) {
      prefs = JSON.parse(prefs);

      this.challenge = prefs.challenge;
      this.fallingSpeed = prefs.fallingSpeed;
      this.spawnSpeed = prefs.spawnSpeed;
      this.isRandom = prefs.isRandom;
      this.challengeCase = prefs.challengeCase;
    }
  }

  saveLocalPrefs() {

    const prefs = {
      challenge: this.store.challenge,
      fallingSpeed: this.fallingSpeed,
      spawnSpeed: this.spawnSpeed,
      challengeCase: this.challengeCase,
      isRandom: this.isRandom
    };

    localStorage.setItem('user_prefs', JSON.stringify(prefs));
  }
}
