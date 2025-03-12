<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['dict-search']">
      <NCollapseItem title="搜索" name="dict-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" label="名称" path="code" class="pr-24px">
              <NInput v-model:value="model.name" placeholder="请输入字典名称" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" label="标识符" path="code" class="pr-24px">
              <NInput v-model:value="model.code" placeholder="请输入字典标识符" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:12">
             <NSpace class="w-full" justify="end">
               <NButton @click="reset">
                 <template #icon>
                   <icon-ic-round-refresh class="text-icon" />
                 </template>
                 重置
               </NButton>
               <NButton type="primary" ghost @click="search">
                 <template #icon>
                   <icon-ic-round-search class="text-icon" />
                 </template>
                 搜索
               </NButton>
             </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<script setup lang="ts">
defineOptions({
  name: "DictSearch"
})

interface Emits {
  (e: "reset"): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>()

const model = defineModel<Api.SystemManage.DictSearchParams>()

const reset = () => emit('reset')
const search = () => emit('search')

</script>

<style scoped>

</style>
