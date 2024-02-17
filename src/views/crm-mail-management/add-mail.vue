<template>
    <div class="add-mail edit-container">
        <div class="form-content">
            <div class="form-module">
                <div class="module-header">
                    <div class="module-title">{{ $t('mail-management.email_content') /*邮件内容*/ }}</div>
                    <div class="preview-btn" @click="onPreviewBtn('content_template')">
                        <a-button>{{ $t('mail-management.preview') }}</a-button>
                    </div>
                </div>
                <a-row class="horizontal-search-row module-content">
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r align-s-start">
                            <!-- 选择模板 -->
                            {{ $t('mail-management.select_template') }}
                        </div>
                        <div class="value m-l-8">
                            <div class="bg-template cursor">
                                <span class="template-text" @click="onPreviewBtn('default_template')">
                                    {{ $t('mail-management.sales_template') }}
                                </span>
                            </div>
                        </div>
                    </a-col>
                    <a-col class="search-col required">
                        <div class="key w-100 t-aligin-r">
                            <!-- 收件人 -->
                            {{ $t('mail-management.recipients') }}
                        </div>
                        <div class="value m-l-8">
                            <a-select
                                style="width: 100%"
                                :showArrow="false"
                                :disabled="true"
                                v-model:value="formData.receiver_type"
                                ref="select"
                            >
                                <template v-for="(item, index) in selectTemplate" :key="index">
                                    <a-select-option :value="item.value">
                                        {{ item[$i18n.locale] }}
                                    </a-select-option>
                                </template>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col class="search-col required">
                        <div class="key w-100 t-aligin-r">
                            <!-- 主标题 -->
                            {{ $t('mail-management.main_title') }}
                        </div>
                        <div class="value m-l-8">
                            <a-input
                                v-model:value="formData.title"
                                :placeholder="$t('mail-management.please_enter')"
                                allow-clear
                            />
                        </div>
                    </a-col>
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 开头称呼 -->
                            {{ $t('mail-management.initial_address') }}
                        </div>
                        <div class="value m-l-8">
                            <a-input
                                v-model:value="formData.address"
                                :placeholder="$t('mail-management.please_enter')"
                                allow-clear
                            />
                        </div>
                    </a-col>
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 正文内容 -->
                            {{ $t('mail-management.main_content') }}
                        </div>
                        <div class="value m-l-8">
                            <a-textarea
                                v-model:value="formData.email_content"
                                :placeholder="$t('mail-management.please_enter')"
                                allow-clear
                            />
                        </div>
                    </a-col>
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 链接 -->
                            {{ $t('mail-management.link') }}
                        </div>
                        <div class="value m-l-8">
                            <a-input
                                v-model:value="formData.template_param.uri"
                                :placeholder="$t('mail-management.please_enter')"
                                allow-clear
                            />
                        </div>
                    </a-col>
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 链接描述文字 -->
                            {{ $t('mail-management.link_description_text') }}
                        </div>
                        <div class="value m-l-8">
                            <a-input
                                v-model:value="formData.template_param.uri_content"
                                :placeholder="$t('mail-management.please_enter')"
                                allow-clear
                            />
                        </div>
                    </a-col>
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r align-s-start">
                            <!-- 海报 -->
                            {{ $t('mail-management.poster') }}
                        </div>
                        <div class="value m-l-8">
                            <a-upload
                                class="poster m-r-10"
                                name="file"
                                accept="image/png, image/jpeg, image/jpg"
                                :file-list="uploadOptions.posterList"
                                :action="uploadOptions.action"
                                :headers="uploadOptions.headers"
                                :data="uploadOptions.data"
                                :maxCount="1"
                                list-type="picture-card"
                                @change="event => onUploadExplosion(event, 'poster')"
                                @preview="handlePreview"
                            >
                                <div class="upload-border" v-if="uploadOptions.posterList.length < 1">
                                    <img
                                        class="upload-img"
                                        src="../../assets/images/crm-mail-management/add.png"
                                        alt=""
                                    />
                                </div>
                            </a-upload>
                            <div class="upload_tips">{{ $t('mail-management.size_tips') }}</div>
                        </div>
                    </a-col>
                    <a-col class="search-col m-t-40">
                        <div class="key w-100 t-aligin-r align-s-start">
                            <!-- 二维码 -->
                            {{ $t('mail-management.qr_code') }}
                        </div>
                        <div class="value m-l-8">
                            <div class="upload_tips">{{ $t('mail-management.upload_tips') }}</div>
                            <div class="qr-code1 m-t-10">
                                <a-upload
                                    class="qr-code m-r-10"
                                    name="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    :file-list="uploadOptions.qrCodeList1"
                                    :action="uploadOptions.action"
                                    :headers="uploadOptions.headers"
                                    :data="uploadOptions.data"
                                    :maxCount="1"
                                    list-type="picture-card"
                                    @change="event => onUploadExplosion(event, 'qrcode1')"
                                    @preview="handlePreview"
                                >
                                    <div class="upload-border" v-if="uploadOptions.qrCodeList1.length < 1">
                                        <img
                                            class="upload-img"
                                            src="../../assets/images/crm-mail-management/add.png"
                                            alt=""
                                        />
                                    </div>
                                </a-upload>
                                <a-input
                                    class="qr-code-input"
                                    v-model:value="formData.qr_code1_introduce"
                                    :placeholder="$t('mail-management.qrcode_introduction')"
                                    allow-clear
                                    @change="event => onQrcodeInput(event, 'qrcode1')"
                                />
                            </div>
                            <div class="qr-code2 m-t-10">
                                <a-upload
                                    class="qr-code m-r-10"
                                    name="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    :file-list="uploadOptions.qrCodeList2"
                                    :action="uploadOptions.action"
                                    :headers="uploadOptions.headers"
                                    :data="uploadOptions.data"
                                    :maxCount="1"
                                    list-type="picture-card"
                                    @change="event => onUploadExplosion(event, 'qrcode2')"
                                    @preview="handlePreview"
                                >
                                    <div class="upload-border" v-if="uploadOptions.qrCodeList2.length < 1">
                                        <img
                                            class="upload-img"
                                            src="../../assets/images/crm-mail-management/add.png"
                                            alt=""
                                        />
                                    </div>
                                </a-upload>
                                <a-input
                                    class="qr-code-input"
                                    v-model:value="formData.qr_code2_introduce"
                                    :placeholder="$t('mail-management.qrcode_introduction')"
                                    allow-clear
                                    @change="event => onQrcodeInput(event, 'qrcode2')"
                                />
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="form-module m-t-20">
                <div class="module-title">{{ $t('mail-management.timed_transmission') /*定时发送*/ }}</div>
                <a-row class="horizontal-search-row module-content">
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 定时发送 -->
                            {{ $t('mail-management.timed_transmission') }}
                        </div>
                        <div class="value m-l-8">
                            <a-radio-group v-model:value="formData.is_schedule_time">
                                <template v-for="(item, index) in istext" :key="index">
                                    <a-radio :value="item.value">{{ item[$i18n.locale] }}</a-radio>
                                </template>
                            </a-radio-group>
                        </div>
                    </a-col>
                    <a-col class="search-col" v-if="Number(formData.is_schedule_time) !== 0">
                        <div class="key w-100 t-aligin-r">
                            <!-- 定时发送时间 -->
                            {{ $t('mail-management.timed_transmission_time') }}
                        </div>
                        <div class="value m-l-8">
                            <a-date-picker
                                style="width: 100%"
                                show-time
                                v-model:value="formData.schedule_time"
                                :placeholder="$t('mail-management.time_tips')"
                            />
                        </div>
                    </a-col>
                </a-row>
            </div>
        </div>

        <div class="operation-btn">
            <a-button @click="onCancel">{{ $t('mail-management.cancel') }}</a-button>
            <a-button type="primary" @click="onSubmit">{{ $t('mail-management.confirm') }}</a-button>
        </div>

        <a-modal width="800px" :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
            <img alt="" style="width: 100%" :src="previewImage" />
        </a-modal>

        <!-- 预览模板按钮 -->
        <a-modal
            class="custom-ant-modal"
            v-model:visible="mailShow"
            width="648px"
            :footer="null"
            destroy-on-close
            @cancel="mailShow = false"
        >
            <template #title>
                <span class="model-title">{{ $t('crm_b.preview') }}</span>
            </template>
            <mailTemplete :mailData="mailData"></mailTemplete>
        </a-modal>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import dayjs from 'dayjs';
