<template>
    <!-- 初审的modal -->
    <div class="modal-area" ref="modalAreaRef">
        <a-modal
            :title="$t('supply-chain.audit_supplier')"
            :visible="modalVisible"
            :destroyOnClose="true"
            @cancel="handleCancel"
            @ok="handleOk"
            wrapClassName="trial-modal"
            :getContainer="() => modalAreaRef"
        >
            <a-form :model="form" :rules="rules" ref="formRef">
                <!-- 淘汰原因select -->
                <a-form-item name="remark" :label="$t('supply-chain.eliminate_reason')">
                    <a-select v-model:value="form.remark" :placeholder="$t('def.select')" allowClear>
                        <a-select-option v-for="item in eliminateReasonOptions" :key="item.id" :value="item.name">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <!-- 附件 v-if="form.audit_status === 30"-->
                <a-form-item name="content" :label="$t('supply-chain.attachment')">
                    <MyUpload
                        v-model:value="form.content"
                        showTip
                        :limit="3"
                        :limitSize="10"
                        :valueType="1"
                        tipPosition="right"
                        :defaultPreview="false"
                        @preview="handlePreview"
                        :tip="$t('supply-chain.upload_attachment')"
                    />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
    <!-- 自定义图片预览 -->
    <MyPreviewImageVideo
        v-model:isClose="isClose"
        :type="uploadOptions.previewType"
        :previewData="uploadOptions.previewImageVideo"
    />
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Core from '@/core';
import { message } from 'ant-design-vue';
import MyUpload from '@/components/MyUpload/index.vue';
import MyPreviewImageVideo from '@/components/horwin/based-on-ant/MyPreviewImageVideo.vue';

const $t = useI18n().t;
const props = defineProps({
    modalVisible: {
        type: Boolean,
        default: true,
    },
    details: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['handleOk', 'handleCancel']);

const modalAreaRef = ref(null);
const isClose = ref(false);
const formRef = ref(null);
const form = ref({
    audit_status: 60,
    remark: undefined,
    content: undefined,
});
const rules = reactive({
    audit_status: [{ required: true, message: $t('supply-chain.please_select_result'), trigger: ['blur', 'change'] }],
    remark: [{ required: true, message: $t('supply-chain.please_enter_reason'), trigger: ['blur', 'change'] }],
});
const uploadOptions = ref({
    previewType: 'image',
    fileData: [], // 提交的数据
    previewImageVideo: [],
});
const eliminateReasonOptions = ref([]);

const handleOk = () => {
    formRef.value.validate().then(() => {
        let params = {
            id: props.details.id,
            audit_status: form.value.audit_status,
            remark: form.value.remark,
            content: form.value.content,
        };
        Core.Api.SUPPLY.audit(params).then(res => {
            formRef.value.resetFields();
            form.value = {
                audit_status: 60,
                remark: undefined,
                content: undefined,
            };
            emit('handleOk');
        });
    });
};
const handleCancel = () => {
    // 重置表单
    formRef.value.resetFields();
    form.value = {
        audit_status: 60,
        remark: undefined,
        content: undefined,
    };
    emit('handleCancel');
};
const handlePreview = ({ file, fileList }) => {
    uploadOptions.value.previewType = 'image';
    uploadOptions.value.previewImageVideo = [];
    fileList.forEach(el => {
        if (el.response) {
            if (file.uid === el.uid) {
                // 让预览的哪张图片在第一张
                uploadOptions.value.previewImageVideo.unshift(Core.Util.imageFilter(file.response?.data?.filename, 1));
            } else {
                uploadOptions.value.previewImageVideo.push(Core.Util.imageFilter(file.response?.data?.filename, 1));
            }
        }
    });
    isClose.value = true;
};
// 获取淘汰原因
const getEliminateReason = () => {
    Core.Api.ItemCategory.tree({ type: 40, parent_id: 0, depth: 1 }).then(res => {
        eliminateReasonOptions.value = res.list;
    });
};
onMounted(() => {
    getEliminateReason();
});
</script>

<style lang="less" scoped>
:deep(.trial-modal) {
    .ant-modal-header,
    .ant-modal-footer {
        text-align: center;
    }
}
</style>
