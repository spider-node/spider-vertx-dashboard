/**
 * 生成 proForm 的 input 项
 * @param {String} prop 属性
 * @param {String} label 标签
 * @param {Object} extra
 * @returns
 */
export const useInputField = (prop, label, extra) => {
  if (typeof prop === 'string') {
    return {
      label,
      prop,
      component: 'el-input',
      ...extra,
      componentAttrs: {
        placeholder: `请输入${label}`,
        clearable: true,
        ...extra?.componentAttrs,
      },
    };
  } if (typeof prop === 'object') {
    return prop;
  }
  return {};
};

/**
 *
 * @param {Boolean} noEmptyOption
 * @param {Array} options
 * @returns
 */
function getOptions(noEmptyOption, options) {
  const emptyOption = { label: '全部', value: null };
  if (!noEmptyOption) {
    return [...options, emptyOption];
  }
  return options;
}

/**
 * 生成 proForm 的 select 项
 * @param {String} prop 属性
 * @param {String} label 标签
 * @param {Object} extra
 * @returns
 */
export const useSelectField = (prop, label, extra) => {
  if (typeof prop === 'string') {
    const {
      noEmptyOption, options, componentAttrs = {}, ...rest
    } = extra;
    const transformedOptions = getOptions(noEmptyOption, options);
    return {
      label,
      prop,
      component: 'el-select',
      componentAttrs: {
        placeholder: `请选择${label}`,
        clearable: true,
        ...componentAttrs,
      },
      options: transformedOptions,
      ...rest,
    };
  } if (typeof prop === 'object') {
    return prop;
  }
  return {};
};

/**
 * 生成 proForm 的 date 项
 * @param {String} prop 属性
 * @param {String} label 标签
 * @param {Object} extra
 * @returns
 */
export const useDateField = (prop, label, extra) => {
  if (typeof prop === 'string') {
    return {
      label,
      prop,
      component: 'el-date-picker',
      ...extra,
      colAttrs: {
        span: 6,
        ...extra?.colAttrs,
      },
      componentAttrs: {
        type: 'date',
        clearable: true,
        valueFormat: 'YYYY-MM-DD',
        placeholder: '选择日期',
        ...extra?.componentAttrs,
      },
    };
  } if (typeof prop === 'object') {
    return prop;
  }
  return {};
};

/**
 * 生成 proForm 的 daterange 项
 * @param {String} prop 属性
 * @param {String} label 标签
 * @param {Object} extra
 * @returns
 */
export const useDateRangeField = (prop, label, extra) => {
  if (typeof prop === 'string') {
    return {
      label,
      prop,
      component: 'el-date-picker',
      ...extra,
      colAttrs: {
        span: 6,
        ...extra?.colAttrs,
      },
      componentAttrs: {
        type: 'daterange',
        clearable: true,
        rangeSeparator: '-',
        defaultTime: [
          new Date(2000, 1, 1, 0, 0, 0),
          new Date(2000, 2, 1, 23, 59, 59),
        ],
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        ...extra?.componentAttrs,
      },
    };
  } if (typeof prop === 'object') {
    return prop;
  }
  return {};
};
