import * as React from 'react';
import { connect } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ErrorContext } from 'app/components/ErrorContext';
import { MaintenanceContext } from 'app/components/MaintenanceContext';
import { ErrorStatus, FetchStatusFlag, PageTitleText } from 'app/constants';
import { Actions as ServiceStatusActions, ErrorResponseData, ErrorResponseStatus } from 'app/services/serviceStatus';
import { RidiSelectState } from 'app/store';

interface ErrorPageStateProps {
  fetchStatus: FetchStatusFlag;
  responseState?: ErrorResponseStatus;
  responseData?: ErrorResponseData;
}

type Props = ErrorPageStateProps & ReturnType<typeof mapDispatchToProps>;

export class ErrorPage extends React.Component<Props> {
<<<<<<< HEAD
<<<<<<< HEAD
  public componentWillUpdate(nextProps: Props) {
=======
  public componentDidMount() {
    if (window.inApp && window.inApp.initialRendered) {
      window.inApp.initialRendered();
    }
  }

  public componentDidUpdate() {
=======
  private getMaintenanceData() {
>>>>>>> 1cd7539... maintenance 대응 수정.
    const { responseData, requestMaintenanceData } = this.props;
>>>>>>> e128b87... error page 에서 인앱 셀렉트 초기 로딩 해지해주는 부분 누락된 것 추가.
    if (
      !nextProps.responseData ||
      nextProps.responseData.status !== ErrorStatus.MAINTENANCE ||
      (nextProps.responseData.period && nextProps.responseData.unavailableService)
    ) {
      return;
    }
    nextProps.requestMaintenanceData();
  }

  private renderErrorContent() {
    const {
      fetchStatus,
      responseState,
      responseData,
      resetErrorState,
    } = this.props;

    if (fetchStatus === FetchStatusFlag.FETCHING) {
      return null;
    }
    return responseData && responseData.period && responseData.unavailableService ? (
        <MaintenanceContext responseData={responseData} />
     ) : (
      <ErrorContext responseState={responseState} resetErrorState={resetErrorState} />
    );
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
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.ERROR} />
        {this.renderErrorContent()}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): ErrorPageStateProps => {
  return {
    fetchStatus: state.serviceStatus.fetchStatus,
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
