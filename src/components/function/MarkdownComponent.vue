

<template>
  <div class="markdown-body" v-html="compiledMarkdown"></div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import {computed} from "vue";

const props = defineProps({
  markdown: {
    type: String,
    default: ''
  }
})

const compiledMarkdown = computed(() => {
  return marked(props.markdown);
});

</script>

<style scoped lang="scss">
// 设置 markdown-body 高度
.markdown-body {
  height: 80%;
}
</style>