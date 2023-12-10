import { ApplicationRef, Component, ViewChild, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  constructor(private update: SwUpdate) { }

  ngOnInit() {
  }
}
