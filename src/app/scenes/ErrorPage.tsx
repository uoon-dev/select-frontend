import * as React from 'react';
import { connect } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ErrorContext } from 'app/components/ErrorContext';
import { MaintenanceContext } from 'app/components/MaintenanceContext';
import { ErrorStatus, PageTitleText } from 'app/constants';
import { Actions as ServiceStatusActions, ErrorResponseData, ErrorResponseStatus } from 'app/services/serviceStatus';
import { RidiSelectState } from 'app/store';

interface ErrorPageStateProps {
  responseState?: ErrorResponseStatus;
  responseData?: ErrorResponseData;
}

type Props = ErrorPageStateProps & ReturnType<typeof mapDispatchToProps>;

export class ErrorPage extends React.Component<Props> {
  private getMaintenanceData() {
    const { responseData, requestMaintenanceData } = this.props;
    if (
      !responseData ||
      responseData.status !== ErrorStatus.MAINTENANCE ||
      (responseData.period && responseData.unavailableService)
    ) {
      return;
    }
    requestMaintenanceData();
  }
  public componentDidMount() {
    if (window.inApp && window.inApp.initialRendered) {
      window.inApp.initialRendered();
    }
    this.getMaintenanceData();
  }

  public componentWillUpdate() {
    this.getMaintenanceData();
  }

  public render() {
    const {
      responseState,
      responseData,
      resetErrorState,
    } = this.props;

    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.ERROR} />
        {responseData && responseData.period && responseData.unavailableService ?
          <MaintenanceContext responseData={responseData} /> :
          <ErrorContext responseState={responseState} resetErrorState={resetErrorState} />
        }
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): ErrorPageStateProps => {
  return {
    responseState: state.serviceStatus.errorResponseState,
    responseData: state.serviceStatus.errorResponseData,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    resetErrorState: () => dispatch(ServiceStatusActions.resetState()),
    requestMaintenanceData: () => dispatch(ServiceStatusActions.loadMaintenanceData()),
  };
};

export const ConnectedErrorPage = connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
