<template>
<div id="RepairDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">工单详情</div>
            <div class="btns-area" v-if="detail.org_type == OrgType && ($auth('AGENT')||$auth('STORE'))">
                <a-button type="primary" @click="handleSecondDoor()" v-if="detail.status == STATUS.WAIT_CHECK || detail.status == STATUS.WAIT_DETECTION || detail.status == STATUS.WAIT_REPAIR" ><i class="icon i_edit"/>二次维修</a-button>
                <template v-if="detail.account_id == User.id || $auth('MANMGE')">
                    <a-button type="primary" @click="handleTransfer()"    v-if="detail.status == STATUS.WAIT_CHECK"><i class="icon i_check_c"/>转单</a-button>
                    <a-button type="primary" @click="handleRepairCheck()" v-if="detail.status == STATUS.WAIT_CHECK"><i class="icon i_check_c"/>确定</a-button>
                    <a-button type="primary" @click="handleFaultSubmit()" v-if="detail.status == STATUS.WAIT_DETECTION"><i class="icon i_check_c"/>提交</a-button>
                    <a-button type="primary" @click="handleResultShow()"  v-if="detail.status == STATUS.WAIT_REPAIR"><i class="icon i_edit"/>维修完成</a-button>
                </template>

                <a-button type="primary" @click="handleSettlement()" v-if="detail.status == STATUS.REPAIR_END">结算</a-button>
                <a-button type="primary" @click="routerChange('invoice')" v-if="detail.status == STATUS.SETTLEMENT ">查看结算单</a-button>

                <a-button type="primary" ghost @click="routerChange('edit')" v-if="detail.status == STATUS.WAIT_CHECK"><i class="icon i_edit"/>编辑</a-button>
            </div>
        </div>
        <div class="gray-panel info">
            <div class="panel-title">
                <div class="left">
                    <span>工单编号</span> {{detail.uid}}
                </div>
                <div class="right">
                    <div class="staff" v-if="detail.repair_user_id">员工：{{detail.repair_user_name || '-'}}</div>
                    <div class="status">
                        <i class="icon i_point" :class="$Util.repairStatusFilter(detail.status,'color')"/>
                        {{$Util.repairStatusFilter(detail.status)}}
                    </div>
                </div>
            </div>
            <div class="panel-content">
                <div class="info-item">
                    <div class="key">创建人</div>
                    <div class="value">{{detail.user_name || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">相关客户</div>
                    <div class="value">{{detail.customer_name || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">优先级</div>
                    <div class="value">{{$Util.repairPriorityFilter(detail.priority)}}</div>
                </div>
                <div class="info-item">
                    <div class="key">创建时间</div>
                    <div class="value">{{$Util.timeFilter(detail.create_time) || '-'}}</div>
                </div>
                <div class="info-item">
                    <div class="key">实施时间</div>
                    <div class="value">{{$Util.timeFilter(detail.finish_time) || '-'}}</div>
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
            <Distribution :id='id' :detail='detail' @submit="getRepairDetail" ref="CheckFault"  v-if="detail.status == STATUS.WAIT_DISTRIBUTION && ($auth('AGENT')||$auth('STORE'))"/>
            <CheckFault :id='id' :detail='detail' @submit="getRepairDetail" ref="CheckFault"  v-if="detail.status == STATUS.WAIT_DETECTION && ($auth('AGENT')||$auth('STORE'))"/>
            <CheckResult :id='id' :detail='detail' :faultList="faultList" :failList="failList" :exchangeList="exchangeList" :failTotle="failTotle" :exchangeTotle="exchangeTotle"  ref="CheckResult" v-if="detail.status != STATUS.WAIT_DISTRIBUTION && detail.status != STATUS.WAIT_DETECTION && detail.status != STATUS.WAIT_CHECK" />
            <RepairInfo :id='id' :detail='detail' />
            <ActionLog :id='id' :detail='detail' />
        </div>
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="modalFailShow" width="600px" title="维修结果" @ok="handleResultSubmit">
            <div class="modal-content">
                <div class="form-item">
                    <div class="key">维修结果</div>
                    <div class="value">
                        <a-select v-model:value="repairForm.results" placeholder="请选择维修结果">
                            <a-select-option v-for="results of resultsList" :key="results.value" :value="results.value">{{results.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item" v-if="repairForm.results == REPAIR.RESULTS.FAIL">
                    <div class="key">失败原因</div>
                    <div class="value">
                        <a-input v-model:value="repairForm.fail_remark" placeholder="请输入失败原因"/>
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
                        <a-select v-model:value="repairForm.store_id" placeholder="请选择门店" @change="getStaffList">
                            <a-select-option v-for="item of storeList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="form-item required">
                    <div class="key">工单负责人</div>
                    <div class="value">
                        <a-select v-model:value="repairForm.repair_user_id" placeholder="请选择工单负责人">
                            <a-select-option v-for="item of staffList" :key="item.id" :value="item.id">{{item.account.name}}</a-select-option>
                        </a-select>
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
import MySteps from '@/components/MySteps.vue';
import dayjs from "dayjs";

const REPAIR = Core.Const.REPAIR
const User = Core.Data.getUser();
const OrgType = Core.Data.getOrgType();
export default {
    name: 'RepairDetail',
    components: {
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
                fail_remark: undefined,
                plan_time: undefined,
                // finish_time: undefined,

            },
            staffList: [],
            storeList: [],
            faultList: [],
            failList: [],
            failTotle: 0,
            exchangeTotle: 0,
            exchangeList: [],


            stepsList: [
                { title: '分配工单' },
                { title: '员工确认' },
                { title: '检测维修' },
                { title: '维修' },
                { title: '结算' },
            ],
            currStep: 1,
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
                        query: { id: this.id },
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
                        query: { id: this.id },
                    })
                    break;
            }
            window.open(routeUrl.href, '_self')
        },

        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
                this.getRepairItemList();
                this.getRepairFaultList();
                this.step(this.detail.status)
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        step(status){
            switch (status){
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
        },
        handleSettlement(){
            Core.Api.Repair.settlement({id: this.id}).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
            })
        },

        // 工单确认
        handleRepairCheck() {
            Core.Api.Repair.check({id: this.id}).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
            })
        },

        handleResultShow(){
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
        handleSecondDoor(){
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
        handleTransferSubmit() {
            let repairForm = Core.Util.deepCopy(this.repairForm)
            Core.Api.Repair.transfer({
                id: this.detail.id,
                ...repairForm
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
                this.storeList.push({id:-1,name:"经销商"})
            });
        },
        // 获取 员工列表
        getStaffList() {
            if (this.repairForm.store_id == -1){
                Core.Api.User.list({
                    page: 0,
                    type: Core.Const.USER.TYPE.WORKER,
                    org_id: this.detail.agent_id,
                    org_type: Core.Const.LOGIN.ORG_TYPE.AGENT,
                }).then(res => {
                    this.staffList = res.list
                    this.repairForm.repair_user_id = undefined
                });
            } else{
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
        getRepairFaultList(){
            Core.Api.RepairItem.faultList({
                repair_order_id: this.id
            }).then(res => {
                console.log('getRepairFaultList res.fault_list', res.fault_list)
                this.faultList = res.fault_list.map(i => i.item_fault_type)
                console.log('getRepairFaultList this.faultList', this.faultList)
            })
        },

        getRepairItemList() {
            Core.Api.RepairItem.list({
                repair_order_id: this.id
            }).then(res => {
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
                console.log('this.failList:', this.failList)
                console.log('this.exchangeList:', this.exchangeList)
                this.failList = failList
                this.failTotle = failTotle
                this.exchangeList = exchangeList
                this.exchangeTotle = exchangeTotle
                console.log('this.exchangeTotle:', this.exchangeTotle)
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
        > .title {
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
