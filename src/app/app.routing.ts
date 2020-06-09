import { Routes, RouterModule } from '@angular/router';
import { NgModule }             from '@angular/core';

import { RegisterComponent } from './registration';
import {GameComponent} from './game'
import { from } from 'rxjs';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'registration', component: RegisterComponent },
  { path: 'detail/:id', component: GameComponent },
  { path: '**', redirectTo: '' }
  
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}