<template>
  <div class="tamplate-modal">
    <a-modal
      v-model:visible="visible"
      destroyOnClose
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title>
        <span v-if="modalType === 'add'">{{
          $t("coc.coc_modal_add_title")
        }}</span>
        <span v-if="modalType === 'edit'">{{
          $t("coc.coc_modal_edit_title")
        }}</span>
        <span v-if="modalType === 'detail'">
          {{ $t("coc.coc_modal_view_title") }}
        </span>
      </template>
      <template #footer>
        <a-button @click="handleCancel" v-if="!isDisable">
          {{ $t("coc.coc_btn_cancel") }}
        </a-button>
        <a-button type="primary" @click="handleOk" v-if="!isDisable">
          {{ $t("coc.coc_btn_comfirm") }}
        </a-button>
      </template>
      <!-- 内容form表单 -->
      <a-form
        ref="refForm"
        :form="searchForm"
        :layout="formLayout"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="searchForm"
        :rules="rules"
      >
        <a-form-item
          :label="$t('coc.coc_lable_name')"
          :label-col="labelCol"
          name="name"
        >
          <a-input
            v-model:value="searchForm.name"
            :disabled="isDisable"
            :placeholder="$t('coc.coc_placeholder_name')"
          />
        </a-form-item>
        <a-form-item
          :label="$t('coc.coc_lable_version')"
          :label-col="labelCol"
          name="version_number"
        >
          <a-input
            v-model:value="searchForm.version_number"
            :disabled="isDisable"
            :placeholder="$t('coc.coc_placeholder_version')"
          />
        </a-form-item>
        <a-form-item
          :label="$t('coc.coc_lable_validity_date')"
          :label-col="labelCol"
          name="coc_validity_date"
        >
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            v-model:value="searchForm.coc_validity_date"
            :disabled="isDisable"
            valueFormat="X"
            :placeholder="[$t('coc.coc_start_date'), $t('coc.coc_start_date')]"
          />
        </a-form-item>
        <a-form-item
          :label="$t('coc.coc_lable_apply_vehicle')"
          :label-col="labelCol"
          name="model"
        >
          <!-- select -->
          <a-select
            v-model:value="searchForm.model"
            mode="multiple"
            showArrow
            :disabled="isDisable"
            :placeholder="$t('coc.coc_placeholder_apply_vehicle')"
          >
            <a-select-option
              v-for="(item, index) in option"
              :key="index"
              :value="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label="$t('coc.coc_lable_template')"
          :label-col="labelCol"
          name="upload"
          class="upload-item"
        >
          <TemplateUpload
            :isDisable="isDisable"
            :type="['doc', 'docx']"
            :fileUrl="searchForm.fileList"
            v-model:upload="upload"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import Core from "@/core"
import { useI18n } from "vue-i18n"
import {
  defineEmits,
  reactive,
  ref,
  onMounted,
  watch,
  toRef,
  getCurrentInstance,
} from "vue"
import TemplateUpload from "./template-upload.vue"
const Util = Core.Util
const FILE_URL_PREFIX = Core.Const.NET.FILE_URL_PREFIX
const { getCateGoryList, viewCocTemplate, addCocTemplate } = Core.Api.COC
const { dayjsReview, timeFilter, dayjsToTimestamp } = Util
const $t = useI18n().t
const $message = getCurrentInstance().proxy.$message

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  modalType: {
    type: String,
    default: "",
  },
  isDisable: {
    type: Boolean,
    default: false,
  },
  recordItem: {
    type: Object,
    default: () => {},
  },
})
const $emit = defineEmits(["update:visible", "search"])

