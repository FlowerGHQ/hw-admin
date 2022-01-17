<template>
    <div id="RepairDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">工单详情</div>
                <div class="btns-area">
                    <!-- 发货 start -->
                    <a-button type="primary" v-if="[STATUS.WAIT_DETECTION].includes(detail.status) && isTransfer == true" @click="handlePurchaseStatus('deliver')" ><i class="icon i_deliver"/>物流信息</a-button>
                    <a-button type="primary" v-if="[STATUS.WAIT_REPAIR].includes(detail.status)" @click="handlePurchaseStatus('deliver')" ><i class="icon i_deliver"/>查看物流</a-button>
                    <!-- 发货 end   -->
                    <template v-if="$auth('ADMIN')">
                        <a-button type="primary" ghost @click="handleAuditShow()"
                                  v-if="[STATUS.WAIT_AUDIT].includes(detail.status)"><i class="icon i_edit"/>审核
                        </a-button>
                    </template>
                    <template v-if="$auth('DISTRIBUTOR')">
                        <a-button type="primary" @click="handleOrderShow()"
                                  v-if="[STATUS.WAIT_CHECK].includes(detail.status)"><i class="icon i_confirm"/>确定接单
                        </a-button>
                    </template>
                    <template v-if="detail.org_type == OrgType && $auth('AGENT', 'STORE')">
                        <!-- v-if="[STATUS.WAIT_AUDIT].includes(detail.status)" -->
                        <a-button type="primary" ghost @click="routerChange('edit')"
                                  v-if="[STATUS.WAIT_CHECK, STATUS.WAIT_DISTRIBUTION, STATUS.AUDIT_FAIL, STATUS.CHECK_FAIL].includes(detail.status)">
                            <i class="icon i_edit"/>编辑
                        </a-button>
                        <a-button type="primary" ghost @click="handleSecondDoor()"
                                  v-if="[STATUS.WAIT_CHECK, STATUS.WAIT_DISTRIBUTION, STATUS.WAIT_REPAIR].includes(detail.status)">
                            <i class="icon i_edit_l"/>二次维修
                        </a-button>
                        <a-button type="primary" @click="handleTransfer()" ghost
                                  v-if="[STATUS.WAIT_CHECK].includes(detail.status)"><i class="icon i_transfer"/>转单
                        </a-button>
                        <!-- <template v-if="detail.account_id == User.id || $auth('MANAGER')"> -->
                            <a-button type="primary" @click="handleFaultSubmit()"
                                      v-if="detail.status == STATUS.WAIT_DETECTION"><i class="icon i_submit"/>提交
                            </a-button>
                            <a-button type="primary" @click="handleResultShow()"
                                      v-if="detail.status == STATUS.WAIT_REPAIR"><i class="icon i_completed"/>维修完成
                            </a-button>
                        <!-- </template> -->
                        <a-button type="primary" @click="handleSettlement()" v-if="detail.status == STATUS.REPAIR_END">
                            <i class="icon i_settle"/>结算
                        </a-button>
                        <!-- <a-button type="danger" ghost @click="handleDelete"><i class="icon i_delete"/>删除</a-button> -->
                    </template>
                    <a-button type="primary" @click="routerChange('invoice')" v-if="detail.status == STATUS.SETTLEMENT">
                        <i class="icon i_detail_l"/>查看结算单
                    </a-button>
                </div>
            </div>
            <div class="gray-panel info">
                <div class="panel-title">
                    <div class="left">
                        <span>工单编号</span> {{ detail.uid }}
                    </div>
                    <div class="right">
                        <div class="staff" v-if="detail.repair_user_id">员工：{{ detail.repair_user_name || '-' }}</div>
                        <div class="status">
                            <i class="icon i_point" :class="$Util.repairStatusFilter(detail.status,'color')"/>
                            {{ $Util.repairStatusFilter(detail.status) }}
                        </div>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="info-item">
                        <div class="key">工单帐类</div>
                        <div class="value">{{ $Util.repairServiceFilter(detail.service_type || '-') }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">创建人</div>
                        <div class="value">{{ detail.user_name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">相关客户</div>
                        <div class="value">{{ detail.customer_name || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">优先级</div>
                        <div class="value">{{ $Util.repairPriorityFilter(detail.priority) }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">创建时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.create_time) || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">计划时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.plan_time) || '-' }}</div>
                    </div>
                    <div class="info-item">
                        <div class="key">实施时间</div>
                        <div class="value">{{ $Util.timeFilter(detail.finish_time) || '-' }}</div>
                    </div>
                    <div class="info-item" v-if="detail.audit_message != ''">
                        <div class="key">未通过原因</div>
                        <div class="value">{{ detail.audit_message || '-' }}</div>
                    </div>
                </div>
            </div>
            <MySteps :stepsList='stepsList' :current='currStep'/>
            <!-- <div class="steps-container">
                <a-steps>
                    <a-step v-for="(item, index) of stepsList" :key="index" :status="item.status" :title="item.title">
                        <template #icon>
                            <span v-if="item.status == 'finish'" class="circle icon i_click"/>
                            <span v-else class="circle">{{index + 1}}</span>
                        </template>
                    </a-step>
                </a-steps>
            </div>
            -->
            <div class="form-container">
                <Distribution :id='id' :detail='detail' @submit="getRepairDetail"
                              v-if="detail.status == STATUS.WAIT_DISTRIBUTION && $auth('AGENT', 'STORE')"/>
                <CheckFault :id='id' :detail='detail' @submit="getRepairDetail" ref="CheckFault"
                            v-if="detail.status == STATUS.WAIT_DETECTION && $auth('DISTRIBUTOR', 'AGENT', 'STORE')"
                            @getIsTransfer="getIsTransfer"/>
                <AttachmentFile :target_id='id' :detail='detail' @submit="getRepairDetail" ref="AttachmentFile"
                                v-if="$auth('DISTRIBUTOR', 'AGENT', 'STORE', 'ADMIN')"/>
                <CheckResult :id='id' :detail='detail' :faultList="faultList" :failList="failList"
                             :exchangeList="exchangeList" :failTotle="failTotle" :exchangeTotle="exchangeTotle"
                             ref="CheckResult"
                             v-if="resultShow && (detail.status != STATUS.WAIT_DISTRIBUTION && detail.status != STATUS.WAIT_DETECTION && detail.status != STATUS.WAIT_CHECK)"/>
                <RepairInfo :id='id' :detail='detail'/>
                <ActionLog :id='id' :detail='detail'/>
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalFailShow" width="600px" title="维修结果" @ok="handleResultSubmit">
                <div class="modal-content">
                    <div class="form-item">
                        <div class="key">维修结果</div>
                        <div class="value">
                            <a-select v-model:value="repairForm.results" placeholder="请选择维修结果">
                                <a-select-option v-for="results of resultsList" :key="results.value"
                                                 :value="results.value">{{ results.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item" v-if="repairForm.results == REPAIR.RESULTS.FAIL">
                        <div class="key">失败原因</div>
                        <div class="value">
                            <a-input v-model:value="repairForm.audit_message" placeholder="请输入失败原因"/>
                        </div>
                    </div>
                </div>
            </a-modal>
            <a-modal v-model:visible="secondDoorShow" width="600px" title="维修结果" @ok="handleSecondDoorSubmit">
                <div class="form-item">
                    <div class="key">计划时间</div>
                    <div class="value">
                        <a-date-picker v-model:value="repairForm.plan_time" valueFormat='YYYY-MM-DD HH:mm:ss'/>
                    </div>
                </div>
                <!--            <div class="form-item">-->
                <!--                <div class="key">完成时间</div>-->
                <!--                <div class="value">-->
                <!--                    <a-date-picker v-model:value="repairForm.finish_time" valueFormat='YYYY-MM-DD HH:mm:ss'/>-->
                <!--                </div>-->
                <!--            </div>-->
            </a-modal>
            <a-modal v-model:visible="transferShow" width="600px" title="转单" @ok="handleTransferSubmit">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">门店</div>
                        <div class="value">
                            <a-select v-model:value="transferForm.store_id" placeholder="请选择门店" @change="getStaffList">
                                <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">工单负责人</div>
                        <div class="value">
                            <a-select v-model:value="transferForm.repair_user_id" placeholder="请选择工单负责人">
                                <a-select-option v-for="item of staffList" :key="item.id" :value="item.id">
                                    {{ item.account.name }}
                                </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
        <!-- 审核 -->
        <template class="modal-container">
            <a-modal v-model:visible="auditShow" title="审核"
                     class="warehouse-edit-modal" :after-close='handleAuditClose'>
                <div class="modal-content">
                    <div>
                        <div class="form-item required">
                            <a-radio-group v-model:value="editForm.audit_result">
                                <a-radio value="1">通过</a-radio>
                                <a-radio value="0">不通过</a-radio>
                            </a-radio-group>
                        </div>
                        <div class="form-item required" v-if="editForm.audit_result == 0">
                            <div class="key">原因:</div>
                            <div class="value">
                                <a-input v-model:value="editForm.audit_message" placeholder="请输入不通过原因"/>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="auditShow = false">取消</a-button>
                    <a-button @click="handleAuditSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
        <!-- 工单确认 -->
        <template class="modal-container">
            <a-modal v-model:visible="orderShow" title="工单确认"
                     class="warehouse-edit-modal" :after-close='handleAuditClose'>
                <div class="modal-content">
                    <div>
                        <div class="form-item required">
                            <a-radio-group v-model:value="editForm.audit_result">
                                <a-radio value="1">接单</a-radio>
                                <a-radio value="0">不接单</a-radio>
                            </a-radio-group>
                        </div>
                        <div class="form-item required" v-if="editForm.audit_result == 0">
                            <div class="key">原因:</div>
                            <div class="value">
                                <a-input v-model:value="editForm.audit_message" placeholder="请输入不接单原因"/>
                            </div>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="orderShow = false">取消</a-button>
                    <a-button @click="handleOrderSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
        <!-- 物流信息 -->
        <template class="modal-container">
            <a-modal v-model:visible="deliverShow" width="600px" title="物流" @ok="handleDeliver">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">快递公司</div>
                        <div class="value">
                            <a-select v-model:value="form.company_uid" placeholder="请选择快递公司">
                                <a-select-option v-for="company of companyUidList" :key="company.value" :value="company.value">{{company.name}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item required" >
                        <div class="key">快递单号</div>
                        <div class="value">
                            <a-input v-model:value="form.waybill_uid" placeholder="请输入快递单号"/>
                        </div>
                    </div>
                </div>
            </a-modal>
        </template>
    </div>
</template>

<script>
import Core from '../../core';
import CheckFault from './components/CheckFault.vue';
import CheckResult from './components/CheckResult.vue';
import RepairInfo from './components/RepairInfo.vue';
import Distribution from './components/Distribution.vue';
import ActionLog from './components/ActionLog.vue';
import MySteps from '@/components/common/MySteps.vue';
import dayjs from "dayjs";
import AttachmentFile from './components/AttachmentFile.vue';

const REPAIR = Core.Const.REPAIR
const User = Core.Data.getUser();
const OrgType = Core.Data.getOrgType();
export default {
    name: 'RepairDetail',
    components: {
        AttachmentFile,
        CheckFault,
        CheckResult,
        RepairInfo,
        ActionLog,
        MySteps,
        Distribution,
    },
    props: {},
    data() {
        return {
            User,
            OrgType,
            REPAIR,
            STATUS: REPAIR.STATUS,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: 0,
            detail: {}, // 工单详情

            resultsList: Core.Const.REPAIR.RESULTS_LIST,

            modalFailShow: false,
            secondDoorShow: false,
            transferShow: false,
            repairForm: {
                results: undefined,
                audit_message: undefined,
                plan_time: undefined,
                // finish_time: undefined,
            },
            // 转单
            transferForm: {
                store_id: undefined,
                repair_user_id: undefined,
            },
            staffList: [],
            storeList: [],
            faultList: [],
            failList: [],
            failTotle: 0,
            exchangeTotle: 0,
            exchangeList: [],
            resultShow: false,

            stepsList: [
                {title: '分配工单'},
                {title: '后台审核'},
                {title: '检测'},
                {title: '维修'},
                {title: '结算'},
            ],
            currStep: 1,

            // 物流弹框显示
            deliverShow: false,
            isTransfer: undefined, // 判断是否存在转单操作（用以显示物流按钮）
            companyUidList: Core.Const.WAYBILL.COMPANY_LIST,
            form: { // 物流信息
                pay_method: undefined,
                company_uid: undefined,
                waybill_uid: '',
                review: '',
            },

            // 审核
            auditShow: false,
            // 工单确认
            orderShow: false,
            editForm: {
                audit_result: 1,
                audit_message: '',
            },

        };
    },
    watch: {},
    computed: {},
    created() {
        this.id = Number(this.$route.query.id) || 0
        this.getRepairDetail();
        console.log(User.id)
    },
    methods: {
        // 向子组件取值
        getIsTransfer(data){
            this.isTransfer = data
            console.log(this.isTransfer)
        },
        // 物流信息显示
        handlePurchaseStatus(val) {
            switch (val){
                case "deliver":
                    this.deliverShow = true
                    break;
            }
        },
        // 页面跳转
        routerChange(type, item) {
            let routeUrl
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
                case 'edit':  // 编辑工单
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-edit",
                        query: {id: this.id},
                    })
                    break;
                case 'list':  // 工单列表
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-list",
                    })
                    break;
                case 'invoice':  // 工单列表
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-invoice",
                        query: {id: this.id},
                    })
                    break;
            }
            window.open(routeUrl.href, '_self')
        },

        handleAuditShow() { // 显示弹框
            this.auditShow = true
        },
        handleAuditClose() { // 关闭弹框
            this.auditShow = false;
            // Object.assign(this.$data.editForm, this.$options.data().editForm)
        },
        handleAuditSubmit() { // 审核提交
            this.loading = true;

            Core.Api.Repair.audit({
                id: this.id,
                ...this.editForm
            }).then(res => {
                console.log('handleAuditSubmit res', res)
                this.routerChange('back')
            }).catch(err => {
                console.log('handleAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleOrderShow() { // 显示弹框
            this.orderShow = true
        },
        handleOrderClose() { // 关闭弹框
            this.orderShow = false;
            // Object.assign(this.$data.editForm, this.$options.data().editForm)
        },
        handleOrderSubmit() { // 工单确认提交
            this.loading = true;

            Core.Api.Repair.check({
                id: this.id,
                ...this.editForm
            }).then(res => {
                console.log('handleOrderSubmit res', res)
                this.routerChange('back')
            }).catch(err => {
                console.log('handleOrderSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.resultShow = false
                this.getRepairFaultList();
                this.step(this.detail.status)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        step(status) {
            switch (status) {
                case REPAIR.STATUS.WAIT_DISTRIBUTION:
                    this.currStep = 0;
                    break;
                case REPAIR.STATUS.WAIT_CHECK:
                    this.currStep = 1;
                    break;
                case REPAIR.STATUS.WAIT_DETECTION:
                    this.currStep = 2;
                    break;
                case REPAIR.STATUS.WAIT_REPAIR:
                    this.currStep = 3;
                    break;
                case REPAIR.STATUS.REPAIR_END:
                    this.currStep = 4;
                    break;
                case REPAIR.STATUS.SETTLEMENT:
                    this.currStep = 5;
                    break;
            }
        },
        handleFaultSubmit() {
            this.$refs.CheckFault.handleFaultSubmit();
            // 物流信息提交 this.form
            this.loading = false;
            Core.Api.Repair.post({
                id: this.id,
                ...this.form
            }).then(res => {
                this.getRepairDetail()
            }).catch(err => {
                console.log('handleFaultSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleSettlement() {
            Core.Api.Repair.settlement({id: this.id}).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
            })
        },


        handleResultShow() {
            this.modalFailShow = true
        },
        handleResultSubmit() {
            Core.Api.Repair.repair({
                id: this.id,
            }).then(res => {
                this.getRepairDetail()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.modalFailShow = false
            });
        },
        handleSecondDoor() {
            this.secondDoorShow = true
            this.repairForm.plan_time = this.detail.plan_time ? dayjs.unix(this.detail.plan_time).format('YYYY-MM-DD HH:mm:ss') : undefined
            // this.repairForm.finish_time = this.detail.finish_time ? dayjs.unix(this.detail.finish_time).format('YYYY-MM-DD HH:mm:ss') : undefined
        },
        handleSecondDoorSubmit() {
            let repairForm = Core.Util.deepCopy(this.repairForm)
            repairForm.plan_time = repairForm.plan_time ? dayjs(repairForm.plan_time).unix() : 0
            // repairForm.finish_time = repairForm.finish_time ? dayjs(repairForm.finish_time).unix() : 0
            Core.Api.Repair.secondDoor({
                id: this.detail.id,
                ...repairForm
            }).then(res => {
                this.getRepairDetail()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.repairForm.plan_time = undefined
                // this.repairForm.finish_time = undefined
                this.loading = false;
                this.secondDoorShow = false
            });
        },
        handleTransfer() {
            this.transferShow = true
            this.getStoreList()
        },
        // 转单
        handleTransferSubmit() {
            let transferForm = Core.Util.deepCopy(this.transferForm)
            // transferForm.plan_time = 0
            // store_id ,repairUserId
            Core.Api.Repair.transfer({
                id: this.detail.id,
                ...transferForm
            }).then(res => {
                this.getRepairDetail()
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.transferShow = false
            });
        },

        getStoreList() {
            Core.Api.Store.list({
                page: 0,
                status: 1,
            }).then(res => {
                this.storeList = res.list
                // this.storeList.push({id: -1, name: "零售商"})
            });
        },
        // 获取 员工列表
        getStaffList() {
            if (this.repairForm.store_id == -1) {
                Core.Api.User.list({
                    page: 0,
                    type: Core.Const.USER.TYPE.WORKER,
                    org_id: this.detail.agent_id,
                    org_type: Core.Const.LOGIN.ORG_TYPE.AGENT,
                }).then(res => {
                    this.staffList = res.list
                    this.repairForm.repair_user_id = undefined
                });
            } else {
                Core.Api.User.list({
                    page: 0,
                    type: Core.Const.USER.TYPE.WORKER,
                    org_id: this.repairForm.store_id,
                    org_type: Core.Const.LOGIN.ORG_TYPE.STORE,
                }).then(res => {
                    this.staffList = res.list
                    this.repairForm.repair_user_id = undefined
                });
            }

        },
        getRepairFaultList() {
            Core.Api.RepairItem.faultList({
                repair_order_id: this.id
            }).then(res => {
                console.log('getRepairFaultList res', res)
                this.faultList = res.fault_list.map(i => i.item_fault_id)
                console.log('getRepairFaultList this.faultList', this.faultList)
                this.getRepairItemList();
            })
        },

        getRepairItemList() {
            Core.Api.RepairItem.list({
                repair_order_id: this.id
            }).then(res => {
                console.log('getRepairItemList res', res)

                let failList = []
                let failTotle = 0
                let exchangeList = []
                let exchangeTotle = 0
                res.list.forEach(it => {
                    it.item_name = it.item.name
                    if (it.type == Core.Const.REPAIR_ITEM.TYPE.ADD) {
                        failList.push(it)
                        failTotle += it.amount * it.price
                    }
                    if (it.type == Core.Const.REPAIR_ITEM.TYPE.REPLACE) {
                        exchangeList.push(it)
                        exchangeTotle += it.amount * it.price
                    }
                })

                this.failList = failList
                this.failTotle = failTotle
                this.exchangeList = exchangeList
                this.exchangeTotle = exchangeTotle

                console.log('this.failList:', this.failList)
                console.log('this.exchangeList:', this.exchangeList)
                console.log('this.exchangeTotle:', this.exchangeTotle)

                this.resultShow = true
                console.log('this.resultShow:', this.resultShow)

            })

        },
    }
};
</script>

<style lang="less">
#RepairDetail {
    .gray-panel.info {
        .left {
            font-size: 12px;
            color: #465670;

            span {
                color: #A5ACB8;
            }
        }

        .right {
            .fcc();
            font-size: 12px;

            .staff {
                color: rgba(0, 0, 0, 0.85);
                margin-right: 12px;
                font-weight: 500;
            }

            .status {
                .fcc();

                .i_point {
                    margin-right: 6px;
                }
            }
        }

        .panel-content {
            .fsb(flex-start);
            padding-bottom: 15px;
        }

        .info-item {
            flex: 1;
            font-size: 12px;

            .key {
                color: #8090A6;
            }

            .value {
                margin-top: 10px;
                color: #363D42;
            }
        }
    }

    .panel-content.affirm {
        .title {
            color: #DD5D5D;
            margin-bottom: 24px;

            i.icon {
                margin-right: 12px;
            }
        }

        .fault_select {
            width: 100%;
            padding-left: 12px;

            .ant-checkbox-wrapper {
                width: 25%;
                margin-left: 0;
                margin-bottom: 18px;
            }
        }
    }

    .steps-container {
        padding: 0 20px;
        margin-bottom: 20px;
    }
}
</style>
