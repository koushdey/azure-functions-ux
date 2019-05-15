import React, { useContext, useEffect } from 'react';
import { ArmObj, Site, ArmArray } from '../../../models/WebAppModels';
import { PortalContext } from '../../../PortalContext';
import { FunctionInfo } from '../../../models/function-model';
import { FunctionsListCommandBar } from './FunctionsListCommandBar';
import FunctionsListContainer from './FunctionsListContainer';

export interface FunctionsListProps {
  site: ArmObj<Site>;
  functions: ArmArray<FunctionInfo>;
  refresh: () => void;
}

const FunctionsList: React.SFC<FunctionsListProps> = props => {
  const { functions, refresh } = props;
  const portalCommunicator = useContext(PortalContext);
  useEffect(() => {
    portalCommunicator.loadComplete();
  }, []);
  return (
    <>
      <FunctionsListCommandBar refresh={refresh} />
      <FunctionsListContainer functions={functions} />
    </>
  );
};

export default FunctionsList;
