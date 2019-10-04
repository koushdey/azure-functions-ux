import React, { useContext } from 'react';
import { ICommandBarItemProps, CommandBar, IDetailsListProps } from 'office-ui-fabric-react';
import { ThemeContext } from '../../ThemeContext';
import { commandBarStyles } from './DisplayTableWithCommandBar.style';
import DisplayTableCommandBarButton from './DisplayTableCommandBarButton';
import DisplayTableWithEmptyMessage, {
  DisplayTableWithEmptyMessageProps,
} from '../DisplayTableWithEmptyMessage/DisplayTableWithEmptyMessage';

interface DisplayTableWithCommandBarProps {
  commandBarItems?: ICommandBarItemProps[];
  loading?: boolean;
}

type Props = DisplayTableWithEmptyMessageProps & DisplayTableWithCommandBarProps & IDetailsListProps;
const DisplayTableWithCommandBar: React.SFC<Props> = props => {
  const { commandBarItems, loading } = props;
  const theme = useContext(ThemeContext);

  return (
    <>
      {commandBarItems && (
        <CommandBar items={commandBarItems} aria-role="nav" styles={commandBarStyles(theme)} buttonAs={DisplayTableCommandBarButton} />
      )}
      {props.children}
      <DisplayTableWithEmptyMessage loading={loading} {...props} />
    </>
  );
};

export default DisplayTableWithCommandBar;
