<template>
<div id="RepairDetail">
    <div class="list-container">
        <div class="collapse-container">
            <a-collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
                <a-collapse-panel key="1" header="故障确认">
                    <div class="gray-panel info">
                        <div class="panel-title">
                        </div>
                        <div class="panel-content">
                            <div class="staff">车辆故障</div>
                        </div>
                        <div class="panel-content">
                            <a-checkbox-group v-model:value="faultList" @change="faultListChange" :style="{width: '100%'}">
                                <a-row>
                                    <a-col :span="4">
                                        <a-checkbox value="1" name="电池故障">
                                            电池故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="2" name="发动机故障">
                                            发动机故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="3" name="轮胎故障">
                                            轮胎故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="4" name="刹车故障">
                                            刹车故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="5" name="转向灯故障">
                                            转向灯故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="6" name="仪表盘故障">
                                            仪表盘故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="7" name="尾灯故障">
                                            尾灯故障
                                        </a-checkbox>
                                    </a-col>
                                </a-row>

                            </a-checkbox-group>
                        </div>
                    </div>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="零部件更换">
                    <a-row>
                        <a-col :span="12">
                            <div class="gray-panel info" >
                                <div class="panel-title">
                                    <div class="left">
                                        <div class="staff">共{{faultListHandle.length}}个故障</div>
                                    </div>
                                </div>
                                <div class="panel-content">
                                    <a-list size="small" bordered v-for="fault in faultListHandle">
                                        <div>
                                            {{fault.name}}<ItemSelect @change="handleAddFailItem" :fault-name="fault.name" :disabled-checked='failData[fault.name].map(i => i.id)' style="margin-bottom: 12px;"/>
                                        </div>
                                        <a-table :columns="failColumns" :data-source="failData[fault.name]" :scroll="{ x: true }"
                                                 :row-key="record => record.id"  :pagination='false' size="small"
                                                 :indentSize='24'>
                                            <template #bodyCell="{ column, text , record ,index}">
                                                <a-input-number v-model:value="record.amount"
                                                                :min="0" :precision="0" placeholder="请输入"
                                                                :formatter="value => value ? `${value}件` : value"
                                                                :parser="value => value.replace('件', '')"
                                                                v-if="column.dataIndex === 'amount'"
                                                />
                                                <template v-if="column.dataIndex === 'name'">

                                                </template>
                                                <template v-if="column.dataIndex === 'operation'">
                                                    <a-button @click="deleteFailItem(index, fault.name)">删除</a-button>
                                                </template>
                                            </template>
                                        </a-table>
                                    </a-list>

                                </div>
                            </div>
                        </a-col>
                        <a-col :span="12">
                            <div class="gray-panel info" >
                                <div class="panel-title">
                                    <div class="left">
                                        <div class="staff">共{{faultListHandle.length}}个故障</div>
                                    </div>
                                </div>
                                <div class="panel-content">
                                    <a-list size="small" bordered v-for="fault in faultListHandle">
                                        <div>
                                            {{fault.name}}<ItemSelect @change="handleAddExchangeItem" :fault-name="fault.name" :disabled-checked='exchangeData[fault.name].map(i => i.id)' style="margin-bottom: 12px;"/>
                                        </div>
                                        <a-table :columns="failColumns" :data-source="exchangeData[fault.name]" :scroll="{ x: true }"
                                                 :row-key="record => record.id"  :pagination='false' size="small"
                                                 :indentSize='24'>
                                            <template #bodyCell="{ column, text , record ,index}">
                                                <a-input-number v-model:value="record.amount"
                                                                :min="0" :precision="0" placeholder="请输入"
                                                                :formatter="value => value ? `${value}件` : value"
                                                                :parser="value => value.replace('件', '')"
                                                                v-if="column.dataIndex === 'amount'"
                                                />
                                                <template v-if="column.dataIndex === 'name'">

                                                </template>
                                                <template v-if="column.dataIndex === 'operation'">
                                                    <a-button @click="deleteExchangeItem(index, fault.name)">删除</a-button>
                                                </template>
                                            </template>
                                        </a-table>
                                    </a-list>

                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>

</div>
</template>

<script>
import Core from '../../../core';
import ItemSelect from '@/components/ItemSelect.vue';
import axios from 'axios';
const failColumns = [
    { title: '商品名称', dataIndex: 'name' },
    { title: '数量', dataIndex: 'amount'  },
    { title: '操作', dataIndex: 'operation'  },
]
const itemColumns = [
    { title: '商品名称', dataIndex: 'name' },
    { title: '编码', dataIndex: 'code'  },
]
export default {
    name: 'RepairDetail',
    components: {
        ItemSelect
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            id: '',
            detail: {}, // 工单详情
            failColumns: failColumns,

            failData: {},
            exchangeData: [],
            faultList: [],
            faultListHandle: [],
            itemColumns: itemColumns,
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
    },
    methods: {
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

        handleAddFailItem(ids, items, name) {
            console.log('handleAddItem items:', name)
            this.failData[name].push(...items)
            console.log('failData items:', this.failData)
            this.failData[name].map(i =>{
                console.log('failData items:', i.id)
            })
        },
        // 添加要寄回的商品
        handleAddExchangeItem(ids, items,name) {
            console.log('handleAddItem items:', items)
            this.exchangeData[name].push(...items)
            console.log('failData items:', this.failData)
        },
        deleteFailItem(index, name) {
            this.failData[name].splice(index, 1)
        },
        deleteExchangeItem(index, name) {
            this.exchangeData[name].splice(index, 1)
        },
        faultListChange(){
            this.faultListHandle = []
            console.log(this.faultList)
            this.faultList.forEach(it =>{
                this.faultListHandle.push({name: it})
                this.failData[it] = []
                this.exchangeData[it] = []
            })

        },
        repairDetection(){
            let itemList = []
            let fault = ""
            this.faultList.forEach(fault => {
                this.failData[fault].forEach(it => {
                    it.item_fault_type = fault
                    it.type = 1
                    itemList.push(it)
                })
                this.exchangeData[fault].forEach(it => {
                    it.item_fault_type = fault
                    it.type = 2
                    itemList.push(it)
                })
            })

            Core.Api.RepairItem.saveList({
                repair_order_id: this.id,
                item_list: itemList
            }).then(
                this.getRepairDetail()
            )
        }
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
