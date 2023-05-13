import SelectionOption from '../base/option/SelectionOption';

enum ShareExpireOption {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  INFINITY = 'INFINITY',
}

interface ShareExpireSelection extends SelectionOption {
  deltaMillisecond: number;
}

const ShareExpireOptions: ShareExpireOption[] = Object.keys(
  ShareExpireOption
).map((k) => k as ShareExpireOption);

const ShareExpireOptionMap: {
  [key in keyof typeof ShareExpireOption]: ShareExpireSelection;
} = {
  HOUR: {
    name: 'share.hour',
    value: 'HOUR',
    deltaMillisecond: 60 * 60 * 1000,
  },
  DAY: {
    name: 'share.day',
    value: 'DAY',
    deltaMillisecond: 24 * 60 * 60 * 1000,
  },
  WEEK: {
    name: 'share.week',
    value: 'WEEK',
    deltaMillisecond: 7 * 24 * 60 * 60 * 1000,
  },
  MONTH: {
    name: 'share.month',
    value: 'MONTH',
    deltaMillisecond: 30 * 24 * 60 * 60 * 1000,
  },
  YEAR: {
    name: 'share.year',
    value: 'YEAR',
    deltaMillisecond: 365 * 24 * 60 * 60 * 1000,
  },
  INFINITY: {
    name: 'share.infinity',
    value: 'INFINITY',
    deltaMillisecond: 0,
  },
};

let ShareExpireOptionList: ShareExpireSelection[] = [];
ShareExpireOptions.forEach((type: ShareExpireOption) => {
  ShareExpireOptionList.push(ShareExpireOptionMap[type]);
});

export { ShareExpireOption, ShareExpireOptionMap, ShareExpireOptionList };
