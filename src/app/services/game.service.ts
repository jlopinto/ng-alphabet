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

  loopID: any;
  spawnSpeed: number;
  fallingSpeed: number;
  fallingSpeedRange: number;
  backgroundSound: HTMLAudioElement;
  runResult: object;
  gameEnd: any;

  constructor(
    private store: LettersStoreService
  ) {
    this.started = false;
    this.ended = false;
    this.paused = false;

    this.loopID = null;
    this.spawnSpeed = 3500; //in milliseconds
    this.fallingSpeed = 7; //in seconds
    this.fallingSpeedRange = 1; //in seconds
    this.backgroundSound = new Audio(`../../../assets/audio/plage.mp3`);
    this.backgroundSound.volume = 0.1;
    this.runResult = [];
  }

  start() {
    this.store.init();
    this.started = true;
    this.ended = false;

    this.loop();
    this.backgroundSound.play();
    this.resolve();
  }

  loop() {
    this.animateRandomLetter();
    this.loopID = setInterval(() => {
      this.animateRandomLetter();
    },
      this.spawnSpeed
    );
  };

  end() {

    clearInterval(this.loopID);
    this.gameEnd.unsubscribe();
    this.ended = true;
    this.started = false;

    this.runResult = {
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
        fallingSpeed: this.randomRangeSecond()
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

  animateRandomLetter() {
    this.store.leftLetters$.pipe(take(1)).subscribe(leftLetters => {
      if (leftLetters.length) {
        const letterIndex = Math.floor(Math.random() * leftLetters.length);
        this.store.setAnimated(leftLetters[letterIndex], true);
      } else {
        clearInterval(this.loopID);
      }
    });
  }

  randomRangeSecond() {
    const min = this.fallingSpeed - this.fallingSpeedRange;
    const max = this.fallingSpeed + this.fallingSpeedRange;
    const res = Math.floor(Math.random() * (max - min + 1) + min);
    return res + 's';
  }
}
