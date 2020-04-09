import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatchTimelineComponent } from './pages/match-timeline/match-timeline.component';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { RoundInfosWidgetComponent } from './components/round-infos-widget/round-infos-widget.component';
import { TwitchPlayerComponent } from './components/twitch-player/twitch-player.component';
import { MatchSelectionComponent } from './pages/match-selection/match-selection.component';
import { MatchInfosWidgetComponent } from './components/match-infos-widget/match-infos-widget.component';
import { MapInfosWidgetComponent } from './components/map-infos-widget/map-infos-widget.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AboutComponent } from './pages/about/about.component';
import { RoundTimelineComponent } from './components/round-timeline/round-timeline.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { MaintenancePageComponent } from './pages/maintenance-page/maintenance-page.component';
import { BuyInfosWidgetComponent } from './components/buy-infos-widget/buy-infos-widget.component';
import { EndRoundReasonWidgetComponent } from './components/end-round-reason-widget/end-round-reason-widget.component';
import { RoundKillsWidgetComponent } from './components/round-kills-widget/round-kills-widget.component';


@NgModule({
  declarations: [
    AppComponent,
    MatchTimelineComponent,
    RoundInfosWidgetComponent,
    TwitchPlayerComponent,
    MatchSelectionComponent,
    MatchInfosWidgetComponent,
    MapInfosWidgetComponent,
    AboutComponent,
    RoundTimelineComponent,
    MenuBarComponent,
    MaintenancePageComponent,
    BuyInfosWidgetComponent,
    EndRoundReasonWidgetComponent,
    RoundKillsWidgetComponent
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
    MatSnackBarModule,
    MatBottomSheetModule,
    MatListModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTooltipModule,
    MatSlideToggleModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
