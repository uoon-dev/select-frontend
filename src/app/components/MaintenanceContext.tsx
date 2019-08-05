import { ConnectedCompactPageHeader } from 'app/components/CompactPageHeader';
import { ErrorResponseData } from 'app/services/serviceStatus';
import * as React from 'react';

interface MaintenanceContextProps {
  responseData: ErrorResponseData;
}

export const MaintenanceContext: React.FunctionComponent<MaintenanceContextProps> = (props) => {
  const { responseData } = props;

  return (
    <section className="PageMaintenance">
      <ConnectedCompactPageHeader />
      <h2 className="MaintenanceTitle">점검 안내</h2>
      <div className="MaintenanceDescription MaintenanceDescription_Box">
        <h3 className="MaintenanceSubTitle">점검기간</h3>
        <p className="MaintenanceDescription_Text">{responseData.period}</p>
        <h3 className="MaintenanceSubTitle">점검 중 이용이 제한되는 서비스</h3>
        <ul className="MaintenanceDescription_ServiceList">
          {responseData.unavailableService.map((service) => (
            <li className="MaintenanceDescription_ServiceItem">{service}</li>
          ))}
        </ul>
      </div>
      <p className="MaintenanceDescription">
        보다 나은 서비스를 제공해 드리기 위한 시스템 점검으로,
        이용에 불편함을 드리게 된 점 양해 부탁드립니다.<br />
        언제나 편리하고 즐겁게 리디셀렉트를 이용하실 수 있도록
        최선을 다하겠습니다.<br />
        감사합니다.<br />
      </p>
    </section>
  );
};
