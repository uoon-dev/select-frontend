import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@ridi/rsg';

import { Actions } from 'app/services/user';
import { Modal } from 'app/components/Modal';
import { Radio } from 'app/components/Forms/Radio';
import * as styles from 'app/components/OrderHistory/styles';

interface CashReceiptIssueModalProps {
  id: number;
  closeModal: () => void;
}
export const CashReceiptIssueModal: React.FunctionComponent<CashReceiptIssueModalProps> = (props) => {
  const { id, closeModal } = props;

  const [cashReceiptIssueType, setCashReceiptIssueType] = React.useState('INCOME_DEDUCTION')
  const [cashReceiptIssueModalIssueNumber, setCashReceiptIssueModalIssueNumber] = React.useState('');

  const dispatch = useDispatch();

  const handleCashReceiptIssueTypeChange = (e: any) => {
    if (!e.currentTarget.checked) {
      return;
    }
    setCashReceiptIssueModalIssueNumber('');
    setCashReceiptIssueType(e.currentTarget.value);
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
              inputName="cashReceiptIssueType"
              id="cashReceipt_incomeDeduction"
              value="INCOME_DEDUCTION"
              isChecked={cashReceiptIssueType === 'INCOME_DEDUCTION'}
              onChange={handleCashReceiptIssueTypeChange}
              displayName="소득 공제용"
            />
          </li>
          <li css={styles.cashReceiptIssueModalIssueTypeListItem}>
            <Radio
              inputName="cashReceiptIssueType"
              id="cashReceipt_ExpenseEvidence"
              value="EXPENSE_EVIDENCE"
              isChecked={cashReceiptIssueType === 'EXPENSE_EVIDENCE'}
              onChange={handleCashReceiptIssueTypeChange}
              displayName="지출 증빙용"
            />
          </li>
        </ul>
        <p css={styles.cashReceiptIssueModalSubTitle}>발급 번호</p>
        <div css={styles.cashReceiptIssueModalIssueNumberInputWrapper}>
          <input
            type="text"
            css={styles.cashReceiptIssueModalIssueNumberInput}
            placeholder={cashReceiptIssueType === 'INCOME_DEDUCTION' ? '주민등록번호 또는 휴대폰 번호 입력' : '사업자 번호 입력'}
            onChange={(e) => setCashReceiptIssueModalIssueNumber(e.currentTarget.value)}
            value={cashReceiptIssueModalIssueNumber}
          />
        </div>
        <div css={styles.cashReceiptIssueModalIssueButtonWrapper}>
          <Button
            color="blue"
            size="large"
            type="button"
            css={styles.cashReceiptIssueModalIssueButton}
            onClick={() => dispatch(Actions.cashReceiptIssueRequest({
              ticketId: id,
              method: 'POST',
              issuePurpose: cashReceiptIssueType,
              issueNumber: cashReceiptIssueModalIssueNumber,
            }))}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
