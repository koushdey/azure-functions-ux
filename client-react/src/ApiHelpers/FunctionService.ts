import { ArmArray } from './../models/WebAppModels';
import { FunctionInfo } from '../models/function-model';
import MakeArmCall from './ArmHelper';
import { CommonConstants } from '../utils/CommonConstants';

export default class FunctionService {
  public static fetchFunctions = (resourceId: string) => {
    const id = `${resourceId}/functions`;

    return MakeArmCall<ArmArray<FunctionInfo>>({
      resourceId: id,
      commandName: 'FetchFunctions',
      apiVersion: CommonConstants.ApiVersions.websiteApiVersion20181101,
    });
  };
}
