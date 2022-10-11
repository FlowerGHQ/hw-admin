<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
                <div class="title-area">{{  $t('crm_b.detail')  }}
            </div>
            <div class="btns-area">
                <a-button @click="nextStep" v-if="detail.status + 1 < groupStatusTableData.length && detail.status !== STATUS.LOSE" v-if="$auth('crm-bo.update-status')"><i class="icon i_audit"/>{{$t('crm_b.next_step')}}</a-button>
                <a-button @click="loseTheOrder" v-if="detail.status !== STATUS.LOSE" v-if="$auth('crm-bo.update-status')"><i class="icon i_audit"/>{{$t('crm_b.lost_order')}}</a-button>
                <a-button @click="winTheOrder"  v-if="detail.status !== STATUS.LOSE && detail.status !== STATUS.WIN" v-if="$auth('crm-bo.update-status')"><i class="icon i_audit"/>{{$t('crm_b.win_order')}}</a-button>
                <a-button @click="reactivation"  v-if="detail.status === STATUS.LOSE"><i class="icon i_audit" v-if="$auth('crm-bo.reactivation')"/>{{$t('crm_b.reactivation')}}</a-button>
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
                        <span class="key">{{ $t('crm_b.customer_name') }}：</span>
                        <span class="value">{{detail.customer_name}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_b.money') }}：</span>
                        <span class="value">{{detail.money}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_b.estimated_deal_time') }}：</span>
                        <span class="value">{{$Util.timeFilter(detail.estimated_deal_time)}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_b.customer_name') }}：</span>
                        <span class="value">{{detail.customer_name}}</span>
                    </a-col>

                    <a-col :xs='24' :sm='24' :lg='24' >
                        <div class="panel-content">
                            <MySteps :stepsList='groupStatusTableData' :current='detail.status'></MySteps>
                        </div>
                    </a-col>

                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                            <span v-if="trackMemberDetail!= null? trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ : false">
                                <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" @submit="getCRMTrackRecord"/>
                                <a-button @click="routerChange('edit')" v-if="$auth('crm-bo.save')">{{ $t('n.edit') }}</a-button>
                                 <a-button @click="routerChange('order-save')" v-if="$auth('crm-order.save')">新建订单</a-button>
                            </span>
                            <span v-if="trackMemberDetail!= null ? trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN : false">
                                <CustomerSelect @select="handleAddCustomerShow" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :addCustomerBtn="true"/>
                                <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-bo.transfer')">{{ $t('crm_c.transfer') }}</a-button>
                                <a-button type="danger" @click="handleReturnPool">{{ $t('crm_c.return_pool') }}</a-button>
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
                            <CRMContact :detail="detail" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO" ref ="CRMContact"/>
                            <CRMOrder :detail="detail" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO" ref ="CRMOrder"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='8' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="tabActiveKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.team_members')">
                            <Group :targetId="id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO" :detail="detail" ref ="Group"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
                            <ActionRecord :targetId="id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :detail="detail" ref ="ActionRecord"/>
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
import FollowUpShow from '@/components/crm/popup-btn/FollowUpShow.vue';
import CustomerAdd from '@/components/crm/popup-btn/CustomerAdd.vue';
import CustomerSelect from '@/components/crm/popup-btn/CustomerSelect.vue';
import MySteps from "@/components/common/MySteps.vue"
import dayjs from "dayjs";

import CRMContact from '@/components/crm/panel/CRMContact.vue';
import CRMOrder from '@/components/crm/panel/CRMOrder.vue';
import Group from '@/components/crm/panel/Group.vue';
import ActionRecord from '@/components/crm/panel/ActionRecord.vue';
import CRMTrackRecord from '@/components/crm/panel/CRMTrackRecord.vue';

export default {
    name: 'CustomerEdit',
    components: { FollowUpShow, CustomerAdd, CustomerSelect, MySteps, CRMContact, CRMOrder, ActionRecord, CustomerSituation,Group, CRMTrackRecord},
    props: {},
    data() {
        return {
            Core,
            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            STATUS: Core.Const.CRM_BO.STATUS,
            activeKey: 'CustomerSituation',
            tabActiveKey: 'CustomerSituation',
            batchShow: false,
            batchType: '',
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            detail: {},
            trackMemberDetail: undefined,
            groupStatusTableData: [],
            batchForm: {
                own_user_id: '',
            },
            userData: [],
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
        if (this.id) {
            this.getBoDetail();
            this.getTargetByUserId();
        }
        this.getGroupStatusDetail()
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
                        path: "/crm-bo/bo-edit",
                        query: { id: this.detail.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'order-save':  // 修改
                    routeUrl = this.$router.resolve({
                        path: "/crm-order/order-edit",
                        query: { bo_id: this.detail.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
            }
        },
        getBoDetail() {
            this.loading = true;
            Core.Api.CRMBo.detail({
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
        // 添加联系人
        handleAddCustomerShow(ids, items) {

        },
        getGroupStatusDetail() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            }).then(res => {
                this.groupStatusTableData = JSON.parse(res.detail.status_list)
                if (this.detail.status !== this.STATUS.LOSE){
                    this.groupStatusTableData.push( {status: '100', zh: '赢单',en: 'Win order'})
                }

            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
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
                    Core.Api.CRMBo.distribute({
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
                    Core.Api.CRMBo.transfer({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    }).then(() => {
                        this.$message.success(this.$t('pop_up.delete_success'));
                        this.getBoDetail();
                        this.handleBatchClose();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
            }
        },
        handleReturnPool() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.sure_return_pool'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.returnPool({id: _this.detail.id}).then(() => {
                        _this.$message.success(_this.$t('crm_b.return_pool_success'));
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
                target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO,
            }).then(res => {
                this.trackMemberDetail = res.detail
                console.log("trackMemberDetail", this.trackMemberDetail);
            })
        },
        getCRMTrackRecord(){
            console.log("getTrackRecord");
            this.$refs.CRMTrackRecord.getCRMTrackRecordTableData();
        },
        getCrmActionRecordTableData(){
            console.log("getCrmActionRecordTableData");
            this.$refs.ActionRecord.getCrmActionRecordTableData();
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
        nextStep(){
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_next_step'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.updateStatus({id: _this.detail.id, status: _this.detail.status +1}).then(() => {
                        _this.$message.success(_this.$t('crm_b.whether_next_step_success'));
                        _this.getBoDetail();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        loseTheOrder(){
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_lost_order'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.fail({id: _this.detail.id}).then(() => {
                        _this.$message.success(_this.$t('crm_b.whether_lost_order_success'));
                        _this.getBoDetail();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        winTheOrder(){
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_win_order'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.success({id: _this.detail.id}).then(() => {
                        _this.$message.success(_this.$t('crm_b.whether_win_order_success'));
                        _this.getBoDetail();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        reactivation(){
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_reactivation'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.reactivation({id: _this.detail.id}).then(() => {
                        _this.$message.success(_this.$t('crm_b.whether_reactivation_success'));
                        _this.getBoDetail();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        }


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
