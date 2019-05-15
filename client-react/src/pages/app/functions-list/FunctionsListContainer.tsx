import React from 'react';
// import { useTranslation } from 'react-i18next';
import { style } from 'typestyle';
import { ArmArray } from '../../../models/WebAppModels';
import { FunctionInfo } from '../../../models/function-model';

interface FunctionsListContainerProps {
  functions: ArmArray<FunctionInfo>;
}

const containerDivStyle = style({
  padding: '30px',
});

const FunctionsListContainer: React.FC<FunctionsListContainerProps> = props => {
  // const { functions } = props;
  // const { t } = useTranslation();

  return (
    <div className={containerDivStyle}>
      <h1>Hello function list from the container!</h1>
    </div>
  );
};

export default FunctionsListContainer;
