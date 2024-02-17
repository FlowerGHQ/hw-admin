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
            :before-upload="handleFileCheck"
        >
            <div v-if="upload.fileList && upload.fileList.length == 0" class="upload-area">
                <plus-outlined></plus-outlined>
                <div class="ant-upload-text">
                    {{ $t('coc.coc_placeholder_upload') }}
                </div>
            </div>
            <div v-else class="upload-file-list">
                <div v-for="(item, index) in upload.fileList" :key="index" class="file-list-item">
                    <div class="file-item">
                        <file-word-outlined></file-word-outlined>
                        <div class="file-name">{{ item.name }}</div>
                    </div>
                    <div class="file-reupload-delete">
                        <a-button type="link" @click="handleFileReupload(item)" v-if="!isDisable">
                            {{ $t('coc.coc_reupload') }}
                        </a-button>
                        <a-button type="link" @click.stop.prevent="handleFileDelete(item)" danger v-if="!isDisable">
                            {{ $t('coc.coc_btn_delete') }}
                        </a-button>
                        <!-- 查看按钮 -->
                        <a-button type="link" @click.stop.prevent="handleFileview(item)" danger v-if="isDisable">
                            {{ $t('coc.coc_btn_view') }}
                        </a-button>
                    </div>
                </div>
            </div>
        </a-upload>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import Core from '@/core';
import { PlusOutlined, FileWordOutlined } from '@ant-design/icons-vue';
const { FILE_URL_PREFIX } = Core.Const.NET;
const props = defineProps({
    isDisable: {
        type: Boolean,
        default: false,
    },
    type: {
        type: [String, Array],
        default: 'file',
    },
    fileUrl: {
        type: Array,
        default: () => [],
    },
});
const upload = reactive({
    action: FILE_URL_PREFIX,
    fileList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'file',
    },
});
const $emit = defineEmits(['update:upload']);

watch(
    () => props.fileUrl,
    newVal => {
        upload.fileList = newVal.map(item => {
            return {
                uid: item.id,
                name: item.name,
                url: item.url,
            };
        });
        $emit('update:upload', upload);
    },
    {
        immediate: true,
        deep: true,
    },
);

// 上传前检查文件
const handleFileCheck = file => {
    props.type = props.type instanceof Array ? props.type : [props.type];
    console.log(props.type);
};
// 上传文件
const handleFileChange = ({ file, fileList }) => {
    console.log(file, fileList);
};
const handleFileReupload = item => {
    // 因为是computed，所以需要重新赋值，
    // 不能直接修改upload.fileList
    upload.fileList = [];
};
const handleFileDelete = item => {
    upload.fileList = [];
};
const handleFileview = item => {
    console.log(item);
    let url = 'http://view.officeapps.live.com/op/view.aspx?src=' + item.url;
    window.open(url, '_blank');
    // const width = 1000; const height = 800
    // const top = (window.screen.availHeight - height) / 2
    // const left = (window.screen.availWidth - width) / 2
    // window.open(url, '', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left)
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
