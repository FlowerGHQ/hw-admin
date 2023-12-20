<template>
    <div class="add-mail edit-container">

        <div class="form-content">
            <div class="form-module">
                <div class="module-title">{{ $t('mail-management.email_content') /*邮件内容*/}}</div>            
                <a-row class="horizontal-search-row module-content">
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r align-s-start">
                            <!-- 选择模板 -->
                            {{ $t('mail-management.select_template') }}
                        </div>
                        <div class="value m-l-8">
                            <div class="bg-template">
                                <span class="template-text">销售模板</span>
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
                                style="width: 100%;"
                                :showArrow="false"
                                :disabled="true"
                                value="1"
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
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 主标题 -->
                            {{ $t('mail-management.main_title') }}
                        </div>
                        <div class="value m-l-8">
                            <a-input
                                v-model:value="value" 
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
                                v-model:value="value" 
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
                                v-model:value="value2" 
                                :placeholder="$t('mail-management.please_enter')"
                                allow-clear 
                                />
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class="form-module m-t-20">
                <div class="module-title">{{ $t('mail-management.email_link') /*邮件链接*/}}</div>            
                <a-row class="horizontal-search-row module-content">     
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 链接 -->
                            {{ $t('mail-management.link')}}
                        </div>
                        <div class="value m-l-8">
                            <a-input
                                v-model:value="value" 
                                :placeholder="$t('mail-management.please_enter')" 
                                allow-clear
                            />
                        </div>
                    </a-col>
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 链接描述文字 -->
                            {{ $t('mail-management.link_description_text')}}
                        </div>
                        <div class="value m-l-8">
                            <a-input
                                v-model:value="value" 
                                :placeholder="$t('mail-management.please_enter')" 
                                allow-clear
                            />
                        </div>
                    </a-col>           
                </a-row>
            </div>
            <div class="form-module m-t-20">
                <div class="module-title">{{ $t('mail-management.other_information') /*其他信息*/}}</div>            
                <a-row class="horizontal-search-row module-content">
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r align-s-start">
                            <!-- 海报 -->
                            {{ $t('mail-management.poster')}}
                        </div>
                        <div class="value m-l-8">
                            <a-upload
                                class="poster m-r-10"
                                name="file"
                                accept='image/png, image/jpeg, image/jpg'
                                :file-list="uploadOptions.posterList"
                                :action="uploadOptions.action"
                                :headers="uploadOptions.headers"
                                :data='uploadOptions.data'
                                :maxCount="1"
                                list-type="picture-card"
                                @change="(event) => onUploadExplosion(event, 'poster')"
                                @preview="handlePreview"
                            >
                                <div class="upload-border" v-if="uploadOptions.posterList.length < 1">
                                    <img class="upload-img" src="../../assets/images/crm-mail-management/add.png" alt="">
                                </div>
                            </a-upload>
                            <div class="upload_tips">{{ $t('mail-management.size_tips') }}</div>
                        </div>
                    </a-col>
                    <a-col class="search-col m-t-40">
                        <div class="key w-100 t-aligin-r align-s-start">
                            <!-- 二维码 -->
                            {{ $t('mail-management.qr_code')}}
                        </div>
                        <div class="value m-l-8">
                            <div class="upload_tips">{{ $t('mail-management.upload_tips') }}</div>
                            <div class="qr-code1 m-t-10">
                                <a-upload
                                    class="qr-code m-r-10"
                                    name="file"                              
                                    accept='image/png, image/jpeg, image/jpg'
                                    :file-list="uploadOptions.qrCode1List"
                                    :action="uploadOptions.action"
                                    :headers="uploadOptions.headers"
                                    :data='uploadOptions.data'
                                    :maxCount="1"                                    
                                    list-type="picture-card"
                                    @change="(event) => onUploadExplosion(event, 'qrcode1')"
                                    @preview="handlePreview"
                                >
                                    <div class="upload-border" v-if="uploadOptions.qrCode1List.length < 1">
                                        <img class="upload-img" src="../../assets/images/crm-mail-management/add.png" alt="">
                                    </div>
                                </a-upload>
                                <a-input
                                    class="qr-code-input"
                                    v-model:value="value" 
                                    :placeholder="$t('mail-management.qrcode_introduction')" 
                                    allow-clear
                                />
                            </div>
                            <div class="qr-code2 m-t-10">
                                <a-upload
                                    class="qr-code m-r-10"
                                    name="file"                              
                                    accept='image/png, image/jpeg, image/jpg'
                                    :file-list="uploadOptions.qrCode2List"
                                    :action="uploadOptions.action"
                                    :headers="uploadOptions.headers"
                                    :data='uploadOptions.data'
                                    :maxCount="1"                                    
                                    list-type="picture-card"
                                    @change="(event) => onUploadExplosion(event, 'qrcode2')"
                                    @preview="handlePreview"
                                >
                                    <div class="upload-border" v-if="uploadOptions.qrCode2List.length < 1">
                                        <img class="upload-img" src="../../assets/images/crm-mail-management/add.png" alt="">
                                    </div>
                                </a-upload>	
                                <a-input
                                    class="qr-code-input"
                                    v-model:value="value" 
                                    :placeholder="$t('mail-management.qrcode_introduction')" 
                                    allow-clear
                                />
                            </div>
                        </div>
                    </a-col>          
                </a-row>
            </div>
            <div class="form-module m-t-20">
                <div class="module-title">{{ $t('mail-management.timed_transmission') /*定时发送*/}}</div>            
                <a-row class="horizontal-search-row module-content">     
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 定时发送 -->
                            {{ $t('mail-management.timed_transmission')}}
                        </div>
                        <div class="value m-l-8">
                            <a-radio-group v-model:value="value">
                                <template v-for="(item, index) in istext" :key="index">                            
                                    <a-radio :value="item.value">{{ item[$i18n.locale] }}</a-radio>
                                </template>                                                      
                            </a-radio-group>
                        </div>
                    </a-col>
                    <a-col class="search-col">
                        <div class="key w-100 t-aligin-r">
                            <!-- 定时发送时间 -->
                            {{ $t('mail-management.timed_transmission_time')}}
                        </div>
                        <div class="value m-l-8">
                            <a-date-picker 
                                style="width: 100%;"
                                show-time 
                                :placeholder="$t('mail-management.time_tips')" 
                                @change="onChange" 
                                @ok="onOk" 
                            />
                        </div>
                    </a-col>                 
                </a-row>
            </div>
        </div>


        <div class="operation-btn">
            <a-button a-button>{{  $t('mail-management.cancel') }}</a-button>
            <a-button type="primary">{{ $t('mail-management.confirm')}}</a-button>
        </div>

        <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
            <img alt="" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Core from '@/core'

