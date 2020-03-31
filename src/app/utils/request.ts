import { AxiosResponse } from 'axios';
import * as qs from 'qs';

import history from 'app/config/history';
import { ArticleRequestQueries } from 'app/types';

export function isValidPaginationParameter(paramValue: any) {
  return !isNaN(paramValue) && paramValue > 0;
}

export function fixWrongPaginationScope(response?: AxiosResponse, paramKeyName = 'page') {
  const { config = {}, status } = response!;
  if (!config.params || !config.params[paramKeyName]) {
    return;
  }
  const pageParam = config.params[paramKeyName];
  if ((status === 404 && Number(pageParam) > 1) || Number(pageParam) < 1) {
    history.replace(`?${updateQueryStringParam('page', 1)}`);
  }
}

export function updateQueryStringParam(key: string, value: string | number) {
  return qs.stringify(
    Object.assign(qs.parse(location.search, { ignoreQueryPrefix: true }), { [key]: value }),
  );
}

export function buildArticleRequestQueriesToString(requestQueries?: ArticleRequestQueries): string {
  const queries = [];

  if (requestQueries && requestQueries.includes) {
    queries.push(`include=${requestQueries.includes.join('|')}`);
  }
  if (requestQueries && requestQueries.ordering) {
    queries.push(`ordering=${requestQueries.ordering}`);
  }
  if (requestQueries && requestQueries.type) {
    queries.push(`type=${requestQueries.type}`);
  }
  if (requestQueries && requestQueries.exceptRidiChannel) {
    queries.push('except_ridi=1');
  }

  return queries.length > 0 ? `?${queries.join('&')}` : '';
}
