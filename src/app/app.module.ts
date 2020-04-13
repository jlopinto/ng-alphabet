import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SceneComponent } from './components/scene/scene.component';
import { LetterComponent } from './components/letter/letter.component';
import { PauseMenuComponent } from './components/pause-menu/pause-menu.component';
import { StartMenuComponent } from './components/start-menu/start-menu.component';
import { ResultMenuComponent } from './components/result-menu/result-menu.component';
import { RatingStarComponent } from './components/rating-star/rating-star.component';
import { CloudComponent } from './components/cloud/cloud.component';
import { ConfigurationViewComponent } from './components/configuration-view/configuration-view.component';
import { ChallengePreviewComponent } from './components/challenge-preview/challenge-preview.component'
import { SunComponent } from './components/sun/sun.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    SceneComponent,
    LetterComponent,
    PauseMenuComponent,
    StartMenuComponent,
    ResultMenuComponent,
    RatingStarComponent,
    CloudComponent,
    ConfigurationViewComponent,
    ChallengePreviewComponent,
    SunComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
