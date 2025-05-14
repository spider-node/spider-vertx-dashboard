import EmptyXML from '@/utils/EmptyXML';
import modelerStore from '@/store/modeler';
export const createNewDiagram = async function (newXml, settings) {
    try {
        const store = modelerStore();
        const timestamp = Date.now();
        const { processId, processName, processEngine } = settings || {};
        const newId = processId ? processId : `Process_${timestamp}`;
        const newName = processName || `业务流程_${timestamp}`;
        const xmlString = newXml || EmptyXML(newId, newName, processEngine);
        const modeler = store.getModeler;
        const { warnings } = await modeler.importXML(xmlString);
        if (warnings && warnings.length) {
            warnings.forEach((warn) => console.warn(warn));
        }
    }
    catch (e) {
        console.error(`[Process Designer Warn]: ${typeof e === 'string' ? e : e?.message}`);
    }
};
