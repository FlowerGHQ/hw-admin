<template>
  <div class="tamplate-modal">
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
      <template #title>
        <span>{{ ModalTitle }}</span>
      </template>
      <template #footer>
        <a-button @click="handleCancel">
          {{ $t("coc.coc_btn_cancel") }}
        </a-button>
        <a-button type="primary" @click="handleOk">
          {{ $t("coc.coc_btn_comfirm") }}
        </a-button>
      </template>
      <!-- 内容form表单 -->
      <a-form
        :form="form"
        :layout="formLayout"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item :label="$t('coc.coc_lable_name')">
          <a-input
            v-model:value="form.name"
            :placeholder="$t('coc.coc_placeholder_name')"
          />
        </a-form-item>
        <a-form-item :label="$t('coc.coc_lable_version')">
          <a-input
            v-model:value="form.version"
            :placeholder="$t('coc.coc_placeholder_version')"
          />
        </a-form-item>
        <a-form-item
          :label="$t('coc.coc_lable_validity_date')"
          :label-col="labelCol"
        >
          <a-range-picker
            :show-time="{ format: 'HH:mm' }"
            v-model:value="form.coc_validity_date"
            format="YYYY-MM-DD HH:mm"
            :placeholder="[$t('coc.coc_start_date'), $t('coc.coc_start_date')]"
            @change="onRangeChange"
            @ok="onRangeOk"
          />
        </a-form-item>
        <a-form-item :label="$t('coc.coc_lable_apply_vehicle')">
          <!-- select -->
          <a-select
            v-model:value="form.apply_vehicle"
            mode="multiple"
            showArrow
            :placeholder="$t('coc.coc_placeholder_apply_vehicle')"
          >
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('coc.coc_lable_template')">
          <!-- 上传组件 正方形带+ -->
          <a-upload
            :multiple="true"
            v-model:file-list="fileList"
            list-type="picture-card"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">
                {{ $t("coc.coc_placeholder_upload") }}
              </div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue"
const { ctx } = getCurrentInstance()
const { $t } = ctx.$root

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  ModalTitle: {
    type: String,
    default: "",
  },
})
const $emit = defineEmits(["update:visible"])

const form = ref({
  name: "",
  version: "",
  apply_vehicle: [],
  coc_validity_date: [],
})
const formLayout = ref("horizontal")
const labelCol = ref({ style: { width: "100px" } })
const wrapperCol = ref({ span: 16 })
const fileList = ref([])
const loading = ref(false)
const imageUrl = ref("")

// 时间选择器
const onRangeOk = (value) => {
  console.log("onRangeOk: ", value)
}

const onRangeChange = (value) => {
  console.log("onRangeChange: ", value)
}
// 上传组件
const beforeUpload = (file) => {
  console.log("beforeUpload: ", file)
}

const handleChange = (info) => {
  console.log("handleChange: ", info)
}
// modal
const handleOk = () => {
  $emit("update:visible", false)
}
const handleCancel = () => {
  $emit("update:visible", false)
}
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
  }
}
</style>
