<template>
  <div class="template-upload">
    <!-- 上传组件 正方形带+ -->
    <a-upload
      name="file"
      ref="uploader"
      :multiple="false"
      :disabled="isDisable"
      :file-list="upload.fileList"
      :action="upload.action"
      :headers="upload.headers"
      :data="upload.data"
      :max-count="1"
      :showUploadList="false"
      @change="handleFileChange"
      :before-upload="handleFileCheck">
      <div
        v-if="upload.fileList && upload.fileList.length == 0"
        class="upload-area">
        <plus-outlined></plus-outlined>
        <div class="ant-upload-text">
          {{ $t("coc.coc_placeholder_upload") }}
        </div>
      </div>
      <div v-else class="upload-file-list">
        <div
          v-for="(item, index) in upload.fileList"
          :key="index"
          class="file-list-item">
          <div class="file-item">
            <file-word-outlined></file-word-outlined>
            <div class="file-name">{{ item.name }}</div>
          </div>
          <div class="file-reupload-delete">
            <a-button
              type="link"
              @click="handleFileReupload(item)"
              v-if="!isDisable">
              {{ $t("coc.coc_reupload") }}
            </a-button>
            <a-button
              type="link"
              @click.stop.prevent="handleFileDelete(item)"
              danger
              v-if="!isDisable">
              {{ $t("coc.coc_btn_delete") }}
            </a-button>
            <!-- 查看按钮 -->
            <a-button
              type="link"
              @click.stop.prevent="handleFileview(item)"
              danger
              v-if="isDisable">
              {{ $t("coc.coc_btn_view") }}
            </a-button>
          </div>
        </div>
      </div>
    </a-upload>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import Core from "@/core";
import { PlusOutlined, FileWordOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
const $t = useI18n().t;
const $message = message;
const { FILE_URL_PREFIX, URL_POINT } = Core.Const.NET;
const props = defineProps({
  isDisable: {
    type: Boolean,
    default: false,
  },
  fileUrl: {
    type: Array,
    default: () => [],
  },
});
const upload = reactive({
  action: URL_POINT + "/core/1/file/file-upload",
  fileList: [],
  headers: {
    ContentType: false,
  },
  data: {
    token: Core.Data.getToken(),
    type: "file",
  },
});
watch(
  () => props.fileUrl,
  (val) => {
    if (val && val.length > 0) {
      upload.fileList = val;
    }
  }
);
const $emit = defineEmits(["update:upload"]);
// 上传前检查文件
const handleFileCheck = (file) => {
  if (
    file.type !== "application/msword" &&
    file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    $message.error($t("coc.coc_error_file_type"));
    return false;
  }
  return true;
};
// 上传文件
const handleFileChange = ({ file, fileList }) => {
  upload.fileList = fileList;
  $emit("update:upload", upload);
};
const handleFileReupload = (item) => {
  // 因为是computed，所以需要重新赋值，
  // 不能直接修改upload.fileList
  upload.fileList = [];
};
const handleFileDelete = (item) => {
  upload.fileList = [];
};
const handleFileview = (item) => {
  console.log(item);
  let url = "http://view.officeapps.live.com/op/view.aspx?src=" + item.url;
  window.open(url, "_blank");
};
</script>

<style lang="less" scoped>
.upload-file-list {
  width: 100%;

  .file-list-item {
    padding: 0 10px;
    border: 1px dashed var(--Color-border-2, #e5e6eb);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .file-item {
      display: flex;
      align-items: center;
      .anticon-file-word {
        margin-right: 8px;
        font-size: 18px;
      }
    }
  }
}
.upload-area {
  display: flex;
  width: 80px;
  height: 80px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 2px;
  border: 1px dashed var(--Color-border-2, #e5e6eb);
  background: var(--Color-fill-1, #f7f8fa);
}
.ant-form-item-control-input-content > span {
  display: block;
  width: 100%;
}
</style>
