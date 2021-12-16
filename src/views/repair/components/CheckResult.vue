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
<!--                                    <div class="right">-->
<!--                                        <div class="staff" v-if="detail.repair_user_id">-->
<!--                                            <ItemSelect @change="handleAddFailItem" :disabled-checked='failData.map(i => i.id)' style="margin-bottom: 12px;"/>-->
<!--                                        </div>-->
<!--                                    </div>-->
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
                                    <!--                                    <div class="right">-->
                                    <!--                                        <div class="staff" v-if="detail.repair_user_id">-->
                                    <!--                                            <ItemSelect @change="handleAddFailItem" :disabled-checked='failData.map(i => i.id)' style="margin-bottom: 12px;"/>-->
                                    <!--                                        </div>-->
                                    <!--                                    </div>-->
                                </div>
                                <div class="panel-content">
                                    <a-table :columns="failColumns" :data-source="exchangeData" :scroll="{ x: true }"
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
const REPAIR = Core.Const.REPAIR
const faultOptions = [
    { label: '电池故障', value: '1' },
    { label: '发动机故障', value: '2' },
    { label: '轮胎故障', value: '3' },
    { label: '刹车故障', value: '4' },
    { label: '转向灯故障', value: '5' },
    { label: '仪表盘故障', value: '6' },
    { label: '尾灯故障', value: '7' },
];
const failNameColumns = [
    { title: '故障名称', dataIndex: 'name' },
    { title: '操作', dataIndex: 'operation'  },
]
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
            faultOptions: faultOptions,
            failColumns: failColumns,
            failNameColumns: failNameColumns,

            failList: [],
            exchangeList: [],
            changeItemData: [],
            exchangeData: [],
            itemCurrPage: 1,
            itemPageSize: 20,
            itemDate:[],
            itemTotal: 0,
            itemSelected: [],
            itemSelectedRowItems: [],
            faultList: [],
            faultListHandle: [],
            modalFailShow: true,
            itemColumns: itemColumns,
            searchItemForm: {
                code:"",
                name:"",
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
        this.getRepairItemList();
        this.getRepairFaultList()
        this.handleItemSearch();
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
        repairCheck(){
            console.log("faultList", this.faultList)
            console.log("failData", this.failData)

            // Core.Api.Repair.check({})
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
        failHandle(type) {
            switch (type){
                case "fail":

                    break;
                case "exchange":

                    break;
            }
            this.modalFailShow = true
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
