<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { deleteDict, getDictDetail, pageDict } from '@/service/api';
import { $t } from '@/locales';
import DictSearch from '@/views/manage/dict/modules/dict-search.vue';
import DictOperateDrawer from '@/views/manage/dict/modules/dict-operate-drawer.vue';

const appStore = useAppStore();


const {
  columns,
  columnChecks,
  data,
  loading,
  getData,
  getDataByPage,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: pageDict,
  apiParams: {
    current: 1,
    size: 10,
    code: null,
    name: null,
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'name',
      title: '名称',
      width: 64,
      align: 'center'
    },
    {
      key: 'code',
      title: '标识符',
      width: 64,
      align: 'center'
    },
    {
      key: 'description',
      title: '描述',
      width: 64,
      align: 'center'
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleBatchDelete([row.id])}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, getData, getDictDetail);


const handleBatchDelete = async (ids: string[]) => {
  await deleteDict(ids)
  await onDeleted()
}



</script>
<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DictSearch v-model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard title="字典列表" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading" @add="handleAdd" @delete="() => handleBatchDelete(checkedRowKeys)" @refresh="getData" />
      </template>
      <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
        :flex-height="!appStore.isMobile" :scroll-x="702" :loading="loading" remote :row-key="row => row.id"
        :pagination="mobilePagination" class="sm:h-full" />
      <DictOperateDrawer v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData"
        @submitted="getDataByPage" />
    </NCard>
  </div>
</template>

<style scoped></style>
