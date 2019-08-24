let FilterType = {
  //用于boolean筛选
  CHECK: 'CHECK',
  //用于文本输入筛选
  INPUT: 'INPUT',
  //用于排序字段筛选
  SORT: 'SORT',
  //用于有限的状态筛选
  SELECTION: 'SELECTION',
  //用于从有限的状态中选出多项，比如：status = RUNNING or status = STOP
  MULTI_SELECTION: 'MULTI_SELECTION',
  //用于Pager筛选。要求一页能够展示完的那种。
  HTTP_SELECTION: 'HTTP_SELECTION',
  //用于输入框从远程筛选。
  HTTP_INPUT_SELECTION: 'HTTP_INPUT_SELECTION',
  //用于按照时间筛选,生成的时间格式是 yyyy-MM-dd HH:mm:ss
  DATE_TIME_SELECTION: 'DATE_TIME_SELECTION',
  //用于按照日期筛选,生成的时间格式是 yyyy-MM-dd
  DATE_SELECTION: 'DATE_SELECTION'

}

export {FilterType}