import Core from '@/core';
import mailTemplete from './components/mail-templete.vue';

const { proxy } = getCurrentInstance();

const router = useRouter();
const route = useRoute();

const uploadOptions = ref({
    action: Core.Const.NET.FILE_UPLOAD_END_POINT,
    coverList: [],
    headers: {
        ContentType: false,
    },
    data: {
        token: Core.Data.getToken(),
        type: 'img',
    },

    posterList: [],
    qrCodeList1: [],
    qrCodeList2: [],
});

// 字段名称
const formData = ref({
    id: undefined,
    templat: '1', // 模板(目前默认写死为1)
    receiver_type: '1', // 收件人类型(目前默认写死)
    title: '', // 邮件主题
    address: '', // 开头称呼
    email_content: '', // 邮件内容
    template_param: {
        uri_content: 'Click For More Information',
        uri: '',
        poster: '',
        qr_code: [], // "qr_code": [{"img":"地址","introduce":"介绍"}]
    },
    // 模板填充值{"uri_content":"链接内容","uri":"链接地址","poster":"海报图片","qr_code":"图片"}
    schedule_time: undefined, // 时间判断

    // 上面字段是传给后端的 下面这些字段自己用来判断的
    is_schedule_time: 0,
    qr_code1_introduce: undefined,
    qr_code2_introduce: undefined,
});

