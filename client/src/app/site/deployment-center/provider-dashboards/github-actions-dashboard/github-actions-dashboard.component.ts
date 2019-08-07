import { Observable, Subject } from 'rxjs/Rx';
import { DeploymentData } from '../../Models/deployment-data';
import { SimpleChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, OnChanges } from '@angular/core';
import { BusyStateScopeManager } from 'app/busy-state/busy-state-scope-manager';
import { BroadcastService } from 'app/shared/services/broadcast.service';
import { SiteTabIds } from 'app/shared/models/constants';
import { TranslateService } from '@ngx-translate/core';
import { DeploymentDashboard } from '../deploymentDashboard';
import { SiteService } from 'app/shared/services/site.service';

@Component({
  selector: 'app-github-actions-dashboard',
  templateUrl: './github-actions-dashboard.component.html',
  styleUrls: ['./github-actions-dashboard.component.scss'],
})
export class GithubActionsDashboardComponent extends DeploymentDashboard implements OnChanges, OnDestroy {
  @Input()
  resourceId: string;

  public deploymentObject: DeploymentData;
  public viewInfoStream$: Subject<string>;

  private _busyManager: BusyStateScopeManager;
  private _ngUnsubscribe$ = new Subject();

  constructor(private _siteService: SiteService, broadcastService: BroadcastService, translateService: TranslateService) {
    super(translateService);
    this._busyManager = new BusyStateScopeManager(broadcastService, SiteTabIds.continuousDeployment);

    this.viewInfoStream$ = new Subject<string>();
    this.viewInfoStream$
      .takeUntil(this._ngUnsubscribe$)
      .switchMap(resourceId => {
        return Observable.zip(
          this._siteService.getSite(resourceId),
          this._siteService.getSiteConfig(resourceId),
          this._siteService.fetchSiteConfigMetadata(resourceId, true),
          (site, siteConfig, siteMetadata) => ({
            site: site.result,
            siteConfig: siteConfig.result,
            siteMetadata: siteMetadata.result,
          })
        );
      })
      .subscribe(responses => {
        this._busyManager.clearBusy();
        this.deploymentObject = {
          site: responses.site,
          siteConfig: responses.siteConfig,
          siteMetadata: responses.siteMetadata,
          sourceControls: null,
          publishingCredentials: null,
          deployments: null,
          publishingUser: null,
        };
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['resourceId']) {
      this._busyManager.setBusy();
      this.viewInfoStream$.next(this.resourceId);
    }
  }

  get repo() {
    return this.deploymentObject.siteMetadata.properties['GithubActionSettingsRepoUrl'];
  }

  get branch() {
    return this.deploymentObject.siteMetadata.properties['GithubActionSettingsBranch'];
  }

  get actionsLink() {
    return `${this.deploymentObject.siteMetadata.properties['GithubActionSettingsRepoUrl']}/actions`;
  }

  repoLinkClick() {
    if (this.repo) {
      const win = window.open(this.repo, '_blank');
      win.focus();
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
  }

  browseToSite() {
    this._browseToSite(this.deploymentObject);
  }
}
