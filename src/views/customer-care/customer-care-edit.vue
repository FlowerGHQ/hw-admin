<template>
    <div id="customer-care-edit" class="common-edit-container">
        <div v-if="!isDetailEnter" class="title-container">
            <div class="title-area">
                {{ route.query.id ? $t('customer-care.modify_inquiry_form') : $t('customer-care.create_inquiry_form') }}
            </div>
        </div>
        <!-- 问题描述 -->
        <div class="form-block" :class="{ 'msg-detail-form-block': !isDetailEnter ? false : true }">
            <div v-if="!isDetailEnter" class="form-title">
                <div class="title"></div>
            </div>
            <div class="form-content" :class="{ 'w-100': !isDetailEnter ? false : true }">
                <!-- 分销商账号 -->
                <div v-if="isDistributerAdmin" class="form-item required">
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('customer-care.distributor_account_number') }}:
                    </div>
                    <div class="value">
                        <a-select
                            v-model:value="formParams.org_name"
                            :placeholder="$t('common.please_enter') + $t('customer-care.distributor_account_number')"
                            style="width: 100%"
                            show-search
                            :filter-option="false"
                            @search="onFetchUser"
                        >
                            <template v-for="(item, index) in distributorFindList">
                                <a-select-option :value="item.name">
                                    ({{ $i18n.locale === 'en' ? item.country_en || '-' : item.country || '-' }})
                                    {{ item.name }}
                                </a-select-option>
                            </template>
                        </a-select>
                    </div>
                </div>
                <!-- 问询单类型 -->
                <div class="form-item required">
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('customer-care.inquiry_form_type') }}:
                    </div>
                    <div class="value">
                        <a-radio-group v-model:value="formParams.type" @change="onFormParamsType">
                            <a-radio
                                v-for="(item, index) in Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE"
                                :value="item.value"
                            >
                                {{ $t(item.t) }}
                            </a-radio>
                        </a-radio-group>
                    </div>
                </div>
                <!-- 故障日期 -->
                <div
                    v-if="
                        !$Util.Common.isMember(formParams.type, [
                            Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION,
                        ])
                    "
                    class="form-item required"
                >
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('customer-care.failure_date') }}:
                    </div>
                    <div class="value">
                        <a-date-picker
                            class="w-370"
                            v-model:value="formParams.fault_time"
                            :locale="$i18n.locale === 'en' ? localeEn : localeZh"
                        />
                    </div>
                </div>
                <!-- 车型 -->
                <div class="form-item required">
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('common.vehicle_model') }}:
                    </div>
                    <div class="value">
                        <a-tree-select
                            v-model:value="formParams.category_id"
                            allow-clear
                            show-search
                            tree-default-expand-all
                            :tree-data="treeData"
                            :placeholder="$t('common.please_enter') + $t('common.vehicle_model')"
                        >
                        </a-tree-select>
                    </div>
                </div>
                <!-- 车架号 -->
                <div
                    v-if="
                        $Util.Common.isMember(formParams.type, [
                            Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION,
                        ])
                    "
                    class="form-item d-f-s required"
                >
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('common.vehicle_no') }}:
                    </div>
                    <div class="value">
                        <a-table
                            :columns="vehicle_column"
                            :dataSource="formParams.vehicle_list"
                            :scroll="{ x: true }"
                            :row-key="record => record.id"
                            :pagination="false"
                            :locale="$i18n.locale === 'en' ? localeEn : localeZh"
                            class="specific-table"
                        >
                            <template #headerCell="{ title, column }">
                                {{ $t(title) }}
                                <!-- <span v-if="column.key === 'mileage'">({{ $t('customer-care.not_mandatory') }})</span> -->
                            </template>
                            <template #bodyCell="{ column, record, index }">
                                <!-- 车架号 -->
                                <template v-if="column.key === 'vehicle_uid'">
                                    <a-input
                                        v-model:value="record.vehicle_uid"
                                        :placeholder="$t('common.please_enter') + $t('common.vehicle_no')"
                                    />
                                </template>
                                <!-- 公里数 -->
                                <template v-if="column.key === 'mileage'">
                                    <a-input-number
                                        v-model:value="record.mileage"
                                        :placeholder="$t('common.please_enter') + $t('customer-care.mileage')"
                                        min="0"
                                        max="9999999"
                                    >
                                        <template #addonAfter>
                                            <span>KM</span>
                                        </template>
                                    </a-input-number>
                                </template>
                                <!-- 操作 -->
                                <template v-if="column.key === 'operations'">
                                    <a-button v-if="index !== 0" type="link" @click="onAddBtn('delete', record, index)">
                                        <i class="icon i_delete" />
                                        {{ $t('common.delete') }}
                                    </a-button>
                                </template>
                            </template>
                        </a-table>

                        <a-button class="m-t-10" type="primary" ghost @click="onAddBtn('add-data')">
                            {{ $t('common.add') }}
                        </a-button>
                    </div>
                </div>
                <!-- 公里数 -->
                <div
                    v-if="
                        $Util.Common.isMember(formParams.type, [
                            Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION,
                        ])
                    "
                    class="form-item"
                >
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('customer-care.mileage') }}:
                    </div>
                    <div class="value">
                        <a-input-number
                            class="w-100"
                            v-model:value="formParams.mileage"
                            :placeholder="$t('common.please_enter') + $t('customer-care.mileage')"
                            min="0"
                            max="9999999"
                        >
                            <template #addonAfter>
                                <span>KM</span>
                            </template>
                        </a-input-number>
                    </div>
                </div>
                <!-- 问题描述 -->
                <div class="form-item d-f-s required">
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('customer-care.problem_description') }}:
                    </div>
                    <div class="value">
                        <a-textarea
                            v-model:value="formParams.description"
                            :placeholder="$t('common.please_enter') + $t('customer-care.problem_description')"
                            allow-clear
                            :autosize="{ minRows: 4, maxRows: 6 }"
                            :maxlength="2000"
                        />
                    </div>
                </div>
                <!-- 添加附件 -->
                <div
                    class="form-item d-f-s"
                    :class="{
                        required: $Util.Common.isMember(formParams.type, [
                            Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY,
                        ]),
                    }"
                >
                    <div class="key t-r" :class="{ 'w-180': $i18n.locale === 'en' }">
                        {{ $t('customer-care.add_attachment') }}:
                    </div>
                    <div class="value d-f">
                        <MyUploads
                            class="edit"
                            v-model:fileList="uploadOptions.fileData"
                            :tips="['customer-care.tip1', 'customer-care.tip2', 'customer-care.tip3']"
                            @change="handleDetailChange"
                            @preview="handlePreview"
                            @remove="handleRemove"
                        >
                        </MyUploads>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isDetailEnter" class="form-btns footer-btn">
            <a-button @click="onAddBtn('back')">{{ $t('def.cancel') }}</a-button>
            <a-button @click="handleSubmit" type="primary">{{ $t('common.submit') }}</a-button>
        </div>

        <!-- 自定义图片预览 -->
        <MyPreviewImageVideo
            v-model:isClose="isClose"
            :type="uploadOptions.previewType"
            :previewData="uploadOptions.previewImageVideo"
        >
        </MyPreviewImageVideo>
    </div>
