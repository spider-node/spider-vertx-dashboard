import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { createModdleElement, getExtensionElementsList } from '@/utils/BpmnExtensionElementsUtil';
import modelerStore from '@/store/modeler';
import editorStore from '@/store/editor';
import { without } from 'min-dash';
/////// 功能函数
export function getExtensionProperties(element) {
    const businessObject = getRelevantBusinessObject(element);
    if (!businessObject)
        return [];
    return getPropertiesList(businessObject) || [];
}
export function addExtensionProperty(element, property) {
    try {
        const store = modelerStore();
        const editor = editorStore();
        const modeling = store.getModeling;
        const prefix = editor.getProcessEngine;
        const businessObject = getRelevantBusinessObject(element);
        // 判断 extensionElements
        let extensionElements = businessObject.get('extensionElements');
        if (!extensionElements) {
            extensionElements = createModdleElement('bpmn:ExtensionElements', { values: [] }, businessObject);
            modeling.updateModdleProperties(element, businessObject, { extensionElements });
        }
        // 判断 extensionElements 是否有 properties
        let properties = getProperties(businessObject);
        if (!properties) {
            properties = createModdleElement(`${prefix}:Properties`, { values: [] }, extensionElements);
            modeling.updateModdleProperties(element, extensionElements, {
                values: [...extensionElements.get('values'), properties]
            });
        }
        // 创建新属性并添加
        const newProperty = createModdleElement(`${prefix}:Property`, property, properties);
        // 判断properties的values中是否存在跟property中的name属性相同的属性,如果存在，请进行替换
        if (properties?.get('values').find(item => item.get('name') === property.name)) {
            const values = properties?.get('values');
            const index = values.findIndex(item => item.get('name') === property.name);
            values.splice(index, 1, newProperty);
            modeling.updateModdleProperties(element, properties, { values });
            return;
        }
        modeling.updateModdleProperties(element, properties, {
            values: [...properties?.get('values'), newProperty]
        });
        console.log("添加完成");
    }
    catch (e) {
        console.log(e);
    }
}
export function removeExtensionProperty(element, property) {
    const businessObject = getRelevantBusinessObject(element);
    const extensionElements = businessObject.get('extensionElements');
    const properties = getProperties(businessObject);
    if (!properties)
        return;
    const store = modelerStore();
    const modeling = store.getModeling;
    const values = without(properties.get('values'), property);
    modeling.updateModdleProperties(element, properties, { values });
    if (!values || !values.length) {
        modeling.updateModdleProperties(element, extensionElements, {
            values: without(extensionElements.get('values'), properties)
        });
    }
}
///// helpers
function getRelevantBusinessObject(element) {
    const businessObject = getBusinessObject(element);
    if (is(element, 'bpmn:Participant')) {
        return businessObject.get('processRef');
    }
    return businessObject;
}
function getPropertiesList(bo) {
    const properties = getProperties(bo);
    return properties && properties.get('values');
}
function getProperties(bo) {
    return getExtensionElementsList(bo)[0];
}
