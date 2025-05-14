import {markRaw, Ref} from 'vue'
import Modeler from 'bpmn-js/lib/Modeler'
import type {BaseViewerOptions} from 'bpmn-js/lib/BaseViewer'
import type {ModulesAndModdles} from '@/components/Designer/modulesAndModdle'

export default async function (
    designer: Ref<HTMLElement | null>,
    modelerModules: ModulesAndModdles
) {

    const options: BaseViewerOptions = {
        container: designer!.value as HTMLElement,
        additionalModules: modelerModules[0] || [],
        moddleExtensions: modelerModules[1] || {},
        ...modelerModules[2]
    }
    return markRaw(new Modeler(options))
}