// 是否文本
const istext = ref([
    {
        value: 1,
        zh: '是',
        en: 'Yes',
    },
    {
        value: 0,
        zh: '否',
        en: 'No',
    },
]);

const selectTemplate = ref([
    {
        value: '1',
        zh: '所有欧洲订阅用户',
        en: 'All European subscribers',
    },
]);

const previewVisible = ref(false); // 预览链接
const previewImage = ref(null); // 预览链接

const mailData = ref({
    // 'title': '',
    // 'address': '',
    // 'email_content': "",
    // 'uri': "",
    // 'uri_content': "",
    // 'poster': '',
    // 'qr_code': [
    //     {
    //         img: "https://img0.baidu.com/it/u=1397203767,4231030802&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1703178000&t=527dac1e9969d86e267a03f72185e8c5",
    //         introduce: "你好啊",
    //     },
    //     {
    //         img: "https://img0.baidu.com/it/u=1397203767,4231030802&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1703178000&t=527dac1e9969d86e267a03f72185e8c5",
    //         introduce: "你好啊",
    //     }
    // ],
}); // 预览数据
const mailShow = ref(false); // 预览显示框
const sizeLimit = ref(2); // 上传大小限制

onMounted(() => {
    if (route.query?.id) {
        getMailDetail({ id: route.query.id });
    }
});

/* fetch */
// 保存邮件
const saveMail = (parmas = {}) => {
    let obj = {
        ...parmas,
    };
    Core.Api.MAIL_MANAGEMENT.add(obj)
        .then(res => {
            proxy.$message.success(proxy.$t('mail-management.created_successfully'));
            router.push('/mail-management/mail-send-statistics');
        })
        .catch(err => {
            console.log('saveImgeFetchError', err);
        });
};
// 详情接口
const getMailDetail = (parmas = {}) => {
    let obj = {
        ...parmas,
    };
    Core.Api.MAIL_MANAGEMENT.detail(obj)
        .then(res => {
            console.log('详情接口', res);

            // 回显数据
            for (const key in formData.value) {
                switch (key) {
                    case 'receiver_type':
                        formData.value[key] = String(res.detail[key]);
                        break;
                    case 'template_param':
                        formData.value[key] = JSON.parse(res.detail[key]);

                        // 海报上传回显
                        if (formData.value[key].poster) {
                            uploadOptions.value.posterList[0] = {
                                name: 'poster',
                                percent: 100,
                                status: 'done',
                                thumbUrl: formData.value[key].poster,
                                url: formData.value[key].poster,
                                response: {
                                    data: {
                                        filename: formData.value[key].poster,
                                    },
                                },
                            };
                        }

                        // 二维码图片
                        formData.value[key].qr_code.forEach((el, index) => {
                            if (!el?.img) {
                                return;
                            }
                            uploadOptions.value[`qrCodeList${index + 1}`][0] = {
                                name: `qrcode${index + 1}`,
                                percent: 100,
                                status: 'done',
                                url: el.img,
                                response: {
                                    data: {
                                        filename: el.img,
                                    },
                                },
                            };
                        });
                        break;
                    case 'schedule_time':
                        formData.value[key] = res.detail[key] > 0 ? dayjs.unix(res.detail[key]) : undefined;
                        break;
                    case 'is_schedule_time':
                        formData.value[key] = res.detail['schedule_time'] > 0 ? 1 : 0;
                        break;
                    case 'qr_code1_introduce':
                    case 'qr_code2_introduce':
                        formData.value['template_param'].qr_code.forEach((el, index) => {
                            if (index === 0) {
                                formData.value.qr_code1_introduce = el.introduce;
                            } else if (index === 1) {
                                formData.value.qr_code2_introduce = el.introduce;
                            }
                        });
                        break;
                    default:
                        formData.value[key] = res.detail[key];
                        break;
                }
            }

            console.log('formData', formData.value);
        })
        .catch(err => {
            console.log('saveImgeFetchError', err);
        });
};

