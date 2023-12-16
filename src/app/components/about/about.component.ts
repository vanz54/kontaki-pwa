import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  constructor(private router: Router) {}

  // This function is used to redirect to the link provided in the parameter
  redirectToLink(linkUrl) {
    window.open(linkUrl, '_blank');
  }

  // This function is used to redirect to the email provided in the parameter
  redirectToEmail(emailAddress: string) {
    window.location.href = `mailto:${emailAddress}`;
  }
}
