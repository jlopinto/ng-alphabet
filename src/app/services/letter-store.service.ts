import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { uuid } from 'src/app/uuid';
import { Letter } from 'src/app/models/letter.model';

@Injectable({ providedIn: 'root' })
export class LettersStoreService {

  constructor() {

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

  init() {
    this.letters = 'abcdefghijklmnopqrstuvwxyz'.split('').map(item => <Letter>{
      id: uuid(),
      item: item,
      isAnimated: false,
      isFound: false,
      isLost: false
    })
  }

  reset() {
    this.letters = [];
    this.init();
  }
}
