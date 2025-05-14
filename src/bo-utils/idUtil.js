import modelerStore from '@/store/modeler';
import { isIdValid } from '@/utils/BpmnValidator';
export function getIdValue(element) {
    return element.businessObject.id;
}
export function setIdValue(element, value) {
    const errorMsg = isIdValid(element.businessObject, value);
    if (errorMsg && errorMsg.length) {
        return window.__messageBox.warning(errorMsg);
    }
    const store = modelerStore();
    const modeling = store.getModeling;
    modeling.updateProperties(element, {
        id: value
    });
}