/* methods */
// upload上传事件
const onUploadExplosion = ({ file, fileList }, type) => {
    switch (type) {
        case 'poster':
            // console.log('poster', uploadOptions.value.posterList);
            uploadOptions.value.posterList = fileList;
            if (file.status === 'done') {
                formData.value.template_param.poster = Core.Const.NET.FILE_URL_PREFIX + file?.response.data.filename;
                loadImages(formData.value.template_param.poster);
            } else if (file.status === 'removed') {
                formData.value.template_param.poster = '';
            }
            break;
        case 'qrcode1':
            // console.log('qrcode1', uploadOptions.value.qrCodeList1);
            uploadOptions.value.qrCodeList1 = fileList;

            const obj1 = {
                ...formData.value.template_param.qr_code[0],
            };
            if (file.status === 'done') {
                obj1['img'] = Core.Const.NET.FILE_URL_PREFIX + file?.response.data.filename;
                loadImages(obj1['img']);
            } else if (file.status === 'removed') {
                Reflect.deleteProperty(obj1, 'img');
            }
            formData.value.template_param.qr_code[0] = obj1;
            break;
        case 'qrcode2':
            // console.log('qrcode2', uploadOptions.value.qrCodeList2);
            uploadOptions.value.qrCodeList2 = fileList;

            const obj2 = {
                ...formData.value.template_param.qr_code[0],
            };

            if (file.status === 'done') {
                obj2['img'] = Core.Const.NET.FILE_URL_PREFIX + file?.response.data.filename;
                loadImages(obj2['img']);
            } else if (file.status === 'removed') {
                Reflect.deleteProperty(obj2, 'img');
            }
            formData.value.template_param.qr_code[1] = obj2;
            break;
    }
};
// upload预览事件
const handlePreview = file => {
    console.log('预览文件', file);
    previewVisible.value = true;

    const url = Core.Const.NET.FILE_URL_PREFIX;
    const reg = new RegExp(`^${url}`);
    // console.log("正则结果", reg.test(file.response.data.filename));
    if (reg.test(file.response.data.filename)) {
        previewImage.value = file.response.data.filename;
    } else {
        previewImage.value = url + file.response.data.filename;
    }
};

// 预览 model 取消事件
const handleCancel = () => {
    previewVisible.value = false;
    previewImage.value = null;
};

// 取消按钮
const onCancel = () => {
    router.push('/mail-management/mail-send-statistics');
};
// 确定创建
const onSubmit = () => {
    // console.log("数据", formData.value);
    const _formData = Core.Util.deepCopy(formData.value);

    // 判断必填项
    if (isRequired(_formData)) {
        return;
    }

    _formData.schedule_time = _formData.is_schedule_time > 0 ? dayjs(formData.value.schedule_time).unix() : 0;

    _formData.template_param.qr_code.forEach((el, index) => {
        // 去除空数组里面的 [{}] 空对象
        if (Object.keys(el).length === 0) {
            _formData.template_param.qr_code.splice(index, 1);
        }
    });

    // JSON化
    _formData.template_param = JSON.stringify(_formData.template_param);

    // 删除多余的参数
    Core.Util.deleteParamsFilter(_formData, ['is_schedule_time', 'qr_code1_introduce', 'qr_code2_introduce']);

    console.log('最后的结果', _formData);
    saveMail(_formData);
};

// 检查并填写是否填写
const isRequired = form => {
    if (!form.receiver_type /*收件人*/) {
        return proxy.$message.error(
            `${proxy.$t('mail-management.please_enter')}${proxy.$t('mail-management.recipients')}`,
        );
    }
    if (!form.title /*主标题*/) {
        return proxy.$message.error(
            `${proxy.$t('mail-management.please_enter')}${proxy.$t('mail-management.main_title')}`,
        );
    }

    return false;
};

