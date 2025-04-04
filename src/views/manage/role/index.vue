<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { deleteRole, fetchGetRoleDetail, fetchGetRoleList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';
import RoleSearch from './modules/role-search.vue';
import { useAuthStore } from '@/store/modules/auth';

const appStore = useAppStore();
const authStore = useAuthStore();


const permission: CommonType.Permission = {
  add: "role:add",
  delete: "role:delete",
  edit: "role:edit",
  search: "role:search"
}

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
  apiFn: fetchGetRoleList,
  apiParams: {
    current: 1,
    size: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    status: null,
    roleName: null,
    roleCode: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
      disabled(row) {
        return !canHandleRole(row);
      }
    },
    {
      key: 'index',
      title: $t('common.index'),
      width: 64,
      align: 'center'
    },
    {
      key: 'roleName',
      title: $t('page.manage.role.roleName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleCode',
      title: $t('page.manage.role.roleCode'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'roleDesc',
      title: $t('page.manage.role.roleDesc'),
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.role.roleStatus'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => {
        if (!canHandleRole(row)) return null;
        return (<div class="flex-center gap-8px">
          <NButton v-permission={permission.edit} type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton v-permission={permission.delete} type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>)
      }
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
} = useTableOperate(data, getData, fetchGetRoleDetail);

async function handleBatchDelete() {
  // request
  await deleteRole(...checkedRowKeys.value);
  await onBatchDeleted();
}

async function handleDelete(id: string) {
  // request
  await deleteRole(id);
  await onDeleted();
}

function edit(id: string) {
  handleEdit(id);
}

function canHandleRole(role: Api.SystemManage.Role): boolean {

  // 1. 判断当前登录用户是管理员还是普通用户
  if (authStore.isOrdinaryUser()) {
    // 1.1 如果当前登录用户是普通用户，则对于管理员无法编辑与删除
    if (authStore.isAdminRole(role.roleCode) || authStore.isSuperAdminRole(role.roleCode)) {
      return false;
    }
    return true;
  }
  // 1.2 如果当前登录用户是管理员
  // 1.2.1 超级管理员可以编辑删除所有角色
  if (authStore.isSuperAdmin) {
    return true;
  }
  // 1.2.2 普通管理员不能编辑删除超级管理员
  if (authStore.isSuperAdminRole(role.roleCode)) {
    return false;
  }
  return true;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <RoleSearch v-permission="permission.search" v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage" />
    <NCard :title="$t('page.manage.role.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :add-permission="permission.add"
          :delete-permission="permission.delete"
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
        :scroll-x="702"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
