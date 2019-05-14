import React from 'react';

export interface FunctionsListDataLoaderProps {
  resourceId: string;
}

class FunctionsListDataLoader extends React.Component<FunctionsListDataLoaderProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return <h1>Hello functions list!</h1>;
  }
}

export default FunctionsListDataLoader;
