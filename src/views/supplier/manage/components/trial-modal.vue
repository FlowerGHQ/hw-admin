<template>
    <!-- 初审的modal -->
    <div class="modal-area" ref="modalAreaRef">
        <a-modal
            :title="$t('supply-chain.audit_supplier')"
            :visible="modalVisible"
            @cancel="handleCancel"
            :destroyOnClose="true"
            @ok="handleOk"
            wrapClassName="trial-modal"
            :getContainer="() => modalAreaRef"
        >
            <a-form :model="form" :rules="rules" ref="formRef">
                <!-- 选择结果 -->
                <a-form-item name="audit_status">
                    <a-radio-group v-model:value="form.audit_status">
                        <a-radio v-for="item in radioList" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- 淘汰原因 -->
                <a-form-item name="remark" v-if="form.audit_status === 60 || form.audit_status === 30">
                    <a-textarea
                        v-model:value="form.remark"
                        maxlength="50"
                        :placeholder="$t('supply-chain.please_enter_reason')"
                        showCount
                        :auto-size="{ minRows: 4, maxRows: 4 }"
                    />
                </a-form-item>
                <!-- 附件 v-if="form.audit_status === 30"-->
                <a-form-item name="content" :label="$t('supply-chain.attachment')" v-if="form.audit_status === 30">
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
const radioList = computed(() => {
    switch (props.details.audit_status) {
        case 10:
            return [
                { label: $t('supply-chain.become_potential_supplier'), value: 10 },
                { label: $t('supply-chain.not_deal'), value: 50 },
                { label: $t('supply-chain.eliminate'), value: 60 },
            ];
            break;
        case 40:
            return [
                // 考虑免审20 现场考核40 淘汰60
                { label: $t('supply-chain.consider_exempt'), value: 20 },
                { label: $t('supply-chain.on_site_assessment'), value: 40 },
                { label: $t('supply-chain.eliminate'), value: 60 },
            ];
            break;
        case 50:
            return [
                //  30 同意免审 40 现场考核
                { label: $t('supply-chain.agree_exempt'), value: 30 },
                { label: $t('supply-chain.on_site_assessment'), value: 40 },
            ];
            break;
        default:
            break;
    }
});
const isClose = ref(false);

const formRef = ref(null);
const form = ref({
    audit_status: undefined,
    remark: '',
    content: '',
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
                audit_status: undefined,
                remark: '',
                content: '',
            };
            emit('handleOk');
        });
    });
};
const handleCancel = () => {
    // 重置表单
    formRef.value.resetFields();
    form.value = {
        audit_status: undefined,
        remark: '',
        content: '',
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
</script>

<style lang="less" scoped>
:deep(.trial-modal) {
    .ant-modal-header,
    .ant-modal-footer {
        text-align: center;
    }
}
</style>
