import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.scss']
})

export class RatingStarComponent implements OnInit {

  @Input() rating;
  @Input() ratingMax;

  done;
  missed;

  constructor() {
    this.done = []
    this.missed = []
    this.rating = 0;
    this.ratingMax = 5;
  }

  ngOnInit() {
    this.done = Array(this.rating).fill('').map((x, i) => i);
    this.missed = Array(this.ratingMax - this.rating).fill('').map((x, i) => i);
  }

}
