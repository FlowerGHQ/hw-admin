<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
                <div class="title-area">{{  $t('crm_c.detail')  }}
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
                        <span class="key">{{ $t('crm_c.level') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerLevelFilter(detail.level, $i18n.locale) || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_c.type') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerTypeFilter(detail.type, $i18n.locale) || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value">{{detail.phone}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"/>
                        <a-button @click="routerChange('edit')">{{ $t('n.edit') }}</a-button>
                        <CustomerSelect @select="handleAddCustomerShow" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :addCustomerBtn="true"/>
                        <a-button>新建商机</a-button>
                        <a-button>新建订单</a-button>
                        <a-button type="primary" @click="handleBatch('distribute')">{{ $t('crm_c.distribute') }}</a-button>
                        <a-button type="primary" @click="handleBatch('transfer')">{{ $t('crm_c.transfer') }}</a-button>
                        <a-button type="primary" @click="handleObtain">{{ $t('crm_c.obtain') }}</a-button>
                        <a-button type="danger" @click="handleReturnPool">{{ $t('crm_c.return_pool') }}</a-button>
                        <a-button type="danger" @click="handleDelete">{{ $t('crm_c.delete') }}</a-button>
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-row >
            <a-col :xs='24' :sm='24' :lg='16' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation :detail="detail"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.related')">
                            <Contact :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" :detail="detail"/>
                            <Bo :detail="detail"/>
                            <Bo :detail="detail"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='8' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.team_members')">
                            <Group :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" :detail="detail"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
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
        <a-modal v-model:visible="batchShow" :title="$t('crm_c.distribute_customer')" :after-close='handleBatchClose'>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                <div class="value">
                    <a-select
                        v-model:value="batchForm.own_user_id"
                        show-search
                        :placeholder="$t('def.input')+$t('n.warehouse')"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="getUserData"
                    >
                        <a-select-option v-for=" item in userData" :key="item.id" :value="item.id">
                            {{ item.account ? item.account.name : '-' }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleBatchSubmit" type="primary">{{ $t('def.ok') }}</a-button>
                <a-button @click="handleBatchClose">{{ $t('def.cancel') }}</a-button>
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
import FollowUpShow from '@/components/crm/popup-btn/FollowUpShow.vue';

import dayjs from "dayjs";
import {get} from "lodash";

export default {
    name: 'CustomerEdit',
    components: { CustomerSelect, FollowUpShow, Contact, Bo, Group, TrackRecord, CustomerSituation},
    props: {},
    data() {
        return {
            Core,
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
            batchForm: {
                own_user_id: '',
            },
            batchShow: false,
            userData: [],
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
            this.getCustomerDetail();
        }
    },
    methods: {
        routerChange(type, item) {
            let routeUrl = ""
            switch (type) {
                case 'back':    // 返回
                    routeUrl = this.$router.resolve({
                        path: "/crm-customer/customer-list",
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':  // 修改
                    routeUrl = this.$router.resolve({
                        path: "/crm-customer/customer-edit",
                        query: { id: this.detail.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getCustomerDetail() {
            this.loading = true;
            Core.Api.CRMCustomer.detail({
                id: this.id,
            }).then(res => {
                console.log('getCustomerDetail res', res)
                let d = res.detail
                this.detail = d
                this.detail.birthday = this.detail.birthday ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD') : undefined
                for (const key in this.form) {
                    this.form[key] = d[key]
                }
                this.defAddr = [d.province, d.city, d.county]

                // this.defArea = [d.continent || '', d.country || '']
            }).catch(err => {
                console.log('getCustomerDetail err', err)
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
                contact_customer_id: form.contact_customer_id,
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
        handleAddCustomerShow(ids, items) {
            this.trackRecordForm.contact_customer_id = items
            Core.Api.CrmContactBind.batchSave({
                target_id: this.detail.id,
                target_type: Core.Const.CRM_CONTACT_BIND.TARGET_TYPE.CUSTOMER,
                contact_customer_ids: ids,
            }).then(() => {
                this.$message.success(this.$t('pop_up.delete_success'));
            }).catch(err => {
                console.log("handleDelete err", err);
            })

        },
        handleBatch(type) {
            this.batchShow = true;
            this.batchType = type
        },
        handleBatchClose() {

            this.batchShow = false;
            this.batchType = '';
        },
        handleBatchSubmit() {
            if (this.batchForm.own_user_id) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            switch (this.batchType){
                case "distribute":
                    Core.Api.CRMCustomer.batchDistribute({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    }).then(() => {
                        this.$message.success(_this.$t('pop_up.delete_success'));
                        this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
                case "transfer":
                    Core.Api.CRMCustomer.batchTransfer({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    }).then(() => {
                        this.$message.success(_this.$t('pop_up.delete_success'));
                        this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
            }
        },
        getUserData(query){
            this.loading = true;
            Core.Api.User.list({
                name: query
            }).then(res => {
                console.log("getTableData res:", res)
                this.userData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleDelete() {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.delete({id: _this.detail.id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleObtain() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_obtain'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.obtain({id: _this.detail.id}).then(() => {
                        _this.$message.success(_this.$t('crm_c.obtain_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        handleReturnPool() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_c.sure_return_pool'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.returnPool({id: _this.detail.id}).then(() => {
                        _this.$message.success(_this.$t('crm_c.return_pool_success'));
                        _this.getTableData();
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
.CustomerEdit {

    .icon {
        font-size: 12px;
    }
}
</style>
