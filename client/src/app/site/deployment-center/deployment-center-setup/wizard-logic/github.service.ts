import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from 'app/shared/services/user.service';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { AuthoricatedUserContext, DevOpsAccount, DevOpsList, DevOpsProject } from './azure-devops-service-models';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { uniqBy } from 'lodash-es';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Constants, DeploymentCenterConstants } from 'app/shared/models/constants';
import { DeploymentCenterStateManager } from './deployment-center-state-manager';
import { CacheService } from 'app/shared/services/cache.service';
import { Guid } from 'app/shared/Utilities/Guid';

@Injectable()
export class GithubService implements OnDestroy {
  private _ngUnsubscribe$ = new Subject();
  private _workflowYmlPath = '.github/workflows/appsvc-portal.yml';

  constructor(private _wizard: DeploymentCenterStateManager, private _cacheService: CacheService) {}

  ngOnDestroy(): void {
    this._ngUnsubscribe$.next();
  }

  fetchOrgs() {
    return this._cacheService.post(Constants.serviceHost + 'api/github/passthrough?orgs=', true, null, {
      url: `${DeploymentCenterConstants.githubApiUrl}/user/orgs`,
      authToken: this._wizard.getToken(),
    });
  }

  fetchUser() {
    return this._cacheService.post(Constants.serviceHost + 'api/github/passthrough?user=', true, null, {
      url: `${DeploymentCenterConstants.githubApiUrl}/user`,
      authToken: this._wizard.getToken(),
    });
  }

  fetchUserRepos(org: string, page?: number) {
    const url = page
      ? `${DeploymentCenterConstants.githubApiUrl}/user/repos?type=owner&page=${page}`
      : `${DeploymentCenterConstants.githubApiUrl}/user/repos?type=owner`;

    return this._cacheService.post(Constants.serviceHost + `api/github/passthrough?repo=${org}&t=${Guid.newTinyGuid()}`, true, null, {
      url,
      authToken: this._wizard.getToken(),
    });
  }

  fetchOrgRepos(org: string, page?: number) {
    const url = page ? `${org}/repos?per_page=100&page=${page}` : `${org}/repos?per_page=100`;

    return this._cacheService.post(Constants.serviceHost + `api/github/passthrough?repo=${org}&t=${Guid.newTinyGuid()}`, true, null, {
      url,
      authToken: this._wizard.getToken(),
    });
  }

  fetchBranches(repoUrl: string, repoName: string, page?: number) {
    const url = page
      ? `${DeploymentCenterConstants.githubApiUrl}/repos/${repoName}/branches?per_page=100&page=${page}`
      : `${DeploymentCenterConstants.githubApiUrl}/repos/${repoName}/branches?per_page=100`;

    return this._cacheService.post(Constants.serviceHost + `api/github/passthrough?branch=${repoUrl}&t=${Guid.newTinyGuid()}`, true, null, {
      url,
      authToken: this._wizard.getToken(),
    });
  }

  fetchWorkflowConfiguration(repoUrl: string, repoName: string, branchName: string) {
    const url = `${DeploymentCenterConstants.githubApiUrl}/repos/${repoName}/contents/${this._workflowYmlPath}?ref=${branchName}`;

    return this._cacheService.post(
      Constants.serviceHost + `api/github/passthrough?branch=${repoUrl}/contents/${this._workflowYmlPath}&t=${Guid.newTinyGuid()}`,
      true,
      null,
      {
        url,
        authToken: this._wizard.getToken(),
      }
    );
  }

  commitWorkflowConfiguration(repoName: string, branchName: string, content: any) {
    const url = `${DeploymentCenterConstants.githubApiUrl}/repos/${repoName}/contents/${this._workflowYmlPath}?ref=${branchName}`;

    return this._cacheService.put(Constants.serviceHost + `api/github/workflowAction`, null, {
      url,
      content,
    });
  }
}
