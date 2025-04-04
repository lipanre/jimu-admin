<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { batchDeleteUser, fetchGetUserList, getUserDetail } from '@/service/api';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { useTable, useTableOperate } from '@/hooks/common/table';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';
import { useAuthStore } from '@/store/modules/auth';

const appStore = useAppStore();

const authStore = useAuthStore();

const permission: CommonType.Permission = {
  add: 'user:add',
  delete: 'user:delete',
  edit: 'user:edit',
  search: 'user:search',
}

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams
} = useTable({
  apiFn: fetchGetUserList,
  showTotal: true,
  apiParams: {
    current: 1,
    size: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    status: null,
    userName: null,
    gender: null,
    nickName: null,
    phone: null,
    email: null
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
      disabled(row) {
        return !canHandleUser(row)
      }
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64
    },
    {
      key: 'userName',
      title: $t('page.manage.user.userName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'gender',
      title: $t('page.manage.user.userGender'),
      align: 'center',
      width: 100,
      render: row => {
        if (!row.gender) {
          return null;
        }

        const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
          1: 'primary',
          2: 'error'
        };

        const label = $t(userGenderRecord[row.gender]);

        return <NTag type={tagMap[row.gender]}>{label}</NTag>;
      }
    },
    {
      key: 'nickName',
      title: $t('page.manage.user.nickName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'phone',
      title: $t('page.manage.user.userPhone'),
      align: 'center',
      width: 120
    },
    {
      key: 'email',
      title: $t('page.manage.user.userEmail'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'status',
      title: $t('page.manage.user.userStatus'),
      align: 'center',
      width: 100,
      render: row => {
        if (!row.status) {
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
        if (!canHandleUser(row)) return null;
        return (
          <div class="flex-center gap-8px">
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
          </div>
        )
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
} = useTableOperate(data, getData, getUserDetail);

async function handleBatchDelete() {
  // request
  await batchDeleteUser(...checkedRowKeys.value);
  onBatchDeleted();
}

async function handleDelete(id: string) {
  // request
  await batchDeleteUser(id);
  onDeleted();
}

function edit(id: string) {
  handleEdit(id);
}

/**
 * 判断是否可以编辑或删除用户
 * @param user 待判断的用户
 */
function canHandleUser(user: Api.SystemManage.User) {
  // 1. 判断用户是否是普通用户
  if (authStore.isOrdinaryUser()) {
    // 1.1 如果用户是普通用户则不能操作管理员用户与超级管理员用户
    // 1.1.1 判断传过来的用户是否是管理员或者超级管理员
    if (user.admin || user.superAdmin) {
      return false;
    }
    return true;
  }
  // 1.2 如果用户是普通管理员用户，则不能操作超级管理员用户
  if (authStore.isAdmin) {
    return !user.superAdmin
  }
  // 1.3 如果用户是超级管理员用户，则可以操作所有用户
  return true;
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <UserSearch v-permission="permission.search" v-model:model="searchParams" @reset="resetSearchParams"
      @search="getDataByPage" />
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading" :add-permission="permission.add" :delete-permission="permission.delete" @add="handleAdd"
          @delete="handleBatchDelete" @refresh="getData" />
      </template>
      <NDataTable v-model:checked-row-keys="checkedRowKeys" :columns="columns" :data="data" size="small"
        :flex-height="!appStore.isMobile" :scroll-x="962" :loading="loading" remote :row-key="row => row.id"
        :pagination="mobilePagination" class="sm:h-full" />
      <UserOperateDrawer v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData"
        @submitted="getDataByPage" />
    </NCard>
  </div>
</template>

<style scoped></style>
