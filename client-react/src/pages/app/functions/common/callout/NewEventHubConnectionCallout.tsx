import React, { useState } from 'react';
import { NewConnectionCalloutProps } from './Callout.properties';
import { useTranslation } from 'react-i18next';
import EventHubPivotDataLoader from './eventHubPivot/EventHubPivotDataLoader';
import IoTHubPivotDataLoader from './iotHubPivot/IoTHubPivotDataLoader';
import CustomPivot from './customPivot/CustomPivot';
import RadioButtonNoFormik from '../../../../../components/form-controls/RadioButtonNoFormik';
import { paddingSidesStyle } from './Callout.styles';

enum RadioState {
  eventHub = 'eventHub',
  iotHub = 'iotHub',
  custom = 'custom',
}

const NewEventHubConnectionCallout: React.SFC<NewConnectionCalloutProps> = props => {
  const { t } = useTranslation();
  const [radioState, setRadioState] = useState<RadioState>(RadioState.eventHub);

  return (
    <div style={paddingSidesStyle}>
      <RadioButtonNoFormik
        id="event-hub-connection-callout-options"
        ariaLabelledBy={`event-hub-connection-callout-options-label`}
        selectedKey={radioState}
        options={[
          {
            key: RadioState.eventHub,
            text: t('eventHubPicker_eventHub'),
          },
          {
            key: RadioState.iotHub,
            text: t('eventHubPicker_IOTHub'),
          },
          {
            key: RadioState.custom,
            text: t('resourceCallout_customAppSetting'),
          },
        ]}
        onChange={(o, e) => e && setRadioState(e.key as RadioState)}
      />
      {radioState === RadioState.eventHub && <EventHubPivotDataLoader {...props} />}
      {radioState === RadioState.iotHub && <IoTHubPivotDataLoader {...props} />}
      {radioState === RadioState.custom && <CustomPivot {...props} />}
    </div>
  );
};

export default NewEventHubConnectionCallout;
