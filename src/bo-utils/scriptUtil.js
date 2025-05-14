import editor from '@/store/editor';
import modeler from '@/store/modeler';
export function createScript(props) {
    const prefix = editor().getProcessEngine;
    const moddle = modeler().getModdle;
    const { scriptFormat, value, resource } = props;
    return moddle.create(`${prefix}:Script`, { scriptFormat, value, resource });
}
export function getScriptType(script) {
    if (script.get('resource')) {
        return 'External Resource';
    }
    if (script.get('value')) {
        return 'Inline Script';
    }
    return 'none';
}
