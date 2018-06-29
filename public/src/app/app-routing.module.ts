import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'game', component: GameComponent},
  { path: 'waitingRoom', component: WaitingRoomComponent},
  { path: 'results', component: ResultsComponent},
  { path: '', pathMatch: 'full', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
