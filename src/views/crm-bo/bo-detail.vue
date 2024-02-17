<template>
    <div id="CustomerDetail" class="edit-container">
        <div class="title-container">
            <div class="title-area">{{ $t('crm_b.detail') }}</div>
            <div class="btns-area">
                <!-- <a-button @click="nextStep" v-if="detail.status + 2 < groupStatusTableData.length && detail.status !== STATUS.LOSE && $auth('crm-bo.update-status')" ><i class="icon i_audit"/>{{$t('crm_b.next_step')}}</a-button>
                <a-button @click="loseTheOrder" v-if="detail.status !== STATUS.LOSE && $auth('crm-bo.update-status')"><i class="icon i_audit"/>{{$t('crm_b.lost_order')}}</a-button>
                <a-button @click="winTheOrder"  v-if="detail.status !== STATUS.LOSE && detail.status !== STATUS.WIN && $auth('crm-bo.update-status')" ><i class="icon i_audit"/>{{$t('crm_b.win_order')}}</a-button>
                <a-button @click="reactivation"  v-if="detail.status === STATUS.LOSE && $auth('crm-bo.reactivation')"><i class="icon i_audit"/>{{$t('crm_b.reactivation')}}</a-button> -->
                <template
                    v-if="
                        trackMemberDetail != null
                            ? trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ
                            : false
                    "
                >
                    <a-button @click="routerChange('edit')" v-if="$auth('crm-bo.save')">{{ $t('n.edit') }}</a-button>
                </template>
                <template
                    v-if="
                        trackMemberDetail != null
                            ? trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN
                            : false
                    "
                >
                    <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-bo.transfer')">{{
                        $t('crm_c.transfer')
                    }}</a-button>
                    <a-button type="danger" @click="handleDelete">{{ $t('crm_c.delete') }}</a-button>
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
                    <!-- 客户名称 -->
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_b.customer_name') }}：</span>
                        <router-link
                            target="_blank"
                            :to="{ path: '/crm-customer/customer-detail', query: { id: detail.customer_id } }"
                        >
                            {{ detail.customer_name }}
                        </router-link>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_b.money') }}：</span>
                        <span class="value">{{ $Util.countFilter(detail.money) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_b.estimated_deal_time') }}：</span>
                        <span class="value">{{ $Util.timeFilter(detail.estimated_deal_time, 3) }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="12" :lg="8" class="detail-item">
                        <span class="key">{{ $t('crm_c.own_user_name') }}：</span>
                        <span class="value">{{ detail.own_user ? detail.own_user.name : '-' }}</span>
                    </a-col>
                    <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                        <span class="key">{{ $t('sl.show') }}：</span>
                        <span class="value">
                            <LabelList :targetId="id" :targetType="Core.Const.CRM_LABEL.CATEGORY.BO" />
                        </span>
                    </a-col>
                    <a-col :xs="24" :sm="24" :lg="24">
                        <div class="panel-content">
                            <NewMySteps
                                :stepsList="groupStatusTableData"
                                :current="detail.status"
                                @nextStep="nextStep"
                                @winTheOrder="winTheOrder"
                                @loseTheOrder="loseTheOrder"
                                @reactivation="reactivation"
                            ></NewMySteps>
                        </div>
                    </a-col>

                    <a-col :xs="24" :sm="24" :lg="24" class="detail-item">
                        <!-- <template v-if="trackMemberDetail!= null? trackMemberDetail.type !== Core.Const.CRM_TRACK_MEMBER.TYPE.READ : false">
                                <a-button @click="routerChange('edit')" v-if="$auth('crm-bo.save')">{{ $t('n.edit') }}</a-button>
                            </template>
                            <template v-if="trackMemberDetail!= null ? trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN : false">
                                <a-button type="primary" @click="handleBatch('transfer')" v-if="$auth('crm-bo.transfer')">{{ $t('crm_c.transfer') }}</a-button>
                                <a-button type="danger" @click="handleDelete">{{ $t('crm_c.delete') }}</a-button>
                            </template> -->
                    </a-col>
                </a-row>
            </div>
        </div>
        <a-row>
            <a-col :xs="24" :sm="24" :lg="16">
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="activeKey">
                        <a-tab-pane key="TrackRecord" :tab="$t('crm_t.track_record')">
                            <CRMTrackRecord
                                v-if="id > 0"
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"
                                :detail="detail"
                                ref="CRMTrackRecord"
                            >
                                <FollowUpShow
                                    :btnText="$t('crm_c.add_follow_records')"
                                    :targetId="detail.id"
                                    :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"
                                    @submit="getCRMTrackRecord"
                                />
                            </CRMTrackRecord>
                        </a-tab-pane>
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.summary_information')">
                            <CustomerSituation v-if="id > 0" :detail="detail" :currentStepText="currentStepText" />
                        </a-tab-pane>
                        <a-tab-pane key="SalesInformation" :tab="$t('crm_b.select_item')">
                            <CRMItem
                                :detail="detail"
                                v-if="id > 0"
                                :sourceId="detail.id"
                                :currency="detail.currency"
                                :sourceType="Core.Const.CRM_ITEM_BIND.SOURCE_TYPE.BO"
                                ref="CRMItem"
                            ></CRMItem>
                        </a-tab-pane>
                        <a-tab-pane key="ContactPerson" :tab="$t('crm_t.contact_customer')">
                            <CRMContact
                                :detail="detail"
                                v-if="id > 0"
                                :targetId="detail.id"
                                :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO"
                                :flagOWN="trackMemberDetail.type === Core.Const.CRM_TRACK_MEMBER.TYPE.OWN"
                                ref="CRMContact"
                            >
                                <CustomerSelect
                                    @select="handleAddCustomerShow"
                                    :targetId="detail.id"
                                    :targetType="Core.Const.CRM_CONTACT_BIND.TARGET_TYPE.BO_ADD_CUSTOMER"
                                    :addCustomerBtn="true"
                                />
                            </CRMContact>
                        </a-tab-pane>
                        <a-tab-pane key="OrderList" :tab="$t('crm_o.list')">
                            <CRMOrder
                                :detail="detail"
                                v-if="id > 0"
                                :targetId="detail.id"
                                :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO"
                                ref="CRMOrder"
                            >
                                <a-button
                                    type="primary"
                                    @click="routerChange('order-save')"
                                    v-if="$auth('crm-order.save')"
                                    >{{ $t('crm_o.save') }}</a-button
                                >
                            </CRMOrder>
                        </a-tab-pane>
                        <a-tab-pane key="customerInfo" :tab="$t('crm_o.customer_detail')">
                            <CrmCustomerDetail v-if="id > 0" :id="detail.customer_id" ref="CrmCustomerDetail" />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
            <a-col :xs="24" :sm="24" :lg="8">
                <div class="tabs-container">
                    <a-tabs v-model:activeKey="tabActiveKey">
                        <a-tab-pane key="CustomerSituation" :tab="$t('crm_c.team_members')">
                            <Group
                                v-if="id > 0"
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO"
                                :detail="detail"
                                ref="Group"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="InformationInfo" :tab="$t('crm_c.dynamic')">
                            <ActionRecord
                                v-if="id > 0"
                                :targetId="id"
                                :targetType="Core.Const.CRM_TRACK_RECORD.TARGET_TYPE.BO"
                                :detail="detail"
                                ref="ActionRecord"
                            />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
        <a-modal v-model:visible="batchShow" :title="$t('crm_b.distribute_bo')" :after-close="handleBatchClose">
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.customer_name') }}：</div>
                <div class="value">
                    {{ detail.customer_name }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_b.name') }}：</div>
                <div class="value">
                    {{ detail.name }}
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('crm_group.name') }}：</div>
                <div class="value">
                    <a-tree-select
                        class="CategoryTreeSelect"
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
                        :placeholder="$t('def.input')"
                        :default-active-first-option="false"
                        :show-arrow="false"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="getUserData"
                        :disabled="!group_id"
                    >
                        <a-select-option v-for="item in userData" :key="item.id" :value="item.id">
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
import NewMySteps from '@/components/common/NewMySteps.vue';
import dayjs from 'dayjs';

import CRMContact from '@/components/crm/panel/CRMContact.vue';
import CRMOrder from '@/components/crm/panel/CRMOrder.vue';
import Group from '@/components/crm/panel/Group.vue';
import ActionRecord from '@/components/crm/panel/ActionRecord.vue';
import CRMTrackRecord from '@/components/crm/panel/CRMTrackRecord.vue';
import CRMItem from '@/components/crm/panel/CRMItem.vue';
import CrmCustomerDetail from '../../components/crm/panel/CrmCustomerDetail.vue';
import LabelList from '@/components/crm/common/LabelList.vue';

export default {
    name: 'CustomerEdit',
    components: {
        FollowUpShow,
        CustomerAdd,
        CustomerSelect,
        NewMySteps,
        CRMContact,
        CRMOrder,
        ActionRecord,
        CustomerSituation,
        Group,
        CRMTrackRecord,
        CRMItem,
        LabelList,
        CrmCustomerDetail,
    },
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
            groupOptions: [],
            group_id: undefined,
        };
    },
    watch: {},
    computed: {
        lang() {
            return this.$store.state.lang;
        },
        currentStepText() {
            console.log('this.groupStatusTableData', this.groupStatusTableData, this.detail.status);
            if (this.detail.status === 100) {
                return this.$i18n.locale === 'en' ? 'Win order' : '赢单';
            }
            if (this.detail.status === -100) {
                return this.$i18n.locale === 'en' ? 'Lose order' : '输单';
            }
            const it = this.groupStatusTableData.filter((item, index) => {
                return index === this.detail.status;
            });
            console.log(it.value);
            return it[0] ? (this.$i18n.locale === 'en' ? it[0].en : it[0].zh) : '';
        },
    },
    created() {
        this.id = Number(this.$route.query.id) || 0;
    },
    mounted() {
        if (this.id) {
            this.getBoDetail();
            this.getTargetByUserId();
        }
        this.getGroupStatusDetail();
    },
    methods: {
        routerChange(type, item) {
            let routeUrl = '';
            switch (type) {
                case 'back': // 返回
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-list',
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'edit': // 修改
                    routeUrl = this.$router.resolve({
                        path: '/crm-bo/bo-edit',
                        query: { id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'order-save': // 修改
                    routeUrl = this.$router.resolve({
                        path: '/crm-order/order-edit',
                        query: { bo_id: this.detail.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
            }
        },
        getBoDetail() {
            this.loading = true;
            Core.Api.CRMBo.detail({
                id: this.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    let d = res.detail;
                    this.detail = d;
                    this.detail.birthday = this.detail.birthday
                        ? dayjs.unix(this.detail.birthday).format('YYYY-MM-DD')
                        : undefined;
                    for (const key in this.form) {
                        this.form[key] = d[key];
                    }
                    this.defAddr = [d.province, d.city, d.county];
                    this.handleGroupTree();
                    // this.defArea = [d.continent || '', d.country || '']
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 添加联系人
        handleAddCustomerShow(ids, items) {
            Core.Api.CrmContactBind.batchSave({
                target_id: this.detail.id,
                target_type: Core.Const.CRM_CONTACT_BIND.TARGET_TYPE.BO,
                contact_customer_ids: ids,
            })
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                })
                .catch(err => {
                    console.log('handleDelete err', err);
                });
        },
        getGroupStatusDetail() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBoStatusGroup.detail({
                id: 1,
            })
                .then(res => {
                    this.groupStatusTableData = JSON.parse(res.detail.status_list);
                    if (this.detail.status !== this.STATUS.LOSE) {
                        this.groupStatusTableData.push({ status: '100', zh: '赢单', en: 'Win order' });
                    }
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleBatch(type) {
            this.batchShow = true;
            this.batchType = type;
        },
        handleBatchClose() {
            this.batchShow = false;
            this.batchType = '';
        },
        handleBatchSubmit() {
            if (!this.batchForm.own_user_id) {
                return this.$message.warning(this.$t('crm_c.select'));
            }
            switch (this.batchType) {
                case 'transfer':
                    Core.Api.CRMBo.transfer({
                        id: this.detail.id,
                        own_user_id: this.batchForm.own_user_id,
                    })
                        .then(() => {
                            this.$message.success(this.$t('crm_c.transfer_success'));
                            this.getBoDetail();
                            this.handleBatchClose();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                    break;
            }
        },
        handleDelete() {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.delete({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.routerChange('back');
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        getTargetByUserId() {
            Core.Api.CRMTrackMember.getTargetByUserId({
                target_id: this.id,
                target_type: Core.Const.CRM_TRACK_MEMBER.TARGET_TYPE.BO,
            }).then(res => {
                this.trackMemberDetail = res.detail;
                console.log('trackMemberDetail', this.trackMemberDetail);
            });
        },
        getCRMTrackRecord() {
            console.log('getTrackRecord');
            this.$refs.CRMTrackRecord.getTableData();
        },
        getCrmActionRecordTableData() {
            console.log('getCrmActionRecordTableData');
            this.$refs.ActionRecord.getTableData();
        },
        getUserData(query) {
            this.batchForm.own_user_id = undefined;
            this.loading = true;
            Core.Api.User.listGroup({
                group_id: this.group_id,
                name: query,
                org_type: Core.Const.LOGIN.ORG_TYPE.ADMIN,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.userData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        nextStep() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_next_step'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.updateStatus({ id: _this.detail.id, status: _this.detail.status + 1 })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_b.whether_next_step_success'));
                            _this.getBoDetail();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        loseTheOrder() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_lost_order'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.fail({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_b.whether_lost_order_success'));
                            _this.getBoDetail();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        winTheOrder() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_win_order'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.success({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_b.whether_win_order_success'));
                            _this.getBoDetail();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        reactivation() {
            let _this = this;
            this.$confirm({
                title: this.$t('crm_b.whether_reactivation'),
                okText: this.$t('def.sure'),
                okType: 'primary',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.reactivation({ id: _this.detail.id })
                        .then(() => {
                            _this.$message.success(_this.$t('crm_b.whether_reactivation_success'));
                            _this.getBoDetail();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUserGroup({
                group_id: this.detail.group_id,
            }).then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
    },
};
</script>

<style lang="less">
.CustomerDetail {
    .icon {
        font-size: 12px;
    }
}
</style>
