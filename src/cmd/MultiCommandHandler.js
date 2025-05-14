export default class MultiCommandHandler {
    _commandStack;
    static $inject;
    constructor(commandStack) {
        this._commandStack = commandStack;
    }
    preExecute(context = []) {
        const commandStack = this._commandStack;
        const exec = (command) => {
            commandStack.execute(command.cmd, command.context);
        };
        context.forEach(exec);
    }
}
MultiCommandHandler.$inject = ['commandStack'];
