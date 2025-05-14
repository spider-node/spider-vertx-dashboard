import { defineStore } from 'pinia';
import { toRaw } from 'vue';
const defaultState = {
    activeElement: undefined,
    activeElementId: undefined,
    modeler: undefined,
    moddle: undefined,
    modeling: undefined,
    canvas: undefined,
    elementRegistry: undefined,
    businessFunctionVersion: undefined
};
export default defineStore('modeler', {
    state: () => defaultState,
    getters: {
        getActive: (state) => toRaw(state.activeElement),
        getActiveId: (state) => state.activeElementId,
        getModeler: (state) => toRaw(state.modeler),
        getModdle: (state) => toRaw(state.moddle),
        getModeling: (state) => toRaw(state.modeling),
        getCanvas: (state) => toRaw(state.canvas),
        getElRegistry: (state) => toRaw(state.elementRegistry),
        getBFVersion: (state) => state.businessFunctionVersion
    },
    actions: {
        setModeler(modeler) {
            this.modeler = modeler;
            if (modeler) {
                this.modeling = modeler.get('modeling');
                this.moddle = modeler.get('moddle');
                this.canvas = modeler.get('canvas');
                this.elementRegistry = modeler.get('elementRegistry');
            }
            else {
                this.modeling = this.moddle = this.canvas = this.elementRegistry = undefined;
            }
        },
        setElement(element) {
            this.activeElement = element;
            this.activeElementId = element?.id;
        },
        setBusinessFunctionVersion(businessFunctionVersion) {
            this.businessFunctionVersion = businessFunctionVersion;
        }
    }
});
