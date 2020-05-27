export enum SortOptionValue {
  RECENT = 'recent',
  POPULAR = 'popular',
}

export const SortOptionList = [
  {
    name: '최신순',
    value: SortOptionValue.RECENT,
  },
  {
    name: '인기순',
    value: SortOptionValue.POPULAR,
  },
];

export const DefaultSortOption = SortOptionList[0];

export const ItemCountPerPage = 24;