</template>

<script setup>
import { ref, watch, computed, getCurrentInstance, onMounted } from 'vue';
import Core from '@/core';
import { useRouter, useRoute } from 'vue-router';
import { Upload, message } from 'ant-design-vue';
import MyPreviewImageVideo from '@/components/horwin/based-on-ant/MyPreviewImageVideo.vue';
import MyUploads from './components/MyUploads.vue';
import dayjs from 'dayjs';
import localeEn from 'ant-design-vue/es/date-picker/locale/en_US';
import localeZh from 'ant-design-vue/es/date-picker/locale/zh_CN';

import { debounce } from 'lodash';

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const imageRegx = /image\/(png|jpg|jpeg|heic)/  // 照片的正则
const videoRegx = /^video\/+/  // 视频的正则
const pdfRegx = /application\/(pdf)/  // pdf的正则
const fileRegx = /^application\/+/  // 文件的正则

const isDistributerAdmin = ref(false); // 根据路由判断其是用在分销商(false) 还是平台方(true)

const uploadOptions = ref({
    previewType: 'image',
    fileData: [], // 提交的数据
    // previewImageVideo
    // "https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png", "https://horwin.oss-cn-hangzhou.aliyuncs.com//img/ba37a2f6f160d68d31f1a96b4a17f2b068b6cee17e6c7b96db51ba5016ef1df0.png"
    previewImageVideo: [],
});

