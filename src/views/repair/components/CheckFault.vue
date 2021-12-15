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
                            <a-checkbox-group @change="" v-model:value="faultList" :style="{width: '100%'}">
                                <a-row>
                                    <a-col :span="4">
                                        <a-checkbox value="电池故障">
                                            电池故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="发动机故障">
                                            发动机故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="轮胎故障">
                                            轮胎故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="刹车故障">
                                            刹车故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="转向灯故障">
                                            转向灯故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="仪表盘故障">
                                            仪表盘故障
                                        </a-checkbox>
                                    </a-col>
                                    <a-col :span="4">
                                        <a-checkbox value="尾灯故障">
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
                                        <div class="staff">共{{failData.length}}个故障</div>
                                    </div>
                                    <div class="right">
                                        <div class="staff" v-if="detail.repair_user_id">
                                            <a-button type="primary" @click='routerChange("detail")'>添加</a-button>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel-content">
                                    <a-table :columns="failColumns" :data-source="failData" :scroll="{ x: true }"
                                             :row-key="record => record.id"  :pagination='false' size="small"
                                             :indentSize='24'>
                                        <template #bodyCell="{ column, text , record }">
                                            <template v-if="column.dataIndex === 'name'">

                                            </template>
                                            <template v-if="column.dataIndex === 'operation'">
                                                <a-button type="primary" @click='routerChange("detail", record)'>删除</a-button>
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
                                        <div class="staff">共{{failData.length}}个故障</div>
                                    </div>
                                    <div class="right">
                                        <div class="staff" v-if="detail.repair_user_id">
                                            <a-button type="primary" @click='failHandle("detail")'>添加</a-button>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel-content">
                                    <a-table :columns="failColumns" :data-source="failData" :scroll="{ x: true }"
                                             :row-key="record => record.id"  :pagination='false' size="small"
                                             :indentSize='24'>
                                        <template #bodyCell="{ column, text , record }">
                                            <template v-if="column.dataIndex === 'name'">

                                            </template>
                                            <template v-if="column.dataIndex === 'operation'">
                                                <a-button type="primary" @click='routerChange("detail", record)'>删除</a-button>
                                            </template>
                                        </template>
                                    </a-table>
                                </div>
                            </div>
                        </a-col>
                    </a-row>

                </a-collapse-panel>
                <a-collapse-panel key="3" header="This is panel header 3" collapsible="disabled">
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
    <template class="modal-container">
        <a-modal v-model:visible="modalFailShow" width="860px" title="更换分新增分类" @ok="addFailList">
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :md='12' class="search-item">
                        <div class="key"><span>商品编码:</span></div>
                        <div class="value">
                            <a-input placeholder="请输入商品编码" v-model:value="searchItemForm.code" @keydown.native.enter='handleItemSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :md='12' class="search-item">
                        <div class="key"><span>商品名称:</span></div>
                        <div class="value">
                            <a-input placeholder="请输入商品名称" v-model:value="searchItemForm.name" @keydown.native.enter='handleItemSearch'/>
                        </div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleItemSearch" type="primary">查询</a-button>
                    <a-button @click="handleItemSearchReset()">重置</a-button>
                </div>
            </div>

            <div class="table-container">
                <a-table :columns="itemColumns" :data-source="itemDate" :scroll="{ x: true }"
                         :row-key="record => record.id"  :pagination='false' size="small"
                         :row-selection="{ selectedRowKeys: itemSelected, onChange: onSelectChange }"
                         :indentSize='24'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.dataIndex === 'name'">

                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="itemCurrPage"
                    :page-size='itemPageSize'
                    :total="itemTotal"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageItemChange"
                    @showSizeChange="pageItemSizeChange"
                />
            </div>
        </a-modal>
    </template>
</div>
</template>

<script>
import Core from '../../../core';
import axios from 'axios';
const REPAIR = Core.Const.REPAIR
const faultOptions = [
    { label: '电池故障', value: '电池故障' },
    { label: '发动机故障', value: '发动机故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
    { label: '轮胎故障', value: '轮胎故障' },
];
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
    components: {},
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

            failData: [{name: "前车灯", 数量: 1}],
            changeItemData:[],
            itemCurrPage: 1,
            itemPageSize: 20,
            itemDate:[],
            itemTotal: 0,
            itemSelected: [],
            itemSelectedRowItems: [],
            faultList: [],
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
        this.handleItemSearch()
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
        onSelectChange(selectedRowKeys, selectedRows) {
            console.log("selectedRowKeys", selectedRowKeys)
            console.log("selectedRows", selectedRows)
            this.itemSelected = selectedRowKeys
            this.itemSelectedRowItems = selectedRows
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
