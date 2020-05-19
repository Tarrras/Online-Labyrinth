import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './registration';
import {GameComponent} from './game'
import { from } from 'rxjs';

const routes: Routes = [
  { path: 'registration', component: RegisterComponent },
  { path: '', component: GameComponent },
  { path: '**', redirectTo: '' }
  
]

export const appRoutingModule = RouterModule.forRoot(routes);