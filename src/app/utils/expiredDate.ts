import addMonths from 'date-fns/addMonths';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import endOfMonth from 'date-fns/endOfMonth';
import isWithinInterval from 'date-fns/isWithinInterval';
import parseISO from 'date-fns/parseISO';
import startOfMonth from 'date-fns/startOfMonth';

export function getNotAvailableConvertDateDiff(BookEndDate: string, NextBillDate?: string) {
  const currentDate = new Date();
  const bookEndDate = parseISO(BookEndDate);
  return differenceInDays(bookEndDate, currentDate);
}

export function getNotAvailableConvertDate(BookEndDate: string, NextBillDate?: string) {
  const currentDate = new Date();
  let differenceMinutes: number = differenceInMinutes(new Date(BookEndDate), currentDate);

  if (NextBillDate) {
    const endDate: Date = parseISO(NextBillDate);
    differenceMinutes = differenceInMinutes(endDate, currentDate);
    // TODO: 다음 결제일 인자를 받은 경우 처리 추가 필요.
  }

  if (getNotAvailableConvertDateDiff(BookEndDate) <= 0) {
    return '이용 불가 도서';
  }

  // 1일: 1440분, 1시간: 60분
  const expiredDays = Math.floor(differenceMinutes / 1440);
  const expiredHours = Math.floor((differenceMinutes % 1440) / 60);
  const expiredMinutes = Math.floor((differenceMinutes % 1440) % 60);

  const expiredDate = `${expiredDays}일 ${expiredHours}시간 ${expiredMinutes}분 남음`;

  return expiredDate;
}

export function isInNotAvailableConvertList(bookEndDate: string) {
  const currentDateObj = new Date();
  const bookEndDateObj = new Date(bookEndDate);

  const startOfCurrentMonth = startOfMonth(currentDateObj);
  const endOfNextMonth = endOfMonth(addMonths(currentDateObj, 1));

  return isWithinInterval(bookEndDateObj, { start: startOfCurrentMonth, end: endOfNextMonth });
}
