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
                            <div v-for="fault in faultList">
                                {{$Util.repairFaultOptionsListFilter(fault.item_fault_type)}}
                            </div>
                        </div>

                    </div>

                </a-collapse-panel>
                <a-collapse-panel key="2" header="零部件更换">
                    <a-row>
                        <a-col :span="12">
                            <div class="gray-panel info" >
                                <div class="panel-title">
                                    <div class="left">
                                        <div class="staff">共{{faultList.length}}个故障</div>
                                    </div>
                                </div>
                                <div class="panel-content">
                                        <a-table :columns="failColumns" :data-source="failList" :scroll="{ x: true }"
                                                 :row-key="record => record.id"  :pagination='false' size="small"
                                                 :indentSize='24'>
                                            <template #bodyCell="{ column, text , record ,index}">
                                                <template v-if="column.dataIndex === 'item_fault_type'">
                                                    {{$Util.repairFaultOptionsListFilter(text)}}
                                                </template>

                                                <template v-if="column.dataIndex === 'amount'">
                                                    {{text}}件
                                                </template>
                                            </template>
                                        </a-table>

                                </div>
                            </div>
                        </a-col>
                        <a-col :span="12">
                            <div class="gray-panel info" >
                                <div class="panel-title">
                                    <div class="left">
                                        <div class="staff">共{{faultList.length}}个故障</div>
                                    </div>
                                </div>
                                <div class="panel-content">
                                    <a-table :columns="failColumns" :data-source="exchangeList" :scroll="{ x: true }"
                                             :row-key="record => record.id"  :pagination='false' size="small"
                                             :indentSize='24'>
                                        <template #bodyCell="{ column, text , record ,index}">
                                            <template v-if="column.dataIndex === 'item_fault_type'">
                                                {{$Util.repairFaultOptionsListFilter(text)}}
                                            </template>

                                            <template v-if="column.dataIndex === 'amount'">
                                                {{text}}件
                                            </template>
                                        </template>
                                    </a-table>

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
    { title: '故障原因', dataIndex: 'item_fault_type' },
    { title: '商品名称', dataIndex: 'item_name' },
    { title: '数量', dataIndex: 'amount'  },

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

            failList: [],
            exchangeList: [],
            faultList: [],
            itemColumns: itemColumns,
            searchItemForm: {
                code:"",
                name:"",
            },
            Core: Core,
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.id = Number(this.$route.query.id) || 0
        this.getRepairDetail();
        this.getRepairItemList();
        this.getRepairFaultList()
    },
    methods: {
        // 页面跳转
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
        getRepairItemList() {
           Core.Api.RepairItem.list({
               repair_order_id: this.id
           }).then(res => {
               res.list.forEach(it => {
                   it.item_name = it.item.name
                   if(it.type == Core.Const.REPAIR_ITEM.TYPE.ADD){
                       this.failList.push(it)
                   }
                   if(it.type == Core.Const.REPAIR_ITEM.TYPE.REPLACE){
                       this.exchangeList.push(it)
                   }

               })
           })
        },
        getRepairFaultList(){
            Core.Api.RepairItem.faultList({
                repair_order_id: this.id
            }).then(res => {
                console.log(res.fault_list)
                this.faultList = res.fault_list
            })
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
