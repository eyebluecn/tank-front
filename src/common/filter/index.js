import * as numberFilters from './number'
import * as timeFilters from './time'
import * as strFilters from './str'
import * as validateFilters from './validate'


export default {...numberFilters, ...timeFilters, ...strFilters, ...validateFilters}


