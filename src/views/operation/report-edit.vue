<template>
    <div id="ReportEdit" class="edit-container" :class="$i18n.locale">
        <!-- <div class="title-container">
            <div class="title-area">{{ form.id ? $t('crm_oi.edit') : $t('crm_oi.save') }}</div>
        </div> -->
        <div class="form-block">
            <div class="form-content">
                <!-- 区域 -->
                <div class="form-item required flex_start area">
                    <div class="key">{{ $t('operation.area') }}</div>
                    <div class="value">
                        <div class="area-body">
                            <a-radio-group v-model:value="form.area_type" name="radioGroup">
                                <a-radio :value="1">{{ $t(/*全部区域*/'operation.all_areas') }}</a-radio>
                                <a-radio :value="2">{{ $t(/*部分区域*/'operation.partial_areas') }}</a-radio>
                            </a-radio-group>
                            <template v-if="form.area_type === 2">
                                <MyCountryCascader v-model:value="form.area" />
                            </template>
                        </div>
                    </div>
                </div>
                <!-- 展示位置 -->
                <div class="form-item required location">
                    <div class="key">{{ $t('operation.display_location') }}</div>
                    <div class="value">
                        <a-checkbox-group v-model:value="form.show_type" @change="onChange">
                            <a-checkbox v-for="it in locationList" :value="it.value">
                                {{ $t('operation.' + it.label) }}
                            </a-checkbox>
                        </a-checkbox-group>
                        <div class="location-preview">
                            <img :src="getSrcImg(item, 'png')" v-for="item in locationPreviewList" :key="item"
                                @click="handleLocationPreview(item)">
                        </div>
                    </div>
                </div>
                <!-- 排序 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.sort') }}</div>
                    <div class="value">
                        <a-input-number 
                            style="width: 100%;" 
                            :placeholder="$t('operation.sort_placeholder')"
                            id="inputNumber" v-model:value="form.sort"                             
                            :min="1" 
                            :precision="0" 
                        />
                    </div>
                </div>
                <!-- 公告标题 -->
                <div class="form-item required">
                    <div class="key">{{ $t('operation.report_title') }}</div>
                    <div class="value">
                        <a-input v-model:value="form.title" :placeholder="$t('operation.title_placeholder')" />
                    </div>
                </div>
                <!-- 公告内容 -->
                <div class="form-item required flex_start">
                    <div class="key">{{ $t('operation.report_content') }}</div>
                    <div class="value">
                        <MyEditor v-model:modelValue="form.content" :modules="modules"
                            :placeholder="`${$t('operation.enter_content')}...`" />
                    </div>
                </div>
                <!-- 图片 -->
                <div class="form-item required flex_start">
                    <div class="key">{{ $t('operation.pic') }}</div>
                    <div class="value">
                        <MyUpload name="add_picList" v-model:value="form.img" showTip :limit="1" :limitSize="10"
                            tipPosition="right" :defaultPreview="false" @preview="handlePreview">
                            <template #tip>
                                <div class="tips">
                                    <p>{{ $t('operation.pic_tip1') }}</p>
                                    <p>{{ $t('operation.pic_tip2') }}</p>
                                    <p>{{ $t('operation.pic_tip3') }}</p>
                                </div>
                            </template>
                        </MyUpload>
                    </div>
                </div>
                <!-- 添加附件 -->
                <div class="form-item flex_start">
                    <div class="key">{{ $t('operation.add_attachments') }}</div>
                    <div class="value">
                        <MyUpload name="add_attachments" :tip="'123\n123'" v-model:value="form.attachment" showTip
                            :limit="3" :limitSize="50" tipPosition="right" accept=".pdf" :isCanUpType="['application/pdf']">
                            <template #tip>
                                <div class="tips">
                                    <p>{{ $t('operation.attachments_tip1') }}</p>
                                    <p>{{ $t('operation.attachments_tip2') }}</p>
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
        <MyPreviewImageVideo v-model:isClose="isClose" :type="uploadOptions.previewType"
            :previewData="uploadOptions.previewImageVideo">
        </MyPreviewImageVideo>
        <CheckModal :visible="modalShow" :bodyText="modalText">
            <a-button @click="routerChange('back')">{{ form.id ? $t(/*退出编辑*/'operation.exit_edit') : $t(/*退出创建*/'operation.exit_creation') }}</a-button>
            <a-button type="primary" @click="modalShow = false">{{ form.id ? $t(/*继续编辑*/'operation.continue_edit') :
                $t(/*继续创建*/'operation.continue_fill') }}</a-button>
        </CheckModal>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from 'vue';
import Core from '../../core';
import { useRouter, useRoute } from 'vue-router'

import MyUpload from "@/components/MyUpload/index.vue";
import MyCountryCascader from '@/components/MyCountryCascader/index.vue';
import MyEditor from "@/components/MyEditor/index.vue";
import MyPreviewImageVideo from "@/components/horwin/based-on-ant/MyPreviewImageVideo.vue";
import CheckModal from '@/components/horwin/based-on-ant/CheckModal.vue';

const imgModules = import.meta.globEager("../../assets/images/operation/*");

const { proxy } = getCurrentInstance();
const router = useRouter()
const route = useRoute()
const locationList = Core.Const.OPERATION.locationList

