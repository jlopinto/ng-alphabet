import { Component, OnInit, Input } from '@angular/core';
import { LettersStoreService } from 'src/app/services/letter-store.service';
import { GameService } from 'src/app/services/game.service';
import { Letter } from 'src/app/models/letter.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-challenge-preview',
  templateUrl: './challenge-preview.component.html',
  styleUrls: ['./challenge-preview.component.scss']
})
export class ChallengePreviewComponent implements OnInit {

  @Input() items: any;

  constructor(
    public store: LettersStoreService,
    public game: GameService,
  ) {

  }

  ngOnInit() {
    if (!this.items) {
      this.items = this.store.letters$;
    } else {
      this.items = new BehaviorSubject<Letter[]>([...this.items]).asObservable();
    }
  }

}
