<!-- 部门选择器 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchDept } from '@/service/api';

defineOptions({
  name: 'DeptSelect'
});

const deptId = defineModel<string>('deptId');

const deptSelectOptions = ref<Api.SystemManage.Dept[]>([]);

onMounted(async () => {
  const { data } = await fetchDept();
  if (data?.records) {
    deptSelectOptions.value = data?.records;
  }
});
</script>

<template>
  <NTreeSelect v-model:value="deptId" checkable :options="deptSelectOptions" label-field="name" key-field="id" />
</template>

<style lang="scss" scoped></style>
