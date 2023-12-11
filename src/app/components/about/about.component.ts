import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  constructor(private router: Router) {}

  redirectToLink(linkUrl) {
    window.open(linkUrl, '_blank');
  }

  redirectToEmail(emailAddress: string) {
    window.location.href = `mailto:${emailAddress}`;
  }
}