// 二维码输入框
const onQrcodeInput = (e, type) => {
    switch (type) {
        case 'qrcode1':
            const obj1 = {
                ...formData.value.template_param.qr_code[0],
            };

            if (!e.target.value) {
                Reflect.deleteProperty(obj1, 'introduce');
            } else {
                obj1['introduce'] = formData.value.qr_code1_introduce;
            }
            formData.value.template_param.qr_code[0] = obj1;
            break;
        case 'qrcode2':
            const obj2 = {
                ...formData.value.template_param.qr_code[1],
            };

            if (!e.target.value) {
                Reflect.deleteProperty(obj2, 'introduce');
            } else {
                obj2['introduce'] = formData.value.qr_code2_introduce;
            }

            formData.value.template_param.qr_code[1] = obj2;
            break;
    }
};

// 预览按钮
const onPreviewBtn = type => {
    mailShow.value = true;

    switch (type) {
        case 'content_template':
            mailData.value = {
                ...formData.value,
                ...formData.value.template_param,
            };

            console.log('赋值的数据', mailData.value);
            break;
        case 'default_template':
            // 默认模板查看
            mailData.value = {};
            break;
    }
};

// 加载图片
const loadImages = url => {
    const images = new Image();
    images.src = url;

    images.onload = () => {
        console.log('图片加载成功');
    };

    images.onerror = () => {
        console.log('图片加载失败');
        loadImages(url);
    };
};
</script>

<style lang="less" scoped>
@bg: '../../assets/images/crm-mail-management/bg.png';
.add-mail {
    padding: 26px 0px;
    box-sizing: border-box;

    .form-content {
        padding: 0 20px;
        box-sizing: border-box;
        .form-module {
            padding: 20px;
            box-sizing: border-box;
            background-color: #f8fafc;
            .module-header {
                display: flex;
                justify-content: space-between;
            }
            .module-title {
                color: #1d2129;
                font-size: 18px;
                font-weight: 600;
            }

            .module-content {
                max-width: 800px;
                margin-left: 225px;
            }
        }
    }

    .operation-btn {
        width: 100%;
        border-top: 1px solid #f2f3f5;
        background: #fff;
        height: 68px;
        line-height: 68px;
        margin-top: 20px;
        text-align: center;
    }

    .bg-template {
        width: 200px;
        height: 72px;
        object-fit: contain;
        background-image: url(@bg);
        background-size: 100%, 100%;
        position: relative;

        .template-text {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #0061ff;
            font-size: 14px;
            font-weight: 600;
        }
    }
    .poster {
        :deep(.ant-upload-select-picture-card) {
            width: 165px;
            height: 80px;
            border: 1px dashed #e2e2e2;
            background: #fff;
        }
        :deep(.ant-upload-list-picture-card-container) {
            width: 165px;
            height: 80px;
            border: 1px dashed #e2e2e2;
        }
    }
    .qr-code {
        width: auto;
        :deep(.ant-upload-select-picture-card) {
            // width: 80px;
            // height: 80px;
            border: 1px dashed #e2e2e2;
            background: #fff;
        }
        :deep(.ant-upload-list-picture-card-container) {
            // width: 80px;
            // height: 80px;
            border: 1px dashed #e2e2e2;
        }
    }

    .upload-border {
        border-radius: 4px;
        position: relative;
        .upload-img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 16px;
            height: 16px;
        }
    }
    .upload_tips {
        color: #666;
        font-size: 14px;
        font-weight: 400;
    }

    .qr-code1,
    .qr-code2 {
        display: flex;

        .qr-code-input {
            width: 165px;
            height: 32px;
            margin-left: 8px;
        }
    }
}

.t-aligin-r {
    color: #1d2129;
    text-align: right;
    font-size: 14px;
    font-weight: 400;
}

.m-l-8 {
    margin-left: 8px;
}
.m-t-10 {
    margin-top: 10px;
}
.m-t-20 {
    margin-top: 20px;
}
.m-t-40 {
    margin-top: 40px;
}
.align-s-start {
    align-self: flex-start;
}

.w-100 {
    width: 100px;
}

:deep(.ant-select-selection-item) {
    color: #1d2129;
    font-size: 14px;
    font-weight: 400;
}

.model-title {
    color: #1d2129;
    font-size: 18px;
    font-weight: 600;
}
</style>
