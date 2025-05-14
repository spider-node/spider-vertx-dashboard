import { markRaw } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
export default async function (designer, modelerModules) {
    const options = {
        container: designer.value,
        additionalModules: modelerModules[0] || [],
        moddleExtensions: modelerModules[1] || {},
        ...modelerModules[2]
    };
    return markRaw(new Modeler(options));
}
