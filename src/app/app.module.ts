import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { PlanningComponent } from './pages/planning/planning.component';
import { UserCardComponent } from './pages/planning/components/user-card/user-card.component';
import { DeckCardComponent } from './pages/planning/components/deck-card/deck-card.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanningComponent,
    UserCardComponent,
    DeckCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