const props = defineProps({
    // 详情点击进来
    isDetailEnter: {
        type: Boolean,
    },
});

// 判断是照片还是视频查看
const isClose = ref(false);
const treeData = ref([
    {
        label: 'parent 1',
        value: '1',
        children: [
            {
                label: 'parent 2',
                value: '2',
            },
        ],
    },
]);
const formParams = ref({
    org_name: undefined, // 分销商名称
    type: Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION, // 问询单类型
    fault_time: undefined, // 故障日期
    category_id: undefined, // 车型
    description: undefined, // 问题描述
    attachment_list: [], // 附件列表
    vehicle_list: [
        {
            vehicle_uid: '',
            mileage: '',
        },
    ], // 车架信息
    mileage: undefined, // 公里数
});
const distributorFindList = ref([
    // {
    //     name: 1
    // },
    // {
    //     name: 2
    // },
]); // 分销商账号list

/* computed start*/
const vehicle_column = computed(() => {
    let result = [
        { title: proxy.$t('common.vehicle_no'), dataIndex: 'vehicle_uid', key: 'vehicle_uid' }, // 车架号
        { title: proxy.$t('customer-care.mileage'), dataIndex: 'mileage', key: 'mileage' }, // 公里数
        {
            title: proxy.$t('common.operations'),
            dataIndex: 'operations',
            key: 'operations',
            fixed: 'right',
            width: 100,
        }, // 操作
    ];
    return result;
});
/* computed end*/

/* fetch start*/
// 保存接口
const saveFetch = (params = {}) => {
    const obj = {
        ...params,
    };
    Core.Api.inquiry_sheet
        .add(obj)
        .then(res => {
            console.log(res);
            if (isDistributerAdmin.value) {
                router.push({
                    path: '/inquiry-management/list',
                });
            } else {
                router.push({
                    path: '/customer-care/list',
                });
            }
        })
        .catch(err => {
            console.log('保存接口', err);
        });
};
// 修改接口
const modifyFetch = (params = {}) => {
    return new Promise((resolve, reject) => {
        const obj = {
            ...params,
        };
        Core.Api.inquiry_sheet
            .modify(obj)
            .then(res => {
                console.log(res);
                if (!props.isDetailEnter) {
                    // 详情使用这边为组件进来的
                    if (isDistributerAdmin.value) {
                        // 平台方
                        router.push({
                            path: '/inquiry-management/list',
                        });
                    } else {
                        router.push({
                            path: '/customer-care/list',
                        });
                    }
                }
                resolve(true);
            })
            .catch(err => {
                console.log('保存接口', err);
                resolve(true);
            });
    });
};
// 详情接口
const getDetailFetch = (params = {}) => {
    const obj = {
        ...params,
    };
    Core.Api.inquiry_sheet
        .detail(obj)
        .then(res => {
            console.log('详情接口 success', res.detail);
            for (const key in res.detail) {
                if (key === 'fault_time') {
                    formParams.value[key] = res.detail[key] > 0 ? dayjs.unix(res.detail[key]) : undefined;
                } else if (key === 'attachment_list') {
                    uploadOptions.value.fileData = [];

                    res.detail[key].forEach(el => {
                        uploadOptions.value.fileData.push({
                            name: el.name,
                            percent: 100,
                            status: 'done',
                            thumbUrl: Core.Const.NET.FILE_URL_PREFIX + el.path,
                            url: Core.Const.NET.FILE_URL_PREFIX + el.path,
                            response: {
                                data: {
                                    filename: el.path,
                                },
                            },
                            type: el.type,
                        });
                    });
                } else if (key === 'vehicle_list') {
                    formParams.value[key] =
                        res.detail[key].length > 0 ? res.detail[key] : [{ vehicle_uid: '', mileage: '' }];
                } else {
                    formParams.value[key] = res.detail[key];
                }
            }
            console.log('最后的结果', formParams.value);
        })
        .catch(err => {
            console.log('详情接口 err', err);
        });
};
// 获取车型接口
const getVehicleTreeFetch = (params = {}) => {
    const obj = {
        parent_id: 1, // 写死
        depth: 2, // 深度
        type: 20, // 10商品管理 20表示车辆管理
        page: 0,
        ...params,
    };
    Core.Api.ItemCategory.tree(obj)
        .then(res => {
            console.log('获取车型接口 success', res.list);
            treeData.value = res.list;
        })
        .catch(err => {
            console.log('获取车型接口 err', err);
        });
};
// 获取分销商账号
const getFindListFetch = (params = {}) => {
    const obj = {
        // search_key: "",
        ...params,
    };
    Core.Api.inquiry_sheet
        .distributorFindList(obj)
        .then(res => {
            // console.log("获取分销商账号 success", res.list);
            distributorFindList.value = res.list;
        })
        .catch(err => {
            console.log('获取分销商账号 err', err);
        });
};
/* fetch end*/

