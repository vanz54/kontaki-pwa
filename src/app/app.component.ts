import { ApplicationRef, Component, ViewChild, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { UpdateService } from './services/update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  constructor(
    private sw: UpdateService
  ) { }

  ngOnInit() {
    this.sw.checkForUpdates();
  }
}
