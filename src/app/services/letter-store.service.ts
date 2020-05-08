import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { uuid } from 'src/app/uuid';
import { Letter } from 'src/app/models/letter.model';

@Injectable({ providedIn: 'root' })

export class LettersStoreService {

  challenge: string;

  constructor() {
    this.challenge = '';
  }

  get letters(): Letter[] {
    return this._letters.getValue();
  }

  set letters(val: Letter[]) {
    this._letters.next(val);
  }

  private readonly _letters = new BehaviorSubject<Letter[]>([]);

  readonly letters$ = this._letters.asObservable();

  readonly animatedLetters$ = this.letters$.pipe(
    map(letters => letters.filter(letter => letter.isAnimated && !letter.isFound && !letter.isLost))
  )

  readonly lostLetters$ = this.letters$.pipe(
    map(letters => letters.filter(letter => letter.isLost))
  )

  readonly foundLetters$ = this.letters$.pipe(
    map(letters => letters.filter(letter => letter.isFound))
  )

  readonly leftLetters$ = this.letters$.pipe(
    map(letters => letters.filter(letter => !letter.isFound && !letter.isLost && !letter.isAnimated))
  )

  async setAnimated(animatedLetter: Letter, isAnimated: boolean) {

    const index = this.letters.indexOf(animatedLetter);
    this.letters[index] = {
      ...animatedLetter,
      isAnimated
    }
    this.letters = [...this.letters];
  }

  async setFound(foundLetter: Letter, isFound: boolean) {
    const index = this.letters.indexOf(foundLetter);
    this.letters[index] = {
      ...foundLetter,
      isFound,
      isAnimated: false
    }
    this.letters = [...this.letters];
  }

  async setLost(lostLetter: Letter, isLost: boolean) {
    const index = this.letters.indexOf(lostLetter);
    this.letters[index] = {
      ...lostLetter,
      isLost,
      isAnimated: false
    }
    this.letters = [...this.letters];
  }

  setChallenge(newChallenge) {
    if (
      newChallenge
      && this.challenge !== newChallenge) {
      this.challenge = newChallenge;
    }
  }

  init(game) {
    const { isRandom: shuffle, challengeCase } = game;

    this.letters = [];
    let isUppercase = false;
    this.letters = this.challenge.split('').map(item => {

      if (challengeCase === 'isRandomCase') {
        isUppercase = Math.floor(Math.random() * Math.floor(2)) === 1;
      } else {
        isUppercase = challengeCase === 'isUppercase';
      }

      return <Letter>{
        id: uuid(),
        item: item,
        isAnimated: false,
        isFound: false,
        isLost: false,
        isUppercase
      }
    })

    if (shuffle) {
      this.shuffleStore(this.letters);
    }
  }

  shuffleStore(a: any[]): any[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  reset() {
    this.letters = [];
  }
}
