import modelerStore from '@/store/modeler';
import editorStore from '@/store/editor';
export function getProcessExecutable(element) {
    return !!element.businessObject.isExecutable;
}
export function setProcessExecutable(element, value) {
    const store = modelerStore();
    const modeling = store.getModeling;
    modeling.updateProperties(element, {
        isExecutable: value
    });
}
export function getProcessVersionTag(element) {
    const editor = editorStore();
    const prefix = editor.getProcessEngine;
    return element.businessObject.get(`${prefix}:versionTag`);
}
export function setProcessVersionTag(element, value) {
    const store = modelerStore();
    const editor = editorStore();
    const modeling = store.getModeling;
    const prefix = editor.getProcessEngine;
    modeling.updateProperties(element, {
        [`${prefix}:versionTag`]: value
    });
}
