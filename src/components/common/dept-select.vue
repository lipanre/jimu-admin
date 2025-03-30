<!-- 部门选择器 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchDept } from '@/service/api';

defineOptions({
  name: 'DeptSelect'
});

interface Props {
  multiple?: boolean;
  defaultExpandAll?: boolean;
}

const { multiple = false, defaultExpandAll = false } = defineProps<Props>();

const value = defineModel<string | string[]>('value');

const deptSelectOptions = ref<Api.SystemManage.Dept[]>([]);

onMounted(async () => {
  const { data } = await fetchDept();
  if (data?.records) {
    deptSelectOptions.value = data?.records;
  }
});
</script>

<template>
  <NTreeSelect
    v-model:value="value"
    checkable
    clearable
    :options="deptSelectOptions"
    label-field="name"
    :default-expand-all="defaultExpandAll"
    key-field="id"
    :multiple="multiple"
  />
</template>

<style lang="scss" scoped></style>
