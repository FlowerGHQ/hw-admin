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
                        <span class="key">{{ $t('crm_c.pre_own_user') }}：</span>
                        <span class="value">{{detail.pre_own_user_name}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <span v-if="detail.status === STATUS.POOL">
                            <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" @submit="getCRMTrackRecord"/>
                            <a-button @click="routerChange('edit')">{{ $t('n.edit') }}</a-button>
                            <CustomerAdd :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER"  />
                            <a-button type="primary" @click="handleObtain">{{ $t('crm_c.obtain') }}</a-button>
                            <a-button type="primary" @click="handleBatch('distribute')">{{ $t('crm_c.distribute') }}</a-button>
                            <a-button type="danger" @click="handleDelete">{{ $t('crm_c.delete') }}</a-button>
                        </span>
                        <span v-if="detail.status === STATUS.CUSTOMER &&  trackMemberDetail!== undefined  &&  trackMemberDetail!== null  &&  trackMemberDetail!== ''">
                            <span v-if="trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ">
                                <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" @submit="getCRMTrackRecord"/>
                                <a-button @click="routerChange('edit')">{{ $t('n.edit') }}</a-button>
                                <a-button @click="routerChange('bo-save')">新建商机</a-button>
                                <a-button @click="routerChange('order-save')">新建订单</a-button>
                            </span>
                            <span v-if="trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN">
                                <CustomerSelect @select="handleAddCustomerShow" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :addCustomerBtn="true"/>
                                <a-button type="primary" @click="handleBatch('transfer')">{{ $t('crm_c.transfer') }}</a-button>
                                <a-button type="danger" @click="handleReturnPool">{{ $t('crm_c.return_pool') }}</a-button>
                            </span>

                        </span>
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-row >
            <a-col :xs='24' :sm='24' :lg='16' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="TrackRecord" :tab="$t('crm_t.track_record')">
                            <CRMTrackRecord :targetId="id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :detail="detail" ref ="CRMTrackRecord"/>
                        </a-tab-pane>
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation :detail="detail"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.related')">
                            <CRMContact :detail="detail" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" ref="CRMContact"/>
                            <CRMBo :detail="detail" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" ref ="CRMBo"/>
                            <CRMOrder :detail="detail" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" ref ="CRMOrder"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='8' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="tabActiveKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.team_members')">
                            <Group :targetId="id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" :detail="detail" ref ="Group"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
                            <ActionRecord :targetId="id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :detail="detail" ref ="ActionRecord"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
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
import CustomerSituation from './components/CustomerSituation.vue';

import CRMBo from '@/components/crm/panel/CRMBo.vue';
import CRMContact from '@/components/crm/panel/CRMContact.vue';
import CRMOrder from '@/components/crm/panel/CRMOrder.vue';
import CRMTrackRecord from '@/components/crm/panel/CRMTrackRecord.vue';

import Group from '@/components/crm/panel/Group.vue';
import ActionRecord from '@/components/crm/panel/ActionRecord.vue';



import CustomerAdd from '@/components/crm/popup-btn/CustomerAdd.vue';
import FollowUpShow from '@/components/crm/popup-btn/FollowUpShow.vue';

import dayjs from "dayjs";
import {get} from "lodash";

export default {
    name: 'CustomerEdit',
    components: { CustomerAdd, FollowUpShow, CRMContact, CRMBo, CRMTrackRecord, Group, CRMOrder, ActionRecord, CustomerSituation},
    props: {},
    data() {
        return {
            Core,
            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            STATUS: Core.Const.CRM_CUSTOMER.STATUS,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,

            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: 'TrackRecord',
            tabActiveKey: 'CustomerSituation',
            detail: {},
            batchForm: {
                own_user_id: '',
            },
            batchShow: false,
            userData: [],
            trackMemberDetail: undefined,

        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang
        }
    },
    created() {
        this.id = Number(this.$route.query.id) || 0
    },
    mounted() {
        // this.id = Number(this.$route.query.id) || 0
        if (this.id) {
            this.getCustomerDetail();
            this.getTargetByUserId();
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
                case 'bo-save':  // 修改
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-edit",
                        query: { customer_id: this.detail.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'order-save':  // 修改
                    routeUrl = this.$router.resolve({
                        path: "/crm-order/order-edit",
                        query: { customer_id: this.detail.id }
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
        // 添加商品
        handleAddCustomerShow(ids, items) {
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
            if (!this.batchForm.own_user_id) {
                return this.$message.warning(this.$t('crm_c.select'))
            }
            switch (this.batchType){
                case "distribute":
                    Core.Api.CRMCustomer.distribute({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    }).then(() => {
                        this.$message.success(this.$t('pop_up.delete_success'));
                        this.getCustomerDetail();
                        this.handleBatchClose();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
                case "transfer":
                    Core.Api.CRMCustomer.transfer({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    }).then(() => {
                        this.$message.success(this.$t('pop_up.delete_success'));
                        this.getCustomerDetail();
                        this.handleBatchClose();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
            }
        },
        getUserData(query){
            this.loading = true;
            Core.Api.User.list({
                name: query,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
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
                        _this.getCustomerDetail();
                        _this.handleBatchClose();
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
                        _this.getCustomerDetail();
                        _this.handleBatchClose();
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
                        _this.getCustomerDetail();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        getTargetByUserId() {
            Core.Api.CRMTrackMember.getTargetByUserId({
                target_id: this.id,
                target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER,
            }).then(res => {
                this.trackMemberDetail = res.detail
                console.log("trackMemberDetail", this.trackMemberDetail);
            })
        },
        getCRMTrackRecord(){
            console.log("getTrackRecord");
            this.$refs.CRMTrackRecord.getTableData();
        },
        getCrmActionRecordTableData(){
            console.log("getCrmActionRecordTableData");
            this.$refs.TrackRecord.getCrmActionRecordTableData();
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
