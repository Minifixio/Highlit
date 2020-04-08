import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchTimelineComponent } from './components/match-timeline/match-timeline.component';
import { MatchSelectionComponent } from './components/match-selection/match-selection.component';
import { AboutComponent } from './components/about/about.component';
import { MaintenancePageComponent  } from './components/maintenance-page/maintenance-page.component';

const maintenance = true;

const routes: Routes = maintenance ? [
  { path: '**', redirectTo: '/maintenance', pathMatch: 'full'},
  { path: 'maintenance', component: MaintenancePageComponent},
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
