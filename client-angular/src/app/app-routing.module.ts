import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchTimelineComponent } from './pages/match-timeline/match-timeline.component';
import { MatchSelectionComponent } from './pages/match-selection/match-selection.component';
import { AboutComponent } from './pages/about/about.component';
import { MaintenancePageComponent  } from './pages/maintenance-page/maintenance-page.component';
import { RoundInfosWidgetComponent } from './components/round-infos-widget/round-infos-widget.component';

const maintenance = false;

const routes: Routes = maintenance ? [
  //{ path: '**', redirectTo: '/maintenance', pathMatch: 'full'},
  { path: 'maintenance', component: MaintenancePageComponent},
  { path: 'round', component: RoundInfosWidgetComponent},
] : [
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
