<template>
    <div id="CustomerEdit" class="edit-container">
        <div class="title-container">
                <div class="title-area">{{  $t('crm_b.detail')  }}
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

                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
<!--                        <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"/>-->
<!--                        <a-button @click="routerChange('edit')">编辑</a-button>-->
<!--                        <CustomerSelect @select="handleAddCustomerShow" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :addCustomerBtn="true"/>-->
<!--                        <a-button>新建订单</a-button>-->
<!--                        <a-button>移交</a-button>-->
<!--                        <a-button>删除</a-button>-->
                    </a-col>
                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <div v-if="detail.status === STATUS.POOL">
                            <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"/>
                            <a-button @click="routerChange('edit')">{{ $t('n.edit') }}</a-button>
                            <CustomerSelect @select="handleAddCustomerShow" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :addCustomerBtn="true"/>
                        </div>
                        <div v-if="detail.status === STATUS.CUSTOMER &&  trackMemberDetail!== undefined  &&  trackMemberDetail!== null  &&  trackMemberDetail!== ''">
                            <span v-if="trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ">
                                <FollowUpShow :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"/>
                                <a-button @click="routerChange('edit')">{{ $t('n.edit') }}</a-button>
                                <a-button>新建订单</a-button>
                            </span>
                            <span v-if="trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN">
                                <CustomerSelect @select="handleAddCustomerShow" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :addCustomerBtn="true"/>
                                <a-button type="primary" @click="handleBatch('transfer')">{{ $t('crm_c.transfer') }}</a-button>
                                <a-button type="danger" @click="handleReturnPool">{{ $t('crm_c.return_pool') }}</a-button>
                            </span>

                        </div>
                    </a-col>
                </a-row>
                <div class="panel-content">
                    <MySteps :stepsList='groupStatusTableData' :current='detail.status'></MySteps>
                </div>
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
                            <TrackRecord :targetId="id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO" :detail="detail" ref ="TrackRecord"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
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
import {get} from "lodash";

import CRMContact from '@/components/crm/panel/CRMContact.vue';
import CRMOrder from '@/components/crm/panel/CRMOrder.vue';
import Group from '@/components/crm/panel/Group.vue';
import TrackRecord from '@/components/crm/panel/TrackRecord.vue';

export default {
    name: 'CustomerEdit',
    components: { FollowUpShow, CustomerAdd, CustomerSelect, MySteps, CRMContact, CRMOrder, TrackRecord, CustomerSituation,Group},
    props: {},
    data() {
        return {
            Core,
            TYPE_MAP: Core.Const.CRM_TRACK_RECORD.TYPE_MAP,
            INTENT_MAP: Core.Const.CRM_TRACK_RECORD.INTENT_MAP,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
            STATUS: Core.Const.CRM_CUSTOMER.STATUS,
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
                        this.getCustomerDetail();
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
                title: this.$t('crm_c.sure_return_pool'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.returnPool({id: _this.detail.id}).then(() => {
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
        getTrackRecord(){
            console.log("getTrackRecord");
            this.$refs.TrackRecord.getCRMTrackRecordTableData();
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
