import React, { useState, useEffect } from 'react';
import { ArmObj, Site, ArmArray } from '../../../models/WebAppModels';
import SiteService from '../../../ApiHelpers/SiteService';
import LogService from '../../../utils/LogService';
import LoadingComponent from '../../../components/loading/loading-component';
import FunctionService from '../../../ApiHelpers/FunctionService';
import { FunctionInfo } from '../../../models/function-model';
import { HttpResponseObject } from '../../../ArmHelper.types';
import FunctionsList from './FunctionsList';

export interface FunctionsListDataLoaderProps {
  resourceId: string;
}

const FunctionsListDataLoader: React.SFC<FunctionsListDataLoaderProps> = props => {
  const [site, setSite] = useState<ArmObj<Site> | null>(null);
  const [functions, setFunctions] = useState<ArmArray<FunctionInfo> | null>(null);
  const [initializeData, setInitializeData] = useState(true);

  const resourceId = props.resourceId;
  let siteResponse: HttpResponseObject<ArmObj<Site>>;
  let functionsResponse: HttpResponseObject<ArmArray<FunctionInfo>>;

  const fetchData = async () => {
    if (initializeData) {
      await Promise.all([SiteService.fetchSite(resourceId), FunctionService.fetchFunctions(resourceId)]).then(responses => {
        siteResponse = responses[0];
        functionsResponse = responses[1];

        if (!siteResponse.metadata.success) {
          LogService.error('/FunctionsList', 'fetchSiteFailed', `Failed to get site with id ${siteResponse.data.id}`);
        } else if (!functionsResponse.metadata.success) {
          LogService.error(
            '/FunctionsList',
            'fetchFunctionsFailed',
            `Failed to get functions from site with id ${functionsResponse.data.id}`
          );
        } else {
          setSite(siteResponse.data);
          setFunctions(functionsResponse.data);

          setInitializeData(false);
        }
      });
    }
  };

  const refresh = () => {
    setInitializeData(true);
  };

  useEffect(() => {
    fetchData();
  }, [resourceId, initializeData]);

  if (initializeData) {
    return <LoadingComponent />;
  }

  return <FunctionsList site={site as ArmObj<Site>} functions={functions as ArmArray<FunctionInfo>} refresh={refresh} />;
};

export default FunctionsListDataLoader;
