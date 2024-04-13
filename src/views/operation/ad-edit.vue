<template>
    <div id="ReportEdit" class="edit-container" :class="$i18n.locale">
        <div class="form-block">
            <div class="form-content">
                <!-- 区域 -->
                <div class="form-item required flex_start area">
                    <div class="key">{{ $t('operation.area') }}</div>
                    <div class="value">
                        <div class="area-body">
                            <a-radio-group v-model:value="form.area_type" name="radioGroup">
                                <a-radio :value="1">{{ $t(/*全部区域*/ 'operation.all_areas') }}</a-radio>
                                <a-radio :value="2">{{ $t(/*部分区域*/ 'operation.partial_areas') }}</a-radio>
                            </a-radio-group>
                            <template v-if="form.area_type === 2">
                                <MyCountryCascader v-model:value="form.area" />
                            </template>
                        </div>
                    </div>
                </div>
                <!-- 排序 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.sort') }}</div>
                    <div class="value">
                        <a-input-number
                            style="width: 100%"
                            :placeholder="$t('operation.sort_placeholder')"
                            v-model:value="form.sort"
                            :min="1"
                            :precision="0"
                        />
                    </div>
                </div>
                <!-- 链接 -->
                <div class="form-item">
                    <div class="key">{{ $t('operation.link') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.url" :placeholder="$t('def.input')" />
                    </div>
                </div>
                <!-- 图片说明 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.img_desc') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.img_desc" :placeholder="$t('operation.img_desc_tip')" />
                    </div>
                </div>
                <!-- 图片 -->
                <div class="form-item required flex_start">
                    <div class="key">{{ $t('operation.pic') }}</div>
                    <div class="value">
                        <MyUpload
                            name="add_picList"
                            v-model:value="form.img"
                            showTip
                            :limit="1"
                            :limitSize="10"
                            :valueType="2"
                            tipPosition="right"
                            :defaultPreview="false"
                            ratioLimit
                            :ratio="{ width: 1920, height: 720 }"
                            @preview="handlePreview"
                        >
                            <template #tip>
                                <div class="tips">
                                    <p>{{ $t('operation.pic_tip1') }}</p>
                                    <p>{{ $t('operation.pic_size_tip') }}</p>
                                    <p>{{ $t('operation.pic_tip3') }}</p>
                                </div>
                            </template>
                        </MyUpload>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-btns">
            <a-button class="btn-block" @click="modalShow = true">{{ $t('def.cancel') }}</a-button>
            <a-button class="btn-block" @click="handleSubmit" type="primary">{{ $t('def.submit') }}</a-button>
        </div>
        <!-- 自定义图片预览 -->
        <MyPreviewImageVideo
            v-model:isClose="isClose"
            :type="uploadOptions.previewType"
            :previewData="uploadOptions.previewImageVideo"
        >
        </MyPreviewImageVideo>
        <CheckModal :visible="modalShow" :bodyText="modalText" :key="`modal-${lang}`">
            <a-button @click="routerChange('back')">{{
                form.id ? $t(/*退出编辑*/ 'operation.exit_edit') : $t(/*退出创建*/ 'operation.exit_creation')
            }}</a-button>
            <a-button type="primary" @click="modalShow = false">{{
                form.id ? $t(/*继续编辑*/ 'operation.continue_edit') : $t(/*继续创建*/ 'operation.continue_fill')
            }}</a-button>
        </CheckModal>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, reactive, computed, watch } from 'vue';
import Core from '../../core';
import { useRouter, useRoute } from 'vue-router';
import MyUpload from '@/components/MyUpload/index.vue';
import MyCountryCascader from '@/components/MyCountryCascader/index.vue';
import MyPreviewImageVideo from '@/components/horwin/based-on-ant/MyPreviewImageVideo.vue';
import CheckModal from '@/components/horwin/based-on-ant/CheckModal.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

onMounted(() => {
    form.value.id = Number(route.query.id) || 0;

    if (form.value.id) {
        getReportDetail(form.value.id);
        modalText.value = proxy.$t(/*编辑尚未提交，确定退出吗？*/ 'operation.edit_exit_tip');
    } else {
        modalText.value = proxy.$t(/*公告尚未创建成功，确定退出吗？*/ 'operation.exit_text');
    }
});
const lang = computed(() => {
    return proxy.$store.state.lang;
});
watch(lang, newV => {
    if (form.value.id) {
        getReportDetail(form.value.id);
        modalText.value = proxy.$t(/*编辑尚未提交，确定退出吗？*/ 'operation.edit_exit_tip');
    } else {
        modalText.value = proxy.$t(/*公告尚未创建成功，确定退出吗？*/ 'operation.exit_text');
    }
});
/* state start*/
const loading = ref(false);
const form = ref({
    id: '',
    type: Core.Const.OPERATION.OPERATION_TYPE_MAP.AD, // 1 公告 2 广告
    area_type: Core.Const.OPERATION.AREA_TYPE_MAP.ALL, // 1 全部 2 部分
    area: [],
    sort: '',
    url: '',
    img_desc: '',
    img: [],
    show_type: 1, // 1 顶部 2 消息合集区
});
const detail = ref({});
const uploadOptions = ref({
    previewType: 'image',
    fileData: [], // 提交的数据
    previewImageVideo: null,
});
const isClose = ref(false);
const modalText = ref(undefined);
const modalShow = ref(false);
/* state end*/
/* Fetch start*/
const getReportDetail = id => {
    loading.value = true;
    Core.Api.Operation.detail({
        id: id,
    })
        .then(res => {
            console.log('getReportDetail res', res);
            detail.value = res.detail;
            Object.assign(form.value, {
                area_type: detail.value.area_type,
                area: detail.value.area ? detail.value.area.split(',') : [],
                sort: detail.value.sort,
                url: detail.value.url,
                img: detail.value.img ? JSON.parse(detail.value.img) : [],
                img_desc: detail.value.img_desc,
                show_type: detail.value.show_type,
            });
        })
        .catch(err => {
            console.log('getReportDetail err', err);
        })
        .finally(() => {
            loading.value = false;
        });
};
const handleSubmit = () => {
    let params = Core.Util.deepCopy(form.value);
    if (params.id === 0) {
        delete params.id;
    }
    console.log('params', params);
    if (checkInput(params)) {
        return;
    }
    if (params.area_type === Core.Const.OPERATION.AREA_TYPE_MAP.ALL) {
        params.area = [];
    }
    params.area = params.area.join(',');
    params.img = JSON.stringify(params.img);
    Core.Api.Operation.save({
        ...params,
    })
        .then(() => {
            proxy.$message.success(proxy.$t('pop_up.save_success'));
            routerChange('back');
        })
        .catch(err => {
            console.log('handleSubmit err:', err);
        });
};
/* Fetch end*/
/* methods start*/
const routerChange = (type, item) => {
    switch (type) {
        case 'back': // 详情
            let routeUrl = router.resolve({
                path: '/operation/ad-list',
            });
            window.open(routeUrl.href, '_self');
            break;
    }
};
const handlePreview = ({ file, fileList }) => {
    uploadOptions.value.previewType = 'image';

    if (file.response) {
        uploadOptions.value.previewImageVideo = Core.Util.imageFilter(file.response?.data?.filename, 1);
    }
    isClose.value = true;
};
const checkInput = form => {
    const { area_type, area, sort, url, img_desc, img } = form;

    if (area_type === Core.Const.OPERATION.AREA_TYPE_MAP.PART && !area.length) {
        proxy.$message.warning(proxy.$t('operation.tip_area'));
        return true;
    }
    if (!sort) {
        proxy.$message.warning(proxy.$t('operation.tip_sort'));
        return true;
    }
    // if (!url) {
    //     proxy.$message.warning(proxy.$t('operation.tip_url'));
    //     return true;
    // }
    if (!img_desc) {
        proxy.$message.warning(proxy.$t('operation.tip_img_desc'));
        return true;
    }
    if (!img.length) {
        proxy.$message.warning(proxy.$t('operation.tip_upload'));
        return true;
    }

    return false;
};
/* methods end*/
</script>

<style lang="less">
#ReportEdit {
    padding-top: 20px;

    .form-block {
        .form-content {
            margin: 0 auto;

            .form-item {
                .key {
                    text-align: right;
                    font-size: 14px;
                    margin-right: 8px;
                }

                .value {
                    .area-body {
                        .ant-radio-group {
                            .ant-radio-wrapper {
                                font-size: 14px;
                            }
                        }
                    }

                    .tips {
                        > p {
                            color: #666;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;

                            &:nth-child(n + 2) {
                                margin-top: 5px;
                            }
                        }
                    }

                    .ant-input,
                    .ant-input-number {
                        font-size: 14px;
                    }

                    .upload-wrap {
                        margin-bottom: 0;

                        .ant-upload.ant-upload-select-picture-card {
                            margin-bottom: 0;
                        }
                    }

                    .cascader-area {
                        margin-top: 8px;
                    }

                    //富文本编辑器
                    .ql-toolbar.ql-snow {
                        border-radius: 3px 3px 0px 0px;
                        background: #f2f3f5;
                        padding: 10px;
                        font-size: 12px;
                        border-color: #eaecf1 !important;

                        .ql-formats {
                            &:nth-child(1) {
                                margin-right: 0;
                            }

                            .ql-list,
                            .ql-underline,
                            .ql-italic,
                            .ql-bold {
                                padding: 0;
                                width: auto;
                                margin-right: 16px;
                                height: 15px;
                            }

                            .ql-list {
                                margin-right: 0;
                            }
                        }

                        &::after {
                            display: none;
                        }
                    }

                    .ql-container.ql-snow {
                        border-radius: 0px 0px 3px 3px;
                        flex: 1;
                        border-color: #eaecf1 !important;
                        background: #fff;

                        .ql-editor {
                            padding: 10px;
                            min-height: 143px;

                            ul {
                                padding-left: 0;
                            }

                            li {
                                padding-left: 1em;
                            }

                            &::before {
                                font-style: normal;
                                color: #bfbfbf;
                            }
                        }
                    }
                }
                &.area {
                    .key {
                        margin-top: 5px;
                    }
                }

                &.location {
                    padding-bottom: 67px;

                    .value {
                        position: relative;
                    }

                    .location-preview {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        transform: translateY(100%);

                        > img {
                            width: 142px;
                            height: 67px;
                            border-radius: 4px;
                            border: 1px solid #eaecf1;
                            overflow: hidden;

                            &:nth-child(n + 2) {
                                margin-left: 24px;
                            }
                        }
                    }
                }

                &.flex_start {
                    align-items: flex-start;
                }
            }
        }
    }

    .form-btns {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 20px 0px 20px 0;
        box-sizing: border-box;

        .btn-block {
            border-radius: 4px;
            width: auto;
            height: 32px;
            padding: 4px 16px;
        }
    }
}
</style>
