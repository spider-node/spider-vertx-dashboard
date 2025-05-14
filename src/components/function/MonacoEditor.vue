<template>
  <div ref="editor" class="monaco-editor"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor';

const emit = defineEmits(['code_update']);

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'java'
  }
});

const editor = ref<HTMLElement>(null);
let monacoInstance: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
  monacoInstance = monaco.editor.create(editor.value, {
    value: props.value,
    language: props.language,
    theme: 'vs-dark',
    automaticLayout: true
  });

  // 添加模型内容变化的监听器
  monacoInstance.onDidChangeModelContent(() => {
    const newValue = monacoInstance.getValue();
    if (newValue !== props.value) {
      emit('code_update', newValue);
    }
  });
});

// 提供一个方法来获取编辑器的内容
defineExpose({
  getValue: () => monacoInstance.getValue()
});
</script>

<style scoped>
.monaco-editor {
  height: 100%;
  width: 100%;
}
</style>
