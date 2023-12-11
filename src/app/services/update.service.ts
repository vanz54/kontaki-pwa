import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { deprecate } from 'util';


@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(
    public updates: SwUpdate,
    public appRef: ApplicationRef
    ) {
      if (updates.isEnabled) {
           // Allow the app to stabilize first, before starting
          // polling for updates with `interval()`.
          const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable === true));
          const every10Minutes$ = interval( /* 10 * */60*1000 );
          const every10MinutesOnceAppIsStable$ = concat(appIsStable$, every10Minutes$);

          every10MinutesOnceAppIsStable$.subscribe(async () => {
            try {
              const updateFound = await updates.checkForUpdate();
              console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
            } catch (err) {
              console.error('Failed to check for updates:', err);
            }
          });
          this.updates.unrecoverable.subscribe(event => {
            alert(
              'An error occurred that we cannot recover from:\n' +
              event.reason +
              '\n\nPlease reload the page.'
            );
          });
      }
    }



  public checkForUpdates():void{
    this.updates.versionUpdates
    .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
    .subscribe(evt => {
      console.log('Updating to new version');
      if (this.promptUser(evt)) {
        // Reload the page to update to the latest version.
        document.location.reload();
      }
    });
  }

  public promptUser(evt: VersionReadyEvent): boolean {
    const msg = `New version available. Update to this version?`;
    return confirm(msg);
  }


}
