<template>
    <div id="RepairDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">工单详情</div>
                <div class="btns-area">
                    <a-button type="primary" @click="repairDetection()" v-if="detail.status == Core.Const.REPAIR.STATUS.WAIT_DETECTION"><i class="icon i_check_c"/>提交</a-button>
                    <a-button type="primary" @click="repairCheck()" v-if="detail.status == Core.Const.REPAIR.STATUS.WAIT_CHECK"><i class="icon i_check_c"/>确定</a-button>

                    <a-button type="primary" @click="repairRepairEnd()" v-if="detail.status == Core.Const.REPAIR.STATUS.REPAIR_END"><i class="icon i_edit"/>结算</a-button>
                    <a-button type="primary" @click="repairRepairShow()" v-if="detail.status == Core.Const.REPAIR.STATUS.WAIT_REPAIR"><i class="icon i_edit"/>维修完成</a-button>

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
                <CheckFault  :id='id' :detail='detail' ref="CheckFault"  />
                <CheckResult  :id='id' :detail='detail' ref="CheckResult"  />
                <div class="info">
                    <a-collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
                        <a-collapse-panel key="1" header="详细信息">
                            <div class="panel-content">
                                <div class="info-item">
                                    <div class="key">工单名称</div>
                                    <div class="value">{{detail.name || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">问题描述</div>
                                    <div class="value">{{detail.desc|| '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">完成时间</div>
                                    <div class="value">{{$Util.timeFilter(detail.plan_time) || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">维修方式</div>
                                    <div class="value">{{$Util.repairChannelFilter(detail.channel) || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">产品类别</div>
                                    <div class="value">{{$Util.repairItemTypeFilter(detail.item_type) || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">维修类别</div>
                                    <div class="value">{{$Util.repairMethodFilter(detail.repair_method) || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">客户电话</div>
                                    <div class="value">{{detail.customer_phone || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">客户邮箱</div>
                                    <div class="value">{{detail.customer_email || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">车辆编号</div>
                                    <div class="value">{{ item_code || '-'}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="key">地址</div>
                                    <div class="value">{{detail.customer_address + detail.customer_detail_address || '-'}}</div>
                                </div>
                            </div>
                        </a-collapse-panel>
                        <a-collapse-panel key="2" header="操作记录">
                            <a-table class="OrderItemTable item_table"
                                     :columns="actionLogColumns" :data-source="actionLogList" :scroll="{ x: true }"
                                     :row-key="record => record.id" :loading='actionLogLoading' :pagination='false'
                                    >
                            </a-table>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </div>
        </div>
        <template class="modal-container">
            <a-modal v-model:visible="modalFailShow" width="600px" title="商品" @ok="repairRepair">
                <div class="modal-content">
                    <div class="form-item">
                        <div class="key">维修结果</div>
                        <div class="value">
                            <a-select v-model:value="repairForm.results" placeholder="请选择维修结果">
                                <a-select-option v-for="results of resultsList" :key="results.value" :value="results.value">{{results.name}}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="form-item" v-if="repairForm.results == Core.Const.REPAIR.RESULTS.FAIL">
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
import axios from 'axios';
import CheckFault from './components/CheckFault.vue';
import CheckResult from './components/CheckResult.vue';

const REPAIR = Core.Const.REPAIR
const actionLogColumns = [
    { title: '操作类型', dataIndex: 'name' },
    { title: '操作人', dataIndex: 'code'  },
    { title: '工单编号', dataIndex: 'uid'  },
    { title: '操作时间', dataIndex: 'time'  },
    { title: '备注', dataIndex: 'remark'  },
]

export default {
    name: 'RepairDetail',
    components: {
        CheckFault,
        CheckResult
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 工单详情
            resultsList: Core.Const.REPAIR.RESULTS_LIST,

            failData: [{name: "前车灯", 数量: 1}],
            active: null,
            changeItemData:[],
            itemCurrPage: 1,
            itemPageSize: 20,
            itemDate:[],
            itemTotal: 0,
            itemSelected: [],
            itemSelectedRowItems: [],
            faultList: [],
            modalFailShow: false,
            actionLogList: [],
            actionLogLoading: false,
            actionLogColumns: actionLogColumns,
            searchItemForm: {
                code:"",
                name:"",
            },
            repairForm: {
                results: undefined,
                fail_remark: undefined,
            },
            Core: Core,
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
        this.handleItemSearch();
        this.getActionLogList();
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
            }
            window.open(routeUrl.href, '_self')
        },
        repairCheck() {
            console.log("faultList", this.faultList)
            console.log("failData", this.failData)

            Core.Api.Repair.check({
                id: this.id
            }).then(
                this.getRepairDetail()
            )
        },
        repairDetection() {
            this.$refs.CheckFault.repairDetection();
        },
        repairRepair() {
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
        repairRepairShow(){
            this.modalFailShow = true
        },
        repairRepairEnd(){
            this.$router.push('/repair/repair-invoice?id=' + this.id)
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
        // 获取操作记录
        getActionLogList() {
            this.loading = true;
            Core.Api.ActionLog.list({
                source_id: this.id,
                source_type: this.Core.Const.ACTION_LOG.SOURCE_TYPE.REPAIR_ORDER
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.actionLogList = res.list
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },

        failHandle() {
            this.modalFailShow = true
        },
        addFailList() {
            this.itemSelectedRowItems.forEach(it =>{
                console.log(it.name)
                this.failData.push(it)
            })

            this.modalFailShow = false
        },
        handleItemSearch() {
            Core.Api.Item.list({
                ...this.searchItemForm
            }).then(res => {
                console.log('getRepairDetail res', res)
                this.itemDate = res.list
                this.itemTotal = res.count
            }).catch(err => {
                console.log('getRepairDetail err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleItemSearchReset() {
            Object.assign(this.searchItemForm, this.$options.data().searchItemForm)
            this.pageItemChange(1)
        },
        pageItemChange(curr) {  // 页码改变
            this.itemCurrPage = curr
            this.handleItemSearch()
        },
        pageItemSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.itemPageSize = size
            this.handleItemSearch()
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
