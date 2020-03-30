import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class GameService {
  _ALPHABET: string[];
  ALPHABET: string[];
  ALPHABET$: BehaviorSubject<string[]>;
  started: boolean;
  paused: boolean;
  ended: boolean;

  loopID: any;
  spawnSpeed: number;
  spawnSpeedRange: number;
  fallingSpeed: number;
  fallingSpeedRange: number;

  runResult: any;

  animatedLetters: string[];
  successLetters: string[];
  missedLetters: string[];
  missedLetters$: BehaviorSubject<string[]>;
  successLetters$: BehaviorSubject<string[]>;
  animatedLetters$: BehaviorSubject<string[]>;

  backgroundSound: HTMLAudioElement;

  constructor(
  ) {
    this.started = false;
    this.ended = false;
    this.paused = false;

    this.loopID = null;
    this.spawnSpeed = 3000; //in milliseconds
    this.spawnSpeedRange = 1000; //in milliseconds
    this.fallingSpeed = 7; //in seconds
    this.fallingSpeedRange = 1; //in seconds

    this.ALPHABET = [];
    this.ALPHABET$ = new BehaviorSubject([]);

    this._ALPHABET = [];

    this.animatedLetters = [];
    this.animatedLetters$ = new BehaviorSubject([]);

    this.missedLetters = [];
    this.missedLetters$ = new BehaviorSubject([]);

    this.successLetters = [];
    this.successLetters$ = new BehaviorSubject([]);

    this.runResult = false;
    this.backgroundSound = new Audio(`../../../assets/audio/plage.mp3`);
    this.backgroundSound.volume = 0.1;

  }

  start() {
    this.started = true;
    this.ended = false;
    this.ALPHABET = 'abc'.split('');
    this._ALPHABET = [...this.ALPHABET];
    this.loop();

    this.backgroundSound.play();
    console.info('game started!');
  }

  pause() {
    this.started = true;
  }

  unpause() {
    this.started = true;
  }

  loop() {
    this.addLetter();
    this.loopID = setInterval(() => {
      this.addLetter();
    },
      this.random(this.spawnSpeed, this.spawnSpeedRange)
    );
  }

  hitTest(letter, state, event) {
    const { toState } = event;

    if (state == 'lost' && toState == 'lost') {

      this.missedLetter(letter);
      if (this.started) {
        const audio = new Audio(`../../../assets/audio/plouf.mp3`);
        audio.volume = 0.2;
        audio.play();
      }

    }
  }

  getAlphabet = () => this.ALPHABET$.asObservable();
  updateAlphabet = (value, reset?) => {
    this.ALPHABET = reset ? [...value] : [...this.ALPHABET, ...value];
    this.ALPHABET$.next(this.ALPHABET);
  }

  getMissedLetters = () => this.missedLetters$.asObservable();
  updateMissedLetters = (value, reset?) => {
    this.missedLetters = reset ? [...value] : [...this.missedLetters, ...value];
    this.missedLetters$.next(this.missedLetters);
  }

  getSuccessLetters = () => this.successLetters$.asObservable();
  updateSuccessLetters = (value, reset?) => {
    this.successLetters = reset ? [...value] : [...this.successLetters, value];
    this.successLetters$.next(this.successLetters);
  }

  getAnimatedLetters = () => this.animatedLetters$.asObservable();
  updateAnimatedLetters = (value, reset?) => {
    this.animatedLetters = reset ? [...value] : [...this.animatedLetters, value];
    this.animatedLetters$.next(this.animatedLetters);
  }

  missedLetter(letter) {
    if (this.started) {
      this.updateMissedLetters(letter);
      this.updateAnimatedLetters(this.animatedLetters.filter(animatedLetter => animatedLetter !== letter), true);
    }

  }

  successLetter(letter) {
    this.updateSuccessLetters(letter);
    // increased mode :D
    //this.addLetter();
  }

  end(status) {
    clearInterval(this.loopID);

    this.ended = true;
    this.started = false;

    this.runResult = {
      missed: [...this.missedLetters],
      success: [...this.successLetters],
      challenge: [...this._ALPHABET],
      config: {
        spawnSpeed: this.spawnSpeed,
        fallingSpeed: this.random(this.fallingSpeed, 1) + 's'
      }
    }


    this.updateSuccessLetters([], true);
    this.updateAlphabet([], true);
    this.updateAnimatedLetters([], true);
    this.updateMissedLetters([], true);

    this.backgroundSound.pause();

    console.info(status, this.runResult);
  }

  addLetter() {
    if (this.ALPHABET.length) {
      const letterIndex = Math.floor(Math.random() * (this.ALPHABET.length));
      this.updateAnimatedLetters(this.ALPHABET[letterIndex]);
      this.updateAlphabet(this.ALPHABET.filter(letter => this.ALPHABET[letterIndex] !== letter), true);
    }

    if ((this.missedLetters.length + this.successLetters.length) === this._ALPHABET.length) {
      this.end('total good !');
    }
  }

  random(level, range) {
    const min = level - range;
    const max = level + range;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
