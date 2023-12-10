import { Component, ViewChild, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private observer: BreakpointObserver, private router: Router, public authService: AuthService) {}

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  
  ngOnInit() {
    this.checkRouteLogin();
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
  checkRouteLogin() {
    if (this.router.url == '/home/login') {
      return false; //mostra register
    } else {
      return true;
    }
  }

  checkRouteRegister() {
    if (this.router.url == '/home/register'  || this.router.url == '/home') {
      return false; //mostra login
    } else {
      return true;
    }
  }
}