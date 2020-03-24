export * from './coverSize';
export * from './imageSize';

export const MOBILE_MAX_WIDTH = 834;
export const CAROUSEL_MIN_WIDTH = 901;
export const MIN_WIDTH = 835;
export const TOP_BANNER_IMAGE_WIDTH = 432;
export const COUNT_PER_PAGE = 24;
export const ARTICLE_HOME_SECTION_COUNT = 4;
export const ARTICLE_HOME_RECENT_SECTION_COUNT = 8;
export const ARTICLE_HOME_CHART_SECTION_COUNT = 20;
export const ARTICLE_CHART_COUNT = 100;

export enum FetchStatusFlag {
  IDLE,
  FETCHING,
  FETCH_ERROR,
}

export enum FetchErrorFlag {
  UNEXPECTED_BOOK_ID,
  UNEXPECTED_PAGE_PARAMS,
  OUT_OF_PAGINATION_SCOPE,
}

export enum ErrorStatus {
  MAINTENANCE = 'maintenance',
}

export enum ContentsType {
  BOOK = 'book_contents',
  ARTICLE = 'article_contents',
}

export enum PageTitleText {
  PREFIX = '리디셀렉트',
  HOME = '',
  INTRO = '신간도 베스트셀러도 월정액으로 제한없이',
  ERROR = '',
  AVAILABLE_BOOKS = '서비스 도서 목록',
  CATEGORY = '카테고리',
  CHARTS = '인기 도서',
  GUIDE = '이용 방법',
  MANAGE_SUBSCRIPTION = '구독 관리',
  MY_SELECT = '마이 셀렉트',
  MY_SELECT_HISTORY = '도서 이용 내역',
  NEW_RELEASE = '최신 업데이트',
  ORDER_HISTORY = '결제/이용권 내역',
  SETTING = '셀렉트 관리',
  NOT_AVAILABLE_BOOK = '',
  CLOSING_RESERVED_BOOKS = '종료 예정 도서',
  VOUCHER = '리디셀렉트 이용권 등록',

  // 셀렉트 2.0 - 아티클
  ARTICLE_HOME = '아티클 홈',
  ARTICLE_FOLLOWING = '팔로잉',
  ARTICLE_CHANNEL = '전체 채널',
  ARTICLE_FAVORITE = '좋아한 아티클',
  ARTICLE_POPULAR = '인기 아티클',
  ARTICLE_RECENT = '최신 아티클',
}

export enum RoutePaths {
  ROOT = '/',
  HOME = '/home',
  NEW_RELEASE = '/new-releases',
  CHARTS = '/charts',
  COLLECTION = '/selection/:collectionId',
  CATEGORY = '/categories',
  MY_SELECT = '/my-select',
  BOOK_DETAIL = '/book/:bookId',
  SETTING = '/settings',
  MANAGE_SUBSCRIPTION = '/manage-subscription',
  ORDER_HISTORY = '/order-history',
  MY_SELECT_HISTORY = '/my-select-history',
  SEARCH_RESULT = '/search',
  GUIDE = '/article/@ridiselect/5',
  AVAILABLE_BOOKS = '/books',
  INTRO = '/intro',
  NOT_AVAILABLE_BOOK = '/not-available-book',
  CLOSING_RESERVED_BOOKS = '/closing-reserved-book',
  VOUCHER = '/voucher',

  /* 셀렉트 2.0 아티클 */
  ARTICLE_ROOTE = '/article',
  ARTICLE_HOME = '/article/home',
  ARTICLE_FOLLOWING = '/article/following',
  ARTICLE_CHANNELS = '/article/channels',
  ARTICLE_CHANNEL_DETAIL = '/article/channel/@:channelName',
  ARTICLE_FAVORITE = '/article/favorite',
  ARTICLE_CONTENT = '/article/@:channelName/:contentIndex',
  ARTICLE_LIST = '/article/list/:listType',
}
