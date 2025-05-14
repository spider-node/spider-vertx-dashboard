import { is } from 'bpmn-js/lib/util/ModelUtil';

/**
 * Get extension elements of business object. Optionally filter by type.
 */
export function getExtensionElementsList(businessObject, type) {
  const extensionElements = businessObject?.get('extensionElements');
  if (!extensionElements) return [];

  const values = extensionElements.get('values');
  if (!values || !values.length) return [];

  if (type) return values.filter((value) => is(value, type));

  return values;
}

export function createModdleElement(
  elementType,
  properties,
  parent,
  moddle,
) {
  // const moddle = modeler.getModdle;
  const element = moddle.create(elementType, properties);
  // eslint-disable-next-line no-unused-expressions
  parent && (element.$parent = parent);
  return element;
}
