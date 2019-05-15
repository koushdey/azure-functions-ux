import React, { useContext } from 'react';
import { IButtonProps, CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../ThemeContext';

// tslint:disable-next-line:member-ordering

// Data for CommandBar
const getItems = (refreshFunctionsList: any, t: (string) => string): ICommandBarItemProps[] => {
  return [
    {
      key: 'create',
      name: t('FunctionsList_CommandBar_Add'),
      iconProps: {
        iconName: 'Add',
      },
    },
    {
      key: 'refresh',
      name: t('FunctionsList_CommandBar_Refresh'),
      iconProps: {
        iconName: 'Refresh',
      },
      onClick: refreshFunctionsList,
    },
    {
      key: 'enable',
      name: t('FunctionsList_CommandBar_Enable'),
      iconProps: {
        iconName: 'Completed',
      },
    },
    {
      key: 'disable',
      name: t('FunctionsList_CommandBar_Disable'),
      iconProps: {
        iconName: 'Blocked',
      },
    },
    {
      key: 'clear',
      name: t('FunctionsList_CommandBar_Delete'),
      iconProps: {
        iconName: 'Delete',
      },
    },
  ];
};
interface FunctionsListCommandBarProps {
  refresh: () => void;
}

export const FunctionsListCommandBar: React.FC<FunctionsListCommandBarProps> = props => {
  const theme = useContext(ThemeContext);
  const { t } = useTranslation();
  const { refresh } = props;

  const customButton = (buttonProps: IButtonProps) => {
    return (
      <CommandBarButton
        {...buttonProps}
        onClick={buttonProps.onClick}
        styles={{
          ...buttonProps.styles,
          root: {
            backgroundColor: theme.semanticColors.bodyBackground,
            border: '1px solid transparent',
          },
          rootDisabled: {
            backgroundColor: theme.semanticColors.bodyBackground,
          },
        }}
      />
    );
  };

  return (
    <CommandBar
      items={getItems(refresh, t)}
      aria-role="nav"
      buttonAs={customButton}
      styles={{
        root: {
          borderBottom: '1px solid rgba(204,204,204,.8)',
          backgroundColor: theme.semanticColors.bodyBackground,
          width: '100%',
        },
      }}
    />
  );
};

export default FunctionsListCommandBar;
