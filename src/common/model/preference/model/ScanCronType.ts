import SelectionOption from "../../base/option/SelectionOption";

enum ScanCronType {
  TEN_SECONDS = "TEN_SECONDS",
  THIRTY_SECONDS = "THIRTY_SECONDS",
  MINUTE = "MINUTE",
  HOUR = "HOUR",
  CUSTOM = "CUSTOM",
}

const ScanCronTypes: ScanCronType[] = Object.keys(ScanCronType).map(
  (k) => k as ScanCronType
);

const ScanCronTypeMap: { [key in keyof typeof ScanCronType]: SelectionOption } = {
  TEN_SECONDS: {
    name: "每十秒",
    value: "@every 10s",
  },
  THIRTY_SECONDS: {
    name: "每三十秒",
    value: "@every 30s",
  },
  MINUTE: {
    name: "每分钟",
    value: "@every 1m",
  },
  HOUR: {
    name: "每小时",
    value: "0 * * * *",
  },
  CUSTOM: {
    name: "自定义",
    value: "CUSTOM",
  },
};

const ScanCronTypeList: SelectionOption[] = [];
ScanCronTypes.forEach((type: ScanCronType) => {
  ScanCronTypeList.push(ScanCronTypeMap[type]);
});

const ScanCronTypeValueList: string[] = [];
ScanCronTypes.forEach((type: ScanCronType) => {
  ScanCronTypeValueList.push(ScanCronTypeMap[type].value);
});

export { ScanCronType, ScanCronTypeMap, ScanCronTypeList, ScanCronTypeValueList };
