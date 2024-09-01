import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DetailsComponent } from './pages/details/details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [authGuard]},
  { path: 'details', component: DetailsComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect any unknown path to Home
];
