import React, { useState, useContext, useEffect } from 'react';
import FunctionKeysData from './FunctionKeys.data';
import { FunctionKeysFormValues } from './FunctionKeys.types';
import { PortalContext } from '../../../../PortalContext';
import LoadingComponent from '../../../../components/loading/loading-component';
import FunctionKeys from './FunctionKeys';

const functionKeysData = new FunctionKeysData();
export const FunctionKeysContext = React.createContext(functionKeysData);

interface FunctionsKeysDataLoaderProps {
  resourceId: string;
}

const FunctionsKeysDataLoader: React.FC<FunctionsKeysDataLoaderProps> = props => {
  const { resourceId } = props;
  const [initialValues, setInitialValues] = useState<FunctionKeysFormValues | null>(null);
  const [refreshLoading, setRefeshLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const portalContext = useContext(PortalContext);

  const refreshData = () => {
    setRefeshLoading(true);
    fetchData();
  };

  const fetchData = async () => {
    const functionKeys = await functionKeysData.fetchKeys(resourceId);

    if (functionKeys.metadata.status === 409) {
      // TODO: [krmitta] read only permission given (WI: TASK 5476044)
    }

    setInitialValues(
      functionKeysData.convertStateToForm({
        keys: functionKeys.metadata.success ? functionKeys.data : null,
      })
    );
    portalContext.loadComplete();
    setInitialLoading(false);
    setRefeshLoading(false);
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initialLoading || !initialValues || refreshLoading) {
    return <LoadingComponent />;
  }

  return (
    <FunctionKeysContext.Provider value={functionKeysData}>
      <FunctionKeys resourceId={resourceId} initialValues={initialValues} refreshData={refreshData} setRefeshLoading={setRefeshLoading} />
    </FunctionKeysContext.Provider>
  );
};

export default FunctionsKeysDataLoader;
