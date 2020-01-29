import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@ridi/rsg';

import { Actions, CashReceiptIssueType } from 'app/services/user';
import { Modal } from 'app/components/Modal';
import { Radio } from 'app/components/Forms/Radio';
import * as styles from 'app/components/OrderHistory/styles';
import toast from 'app/utils/toast';
import { RidiSelectState } from 'app/store';

interface CashReceiptIssueModalProps {
  id: number;
  closeModal: () => void;
}
export const CashReceiptIssueModal: React.FunctionComponent<CashReceiptIssueModalProps> = (props) => {
  const { id, closeModal } = props;

  const isIssueFetching = useSelector((state: RidiSelectState) => state.user.purchaseHistory.isCashReceiptIssueFetching);

  const [IssueType, setIssueType] = React.useState(CashReceiptIssueType.INCOME_DEDUCTION)
  const [IssueNumber, setIssueNumber] = React.useState('');

  const dispatch = useDispatch();

  const handleIssueTypeChange = (e: any) => {
    if (!e.currentTarget.checked) {
      return;
    }
    setIssueNumber('');
    setIssueType(e.currentTarget.value);
  }

  const submitCashReceiptIssueRequest = () => {
    if (isIssueFetching) {
      return;
    }

    if (!IssueNumber || IssueNumber.length <= 0) {
      toast.failureMessage('번호를 확인해주세요.');
      return;
    }

    dispatch(Actions.cashReceiptIssueRequest({
      ticketId: id,
      method: 'POST',
      issuePurpose: IssueType,
      issueNumber: IssueNumber,
    }));
  }

  return (
    <Modal
      title="현금영수증 발급 신청"
      onClose={closeModal}
    >
      <div css={styles.cashReceiptIssueModalWrapper}>
        <p css={styles.cashReceiptIssueModalSubTitle}>발행 용도</p>
        <ul css={styles.cashReceiptIssueModalIssueTypeList}>
          <li css={styles.cashReceiptIssueModalIssueTypeListItem}>
            <Radio
              inputName="IssueType"
              id="cashReceipt_incomeDeduction"
              value={CashReceiptIssueType.INCOME_DEDUCTION}
              isChecked={IssueType === CashReceiptIssueType.INCOME_DEDUCTION}
              onChange={handleIssueTypeChange}
              displayName="소득 공제용"
            />
          </li>
          <li css={styles.cashReceiptIssueModalIssueTypeListItem}>
            <Radio
              inputName="IssueType"
              id="cashReceipt_ExpenseEvidence"
              value={CashReceiptIssueType.EXPENSE_EVIDENCE}
              isChecked={IssueType === CashReceiptIssueType.EXPENSE_EVIDENCE}
              onChange={handleIssueTypeChange}
              displayName="지출 증빙용"
            />
          </li>
        </ul>
        <p css={styles.cashReceiptIssueModalSubTitle}>발급 번호</p>
        <div css={styles.cashReceiptIssueModalIssueNumberInputWrapper}>
          <input
            type="number"
            css={styles.cashReceiptIssueModalIssueNumberInput}
            placeholder={IssueType === CashReceiptIssueType.INCOME_DEDUCTION ? '주민등록번호 또는 휴대폰 번호 입력' : '사업자 번호 입력'}
            onChange={(e) => setIssueNumber(e.currentTarget.value)}
            value={IssueNumber}
          />
        </div>
        <div css={styles.cashReceiptIssueModalIssueButtonWrapper}>
          <Button
            color="blue"
            size="large"
            type="button"
            css={styles.cashReceiptIssueModalIssueButton}
            onClick={submitCashReceiptIssueRequest}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
