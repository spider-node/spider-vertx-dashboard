import { defineComponent, markRaw, onMounted, ref } from 'vue';
import { NCollapse } from 'naive-ui';
import debounce from 'lodash.debounce';
import EventEmitter from '@/utils/EventEmitter';
import modelerStore from '@/store/modeler';
import Logger from '@/utils/Logger';
import getBpmnIconType from '@/bpmn-icons/getIconType';
import bpmnIcons from '@/bpmn-icons';
import BpmnIcon from '@/components/common/BpmnIcon.vue';
import ElementDomainFunction from "@/components/Panel/components/new/ElementDomainFunction.vue";
import ElementGenerations from './components/ElementGenerations.vue';
import ElementConditionalNew from "@/components/Panel/components/ElementConditionalNew.vue";
import { isCanbeConditional, isExtendTask } from '@/bo-utils/conditionUtil';
import { customTranslate } from '@/additional-modules/Translate';
const Panel = defineComponent({
    name: 'PropertiesPanel',
    props: {
        businessFunctionVersion: {
            type: Object,
            default: undefined
        }
    },
    setup(props) {
        const modeler = modelerStore();
        const panel = ref(null);
        const currentElementId = ref(undefined);
        const currentElementType = ref(undefined);
        const businessFunctionVersion = ref(props.businessFunctionVersion);
        const penalTitle = ref('属性配置');
        const bpmnIconName = ref('Process');
        const bpmnElementName = ref('Process');
        const renderComponents = markRaw([]);
        const setCurrentComponents = (element) => {
            // 清空
            /*if(isExtendTask(element)){
                // 设置 element为service task类型
                element.type = 'bpmn:ServiceTask'
            }*/
            renderComponents.splice(0, renderComponents.length);
            renderComponents.push(ElementGenerations);
            isExtendTask(element) && renderComponents.push(ElementDomainFunction);
            isCanbeConditional(element) && renderComponents.push(ElementConditionalNew);
        };
        // 设置选中元素，更新 store
        const setCurrentElement = debounce((element) => {
            let activatedElement = element;
            let activatedElementTypeName = '';
            if (!activatedElement) {
                activatedElement =
                    modeler.getElRegistry?.find((el) => el.type === 'bpmn:Process') ||
                        modeler.getElRegistry?.find((el) => el.type === 'bpmn:Collaboration');
                if (!activatedElement) {
                    return Logger.prettyError('No Element found!');
                }
            }
            activatedElementTypeName = getBpmnIconType(activatedElement);
            modeler.setElement(markRaw(activatedElement));
            currentElementId.value = activatedElement.id;
            currentElementType.value = activatedElement.type.split(':')[1];
            penalTitle.value = modeler.getModeler?.get('translate')(currentElementType.value);
            bpmnIconName.value = bpmnIcons[activatedElementTypeName];
            bpmnElementName.value = activatedElementTypeName;
            setCurrentComponents(activatedElement);
            EventEmitter.emit('element-update', activatedElement);
            Logger.prettyPrimary('Selected element changed', `ID: ${activatedElement.id} , type: ${activatedElement.type}`);
        }, 100);
        EventEmitter.on('modeler-init', (modeler) => {
            // 导入完成后默认选中 process 节点
            modeler.on('import.done', () => {
                setCurrentElement(null);
            });
            // 监听选择事件，修改当前激活的元素以及表单
            modeler.on('selection.changed', ({ newSelection }) => {
                setCurrentElement(newSelection[0] || null);
            });
            modeler.on('element.changed', ({ element }) => {
                // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
                if (element && element.id === currentElementId.value) {
                    setCurrentElement(element);
                }
            });
            modeler.on('element.click', (event) => {
                Logger.prettyInfo('Element Click', event);
            });
        });
        onMounted(() => {
            !currentElementId.value && setCurrentElement(null);
            console.log("---function", businessFunctionVersion.value);
            modeler.setBusinessFunctionVersion(businessFunctionVersion.value);
        });
        return () => (<div ref={panel} class="panel">
                <div class="panel-header">
                    <BpmnIcon name={bpmnIconName.value}></BpmnIcon>
                    <p>{bpmnElementName.value}</p>
                    <p>{customTranslate(currentElementType.value || 'Process')}</p>
                </div>
                <NCollapse arrow-placement="right">
                    {renderComponents.map((component) => (<component is={component}></component>))}
                </NCollapse>
            </div>);
    }
});
export default Panel;
