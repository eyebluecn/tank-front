import React from 'react';
import './StringsPicker.less';
import { Input, Tag, Tooltip } from 'antd';
import TankComponent from '../../common/component/TankComponent';
import SafeUtil from '../../common/util/SafeUtil';

interface IProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  editable?: boolean;
}

interface IState {
  tags: string[];
  inputVisible: boolean;
  inputValue: string;
}

/**
 * 这个控件可以填充一组字符串，同时具备回填的能力。
 * 格式为 json list 的字符串形式
 */
export default class StringsPicker extends TankComponent<IProps, IState> {
  innerValue: string | null = null;

  inputDom: any = null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      tags: [],
      inputVisible: false,
      inputValue: '',
    };
  }

  componentDidMount() {
    //刷新一下列表
    let that = this;

    this.fillBack();
  }

  componentWillReceiveProps(
    nextProps: Readonly<IProps>,
    nextContext: any
  ): void {
    let that = this;

    //每次刷新都尝试去回填。
    if (nextProps.value != this.innerValue) {
      that.fillBack(nextProps.value);
    }
  }

  //回填
  fillBack(selectedValue?: string | null) {
    let that = this;

    if (!selectedValue) {
      selectedValue = this.props.value;
    }

    let arr: string[] = [];
    if (selectedValue) {
      try {
        arr = JSON.parse(selectedValue);
      } catch (e) {
        arr = [];
      }
      that.setState({ tags: arr });
    }

    this.setState({
      tags: arr,
    });
  }

  handleClose(removedTag: string) {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);

    this.setState({ tags });

    this.innerValue = JSON.stringify(tags);
    //往外通知
    SafeUtil.safeCallback(this.props.onChange)(this.innerValue);
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.inputDom.focus());
  };

  handleInputChange(e: any) {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });

    this.innerValue = JSON.stringify(tags);

    //往外通知
    SafeUtil.safeCallback(this.props.onChange)(this.innerValue);
  };

  /**
   * 由于Select控件具有内部自动搜索的能力，因此value要用nickname,realname,no的拼接
   */
  render() {
    let tags: string[] = this.state.tags;
    let inputVisible: boolean = this.state.inputVisible;
    let inputValue: string = this.state.inputValue;

    let editable: boolean = true;
    if (this.props.editable !== undefined) {
      editable = this.props.editable;
    }

    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag
              key={tag}
              closable={editable}
              onClose={() => this.handleClose(tag)}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && editable && (
          <Input
            ref={(dom) => {
              this.inputDom = dom;
            }}
            type="text"
            size="small"
            style={{ width: 120 }}
            value={inputValue}
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && editable && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            添加
          </Tag>
        )}
      </div>
    );
  }
}
