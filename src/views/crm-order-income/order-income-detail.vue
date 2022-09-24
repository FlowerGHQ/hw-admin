<template>
    <div id="OrderDetail" class="edit-container">
        <div class="title-container">
                <div class="title-area">{{  $t('crm_oi.detail')  }}
                <a-tag v-if="$auth('ADMIN')" :color='detail.status ? "green" : "red"'>
                    {{ detail.status ? $t('def.enable_ing') : $t('def.disable_ing') }}
                </a-tag>
            </div>
        </div>
        <div class="gray-panel">
            <div class="panel-content desc-container">
                <div class="desc-title">
                    <div class="title-area">
                        <span class="title">{{ detail.name }}</span>
                    </div>
                </div>
                <a-row class="desc-detail">
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_oi.order') }}：</span>
                        <span class="value">{{ detail.order || '-'   || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_oi.status') }}：</span>
                        <span class="value">{{ $Util.CRMOrderIncomeStatusFilter(detail.status) || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_oi.money') }}：</span>
                        <span class="value">{{ detail.money || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_oi.date') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.date) || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_oi.own_user_name') }}：</span>
                        <span class="value">{{ detail.own_user_name || '-'}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <a-button>退款</a-button>
                        <a-button @click="handleDelete(detail.id)">删除</a-button>
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-row>
            <a-col :xs='24' :sm='24' :lg='16' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation :detail="detail"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.related')">
                            <AttachmentFile :target_id="id" :target_type="CRM_ORDER_INCOME_FILE" />
                            <Bo :detail="detail"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='8' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('d.manage_employees')">
                            <Group :detail="detail"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('d.manage_employees')">
                            <TrackRecord :detail="detail"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
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
    </div>
</template>

<script>
import Core from '../../core';
import Contact from './components/Contact.vue';
import CustomerSituation from './components/CustomerSituation.vue';
import Bo from './components/Bo.vue';
import Group from './components/Group.vue';
import TrackRecord from './components/TrackRecord.vue';
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';
import AttachmentFile from '@/components/panel/AttachmentFile.vue';


import dayjs from "dayjs";
import {get} from "lodash";

export default {
    name: 'OrderDetail',
    components: { CustomerSelect, Contact, Bo, Group, TrackRecord, CustomerSituation, AttachmentFile},
    props: {},
    data() {
        return {
            CRM_ORDER_INCOME_FILE: Core.Const.ATTACHMENT.TARGET_TYPE.CRM_ORDER_INCOME_FILE,
            
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
                contact_order_id: '',
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
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        if (this.id) {
            this.getOrderDetail();
        }
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-order-income/order-income-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'back':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-order-income/order-income-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getOrderDetail() {
            this.loading = true;
            Core.Api.CRMOrderIncome.detail({
                id: this.id,
            }).then(res => {
                console.log('getOrderDetail res', res)
                let d = res.detail
                this.detail = d
                this.detail.birthday = this.detail.birthday ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                this.defAddr = [d.province, d.city, d.county]

                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getOrderDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
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
                target_id: this.detail.id,
                target_type: Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER,
                type: form.type,
                content: form.content,
                contact_order_id: form.contact_order_id,
                track_time: track_time,
                intent: form.intent,
                next_track_time: next_track_time,
            }).then(() => {
                this.$message.success(this.$t('pop_up.save_success'))
                this.handleTrackRecordClose();
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
        handleAddorderShow(ids, items) {
            this.trackRecordForm.contact_order_id = items[0].id
            this.trackRecordForm.contact_order_name = items[0].name

        },
        // 删除 合同订单
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('crm_oi.delete') + '？',
                okText: _this.$t('def.ok'),
                okType: 'danger',
                cancelText: _this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMOrderIncome.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.routerChange("back");
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less">
.OrderDetail {

    .icon {
        font-size: 12px;
    }
}
</style>
