<template>
    <div id="CustomerDetail" class="edit-container">
        <div class="title-container">
                <div class="title-area">{{  $t('crm_c.detail')  }}
<!--                <a-tag v-if="$auth('ADMIN')" :color='detail.status ? "green" : "red"'>-->
<!--                    {{ detail.status ? $t('def.enable_ing') : $t('def.disable_ing') }}-->
<!--                </a-tag>-->

                </div>
                <div class="btns-area">
                        <template v-if="detail.status === STATUS.POOL">
                            <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">{{ $t('n.edit') }}</a-button>
                            <a-button type="primary" @click="handleObtain" v-if="$auth('crm-customer.obtain')">{{ $t('crm_c.obtain') }}</a-button>
                            <a-button type="primary" @click="handleBatch('distribute')" v-if="$auth('crm-customer.distribute')">{{ $t('crm_c.distribute') }}</a-button>
                            <a-button type="danger" @click="handleDelete" v-if="$auth('crm-customer.delete')">{{ $t('crm_c.delete') }}</a-button>
                        </template>
                        <template v-if="detail.status === STATUS.CUSTOMER &&  trackMemberDetail!== undefined  &&  trackMemberDetail!== null  &&  trackMemberDetail!== ''">
                            <template v-if="trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ">
                                <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">{{ $t('n.edit') }}</a-button>
                            </template>
                            <template v-if="trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN">
                                <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-customer.transfer')">{{ $t('crm_c.transfer') }}</a-button>
                                <a-button type="danger" @click="handleReturnPool" v-if="$auth('crm-customer.return-pool')">{{ $t('crm_c.return_pool') }}</a-button>
                            </template>
                        </template>
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
                        <span class="key">{{ $t('n.phone') }}：</span>
                        <span class="value phone-hover">
                            {{detail.phone_country_code}} {{detail.phone}}
                             <a-button type="link" v-if="(!detail.flag_eyes) && detail.status !== STATUS.CUSTOMER" class="switch" @click="handleChecking()"><i class="icon i_eyes"/></a-button>

                        </span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('n.email') }}：</span>
                        <span class="value phone-hover">
                            {{detail.email}}
                            <a-button type="link" v-if="(!detail.flag_eyes) && detail.status !== STATUS.CUSTOMER" class="switch" @click="handleChecking()"><i class="icon i_eyes"/></a-button>

                        </span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_c.level') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerLevelFilter(detail.level, $i18n.locale) || '-'  }}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_c.type') }}：</span>
                        <span class="value">{{ $Util.CRMCustomerTypeFilter(detail.type, $i18n.locale) || '-'  }}</span>
                    </a-col>

                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_c.own_user_name') }}：</span>
                        <span class="value">{{detail.own_user ? detail.own_user.name : "-"}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('crm_c.pre_own_user') }}：</span>
                        <span class="value">{{detail.pre_own_user_name}}</span>
                    </a-col>
                    <a-col :xs='24' :sm='12' :lg='8' class='detail-item'>
                        <span class="key">{{ $t('n.time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.create_time) }}</span>
                    </a-col>
                    <!-- 标签展示 -->
                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <span class="key">{{ $t('sl.show') }}：</span>
                        <span class="value" style="overflow: initial; white-space: normal;">
                            <LabelList :targetId="id" :targetType="Core.Const.CRM_LABEL.CATEGORY.CUSTOMER"/>
                        </span>
                    </a-col>

                    <a-col :xs='24' :sm='24' :lg='24' class='detail-item'>
                        <!-- <a-button type="primary" @click="routerChange('test-drive')" v-if="$auth('crm-customer.save')">{{ $t('crm_d.save') }}</a-button>
                        <template v-if="detail.status === STATUS.POOL">
                            <FollowUpShow :btnText="$t('crm_c.add_follow_records')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" @submit="getCRMTrackRecord" />
                            <CustomerAdd :btnText="$t('crm_c.add')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :groupId="detail.group_id"  @select="getCRMContactList" />
                            <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">{{ $t('n.edit') }}</a-button>
                            <a-button type="primary" @click="handleObtain" v-if="$auth('crm-customer.obtain')">{{ $t('crm_c.obtain') }}</a-button>
                            <a-button type="primary" @click="handleBatch('distribute')" v-if="$auth('crm-customer.distribute')">{{ $t('crm_c.distribute') }}</a-button>
                            <a-button type="danger" @click="handleDelete" v-if="$auth('crm-customer.delete')">{{ $t('crm_c.delete') }}</a-button>
                        </template>
                        <template v-if="detail.status === STATUS.CUSTOMER &&  trackMemberDetail!== undefined  &&  trackMemberDetail!== null  &&  trackMemberDetail!== ''">
                            <template v-if="trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ">
                                <FollowUpShow :btnText="$t('crm_c.add_follow_records')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" @submit="getCRMTrackRecord"/>
                                <a-button @click="routerChange('edit')" v-if="$auth('crm-customer.save')">{{ $t('n.edit') }}</a-button>
                                <a-button @click="routerChange('bo-save')" v-if="$auth('crm-bo.save')">{{$t('crm_b.save')}}</a-button>
                                <a-button @click="routerChange('order-save')" v-if="$auth('crm-order.save')">{{ $t('crm_o.save') }}</a-button>
                                <CustomerAdd :btnText="$t('crm_c.add')"  :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :groupId="detail.group_id" @select="getCRMContactList" :addCustomerBtn="true"/>
                            </template>
                            <template v-if="trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN">
                                <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-customer.transfer')">{{ $t('crm_c.transfer') }}</a-button>
                                <a-button type="danger" @click="handleReturnPool" v-if="$auth('crm-customer.return-pool')">{{ $t('crm_c.return_pool') }}</a-button>
                            </template>
                        </template> -->
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-row >
            <a-col :xs='24' :sm='24' :lg='16' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <!-- 跟进记录 tab -->
                        <a-tab-pane key="TrackRecord" :tab="$t('crm_t.track_record')">
                            <CRMTrackRecord :targetId="id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :detail="detail" ref ="CRMTrackRecord">
                                <FollowUpShow :btnText="$t('crm_c.add_follow_records')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" @submit="getCRMTrackRecord" />
                            </CRMTrackRecord>
                        </a-tab-pane>
                        <!-- 资料 tab -->
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation :detail="detail"/>
                        </a-tab-pane>
                        <!-- 试驾单列表 tab -->
                        <a-tab-pane key="TestDriveList" :tab="$t('crm_d.list')">
                            <CRMTestDrive  v-if="id>0" :detail="detail" :customerId="detail.id" ref="CRMTestDrive">
                                <a-button type="primary" @click="routerChange('test-drive')" v-if="$auth('crm-customer.save')">{{ $t('crm_d.save') }}</a-button>
                            </CRMTestDrive>
                        </a-tab-pane>
                        <!-- 联系人 tab -->
                        <a-tab-pane key="ContacPerson" :tab="$t('crm_t.contact_customer')">
                            <CRMContact  v-if="id>0" :detail="detail" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" :flagOWN="trackMemberDetail != null ?trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN: false" ref="CRMContact">
                                <CustomerAdd :btnText="$t('crm_c.add')" :targetId="detail.id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :groupId="detail.group_id"  @select="getCRMContactList" />
                            </CRMContact>
                        </a-tab-pane>
                        <!-- 商机 tab -->
                        <a-tab-pane key="Opportunity" :tab="$t('crm_b.new_bo')">
                            <CRMBo  v-if="id>0" :detail="detail" :customerId="detail.id" ref ="CRMBo">
                                <a-button type="primary" @click="routerChange('add-crm-bo')" v-if="$auth('crm-bo.save')"><i class="icon i_add"/>{{ $t('crm_b.save') }}</a-button>
                            </CRMBo>
                        </a-tab-pane>
                        <!-- 合同 -->
                        <a-tab-pane key="ContractList" :tab="$t('crm_o.list')">
                            <CRMOrder   v-if="id>0" :detail="detail" :customerId="detail.id"  ref ="CRMOrder">
                                <a-button type="primary" @click="routerChange('add-order')" v-if="$auth('crm-order.save')"><i class="icon i_add"/>{{ $t('crm_o.save') }}</a-button>
                            </CRMOrder>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs='24' :sm='24' :lg='8' >
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="tabActiveKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.team_members')" v-if="detail.status !== Core.Const.CRM_CUSTOMER.STATUS.POOL">
                            <Group  v-if="id>0" :targetId="id" :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.CUSTOMER" :detail="detail" ref ="Group"/>
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
                            <ActionRecord  v-if="id>0" :targetId="id" :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.CUSTOMER" :detail="detail" ref ="ActionRecord"/>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
        <a-modal v-model:visible="batchShow" :title="$t('crm_c.distribute_customer')" :after-close='handleBatchClose'>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                <div class="value">
                    {{detail.name}}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_group.name') }}：</div>
                <div class="value">
                    <a-tree-select class="CategoryTreeSelect"
                        v-model:value="group_id"
                        :placeholder="$t('def.select')"
                        :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                        :tree-data="groupOptions"
                        @change="getUserData('')"
                        tree-default-expand-all
                    />
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.own_user_name') }}：</div>
                <div class="value">
                    <a-select
                        v-model:value="batchForm.own_user_id"
                        show-search
                        :placeholder="$t('def.select')+$t('crm_b.own_user_name')"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="getUserData"
                        :disabled="!group_id"
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
import CRMTestDrive from '@/components/crm/panel/CRMTestDrive.vue';

import Group from '@/components/crm/panel/Group.vue';
import ActionRecord from '@/components/crm/panel/ActionRecord.vue';

import CustomerAdd from '@/components/crm/popup-btn/CustomerAdd.vue';
import FollowUpShow from '@/components/crm/popup-btn/FollowUpShow.vue';

import LabelList from '@/components/crm/common/LabelList.vue';

export default {
    name: 'CustomerEdit',
    components: { CustomerAdd, FollowUpShow, CRMContact, CRMBo, CRMTrackRecord, Group, CRMOrder, ActionRecord, CustomerSituation,LabelList,CRMTestDrive},
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
            groupOptions: [],
            group_id: undefined,
            id: '',
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
                    window.open(routeUrl.href, '_block')
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
                case 'test-drive':    // 新建试驾单
                    routeUrl = this.$router.resolve({
                        path: "/crm-test-drive-order/test-drive-edit",
                        query: {customer_id: this.detail.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'add-crm-bo':  // 修改
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-edit",
                        query: { customer_id: this.detail.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'add-order':  // 修改
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
                if (this.detail.status === Core.Const.CRM_CUSTOMER.STATUS.POOL){
                    this.tabActiveKey = "InformationInfo";
                }
                this.handleGroupTree()

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
        getCRMContactList(){
            this.$refs.CRMContact.getTableData();
        },
        handleBatch(type) {
            this.getUserData()
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
                        this.$message.success(this.$t('crm_c.distribute_success'));
                        this.getCustomerDetail();
                        this.getTargetByUserId();
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
                        this.$message.success(this.$t('crm_c.transfer_success'));
                        this.getCustomerDetail();
                        this.getTargetByUserId();
                        this.handleBatchClose();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                    break;
            }
        },
        getUserData(query){
            this.batchForm.own_user_id = undefined
            this.loading = true;
            Core.Api.User.listGroup({
                group_id: this.group_id,
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

                        _this.routerChange('back')
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
                        _this.getTargetByUserId();
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
                        _this.getTargetByUserId();
                        _this.handleBatchClose();
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
                // console.log("trackMemberDetail", this.trackMemberDetail);
            })
        },
        getCRMTrackRecord(){
            this.$refs.CRMTrackRecord.getTableData();
        },
        getCrmActionRecordTableData(){
            console.log("getCrmActionRecordTableData");
            this.$refs.TrackRecord.getCrmActionRecordTableData();
        },
        handleGroupTree(){
            Core.Api.CRMGroupMember.structureByUserGroup({
                group_id: this.detail.group_id
            }).then(res => {
                this.groupOptions = res.list
                console.log(res)

            })
        },
        handleChecking(){
            Core.Api.CRMCustomer.checking({
                id:this.detail.id
            }).then(res => {
                this.detail.phone = res.detail.phone
                this.detail.email = res.detail.email
                this.detail.flag_eyes = true
                console.log(res)

            })
        },

    }
};
</script>

<style lang="less">
#CustomerDetail {

    .icon {
        font-size: 12px;
    }
    .i_eyes {font-size: 12px;}
    .phone-hover {
        .switch {
            opacity: 0;
        }
        &:hover {
            .switch {
                opacity: 1;
            }
        }
    }
}
</style>
