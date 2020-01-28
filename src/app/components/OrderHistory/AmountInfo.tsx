import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Button } from '@ridi/rsg';

import toast from 'app/utils/toast';
import { RidiSelectState } from 'app/store';
import { Actions } from 'app/services/user';
import { Ticket } from 'app/services/user/requests';
import { CashReceiptIssueModal } from './CashReceiptIssueModal';

interface OrderHistoryListAmountInfoProps {
  payment: Ticket;
  ButtonExists: boolean;
}

export const OrderHistoryListAmountInfo: React.FunctionComponent<OrderHistoryListAmountInfoProps> = (props) => {
  const { ButtonExists, payment } = props;
  const { isFreePromotion, formattedPrice, voucherCode, isCancellable, id, ticketIdsToBeCanceledWith, isCashReceiptIssuable, cashReceiptUrl } = payment;

  const orderHistory = useSelector((state: RidiSelectState) => state.user.purchaseHistory);
  const subscriptionState = useSelector((state: RidiSelectState) => state.user.subscription);

  const dispatch = useDispatch();

  const [cashReceiptIssuePopupActive, setCashReceiptIssuePopupActive] = React.useState(false);

  const handleCancelPurchaseButtonClick = () => {
    if (orderHistory.isCancelFetching) {
      toast.failureMessage('취소 진행중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }
    const comfirmMessageBlocks = [];

    if (subscriptionState && subscriptionState.isSubscribedWithOldPrice) {
      comfirmMessageBlocks.push(`\n결제 금액이 인상되어 결제 취소 이후\n월 ${subscriptionState.formattedNewMonthlyPayPrice}이 적용됩니다.`);
    }
    if (ticketIdsToBeCanceledWith.length > 0) {
      comfirmMessageBlocks.push(`${comfirmMessageBlocks.length > 0 ? '\n\n' : '\n'}미사용된 이용권이 함께 취소되며 이용권은 유효기간 내에 다시 등록 가능합니다.`);
    }
    if (comfirmMessageBlocks.length <= 0) {
      comfirmMessageBlocks.push('\n결제를 취소할 경우 즉시 이용할 수 없습니다.');
    }

    if (confirm(`결제를 취소하시겠습니까?${comfirmMessageBlocks.join('')}`)) {
      dispatch(Actions.cancelPurchaseRequest({ purchaseId: id }))
    }
  }

  return (
    <>
      <p className="Ordered_Amount">
        {isFreePromotion
          ? '무료'
          : voucherCode ? '' : formattedPrice}
      </p>
      {ButtonExists ? (
        <div className="OrderHistoryButtons">
          {isCancellable ? (
            <Button
              className="CancelOrderButton"
              color="gray"
              outline={true}
              onClick={handleCancelPurchaseButtonClick}
              size="medium"
            >
              결제 취소
            </Button>
          ) : null}
          {isCashReceiptIssuable ? (
            cashReceiptUrl ? (
              <>
                <Button
                  className="CashReceiptCancel_Button"
                  color="gray"
                  outline={true}
                  size="medium"
                  onClick={() => {
                    if (orderHistory.isCashReceiptIssueFetching) {
                      return;
                    }
                    dispatch(Actions.cashReceiptIssueRequest({
                      ticketId: id,
                      method: 'DELETE',
                    }));
                  }}
                >
                  발급 취소
                </Button><br/>
                <Button
                  className="CashReceiptPrint_Button"
                  color="gray"
                  outline={true}
                  size="medium"
                >
                  영수증 인쇄
                </Button>
              </>
            ) : (
              <Button
                className="CashReceiptIssue_Button"
                color="gray"
                outline={true}
                onClick={() => setCashReceiptIssuePopupActive(true)}
                size="medium"
              >
                영수증 발급
              </Button>
            )
          ) : null}
        </div>
      ) : null}
      {cashReceiptIssuePopupActive ? (
        <CashReceiptIssueModal
          id={id}
          closeModal={() => setCashReceiptIssuePopupActive(false)}
        />
      ) : null}
    </>
  );
}
