import editor from '@/store/editor';
import modeler from '@/store/modeler';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
////////// only in bpmn:StartEvent
export function getInitiatorValue(element) {
    const prefix = editor().getProcessEngine;
    const businessObject = getBusinessObject(element);
    return businessObject.get(`${prefix}:initiator`);
}
export function setInitiatorValue(element, value) {
    const prefix = editor().getProcessEngine;
    const modeling = modeler().getModeling;
    const businessObject = getBusinessObject(element);
    modeling.updateModdleProperties(element, businessObject, {
        [`${prefix}:initiator`]: value
    });
}
export function isStartInitializable(element) {
    const prefix = editor().getProcessEngine;
    return is(element, `${prefix}:Initiator`) && !is(element.parent, 'bpmn:SubProcess');
}
export function isUserAssignmentSupported(element) {
    return is(element, `${editor().getProcessEngine}:Assignable`);
}
