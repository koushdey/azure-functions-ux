import React from 'react';
import { useTranslation } from 'react-i18next';
import { style } from 'typestyle';
import { ArmObj } from '../../../models/WebAppModels';
import { FunctionInfo } from '../../../models/function-model';
import { DetailsList, IColumn, SelectionMode } from 'office-ui-fabric-react';

interface FunctionsListContainerProps {
  functions: ArmObj<FunctionInfo>[];
}

const containerDivStyle = style({
  padding: '30px',
});

const FunctionsListContainer: React.FC<FunctionsListContainerProps> = props => {
  const { functions } = props;
  const { t } = useTranslation();

  return (
    <div className={containerDivStyle}>
      <DetailsList items={functions.map(func => func.properties)} columns={getColumns(t)} selectionMode={SelectionMode.multiple} />
    </div>
  );
};

const getColumns = (t: (string) => string): IColumn[] => {
  return [
    {
      key: 'name',
      name: t('nameRes'),
      fieldName: 'name',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      data: 'string',
      isPadded: true,
      isResizable: true,
    },
  ];
};

export default FunctionsListContainer;
