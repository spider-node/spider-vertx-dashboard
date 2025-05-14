import modeler from '@/store/modeler';
export default function () {
    const modelerStore = modeler();
    let replaceElement;
    let elementFactory;
    let create;
    function replaceAction(target, currentElement) {
        if (!replaceElement) {
            replaceElement = modelerStore.getModeler.get('bpmnReplace').replaceElement;
        }
        replaceElement(currentElement, target);
    }
    function appendAction(target, event) {
        if (!elementFactory) {
            elementFactory = modelerStore.getModeler.get('elementFactory');
        }
        if (!create) {
            create = modelerStore.getModeler.get('create');
        }
        const shape = elementFactory.createShape(target);
        if (target.isExpanded != null) {
            shape.businessObject.di.isExpanded = target.isExpanded;
        }
        setTimeout(() => create.start(event, shape), 30);
    }
    return {
        replaceAction,
        appendAction
    };
}