/* methods start*/
const onAddBtn = (type, record, index) => {
    switch (type) {
        case 'add-data':
            formParams.value.vehicle_list.push({
                vehicle_uid: '',
                mileage: '',
            });
            break;
        case 'delete':
            formParams.value.vehicle_list.splice(index, 1);
            break;
        case 'back':
            if (!isDistributerAdmin.value) {
                router.push({
                    path: '/inquiry-management/list',
                });
            } else {
                // 平台方
                router.push({
                    path: '/inquiry-management/list',
                });
            }
            break;

        default:
            break;
    }
};
// 提交
const handleSubmit = () => {
    // 校验的数据
    // 公共的(私有的需要在checkFormInput中添加)
    let publicCheckForm = {
        type: '', // 问询单类型
        category_id: '', // 车型
        description: '', // 问题描述
    };

    if (isDistributerAdmin.value) {
        // 平台方的时候出现
        publicCheckForm['org_name'] = ''; // 分销商名称
    }

    formParams.value.attachment_list = [];
    uploadOptions.value.fileData.forEach(el => {
        formParams.value.attachment_list.push({
            name: el.name, // 附件名称
            path: el.response?.data?.filename, // 附件url
            type: el.type, // 附件类型
        });
    });

    console.log('formParams.value', formParams.value);

    if (checkFormInput(publicCheckForm, formParams.value)) return;
    // 上面是检查的

    const submitForm = {
        ...formParams.value,
        fault_time: dayjs().unix(formParams.value.fault_time) || undefined,
    };

    // 将 mileage 转换为小数点后两位
    (submitForm.mileage = submitForm.mileage ? submitForm.mileage.toFixed(2) : undefined),
        submitForm.vehicle_list?.forEach(el => {
            el.mileage = el.mileage ? el.mileage.toFixed(2) : undefined;
        });

    console.log('submitForm', submitForm);

    if (route.query?.id) {
        // 修改
        return modifyFetch(Core.Util.searchFilter(submitForm));
    } else {
        // 新增
        saveFetch(Core.Util.searchFilter(submitForm));
    }
};
// 检查 sourceData(元素数据) checkForm(检查的元素)
const checkFormInput = (publicCheckForm, sourceData) => {
    // 私有的
    let privateParams = {};

    switch (formParams.value.type) {
        case Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION:
            // 故障
            privateParams = {
                fault_time: '', // 故障日期
                vehicle_list: [
                    {
                        vehicle_uid: null,
                        mileage: null,
                    },
                ], // 车架信息
            };
            break;
        case Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION:
            // 咨询
            break;
        case Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY:
            // 电池
            privateParams = {
                fault_time: '', // 故障日期
                attachment_list: [], // 附件
            };
            break;
    }

    let checkForm = {
        ...privateParams,
        ...publicCheckForm,
    };
    console.log('sourceData', sourceData);
    let result = [];
    for (const key in checkForm) {
        let keys = checkForm[key];

        if (keys instanceof Array) {
            if (key === 'attachment_list') {
                // console.log("输出的东西", sourceData[key]);
                // 附件
                if (sourceData[key]?.length === 0) {
                    result.push(`${key}`);
                }
                continue;
            }

            for (const el of sourceData[key]) {
                // 这里是必填项的参数循环 判断数据里面哪些参数是必填的

                for (const arrItem in keys[0]) {
                    // console.log("el", el[arrItem]);
                    // console.log("arrItem", arrItem);
                    if (!el[arrItem]) {
                        result.push(`${key}`);
                    }
                }
            }
            // 判断 数组
        } else if (keys instanceof Object) {
        } else if (
            typeof keys === 'string' ||
            typeof keys === 'number' ||
            typeof keys === 'boolean' ||
            typeof keys === 'undefined'
        ) {
            // | 字符串 | 数字 | 布尔
            if (!sourceData[key]) {
                result.push(`${key}`);
            }
        }
    }

    console.log('结果', [...new Set(result)]);

    let tips = null;
    for (const key of [...new Set(result)]) {
        console.log('key', key);
        switch (key) {
            case 'org_name':
                tips =
                    proxy.$t('common.please_complete_info') +
                    '(' +
                    proxy.$t('customer-care.distributor_account_number') +
                    ')';
                break;
            case 'type':
                tips =
                    proxy.$t('common.please_complete_info') + '(' + proxy.$t('customer-care.inquiry_form_type') + ')';
                break;
            case 'fault_time':
                tips = proxy.$t('common.please_complete_info') + '(' + proxy.$t('customer-care.failure_date') + ')';
                break;
            case 'category_id':
                tips = proxy.$t('common.please_complete_info') + '(' + proxy.$t('common.vehicle_model') + ')';
                break;
            case 'description':
                tips =
                    proxy.$t('common.please_complete_info') + '(' + proxy.$t('customer-care.problem_description') + ')';
                break;
            case 'attachment_list':
                tips = proxy.$t('common.please_complete_info') + '(' + proxy.$t('customer-care.text_upload') + ')';
                break;
            case 'mileage':
                tips = proxy.$t('common.please_complete_info') + '(' + proxy.$t('customer-care.mileage') + ')';
                break;
            case 'vehicle_list':
                tips = proxy.$t('common.please_complete_info') + '(' + proxy.$t('common.vehicle_no') + ')';
                break;
        }
    }

    return tips ? message.warning(tips) : false;
};
// 上传组件事件
const handleDetailChange = ({ file, fileList }) => {
    console.log('输出文件', file, fileList);
    if (file.status === 'done') {
        // 上传成功
        if (file.response.code === 0) {
            uploadOptions.value.fileData = fileList;
        } else {
            // 上传失败
            message.error(file.response.msg);
        }
    } else if (file.status === 'error') {
        message.error(proxy.$t('common.upload_fail'));
    }
};
const handlePreview = ({ file, fileList }) => {
    console.log('预览', file, fileList);

    if (videoRegx.test(file.type)) {
        console.log('video/*(视频预览)');

        uploadOptions.value.previewImageVideo = [];
        uploadOptions.value.previewType = 'video';
        uploadOptions.value.previewImageVideo.push(Core.Util.imageFilter(file.response?.data?.filename, 4));
        isClose.value = true;
    } else if (imageRegx.test(file.type)) {
        console.log('image/*(照片预览)');

        uploadOptions.value.previewType = 'image';
        uploadOptions.value.previewImageVideo = [];
        fileList.forEach(el => {
            if (el.response) {
                if (imageRegx.test(el.type)) {
                    if (file.uid === el.uid) {
                        // 让预览的哪张图片在第一张
                        uploadOptions.value.previewImageVideo.unshift(
                            Core.Util.imageFilter(el.response?.data?.filename, 1),
                        );
                    } else {
                        uploadOptions.value.previewImageVideo.push(
                            Core.Util.imageFilter(el.response?.data?.filename, 1),
                        );
                    }
                }
            }
        });
        console.log('结果', uploadOptions.value.previewImageVideo);
        isClose.value = true;
    } else if (pdfRegx.test(file.type)) {
        console.log('application/pdf(pdf预览)', Core.Util.imageFilter(file.response?.data?.filename, 4));
        window.open(Core.Util.imageFilter(file.response?.data?.filename, 4), '_blank');
    } else if (fileRegx.test(file.type)) {
        console.log('文件', Core.Util.imageFilter(file.response?.data?.filename, 4));
        // office online (PDF 支持预览)
        let url =
            'http://view.officeapps.live.com/op/view.aspx?src=' +
            Core.Util.imageFilter(file.response?.data?.filename, 4);
        window.open(url, '_blank');
    }
};
const handleRemove = ({ file, fileList }) => {
    console.log('删除', fileList);
};
// 问询单类型切换
const onFormParamsType = e => {
    console.log('formParams.type', formParams.value.type);
    switch (Number(formParams.value.type)) {
        case Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.MALFUNCTION:
            // 故障
            formParams.value.vehicle_list = [
                {
                    vehicle_uid: '',
                    mileage: '',
                },
            ];
            Core.Util.deleteParamsFilter(formParams.value, ['mileage']);
            break;
        case Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.CONSULTATION:
            // 咨询
            Core.Util.deleteParamsFilter(formParams.value, ['fault_time', 'vehicle_list']);
            break;
        case Core.Const.CUSTOMER_CARE.INQUIRY_SHEET_TYPE_MAP.BATTERY:
            // 电池
            Core.Util.deleteParamsFilter(formParams.value, ['vehicle_list']);
            break;
    }
};
const onFetchUser = debounce(value => {
    // console.log("onFetchUser", value);
    getFindListFetch({ search_key: value });
}, 500);

