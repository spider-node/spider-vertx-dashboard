import { assign } from 'min-dash';
export function createAction(elementFactory, create, type, group, className, title, options) {
    function createListener(event) {
        const shape = elementFactory.createShape(assign({ type: type }, options));
        if (options) {
            !shape.businessObject.di && (shape.businessObject.di = {});
            shape.businessObject.di.isExpanded = options.isExpanded;
        }
        create.start(event, shape);
    }
    return {
        group: group,
        className: className,
        title: title,
        action: {
            dragstart: createListener,
            click: createListener
        }
    };
}
