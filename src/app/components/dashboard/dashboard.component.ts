import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
constructor(public authService: AuthService, private router: Router) { }

ngOnInit() {}

// This function is used to redirect to the link provided in the parameter
isCurrentRoute(route: string): boolean {
  return this.router.url.includes(route);
}

}