/* methods end*/

// 暴露方法出去
defineExpose({
    handleSubmit,
});

watch(
    () => router.currentRoute.value,
    (newValue, oldValue) => {
        console.log('newValue', newValue);
        if (newValue.matched[0].path === '/customer-care') {
            // 分销商的客户关怀
            isDistributerAdmin.value = false;
        } else if (newValue.matched[0].path === '/inquiry-management') {
            // 平台方
            isDistributerAdmin.value = true;
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

onMounted(() => {
    getVehicleTreeFetch();
    if (route.query?.id) {
        getDetailFetch({
            id: route.query?.id,
        });
    }

    if (isDistributerAdmin.value) {
        // 平台方调用
        getFindListFetch();
    }
});
</script>

<style lang="less" scoped>
#customer-care-edit {
    position: relative;

    .d-f-a {
        display: flex;
        align-items: center;
    }

    .customer-care-required {
        &::before {
            content: '*';
            color: #eb4141;
            margin-right: 4px;
            vertical-align: middle;
        }
    }

    .add-attachment-tip {
        color: #666;
        font-size: 14px;
        font-weight: 400;
        white-space: nowrap;
    }

    .footer-btn {
        width: 100%;
        background-color: #fff;
        text-align: center;
        margin-top: 20px;
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
// 上传时候的文字
:deep(.ant-upload-list-item-thumbnail) {
    white-space: nowrap;
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

:deep(.ant-input-number-group-addon) {
    background-color: #f2f2f2;
    color: #808fa6;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    border-color: #eaecf1;
    box-sizing: border-box;
}
:deep(.ant-input-number-group) {
    border-radius: 4px;
    border-color: #eaecf1;
    background: #fff;
    overflow: hidden;
}

// 详情用这个组件过来的
.w-100 {
    width: 100% !important;
}

.w-180 {
    width: 180px !important;
}

.msg-detail-form-block {
    background: initial;
    border-radius: 0px;
    display: flex;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>
