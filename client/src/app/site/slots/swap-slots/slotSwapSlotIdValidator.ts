import { AsyncValidator, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { PortalResources } from './../../../shared/models/portal-resources';
import { AuthzService } from './../../../shared/services/authz.service';
import { SiteService } from './../../../shared/services/site.service';

export class SlotSwapSlotIdValidator implements AsyncValidator {
  constructor(
    private _formGroup: FormGroup,
    private _authZService: AuthzService,
    private _translateService: TranslateService,
    private _siteService: SiteService
  ) {}

  validate(control: FormControl) {
    if (!this._formGroup) {
      throw new Error('FormGroup for validator cannot be null');
    }

    const srcIdCtrl: FormControl = this._formGroup.get('srcId') as FormControl;
    const srcAuthCtrl: FormControl = this._formGroup.get('srcAuth') as FormControl;
    const destIdCtrl: FormControl = this._formGroup.get('destId') as FormControl;
    const destAuthCtrl: FormControl = this._formGroup.get('destAuth') as FormControl;
    const multiPhaseCtrl: FormControl = this._formGroup.get('multiPhase') as FormControl;

    if (!srcIdCtrl || !srcAuthCtrl || !destIdCtrl || !destAuthCtrl || !multiPhaseCtrl) {
      throw new Error('Validator requires FormGroup with the following controls: srcId, srcAuth, destId, destAuth, multiPhase');
    }

    if (control === srcIdCtrl || control === destIdCtrl) {
      const authControl = control === srcIdCtrl ? srcAuthCtrl : destAuthCtrl;
      const resourceId: string = control.value as string;

      if (!resourceId) {
        return Promise.resolve(null);
      } else {
        return new Promise(resolve => {
          Observable.zip(
            this._authZService.hasPermission(resourceId, [AuthzService.writeScope]),
            this._authZService.hasPermission(resourceId, [
              AuthzService.slotswapScope,
              AuthzService.applySlotConfigScope,
              AuthzService.resetSlotConfigScope,
            ]),
            this._authZService.hasReadOnlyLock(resourceId),
            this._siteService.getSiteConfig(resourceId)
          ).subscribe(r => {
            const [hasWritePermission, hasSwapPermission, hasReadOnlyLock, siteConfigResult] = r;

            authControl.setValue(siteConfigResult.isSuccessful ? siteConfigResult.result.properties.siteAuthEnabled : false);

            if (hasSwapPermission && hasWritePermission && !hasReadOnlyLock) {
              resolve(null);
            } else {
              const errors: ValidationErrors = {};
              if (!hasSwapPermission) {
                errors['noSwapPermission'] = this._translateService.instant(PortalResources.noSwapPermission);
              }
              if (!hasWritePermission) {
                errors['noWritePermission'] = this._translateService.instant(PortalResources.noWritePermission);
              }
              if (hasReadOnlyLock) {
                errors['readOnlyLock'] = this._translateService.instant(PortalResources.slotReadOnlyLock);
              }
              resolve(errors);
            }
          });
        });
      }
    } else {
      throw new Error('FormGroup for validator must be parent of FormControl being validated');
    }
  }
}
