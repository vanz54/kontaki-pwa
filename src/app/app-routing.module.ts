import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { BankComponent } from './components/bank/bank.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

// Redirecttions and use of guard to protect the dashboard
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },  // Redirect /home to /home/login
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'about', component: AboutComponent }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      { path: 'bank', component: BankComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: '/home/login' },  // Redirect empty path to /home/login
  { path: '**', redirectTo: '/home/login' }  // Redirect any other unknown route to /home/login
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
