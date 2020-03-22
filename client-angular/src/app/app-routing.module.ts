import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchTimelineComponent } from './components/match-timeline/match-timeline.component';
import { MatchSelectionComponent } from './components/match-selection/match-selection.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/match-selection', pathMatch: 'full'},
  { path: 'match', component: MatchTimelineComponent},
  { path: 'match-selection', component: MatchSelectionComponent},
  { path: 'about', component: AboutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
