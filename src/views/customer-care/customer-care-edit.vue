<template>
    <div id="customer-care-edit" class="common-edit-container">
        <div class="title-container">
            <div class="title-area">
                {{ route.query.id ? $t("customer-care.modify_inquiry_form") : $t("customer-care.create_inquiry_form") }}
            </div>
        </div>
        <!-- 问题描述 -->
        <div class="form-block">
            <div class="form-title">
                <div class="title"></div>
            </div>
            <div class="form-content">
                <!-- 分销商账号 -->
                <div v-if="isDistributerAdmin" class="form-item required">
                    <div class="key t-r">{{ $t("customer-care.distributor_account_number") }}:</div>
                    <div class="value">
                        <a-input
                            v-model:value="formParams.account"
                            :placeholder="$t('common.please_enter') + $t('customer-care.distributor_account_number')"
                        />
                    </div>
                </div>
                <!-- 问询单类型 -->
                <div class="form-item required">
                    <div class="key t-r">{{ $t("customer-care.inquiry_form_type") }}:</div>
                    <div class="value">
                        <a-radio-group v-model:value="formParams.type">
                            <a-radio v-for="(item, index) in Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE" :value="item.value">
                                {{ $t(item.t) }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- 故障日期 -->
                <div
                    v-if="!$Util.Common.returnTypeBool(formParams.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION])"
                    class="form-item required"
                >
                    <div class="key t-r">{{ $t("customer-care.failure_date") }}:</div>
                    <div class="value">
                        <a-date-picker class="w-370" v-model:value="formParams.time" />
                    </div>
                </div>
                <!-- 车型 -->
                <div class="form-item required">
                    <div class="key t-r">{{ $t("common.vehicle_model") }}:</div>
                    <div class="value">可能是树状结构</div>
                </div>
                <!-- 车架号 -->
                <div
                    v-if="$Util.Common.returnTypeBool(formParams.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION])"
                    class="form-item d-f-s required"
                >
                    <div class="key t-r">{{ $t("common.vehicle_no") }}:</div>
                    <div class="value">
                        <a-table
                            :columns="vehicle_column"
                            :dataSource="formParams.list"
                            :scroll="{ x: true }"
                            :row-key="(record) => record.id"
                            :pagination="false"
                            class="specific-table"
                        >
                            <template #headerCell="{ title }">
                                {{ $t(title) }}
                            </template>
                            <template #bodyCell="{ column, record, index }">
                                <!-- 车架号 -->
                                <template v-if="column.key === 'no'">
                                    <a-input v-model:value="record.no" :placeholder="$t('common.please_enter') + $t('common.vehicle_no')" />
                                </template>
                                <!-- 公里数 -->
                                <template v-if="column.key === 'mileage'">
                                    <a-input v-model:value="record.mileage" :placeholder="$t('common.please_enter') + $t('customer-care.mileage')" />
                                </template>
                                <!-- 操作 -->
                                <template v-if="column.key === 'operations'">
                                    <a-button v-if="index !== 0" type="link" @click="onAddBtn('delete', record, index)">
                                        <i class="icon i_delete" />
                                        {{ $t("common.delete") }}
                                    </a-button>
                                </template>
                            </template>
                        </a-table>

                        <a-button class="m-t-16" type="primary" ghost @click="onAddBtn('add-data')">
                            {{ $t("supply-chain.add_opponents") }}
                        </a-button>
                    </div>
                </div>
                <!-- 公里数 -->
                <div
                    v-if="$Util.Common.returnTypeBool(formParams.type, [Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION])"
                    class="form-item required"
                >
                    <div class="key t-r">{{ $t("customer-care.mileage") }}:</div>
                    <div class="value">
                        <a-input v-model:value="formParams.mileage" :placeholder="$t('common.please_enter') + $t('customer-care.mileage')" />
                    </div>
                </div>
                <!-- 问题描述 -->
                <div class="form-item d-f-s required">
                    <div class="key t-r">{{ $t("customer-care.problem_description") }}:</div>
                    <div class="value">
                        <a-textarea
                            v-model:value="formParams.description"
                            :placeholder="$t('common.please_enter') + $t('customer-care.problem_description')"
                            allow-clear
                            :maxlength="20000"
                        />
                    </div>
                </div>
                <!-- 添加附件 -->
                <div class="form-item d-f-s">
                    <div class="key t-r">{{ $t("customer-care.add_attachment") }}:</div>
                    <div class="value d-f">

                        <MyUpload
                            :videoLimit="uploadOptions.videoLimit"
                            :imageLimit="uploadOptions.imageLimit"
                            @change="handleDetailChange"
                            @preview="handlePreview"
                            @remove="handleRemove"
                        >                            
                        </MyUpload>

                        <div class="add-attachment-tip m-l-10">
                            <div>{{ $t("customer-care.tip1") }}</div>
                            <div>{{ $t("customer-care.tip2") }}</div>
                            <div>{{ $t("customer-care.tip3") }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns footer-btn">
            <a-button @click="routerChange('back')">{{ $t("def.cancel") }}</a-button>
            <a-button @click="handleSubmit" type="primary" v-if="$auth('repair-order.save')">{{ $t("def.sure") }}</a-button>
        </div>

        <!-- 自定义图片预览 -->
        <MyPreviewImageVideo
            v-model:isClose="isClose"
            :type="isVideoImage" 
            :previewData="uploadOptions.previewImage"
        >
        </MyPreviewImageVideo>
    </div>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance, onMounted } from "vue";
import Core from "@/core";
import { useRouter, useRoute } from "vue-router";
import { Upload, message } from "ant-design-vue";
import MyPreviewImageVideo from './components/MyPreviewImageVideo.vue'
import MyUpload from './components/MyUpload.vue'

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const isDistributerAdmin = ref(false); // 根据路由判断其是用在分销商(false) 还是平台方(true)

const uploadOptions = ref({    
    // previewImage
    previewImage: ["https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png", "https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png"],
    // previewVideo
    previewVideo: undefined,
});

// 判断是照片还是视频查看
const isVideoImage = ref('image');
const isClose = ref(false)
const formParams = ref({
    account: undefined,
    type: 1,
    time: undefined,
    description: undefined,
    file: undefined,
    mileage: undefined, // 公里数
    list: [
        {
            no: "",
            mileage: "",
        },
    ], // 车架号、公里数
});

onMounted(() => {}),
watch(
    () => router.currentRoute.value,
    (newValue, oldValue) => {
        console.log("newValue", newValue);
        if (newValue.matched[0].path === "/customer-care") {
            // 分销商的客户关怀
            isDistributerAdmin.value = false;
        } else if (newValue.matched[0].path === "/inquiry-management") {
            // 平台方
            isDistributerAdmin.value = true;
        }
    },
    {
        deep: true,
        immediate: true,
    }
);

/* computed start*/
const vehicle_column = computed(() => {
    let result = [
        { title: proxy.$t("common.vehicle_no"), dataIndex: "no", key: "no" }, // 车架号
        { title: proxy.$t("customer-care.mileage"), dataIndex: "mileage", key: "mileage" }, // 公里数
        {
            title: proxy.$t("common.operations"),
            dataIndex: "operations",
            key: "operations",
            fixed: "right",
            width: 100,
        }, // 操作
    ];
    return result;
});
/* computed end*/

/* methods start*/
const onAddBtn = (type, record, index) => {
    switch (type) {
        case "add-data":
            formParams.value.list.push({
                no: "",
                mileage: "",
            });
            break;
        case "delete":
            formParams.value.list.splice(index, 1);
            break;

        default:
            break;
    }
};
// 提交
const handleSubmit = () => {
    isClose.value = true
};

// 上传组件事件
const handleDetailChange = ({ file, fileList }) => {
    console.log("输出文件", file, fileList);
    if (file.status === "done") {
        // 上传成功
        if (file.response.code === 0) {
        } else {
            // 上传失败
            message.error(file.response.msg);
        }
    } else if (file.status === "error") {
        message.error(proxy.$t("common.upload_fail"));
    }
};
const handlePreview = ({ file, fileList }) => {
    console.log("预览", file, fileList);

    if (/^video\/+/.test(file.type)) {
        uploadOptions.value.previewVideo = ""
        isClose.value = true
        return
    }

    uploadOptions.value.previewImage = [];    
    fileList.forEach((el) => {
        // console.log("输出的东西", el.response);
        if (el.response) {
            if (/^image\/+/.test(el.type)) {
                if (file.uid === el.uid) {
                    // 让预览的哪张图片在第一张
                    uploadOptions.value.previewImage.unshift(Core.Const.NET.FILE_URL_PREFIX + el.response?.data?.filename);
                } else {
                    uploadOptions.value.previewImage.push(Core.Const.NET.FILE_URL_PREFIX + el.response?.data?.filename);
                }
            }
        }
    });
    console.log("结果", uploadOptions.value.previewImage);
    isClose.value = true
};
const handleRemove = ({ file, fileList }) => {
    console.log("删除", file);
};
/* methods end*/
</script>

<style lang="less" scoped>
#customer-care-edit {
    height: 100%;
    position: relative;

    .d-f-a {
        display: flex;
        align-items: center;
    }

    .customer-care-required {
        &::before {
            content: "*";
            color: #eb4141;
            margin-right: 4px;
            vertical-align: middle;
        }
    }

    .add-attachment-tip {
        color: #666;
        font-size: 14px;
        font-weight: 400;
    }

    .footer-btn {
        position: absolute;
        bottom: 0;
        width: calc(100% - 200px);
        text-align: center;
    }

    // upload
    .image-inner {
        border: 2px solid #0061ff;
        width: 16px;
        height: 16px;
        padding: 3px;
        display: flex;
        justify-content: center;
        img {
            width: 100%;
            height: 100%;
        }
    }    
}

.ant-upload-picture-card-wrapper {
    width: initial;
    :deep(.ant-upload.ant-upload-select-picture-card) {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        border: 1px dashed #eaecf1;
        background: #fff;
        margin: 0;
    }

    :deep(.ant-upload-list-picture-card-container) {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        border: 1px dashed #eaecf1;
        background: #fff;
    }
}

.w-370 {
    width: 370px;
}

.d-f-s {
    align-items: flex-start !important;
}

.d-f {
    display: flex;
    align-items: center;
}

.t-r {
    text-align: right;
}
</style>
