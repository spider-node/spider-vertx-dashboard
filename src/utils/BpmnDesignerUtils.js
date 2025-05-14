import { isAny } from 'bpmn-js/lib/util/ModelUtil';
export function isAppendAction(element) {
    return (!element ||
        isAny(element, ['bpmn:Process', 'bpmn:Collaboration', 'bpmn:Participant', 'bpmn:SubProcess']));
}
