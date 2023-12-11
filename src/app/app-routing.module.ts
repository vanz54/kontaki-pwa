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

const routes: Routes = [
  {path:'', pathMatch : 'full' , component: HomeComponent},
  {path:'home', component: HomeComponent, children: [
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'about', component: AboutComponent}
  ]},
  {path:'dashboard', canActivate: [AuthGuard] ,component: DashboardComponent, children: [ 
    {path:'bank', component: BankComponent},
    {path:'profile', component: ProfileComponent}
   ]},
  {path: '**', redirectTo: '/home/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
