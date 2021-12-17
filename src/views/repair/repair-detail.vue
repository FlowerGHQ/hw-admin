<template>
<div id="RepairDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">工单详情</div>
            <div class="btns-area">
                <a-button type="primary" @click="handleRepairCheck()" v-if="detail.status == STATUS.WAIT_CHECK"><i class="icon i_check_c"/>确定</a-button>
                <a-button type="primary" @click="handleFaultSubmit()" v-if="detail.status == STATUS.WAIT_DETECTION"><i class="icon i_check_c"/>提交</a-button>


                <a-button type="primary" @click="routerChange('invoice')" v-if="detail.status == STATUS.REPAIR_END">查看结算单</a-button>
                <a-button type="primary" @click="handleResultShow()" v-if="detail.status == STATUS.WAIT_REPAIR"><i class="icon i_edit"/>维修完成</a-button>

                <a-button type="primary" ghost @click="routerChange('edit')" v-if="detail.status == STATUS.WAIT_CHECK"><i class="icon i_edit"/>编辑</a-button>
                <!-- <a-button type="danger" ghost @click="handleDelete"><i class="icon i_delete"/>删除</a-button> -->
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
            <CheckFault :id='id' :detail='detail' @submit="getRepairDetail" ref="CheckFault"  v-if="detail.status == STATUS.WAIT_DETECTION"/>
            <CheckResult :id='id' :detail='detail' :faultList="faultList" :failList="failList" :exchangeList="exchangeList" ref="CheckResult" v-if="detail.status != STATUS.WAIT_DETECTION && detail.status != STATUS.WAIT_CHECK" />
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
    </template>
</div>
</template>

<script>
import Core from '../../core';
import CheckFault from './components/CheckFault.vue';
import CheckResult from './components/CheckResult.vue';
import RepairInfo from './components/RepairInfo.vue';
import ActionLog from './components/ActionLog.vue';
import MySteps from '@/components/MySteps.vue';

const REPAIR = Core.Const.REPAIR

export default {
    name: 'RepairDetail',
    components: {
        CheckFault,
        CheckResult,
        RepairInfo,
        ActionLog,
        MySteps,
    },
    props: {},
    data() {
        return {
            REPAIR,
            STATUS: REPAIR.STATUS,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: 0,
            detail: {}, // 工单详情

            resultsList: Core.Const.REPAIR.RESULTS_LIST,

            modalFailShow: false,
            repairForm: {
                results: undefined,
                fail_remark: undefined,
            },
            faultList:[],
            failList:[],
            exchangeList:[],


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
            }
        },
        handleFaultSubmit() {
            this.$refs.CheckFault.handleFaultSubmit();
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
                let exchangeList = []
                res.list.forEach(it => {
                    it.item_name = it.item.name
                    if (it.type == Core.Const.REPAIR_ITEM.TYPE.ADD) {
                        failList.push(it)
                    }
                    if (it.type == Core.Const.REPAIR_ITEM.TYPE.REPLACE) {
                        exchangeList.push(it)
                    }
                })
                console.log('this.failList:', this.failList)
                console.log('this.exchangeList:', this.exchangeList)
                this.failList = failList
                this.exchangeList = exchangeList
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
