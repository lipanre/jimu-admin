<!-- 部门选择器 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchDept } from '@/service/api';

defineOptions({
  name: 'DeptSelect'
});

interface Props {
  multiple?: boolean;
}

const { multiple = false } = defineProps<Props>();

const value = defineModel<string>('value');

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
    :options="deptSelectOptions"
    label-field="name"
    key-field="id"
    :multiple="multiple"
  />
</template>

<style lang="scss" scoped></style>
