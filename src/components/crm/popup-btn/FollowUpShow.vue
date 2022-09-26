<template>
    <a-button class="FollowUpShow" @click.stop="handleModalShow" :ghost='ghost' :type="btnType" :class="btnClass">
        <slot>{{ btnText }}</slot>
    </a-button>
    <template class="modal-container">
        <a-modal v-model:visible="TrackRecordShow" :title="$t('crm_t.add_track_record')" :after-close='handleTrackRecordClose'>
            <div class="form-item required">
                <div class="key">{{ $t('crm_t.type') }}：</div>
                <div class="value">
                    <a-select v-model:value="trackRecordForm.type" :placeholder="$t('def.input')">
                        <a-select-option v-for="item of TYPE_MAP" :key="item.value" :value="item.value">{{ lang === 'zh' ? item.zh: item.en }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item textarea required">
                <div class="key">{{ $t('crm_t.content') }}：</div>
                <div class="value">
                    <a-textarea v-model:value="trackRecordForm.content" :placeholder="$t('r.enter_remark')"
                                :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                    <span class="content-length">{{ trackRecordForm.content.length }}/500</span>
                </div>
            </div>
            <div class="form-item img-upload">
                <div class="key">{{ $t('i.picture') }}</div>
                <div class="value">
                    <a-upload name="file" class="image-uploader"
                              list-type="picture-card" accept='image/*'
                              :file-list="upload.detailList" :action="upload.action"
                              :headers="upload.headers" :data='upload.data'
                              :before-upload="handleImgCheck"
                              @change="handleCoverChange">
                        <div class="image-inner" v-if="upload.detailList.length < 10">
                            <i class="icon i_upload"/>
                        </div>
                    </a-upload>
                    <div class="tip">{{ $t('n.size') }}：800*800px</div>
                </div>
            </div>
            <div class="form-item file-upload">
                <div class="key">{{  $t('f.file') }}:</div>
                <div class="value">
                    <a-upload name="file"
                              :file-list="fileUpload.fileList" :action="fileUpload.action"
                              :headers="fileUpload.headers" :data='fileUpload.data'
                              :before-upload="handleImgCheck"
                              @change="handleFileChange">
                        <a-button class="file-upload-btn" type="primary" ghost v-if="fileUpload.fileList.length < 1">
                            <i class="icon i_upload"/> {{  $t('f.upload') }}
                        </a-button>
                    </a-upload>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_t.contact_customer') }}：</div>
                <div class="value">
                    <div v-if="trackRecordForm.contact_customer_id === ''">

                        <CustomerSelect @select="handleAddCustomerShow" :radioMode="true" btn-class="select-item-btn" btnType='link'>
                            <i class="icon i_edit"/> {{ $t('crm_c.add') }}
                        </CustomerSelect>
                    </div>
                    <div v-else>
                        {{trackRecordForm.contact_customer_name}}
                        <CustomerSelect @select="handleAddCustomerShow" :radioMode="true" btn-class="select-item-btn" btnType='link'>
                            <i class="icon i_edit"/> {{ $t('crm_c.edit') }}
                        </CustomerSelect>
                    </div>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_t.track_time') }}：</div>
                <div class="value">
                    <a-date-picker v-model:value="trackRecordForm.track_time" valueFormat='YYYY-MM-DD HH:mm:ss' :show-time="defaultTime" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_t.intent') }}：</div>
                <div class="value">
                    <a-select v-model:value="trackRecordForm.intent" :placeholder="$t('def.input')">
                        <a-select-option v-for="item of INTENT_MAP" :key="item.key" :value="item.value">{{lang === 'zh' ? item.zh: item.en }}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_t.next_track_time') }}：</div>
                <div class="value">
                    <a-date-picker v-model:value="trackRecordForm.next_track_time" valueFormat='YYYY-MM-DD HH:mm:ss' :show-time="defaultTime" :placeholder="$t('def.input')"/>
                </div>
            </div>

            <template #footer>
                <a-button @click="handleTrackRecordSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                <a-button @click="handleTrackRecordClose">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </template>
</template>

<script>
import Core from '../../../core'
import dayjs from "dayjs";
import {get} from "lodash";
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';

const WAYBILL = Core.Const.WAYBILL

export default {
    name: 'FollowUpShow',
    components: { CustomerSelect},
    props: {
        btnText: {
            type: String,
            default: '添加跟进记录'
        },
        btnType: {
            type: String,
            default: 'primary'
        },
        btnClass: {
            type: String,
        },
        ghost: {
            type: Boolean,
            default: false,
        },
        targetType: {
            type: Number,
            default: 0
        },
        targetId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {

            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,

            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            TrackRecordShow: false,
            trackRecordForm: {
                type: '',
                content: "",
                contact_customer_id: '',
                track_time: undefined,
                intent: "",
                next_track_time: undefined,
            },

            upload: { // 上传图片
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                coverList: [],
                detailList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'img',
                },
            },
            fileUpload: {
                action: Core.Const.NET.FILE_UPLOAD_END_POINT,
                fileList: [],
                headers: {
                    ContentType: false
                },
                data: {
                    token: Core.Data.getToken(),
                    type: 'file',
                },
            },
        }
    },
    watch: {},
    computed: {
        lang(){
            return this.$store.state.lang
        }
    },
    created() {
    },
    mounted() {

    },
    methods: {
        handleModalShow() {
            this.TrackRecordShow = true
        },
        handleTrackRecordSubmit() {
            let form = Core.Util.deepCopy(this.trackRecordForm)
            let track_time = form.track_time
            if (typeof track_time === 'string') {
                track_time = dayjs(form.track_time).unix()
            }
            let next_track_time = form.next_track_time
            if (typeof next_track_time === 'string') {
                next_track_time = dayjs(form.next_track_time).unix()
            }
            Core.Api.CRMTrackRecord.save({
                target_id: this.targetId,
                target_type: this.targetType,
                type: form.type,
                content: form.content,
                contact_customer_id: form.contact_customer_id,
                track_time: track_time,
                intent: form.intent,
                next_track_time: next_track_time,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.handleTrackRecordClose();
                this.$emit("submit")
            }).catch(err => {
                console.log('handleSubmit err:', err)
            })
        },
        handleTrackRecordClose(){
            this.TrackRecordShow = false;
            Object.assign(this.trackRecordForm, this.$options.data().trackRecordForm)
        },
        // 校验图片
        handleImgCheck(file) {
            const isCanUpType = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
            if (!isCanUpType) {
                this.$message.warning(this.$t('n.file_incorrect'));
            }
            const isLt10M = (file.size / 1024 / 1024) < 10;
            if (!isLt10M) {
                this.$message.warning(this.$t('n.picture_smaller'));
            }

            // this.loadImage(TEST_IMAGE);
            // return false;
            return isCanUpType && isLt10M;
        },
        // 上传图片
        handleCoverChange({ file, fileList }) {
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
                this.shortPath = get(fileList,'[0].response.data.filename', null);
                if(this.shortPath) {
                    this.form.img = this.shortPath;
                    // this.loadImage(this.detailImageUrl);
                }
            }
            this.upload.coverList = fileList;
        },
        // 上传文件
        handleFileChange({file, fileList}) {
            console.log("handleCoverChange status:", file.status, "file:", file)
            if (file.status == 'done') {
                if (file.response && file.response.code > 0) {
                    return this.$message.error(file.response.message)
                }
                this.form.path = file.response.data.filename
                this.form.type = this.form.path.split('.').pop()
                if (this.form.path){
                    this.submitDisabled = false
                }
            }
            this.upload.fileList = fileList
        },
        // 添加商品
        handleAddCustomerShow(ids, items) {
            this.trackRecordForm.contact_customer_id = items[0].id
            this.trackRecordForm.contact_customer_name = items[0].name

        },

    }
}
</script>

<style lang='less'>
.FollowUpShow {
    .main {
        font-size: 12px;
        font-weight: 500;
        color: #3C3C3C;
        line-height: 20px;

        .ant-btn {
            height: 20px;
            font-size: 12px;
            margin-left: 8px;
        }
    }

    .desc, .time {
        font-size: 12px;
        font-weight: 400;
        color: #6C6C6C;
        line-height: 20px;
        margin: 6px 0;
    }
}

.waybill-show-modal {
    .ant-steps-item-container {
        .ant-steps-item-content {
            width: calc(~'100% - 30px');
        }
    }
}
</style>
