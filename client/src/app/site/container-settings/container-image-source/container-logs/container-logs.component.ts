import { Component, Input, OnDestroy, Injector } from '@angular/core';
import { Container, ContainerConfigureData } from '../../container-settings';
import { ContainerLogsService } from '../../services/container-logs.service';
import { FeatureComponent } from '../../../../shared/components/feature-component';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { PortalResources } from '../../../../shared/models/portal-resources';
import { HttpResult } from '../../../../shared/models/http-result';
import { FileUtilities } from 'app/shared/Utilities/file';
import { PortalService } from 'app/shared/services/portal.service';

@Component({
  selector: 'container-logs',
  templateUrl: './container-logs.component.html',
  styleUrls: ['./../../container-settings.component.scss', './container-logs.component.scss'],
})
export class ContainerLogsComponent extends FeatureComponent<ContainerConfigureData> implements OnDestroy {
  @Input()
  set containerConfigureInfoInput(containerConfigureInfo: ContainerConfigureData) {
    this.setInput(containerConfigureInfo);
  }

  public selectedContainer: Container;
  public containerConfigureInfo: ContainerConfigureData;
  public log: string;
  public loadingMessage: string;
  public disableDownloadButton = false;

  constructor(
    private _containerLogsService: ContainerLogsService,
    private _ts: TranslateService,
    private _portalService: PortalService,
    injector: Injector
  ) {
    super('ContainerLogsComponent', injector, 'dashboard');
    this.featureName = 'ContainerSettings';
    this.loadingMessage = this._ts.instant(PortalResources.loading);
    this.log = this.loadingMessage;
  }

  protected setup(inputEvents: Observable<ContainerConfigureData>) {
    return inputEvents
      .distinctUntilChanged()
      .switchMap(containerConfigureInfo => {
        this.containerConfigureInfo = containerConfigureInfo;
        this.clearBusyEarly();

        return this._containerLogsService.getContainerLogs(containerConfigureInfo.resourceId);
      })
      .do(logResponse => {
        this._displayLog(logResponse);
      });
  }

  public clickDownload() {
    this.disableDownloadButton = true;
    let notificationId: string = null;

    this._portalService
      .startNotification(
        this._ts.instant(PortalResources.detailContainerLogFetchTitle),
        this._ts.instant(PortalResources.detailContainerLogFetchDescription)
      )
      .first()
      .switchMap(notification => {
        notificationId = notification.id;
        return this._containerLogsService.getContainerLogsAsZip(this.containerConfigureInfo.resourceId);
      })
      .subscribe(data => {
        if (data.isSuccessful) {
          FileUtilities.saveFile(data.result, `logs.zip`);

          this._portalService.stopNotification(
            notificationId,
            data.isSuccessful,
            this._ts.instant(PortalResources.detailContainerLogFetchSuccess)
          );
        } else {
          this._portalService.stopNotification(
            notificationId,
            data.isSuccessful,
            this._ts.instant(PortalResources.detailContainerLogFetchFailure)
          );
        }

        this.disableDownloadButton = false;
      });
  }

  public clickRefresh() {
    this.log = this.loadingMessage;
    this._containerLogsService.getContainerLogs(this.containerConfigureInfo.resourceId, true).subscribe(logResponse => {
      this._displayLog(logResponse);
    });
  }

  private _displayLog(logResponse: HttpResult<any>) {
    if (logResponse.isSuccessful) {
      if (logResponse.result && logResponse.result._body) {
        this.log = logResponse.result._body;
      } else {
        this.log = this._ts.instant(PortalResources.noLogsAvailable);
      }
    } else {
      this.log = this._ts.instant(PortalResources.errorRetrievingLogs);
    }
  }
}
