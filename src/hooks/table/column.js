// 基于 yun-pro-table 的配置，详细使用参考 http://fe-yun-desgin-beta-component.frontend-yun-desgin.dev.yunlizhi.net/zh-CN/component/pro-table.html

/**
 * @description 生成 proTable 序号列
 * @param {Object} extra
 */
export const useIndexColumn = (extra = {}) => ({
  prop: 'order',
  label: '序号',
  type: 'index',
  width: 60,
  ...extra,
});

/**
 * @description 生成 proTable 操作列
 * @param {Object} extra
 */
export const useActionColumn = (extra = {}) => ({
  prop: 'action',
  label: '操作',
  width: '180px',
  fixed: 'right',
  ...extra,
});

/**
 * @description 生成 proTable 的 text 列
 * @param {String} prop 属性
 * @param {String} label 标签
 * @param {String} width 宽度
 * @param {Object} extra
 */
export const useTextColumn = (prop, label, extra = {}) => {
  if (typeof prop === 'string') {
    return {
      prop,
      label,
      ...extra,
    };
  } if (typeof prop === 'object') {
    return prop;
  }
  return {};
};
