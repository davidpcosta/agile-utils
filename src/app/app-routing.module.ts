import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanningComponent } from './pages/planning/planning.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';


const routes: Routes = [
  { path: 'signin', component: SignInComponent },
  { path: 'signin/:sessionId', component: SignInComponent },
  { path: 'planning/:sessionId', component: PlanningComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
