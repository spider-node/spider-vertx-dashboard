import { defineComponent } from 'vue';
import modelerStore from '@/store/modeler';
import { NCollapse, NCollapseItem } from 'naive-ui';
const Palette = defineComponent({
    name: 'BpmnPalette',
    setup() {
        const store = modelerStore();
        const createElement = (ev, type, options) => {
            const ElementFactory = store.getModeler.get('elementFactory');
            const create = store.getModeler.get('create');
            const shape = ElementFactory.createShape({ type: `bpmn:${type}`, ...(options || {}) });
            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }
            create.start(ev, shape);
        };
        return () => (<div class="palette">
        <NCollapse>
          <NCollapseItem title="工具" name="tools">
            工具部分
          </NCollapseItem>
          <NCollapseItem title="事件" name="events">
            <div class="palette-el-list">
              <div class="palette-el-item start-event" onClick={(e) => createElement(e, 'StartEvent')}>
                <i class="bpmn-icon-start-event-none"></i>
                <span>开始</span>
              </div>
            </div>
          </NCollapseItem>
          <NCollapseItem title="任务" name="tasks">
            任务部分
          </NCollapseItem>
          <NCollapseItem title="网关" name="gateways">
            网关部分
          </NCollapseItem>
        </NCollapse>
      </div>);
    }
});
export default Palette;
