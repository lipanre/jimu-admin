<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { createDept, updateDept } from '@/service/api';

export type OperateType = NaiveUI.TableOperateType | 'addChild';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: Api.Common.CommonRecord<Api.SystemManage.Dept> | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule, patternRules } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: '新增部门',
    addChild: '新增子部门',
    edit: '编辑部门'
  };
  return titles[props.operateType];
});

const createDefaultModel = (): Api.SystemManage.Dept => ({
  name: '',
  parentId: '0',
  sort: 0,
  chargePerson: '',
  phone: '',
  email: ''
});
const model = ref<Api.SystemManage.Dept>(createDefaultModel());

type RuleKey = Extract<Api.SystemManage.Dept, 'name'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  phone: patternRules.phone,
  email: patternRules.email
};

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const params = model.value;

  // request
  if (props.operateType === 'add') {
    await createDept(params);
  }

  if (props.operateType === 'addChild') {
    if (props.rowData?.id) {
      await createDept({ ...params, parentId: props.rowData?.id });
    }
  }

  if (props.operateType === 'edit') {
    if (params.id) {
      const { error } = await updateDept(params.id, params);
      if (!error) {
        window.$message?.success($t('common.updateSuccess'));
      }
    }
  }
  closeDrawer();
  emit('submitted');
}

watch(visible, value => {
  if (value) {
    restoreValidation();
    if (props.operateType === 'add' || props.operateType === 'addChild') {
      model.value = createDefaultModel();
    }
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-500px">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="80">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24" label="部门名称" path="name">
          <NInput v-model:value="model.name" placeholder="请输入部门名称" />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" label="显示排序" path="sort">
          <NInputNumber v-model:value="model.sort" />
        </NFormItemGi>

        <NFormItemGi span="24 m:12" label="负责人" path="chargePerson">
          <NInput v-model:value="model.chargePerson" placeholder="请输入负责人名称" />
        </NFormItemGi>

        <NFormItemGi span="24 m:12" label="联系电话" path="phone">
          <NInput v-model:value="model.phone" placeholder="请输入联系电话" />
        </NFormItemGi>

        <NFormItemGi span="24 m:12" label="邮箱" path="email">
          <NInput v-model:value="model.email" placeholder="请输入邮箱" />
        </NFormItemGi>
      </NGrid>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
