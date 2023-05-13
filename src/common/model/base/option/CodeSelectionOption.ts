/**
 * 带有Code的一个selection
 */
import SelectionOption from "./SelectionOption";

export default interface CodeSelectionOption extends SelectionOption {
    code: string,
    type: string,
}
