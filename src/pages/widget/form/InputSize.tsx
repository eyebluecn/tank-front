import React, { useState } from 'react';
import { InputNumber, InputNumberProps, Select, Space, Tag } from 'antd';
import Lang from '../../../common/model/global/Lang';
import FileUtil, { Unit } from '../../../common/util/FileUtil';
import Color from '../../../common/model/base/option/Color';

const InputSize = ({
  defaultValue,
  value,
  onChange,
  ...otherProps
}: InputNumberProps<number>) => {
  const v = value ?? defaultValue;
  const [num, setNum] = useState<number | undefined>(
    v ? FileUtil.bytesToNumUnitTuple(v)[0] : undefined
  );
  const [unit, setUnit] = useState<Unit>(
    v ? FileUtil.bytesToNumUnitTuple(v)[1] ?? 'GB' : 'GB'
  );

  const renderAfter = () => {
    return (
      <Select
        value={unit}
        disabled={otherProps.disabled}
        onChange={handleChangeUnit}
      >
        {FileUtil.sizeUnits.map((u) => (
          <Select.Option key={u} value={u}>
            {u}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const change = (unit: Unit, num?: number) => {
    if (!num) {
      onChange?.(0);
    }
    onChange?.(num === -1 ? -1 : num! * FileUtil.unitToBytes(unit));
  };

  const handleChangeNum = (value: number) => {
    setNum(value);
    change(unit, value);
  };

  const handleChangeUnit = (u: Unit) => {
    setUnit(u);
    change(u, num);
  };

  return (
    <Space>
      <InputNumber
        value={num}
        addonAfter={renderAfter()}
        min={-1}
        precision={0}
        onChange={handleChangeNum}
        {...otherProps}
      />
      {num === -1 && (
        <Tag color={Color.PRIMARY}>{Lang.t('preference.noLimit')}</Tag>
      )}
    </Space>
  );
};

export default InputSize;
