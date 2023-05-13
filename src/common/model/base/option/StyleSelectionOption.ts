/**
 * 下拉筛选框的选项，统一使用该接口，同时这个作为枚举的复杂类型。
 */
import SelectionOption from "./SelectionOption";

export default interface StyleSelectionOption extends SelectionOption {
    style: string,
}
