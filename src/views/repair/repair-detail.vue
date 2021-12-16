<template>
<div id="RepairDetail">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">工单详情</div>
            <div class="btns-area">
                <a-button type="primary" @click="repairDetection()" v-if="detail.status == STATUS.WAIT_DETECTION"><i class="icon i_check_c"/>提交</a-button>
                <a-button type="primary" @click="handleRepairCheck()" v-if="detail.status == STATUS.WAIT_CHECK"><i class="icon i_check_c"/>确定</a-button>

                <a-button type="primary" @click="routerChange('invoice')" v-if="detail.status == STATUS.REPAIR_END"><i class="icon i_edit"/>结算</a-button>
                <a-button type="primary" @click="handleRepairRepairShow()" v-if="detail.status == STATUS.WAIT_REPAIR"><i class="icon i_edit"/>维修完成</a-button>

                <a-button type="primary" ghost @click="routerChange('edit')"><i class="icon i_edit"/>编辑</a-button>
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
                    <div class="value">{{detail.operator_name || '-'}}</div>
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
        <div class="steps-container">
            <a-steps>
                <a-step v-for="(item, index) of stepsList" :key="index" :status="item.status" :title="item.title">
                    <template #icon>
                        <span v-if="item.status == 'finish'" class="circle icon i_click"/>
                        <span v-else class="circle">{{index + 1}}</span>
                    </template>
                </a-step>
            </a-steps>
        </div>

        <div class="form-container">
            <CheckFault :id='id' :detail='detail' ref="CheckFault" />
            <CheckResult :id='id' :detail='detail' ref="CheckResult" />
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

const REPAIR = Core.Const.REPAIR

export default {
    name: 'RepairDetail',
    components: {
        CheckFault,
        CheckResult,
        RepairInfo,
        ActionLog,
    },
    props: {},
    data() {
        return {
            REPAIR,
            STATUS: REPAIR.STATUS,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 工单详情

            resultsList: Core.Const.REPAIR.RESULTS_LIST,

            modalFailShow: false,
            repairForm: {
                results: undefined,
                fail_remark: undefined,
            },

            stepsList: [
                {status: 'finish', title: '已分配工单'},
                {status: 'process', title: '确认中...'},
                {status: 'wait', title: '待检测维修'},
                {status: 'wait', title: '工单完成'},
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
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
                    })
                    break;
            }
            window.open(routeUrl.href, '_self')
        },
        // 工单确认
        handleRepairCheck() {
            Core.Api.Repair.check({id: this.id}).then(() => {
                this.$message.success('操作成功')
                this.getRepairDetail()
            })
        },
        repairDetection() {
            this.$refs.CheckFault.repairDetection();
        },

        // 获取工单详情
        getRepairDetail() {
            this.loading = true;
            Core.Api.Repair.detail({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        handleResultSubmit() {
            Core.Api.Repair.repair({
                id: this.id,
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.detail = res
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
                this.modalFailShow = false
            });
        },
        handleResultShow(){
            this.modalFailShow = true
        },
    }
};
</script>

<style lang="less" scoped>
#RepairDetail {
    .ant-collapse-content-box {
        padding: 0px;
    }
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
    .steps-container {
        margin: 20px;
    }
}
</style>
