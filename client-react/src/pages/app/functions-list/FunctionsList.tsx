import React, { useContext, useEffect } from 'react';
import { ArmObj, Site, ArmArray } from '../../../models/WebAppModels';
import { PortalContext } from '../../../PortalContext';
import { FunctionInfo } from '../../../models/function-model';

export interface FunctionsListProps {
  site: ArmObj<Site>;
  functions: ArmArray<FunctionInfo>;
  onFunctionsUpdated: () => void;
}

const FunctionsList: React.SFC<FunctionsListProps> = props => {
  const {} = props;
  const portalCommunicator = useContext(PortalContext);
  useEffect(() => {
    portalCommunicator.loadComplete();
  }, []);
  return <h1>Hello function list again!</h1>;
};

export default FunctionsList;