const formLayout = ref("horizontal")
const labelCol = ref({ style: { width: "100px" } })
const wrapperCol = ref({ span: 18 })
const option = ref([])
const refForm = ref(null)
const upload = ref({})
// validate
const validateDate = async (rule, value) => {
  if (value && value.length > 0) {
    return Promise.resolve()
  }
  return Promise.reject($t("coc.coc_validity_date_required"))
}
const validateModel = async (rule, value) => {
  console.log("value", value)
  if (value && value.length > 0) {
    return Promise.resolve()
  }
  return Promise.reject($t("coc.coc_apply_vehicle_required"))
}
const validateUpload = async (rule, value) => {
  console.log("value", upload.value)
  // console.log("upload.fileList", upload)
  // // upload.fileList若为空数组，说明没有上传文件
  if (upload.value.fileList.length > 0 && upload.value.fileList) {
    return Promise.resolve()
  }
  return Promise.reject($t("coc.coc_template_required"))
}
const rules = reactive({
  name: [
    {
      required: true,
      message: () => $t("coc.coc_name_required"),
      trigger: ["change", "blur"],
    },
  ],
  version_number: [
    {
      required: true,
      message: () => $t("coc.coc_version_required"),
      trigger: ["change", "blur"],
    },
  ],
  coc_validity_date: [
    {
      required: true,
      trigger: ["change", "blur"],
      validator: validateDate,
    },
  ],
  model: [
    {
      required: true,
      trigger: ["change", "blur"],
      validator: validateModel,
    },
  ],
  upload: [
  	{
  		required: false,
  		trigger: ["change", "blur"],
  		validator: validateUpload,
  	},
  ],
})
const searchForm = reactive({
  name: "",
  version_number: "",
  coc_validity_date: [],
  model: [],
  fileList: [],
  id:''
})

watch(
  () => props.recordItem,
  (newVal) => {
    console.log("newVal", newVal)
    let arr = Util.deepCopy(newVal)
    if (Object.keys(arr).length === 0) {
      searchForm.name = ""
      searchForm.version_number = ""
      searchForm.coc_validity_date = []
      searchForm.model = []
      searchForm.fileList = []
    } else { 
        if (arr.model) {
              arr.model = arr.model.split(",")
            }

        if (arr.file_url) {
          arr.fileList = [
            {
              uid: "-1",
              name: arr.name,
              status: "done",
              url: FILE_URL_PREFIX + arr.file_url,
              response: {
                code: 0,
                data: {
                  name: arr.name,
                  filename: arr.file_url,
                },
              },
            },
          ]
        }
        arr.coc_validity_date = [
          dayjsReview(arr.effective_start_time),
          dayjsReview(arr.effective_end_time),
        ]
      // 将arr中所有的key转成searchForm中的key
      for (let key in arr) {
        searchForm[key] = arr[key]
      }
    }
  },
  {
    deep: true,
  }
)

// 获取下拉框数据
const getCateGory = async () => {
  const res = await getCateGoryList()
  option.value = res
}

const hanleeEdit = (form) => {
  addCocTemplate(form).then((res) => {
    if (props.modalType === "edit") {
      $message.success($t("coc.coc_edit_success"))
    } else if (props.modalType === "add") {
      $message.success($t("coc.coc_add_success"))
    }
    $emit("update:visible", false)
    $emit("search")
  })
}
// modal
const handleOk = () => {
  refForm.value
    .validate()
    .then((res) => {
      // 整合数据
      let data = JSON.parse(JSON.stringify(searchForm))
      // Dayjs深拷贝会报错，所以用JSON，但是JSON会把时间戳转成字符串，所以要转回来
      data.effective_start_time =Number( dayjsToTimestamp(data.coc_validity_date[0]))
      data.effective_end_time = Number(dayjsToTimestamp(data.coc_validity_date[1]))
      data.model = data.model.length > 1 ? data.model.join(",") : data.model[0]
      data.file_url =
        data.fileList.length > 0 ? data.fileList[0].response.data.filename : ""
      delete data.fileList
      delete data.coc_validity_date
      hanleeEdit(data)
    })
    .catch((err) => {
      console.log(err)
      console.log("校验失败")
    })
}

const handleCancel = () => {
  $emit("update:visible", false)
}

onMounted(() => {
  getCateGory()
})
</script>

<style lang="less" scoped>
:deep(.ant-form-item-label) {
  label {
    display: inline-flex;
    white-space: normal;
    height: 100%;
    margin-right: 8px;
    // 与右侧内容对齐
    align-items: center;
    align-items: flex-start;
  }
}
:deep(.ant-upload) {
  width: 100%;
}
</style>
