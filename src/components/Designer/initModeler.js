import { markRaw } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
import EventEmitter from '@/utils/EventEmitter';
import modelerStore from '@/store/modeler';
import EnhancementContextmenu from '@/additional-functions/EnhancementContextmenu';
export default async function (designer, modelerModules, emit) {
    const store = modelerStore();
    const options = {
        container: designer.value,
        additionalModules: modelerModules[0] || [],
        moddleExtensions: modelerModules[1] || {},
        ...modelerModules[2]
    };
    if (store.getModeler) {
        // 清除旧 modeler
        store.getModeler.destroy();
        await store.setModeler(undefined);
    }
    const modeler = new Modeler(options);
    await store.setModeler(markRaw(modeler));
    EventEmitter.emit('modeler-init', modeler);
    EnhancementContextmenu(modeler);
    modeler.on('commandStack.changed', async (event) => {
        try {
            const { xml } = await modeler.saveXML({ format: true });
            emit('update:xml', xml);
            emit('command-stack-changed', event);
        }
        catch (error) {
            console.error(error);
        }
    });
}
