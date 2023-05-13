/**
 * 包含图标和 index序列的选项，在ProteinSqlPendant中有用到
 */
import SelectionOption from "./SelectionOption";

export default interface IconIndexSelectionOption extends SelectionOption {
    index: number,
    icon: string,
}


