import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SceneComponent } from './components/scene/scene.component';


const routes: Routes = [
  {
    path: '',
    component: SceneComponent
  },
  {
    path: ':challenge',
    component: SceneComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
