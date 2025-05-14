import MultiCommandHandler from './MultiCommandHandler';
const HANDLERS = {
    'panel.multi-command': MultiCommandHandler
};
export default class CommandInitializer {
    static $inject;
    constructor(eventBus, commandStack) {
        eventBus.on('diagram.init', function () {
            Object.keys(HANDLERS).forEach((id) => commandStack.registerHandler(id, HANDLERS[id]));
        });
    }
}
CommandInitializer.$inject = ['eventBus', 'commandStack'];
