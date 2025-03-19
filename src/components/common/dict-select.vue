<template>
   <NSelect
     v-model:value="value"
     :options="options"
     :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
import { useDict } from '@/store/modules/dict';
import { SelectGroupOption, SelectOption } from 'naive-ui';
const { dictMapping } = useDict();

defineOptions({
  name: "DictSelect"
})

const value = defineModel<string>("value")

const { dictCode, placeholder } = defineProps<{ dictCode: string, placeholder: string }>();

const options: Array<SelectOption | SelectGroupOption> = dictMapping[dictCode]?.map(detail => ({
  label: detail.dictValue,
  value: detail.dictKey
}))

</script>

<style scoped>

</style>
