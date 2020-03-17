import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatchTimelineComponent } from './components/match-timeline/match-timeline.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { RoundInfosWidgetComponent } from './components/round-infos-widget/round-infos-widget.component';
import { TwitchPlayerComponent } from './components/twitch-player/twitch-player.component';
import { MatchSelectionComponent } from './components/match-selection/match-selection.component';
import { MatchInfosWidgetComponent } from './components/match-infos-widget/match-infos-widget.component';
import { MapInfosWidgetComponent } from './components/map-infos-widget/map-infos-widget.component';


@NgModule({
  declarations: [
    AppComponent,
    MatchTimelineComponent,
    RoundInfosWidgetComponent,
    TwitchPlayerComponent,
    MatchSelectionComponent,
    MatchInfosWidgetComponent,
    MapInfosWidgetComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,

    MatProgressSpinnerModule,
    MatBadgeModule,
    MatChipsModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatCardModule,
    MatRadioModule,
    MatInputModule,
    MatExpansionModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
