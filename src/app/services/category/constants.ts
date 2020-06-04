export enum SortOptionValue {
  POPULAR = 'popular',
  RECENT = 'recent',
}

export const SortOptionList = [
  {
    name: '인기순',
    value: SortOptionValue.POPULAR,
  },
  {
    name: '최신순',
    value: SortOptionValue.RECENT,
  },
];

export const DefaultSortOption = SortOptionList[0];

export const ItemCountPerPage = 24;
