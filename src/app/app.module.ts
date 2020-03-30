import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LetterComponent } from './components/letter/letter.component';
import { PauseMenuComponent } from './components/pause-menu/pause-menu.component';
import { StartMenuComponent } from './components/start-menu/start-menu.component';
import { ResultMenuComponent } from './components/result-menu/result-menu.component';
import { RatingStarComponent } from './components/rating-star/rating-star.component';

@NgModule({
  declarations: [
    AppComponent,
    LetterComponent,
    PauseMenuComponent,
    StartMenuComponent,
    ResultMenuComponent,
    RatingStarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
