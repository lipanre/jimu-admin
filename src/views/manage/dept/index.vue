<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="部门管理" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>

      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1088"
        :loading="loading"
        :row-key="row => row.id"
        remote
        class="sm:h-full"
      />

      <DeptOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<script setup lang="tsx">


import { useTable, useTableOperate } from '@/hooks/common/table';
import { batchDeleteDept, fetchDept, fetchDeptDetail, fetchMenuDetail } from '@/service/api';
import { $t } from '@/locales';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { type Ref, ref } from 'vue';
import { useBoolean } from '~/packages/hooks';
import DeptOperateModal, { OperateType } from '@/views/manage/dept/modules/dept-operate-modal.vue';

defineOptions({
  name: "Dept",
})

const appStore = useAppStore()

const { bool: visible, setTrue: openModal } = useBoolean();


const { columns, columnChecks, data, loading, pagination, getData, getDataByPage } = useTable({
  apiFn: fetchDept,
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'id',
      title: $t('page.manage.menu.rowNumber'),
      align: 'center',
      render: (_, index) => `${index + 1}`,
    },
    {
      key: "name",
      title: '部门名称',
      align: 'center',
      minWidth: 80
    },
    {
      key: "parentId",
      title: "父级部门ID",
      align: 'center',
      minWidth: 80
    },
    {
      key: "sort",
      title: "排序",
      align: 'center',
      minWidth: 80
    },
    {
      key: "chargePerson",
      title: "负责人",
      align: 'center',
      minWidth: 80
    },
    {
      key: 'phone',
      title: "联系电话",
      align: "center",
      minWidth: 80
    },
    {
      key: "email",
      title: "邮箱",
      align: "center",
      width: 150
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
        <div class="flex-center justify-end gap-8px">
          <NButton type="primary" ghost size="small" onClick= {() => handleAddChild(row)}>
            添加子部门
          </NButton>
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
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

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, getData);

const operateType = ref<OperateType>('add');

const handleAdd = () => {
  operateType.value = 'add'
  openModal()
}

const handleDelete = async (id: string) => {
  await batchDeleteDept([id])
  await onDeleted()
}

const handleBatchDelete = async () => {
  await batchDeleteDept(checkedRowKeys.value)
  await onBatchDeleted()
}

const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);
async function handleEdit(item: Api.SystemManage.Dept) {
  operateType.value = 'edit';

  const detail = await fetchDeptDetail(item.id)
  editingData.value = detail.data;
  openModal();
}

const handleAddChild = async (item: Api.SystemManage.Dept) => {
  operateType.value = 'addChild'
  editingData.value = item
  openModal()

  console.log("editingData", editingData)
}


</script>

<style scoped>

</style>