onMounted(() => {
    form.id = Number(route.query.id) || 0

    if (form.id) {
        getReportDetail();
        modalText.value = proxy.$t(/*编辑尚未提交，确定退出吗？*/'operation.edit_exit_tip')
    } else {
        modalText.value = proxy.$t(/*公告尚未创建成功，确定退出吗？*/'operation.exit_text')
    }

})
/* state start*/
const loading = ref(false)
const detail = reactive({})
const form = reactive({
    id: '',
    area_type: 1,
    area: [],
    show_type: ['1'],
    sort: '',
    title: '',
    type: 1,// 1 公告 2 广告
    content: '',
    img: '',
    attachment: [],
})
const uploadOptions = ref({
    previewType: "image",
    fileData: [], // 提交的数据
    previewImageVideo: [],
});
const areaIndex = ref('1')
const modules = reactive({
    toolbar: [
        ['bold'], // 加粗
        ['image'] // 链接、图片，需要视频的可以加上video
    ],
    // 拖拽上传
    imageDrop: true,
    // 调整图片大小
    imageResize: {
        displayStyles: {
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
        },
        modules: ['Resize', 'DisplaySize', 'Toolbar']
    },
})
const locationPreviewList = ref(['top_message', 'message_aggregation'])
const isClose = ref(false)
const modalText = ref(undefined)
const modalShow = ref(false)
/* state end*/

/* methods start*/
const routerChange = (type, item) => {
    switch (type) {
        case 'back':    // 详情
            let routeUrl = router.resolve({
                path: "/operation/report-list",
            })
            window.open(routeUrl.href, '_self')
            break;
    }
}
const getReportDetail = () => {
    loading.value = true;
    Core.Api.Operation.detail({
        id: form.id,
    }).then(res => {
        Object.assign(detail, res.detail)
        Object.assign(form, {
            area_type: detail.area_type,
            area: detail.area ? detail.area.split(',') : [],
            show_type: detail.show_type ? detail.show_type.split(',') : [],
            sort: detail.sort,
            title: detail.title,
            content: detail.content,
            img: JSON.parse(detail.img),
            attachment: JSON.parse(detail.attachment),
        })
    }).catch(err => {
        console.log('getReportDetail err', err)
    }).finally(() => {
        loading.value = false;
    });
}
const handleSubmit = () => {
    let formNew = Core.Util.deepCopy(form)
    console.log(formNew.area)
    if (formNew.area_type === 2 && formNew.area.length === 0) {//区域校验
        return proxy.$message.warning(proxy.$t('n.enter') + ":" + proxy.$t('operation.area'))
    }
    if (formNew.show_type.length === 0) {//展示位置校验
        return proxy.$message.warning(proxy.$t('n.enter') + ":" + proxy.$t('operation.display_location'))
    }
    if (!formNew.sort) {//排序校验
        return proxy.$message.warning(proxy.$t('n.enter') + ":" + proxy.$t('operation.sort'))
    }
    if (!formNew.title) {//公告标题校验
        return proxy.$message.warning(proxy.$t('n.enter') + ":" + proxy.$t('operation.report_title'))
    }
    if (!formNew.content) {//公告内容校验
        return proxy.$message.warning(proxy.$t('n.enter') + ":" + proxy.$t('operation.report_content'))
    }
    if (formNew.img.length === 0) {//图片校验
        return proxy.$message.warning(proxy.$t('n.upload') + ":" + proxy.$t('operation.pic'))
    }
    if(formNew.area_type === Core.Const.OPERATION.AREA_TYPE_MAP.ALL) {
        formNew.area = []
    }
    formNew.show_type = formNew.show_type.join(',')
    formNew.area = formNew.area.join(',')
    formNew.img = JSON.stringify(formNew.img)
    formNew.attachment = JSON.stringify(formNew.attachment)
    Core.Api.Operation.save({
        ...formNew,
    }).then(() => {
        proxy.$message.success(proxy.$t('pop_up.save_success'))
        router.go(-1)
    }).catch(err => {
        console.log('handleSubmit err:', err)
    })
}
const onChange = () => {

}
const handleLocationPreview = (e) => {
    const arr = locationPreviewList.value.map(item => {
        return getSrcImg(item, 'png')
    })
    uploadOptions.value.previewImageVideo = arr;
    const index = locationPreviewList.value.indexOf(e);
    if (index !== -1) {
        const item = uploadOptions.value.previewImageVideo.splice(index, 1)[0];
        uploadOptions.value.previewImageVideo.unshift(item);
    }
    isClose.value = true;
}
const handlePreview = ({ file, fileList }) => {
    uploadOptions.value.previewType = 'image';
    uploadOptions.value.previewImageVideo = [];
    fileList.forEach((el) => {
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
}
// 获取照片
const getSrcImg = (name, type = "png") => {
    const path = `../../assets/images/operation/${name}.${type}`;
    return imgModules[path]?.default;
}
/* methods end*/

/* Fetch start*/

/* Fetch end*/
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
                        >p {
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
                        // font-size: 14px;
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
                        border-color: #EAECF1 !important;

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
                        border-color: #EAECF1 !important;
                        background: #FFF;

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

                        >img {
                            width: 142px;
                            height: 67px;
                            border-radius: 4px;
                            border: 1px solid #EAECF1;
                            overflow: hidden;
                            cursor: pointer;

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
        padding: 20px;
        text-align: center;

        .btn-block {
            border-radius: 4px;
            width: auto;
            height: 32px;
            padding: 4px 16px;
        }
    }
}
</style>
