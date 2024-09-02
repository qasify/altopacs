import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ExamineComponent } from './pages/examine/examine.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [authGuard]},
  { path: 'examine', component: ExamineComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect any unknown path to Home
];
