import { Empty } from '@ridi/rsg';
import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { OrderHistoryListInfo } from 'app/components/OrderHistory/Info';
import { OrderHistoryListAmountInfo } from 'app/components/OrderHistory/AmountInfo';
import { getIsMobile } from 'app/services/commonUI/selectors';

interface OrderHistoryListProps {
  page: number;
}

export const OrderHistoryList: React.FunctionComponent<OrderHistoryListProps> = props => {
  const { page } = props;
  const isMobile = useSelector(getIsMobile);
  const orderHistory = useSelector((state: RidiSelectState) => state.user.purchaseHistory);
  const { itemList } = orderHistory.itemListByPage[page];

  if (!itemList || itemList.length === 0) {
    return <Empty description="결제/이용권 내역이 없습니다." iconName="book_1" />;
  }
  return (
    <ul className="OrderHistoryList">
      {itemList.map(item => (
        <li
          className={classNames({
            OrderHistoryItem: true,
            'OrderHistoryItem-canceled': item.isCanceled,
          })}
          key={item.id}
        >
          {isMobile ? (
            <>
              <div className="OrderHistoryItem_Info">
                <OrderHistoryListInfo payment={item} />
              </div>
              <div className="OrderHistoryItem_AmountInfo">
                <OrderHistoryListAmountInfo payment={item} />
              </div>
            </>
          ) : (
            <>
              <OrderHistoryListInfo payment={item} />
              <OrderHistoryListAmountInfo payment={item} />
            </>
          )}
        </li>
      ))}
    </ul>
  );
};
