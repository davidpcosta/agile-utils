import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { FormsModule } from '@angular/forms';
import { PlanningComponent } from './pages/planning/planning.component';
import { UserCardComponent } from './pages/planning/components/user-card/user-card.component';
import { DeckCardComponent } from './pages/planning/components/deck-card/deck-card.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PlanningComponent,
    UserCardComponent,
    DeckCardComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