const uploadOptions = ref({
    action: Core.Const.NET.FILE_UPLOAD_END_POINT,
    coverList: [],
    headers: {
        ContentType: false
    },
    data: {
        token: Core.Data.getToken(),
        type: 'img',
    },

    posterList: [],
    qrCode1List: [],
    qrCode2List: [],
})


// 字段名称
const formData = ref({

})

// 是否文本
const istext = ref([
    {
        value: 1,
        zh: "是",
        en: "Yes",
    }, 
    {
        value: 0,
        zh: "否",
        en: "No",
    }
])

const selectTemplate = ref([
    {
        value: "1",
        zh: "所有欧洲订阅用户",
        en: "All European subscribers",
    }
])

const previewVisible = ref(false) // 预览链接
const previewImage = ref(null) // 预览链接


/* methods */
// 上传事件
const onUploadExplosion = ({ file, fileList }, type) => {
    switch(type) {
        case 'poster':
            uploadOptions.value.posterList = fileList
            console.log('poster', uploadOptions.value.posterList);
        break;
        case 'qrcode1':
            uploadOptions.value.qrCode1List = fileList
            console.log('qrcode1', file);
        break;
        case 'qrcode2':
            uploadOptions.value.qrCode2List = fileList
            console.log('qrcode2', uploadOptions.value.qrCode2List);
        break;
    }
}
// 预览事件
const handlePreview = (file) => {
    previewVisible.value = true
    previewImage.value = Core.Const.NET.FILE_URL_PREFIX + file.response.data.filename
}

// 预览 model 取消事件
const handleCancel = () => {
    previewVisible.value = false
    previewImage.value = null
}


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
            background-color: #F8FAFC;
            .module-title {
                color: #1D2129;
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
        border-top: 1px solid #F2F3F5;
        background: #FFF;
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
        background-size: 100%,100%;
        position: relative;

        .template-text {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #0061FF;
            font-size: 14px;
            font-weight: 600;
        }
    }
    .poster {

        :deep(.ant-upload-select-picture-card) {
            width: 165px;
            height: 80px;
            border: 1px dashed #E2E2E2;
            background: #FFF;
        }
        :deep(.ant-upload-list-picture-card-container) {
            width: 165px;
            height: 80px;
            border: 1px dashed #E2E2E2;            
        }
    }
    .qr-code {
        width: auto;
        :deep(.ant-upload-select-picture-card) {
            // width: 80px;
            // height: 80px;
            border: 1px dashed #E2E2E2;
            background: #FFF;
        }
        :deep(.ant-upload-list-picture-card-container) {
            // width: 80px;
            // height: 80px;
            border: 1px dashed #E2E2E2;    
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

    .qr-code1, .qr-code2 {
        display: flex;

        .qr-code-input {
            width: 165px;
            height: 32px;
            margin-left: 8px;
        }      
    }
}

.t-aligin-r {
    color: #1D2129;
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
    color: #1D2129;
    font-size: 14px;
    font-weight: 400;
}
</style>

