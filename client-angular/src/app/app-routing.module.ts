import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchTimelineComponent } from './pages/match-timeline/match-timeline.component';
import { MatchSelectionComponent } from './pages/match-selection/match-selection.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/match-selection', pathMatch: 'full'},
  { path: 'match', component: MatchTimelineComponent},
  { path: 'match-selection', component: MatchSelectionComponent},
  { path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
