import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SoundService {

  lostSound: HTMLAudioElement;
  backgroundSound: HTMLAudioElement;

  constructor() {
    new Audio(`../../../assets/audio/plouf.mp3`);
    this.backgroundSound = new Audio(`../../../assets/audio/plage.mp3`);
    this.backgroundSound.volume = 0.1;
  }

  playLostSound() {
    this.lostSound = new Audio(`../../../assets/audio/plouf.mp3`);
    this.lostSound.play();
  }

  playBackgroundSound() {

    this.backgroundSound.play();
  }

  pauseBackgroundSound() {
    this.backgroundSound.pause();
  }
}
