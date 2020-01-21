import React from 'react';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';


import { FetchStatusFlag, MAX_WIDTH, PageTitleText } from 'app/constants';
import { ConnectedPageHeader, HelmetWithTitle, Pagination } from 'app/components';
import { SubscriptionListPlaceholder } from 'app/placeholder/SubscriptionListPlaceholder';

import { RidiSelectState } from 'app/store';
import { getPageQuery } from 'app/services/routing/selectors';
import { Actions as CommonUIActions } from 'app/services/commonUI';
import { OrderHistoryList } from 'app/components/OrderHistory/List';
import { Actions, PurchaseHistory, SubscriptionState } from 'app/services/user';

interface OrderStateProps {
  orderHistory: PurchaseHistory;
  subscriptionFetchStatus: FetchStatusFlag;
  subscriptionState?: SubscriptionState | null;
  page: number;
}

type Props = OrderStateProps & ReturnType<typeof mapDispatchToProps>;

export class OrderHistory extends React.PureComponent<Props> {
  private isFetched = (page: number) => {
    const { orderHistory } = this.props;
    return (
      !!orderHistory.itemListByPage[page] &&
      orderHistory.itemListByPage[page].fetchStatus !== FetchStatusFlag.FETCHING
    );
  }

  public componentDidMount() {
    const {
      dispatchLoadOrderHistory,
      dispatchUpdateGNBTabExpose,
      dispatchLoadSubscriptionRequest,
      subscriptionState,
      page,
    } = this.props;

    if (!this.isFetched(page)) {
      dispatchLoadOrderHistory(page);
    }

    if (!subscriptionState) {
      dispatchLoadSubscriptionRequest();
    }

    dispatchUpdateGNBTabExpose(false);
  }

  public shouldComponentUpdate(nextProps: Props) {
    if (nextProps.page !== this.props.page) {
      const { dispatchLoadOrderHistory, page } = nextProps;

      if (!this.isFetched(page)) {
        dispatchLoadOrderHistory(page);
      }
    }
    return true;
  }

  public componentWillUnmount() {
    this.props.dispatchClearPurchases();
    this.props.dispatchUpdateGNBTabExpose(true);
  }

  public render() {
    const { page, orderHistory, subscriptionFetchStatus } = this.props;

    const itemCount: number = orderHistory.itemCount ? orderHistory.itemCount : 0;
    const itemCountPerPage = 10;
    return (
      <main
        className={classNames(
          'SceneWrapper',
          'PageOrderHistory',
        )}
      >
        <HelmetWithTitle titleName={PageTitleText.ORDER_HISTORY} />
        <ConnectedPageHeader pageTitle={PageTitleText.ORDER_HISTORY} />
        {(
          !this.isFetched(page) ||
          subscriptionFetchStatus === FetchStatusFlag.FETCHING ||
          isNaN(page)
        ) ?
          <SubscriptionListPlaceholder />
          : (
            <>
              <OrderHistoryList
                page={this.props.page}
              />
              {itemCount > 0 &&
                <>
                  <MediaQuery maxWidth={MAX_WIDTH}>
                    {(isMobile) => <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(itemCount / itemCountPerPage)}
                      isMobile={isMobile}
                      item={{
                        el: Link,
                        getProps: (p): LinkProps => ({
                          to: `/order-history?page=${p}`,
                        }),
                      }}
                    />}
                  </MediaQuery>
                  <ul className="NoticeList">
                    <li className="NoticeItem">결제 취소는 결제일로부터 7일 이내 이용권 대상 도서를 1권 이상 다운로드하지 않는 경우에만 가능합니다.</li>
                    <li className="NoticeItem">결제 취소 시 리디셀렉트 구독이 자동으로 해지됩니다.</li>
                  </ul>
                </>
              }
            </>
          )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): OrderStateProps => ({
  orderHistory: rootState.user.purchaseHistory,
  subscriptionFetchStatus: rootState.user.subscriptionFetchStatus,
  subscriptionState: rootState.user.subscription,
  page: getPageQuery(rootState),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchLoadOrderHistory: (page: number) => dispatch(Actions.loadPurchasesRequest({ page })),
  dispatchLoadSubscriptionRequest: () => dispatch(Actions.loadSubscriptionRequest()),
  dispatchClearPurchases: () => dispatch(Actions.clearPurchases()),
  dispatchCancelPurchase: (purchaseId: number) => dispatch(Actions.cancelPurchaseRequest({ purchaseId })),
  dispatchUpdateGNBTabExpose: (isGnbTab: boolean) => dispatch(CommonUIActions.updateGNBTabExpose({ isGnbTab })),
});

export const ConnectedOrderHistory = connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
