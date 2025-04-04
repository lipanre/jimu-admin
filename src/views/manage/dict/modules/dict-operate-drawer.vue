<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem label="名称" path="name">
          <NInput v-model:value="model.name" placeholder="请输入字典名称" />
        </NFormItem>
        <NFormItem label="标识符" path="code">
          <NInput v-model:value="model.code" placeholder="请输入字典标识符" />
        </NFormItem>
        <NFormItem label="描述" path="description">
          <NInput type="textarea" v-model:value="model.description" placeholder="请输入字典描述" />
        </NFormItem>
        <NFormItem label="字典明细" path="details">
          <NDynamicInput v-model:value="model.details" preset="pair" :on-create="handleCreateDictDetail">
            <template #default="{value, index}">
              <div class="ml-8px flex-y-center flex-1 gap-12px">
                <NInput v-model:value="value.dictKey"
                        placeholder="key"
                        class="flex-1" />
                <NInput v-model:value="value.dictValue"
                        placeholder="value"
                        class="flex-1" />
              </div>
            </template>
            <template #action="{ index, create, remove }">
              <NSpace class="ml-12px">
                <NButton size="medium" @click="() => create(index)">
                  <icon-ic:round-plus class="text-icon" />
                </NButton>
                <NButton size="medium" @click="() => remove(index)">
                  <icon-ic-round-remove class="text-icon" />
                </NButton>
              </NSpace>
            </template>
          </NDynamicInput>
        </NFormItem>
      </NForm>

      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { createDict, updateDict } from '@/service/api';


defineOptions({
  name: 'DictOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Common.CommonRecord<Api.SystemManage.Dict> | null;
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
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增字典',
    edit: '编辑字典'
  };
  return titles[props.operateType];
});

type Model = Pick<Api.SystemManage.Dict, 'code' | 'name' | 'description'> & { details: Api.SystemManage.DictDetail[] };

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    code: '',
    name: '',
    description: '',
    details: []
  };
}

type RuleKey = Exclude<keyof Model, 'description' | 'details'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  code: defaultRequiredRule,
  name: defaultRequiredRule
};

const isEdit = computed(() => props.operateType === 'edit');

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  if (props.operateType === 'add') {
    await createDict(model.value);
  }

  if (props.operateType === 'edit') {
    if (props.rowData?.id) {
      await updateDict(props.rowData.id, model.value);
    } else {
      console.error('roleId is null');
    }
  }

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

const handleCreateDictDetail = (): Partial<Api.SystemManage.DictDetail> => {
  return {
    dictKey: '',
    dictValue: ''
  };
};

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});

</script>

<style scoped>

</style>
