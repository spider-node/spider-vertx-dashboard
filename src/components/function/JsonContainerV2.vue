<template>
  <div class="json-editor-container">
    <textarea v-model="editableJson" @input="updateJson" class="json-textarea"></textarea>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, toRef} from 'vue';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/default.css';

hljs.registerLanguage('json', json);


const props = defineProps({
  jsonData: {
    type: Object,
    default: {}
  }
})

const emit = defineEmits(['updateModelValue']);

const jsonData = toRef(props, 'jsonData');

const editableJson = ref<string>(JSON.stringify(jsonData.value, null, 2));
const jsonContainer = ref<HTMLPreElement | null>(null);

const highlightJson = () => {
  if (!jsonContainer.value) return;
  const jsonString = JSON.stringify(JSON.parse(editableJson.value), null, 2); // 格式化 JSON 数据
  jsonContainer.value.innerHTML = hljs.highlight(jsonString, { language: 'json' }).value;
};

const updateJson = () => {
  try {
    const parsedJson = JSON.parse(editableJson.value);
    emit('updateModelValue', parsedJson);
    highlightJson();
  } catch (error) {
    console.error("Invalid JSON format:", error);
    jsonContainer.value!.innerHTML = '<span style="color: red;">Invalid JSON format</span>';
  }
};

onMounted(() => {
  highlightJson();
});

/*watch(
    () => props.jsonData,
    (newVal) => {
      editableJson.value = JSON.stringify(newVal, null, 2);
      highlightJson();
    },
    { deep: true }
);*/
</script>

<style scoped>
.json-editor-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.json-textarea {
  width: 100%;
  height: 550px;
  padding: 10px;
  font-family: monospace;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.json-highlight {
  width: 100%;
  padding: 10px;
  font-family: monospace;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>



