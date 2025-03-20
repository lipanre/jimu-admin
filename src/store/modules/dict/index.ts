import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';
import { allDictMapping } from '@/service/api';
import { nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';

// 请求获取所有字典映射
type DictMapping = {
  [key: string]: Api.SystemManage.DictDetail[]
}

export const useDict = defineStore(SetupStoreId.DICT, () => {

  const dictMapping = ref<DictMapping>({});

  const initDictMapping = async () => {

    const {data} = await allDictMapping()

    const mapping: DictMapping = {}
    data?.forEach(dict => {
      if (dict?.details) {
        mapping[dict.code] = dict.details;
      }
    });
    dictMapping.value = mapping;
  }



  return {
    dictMapping,
    initDictMapping
  };
});
