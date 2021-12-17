<template>
<div class="PurchaseList  gray-panel no-margin">
    <div class="panel-title">
        <div class="title">采购订单</div>
    </div>
    <div class="list-container">
        <div class="table-container">
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id" :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text , record}">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.dataIndex === 'price'">
                        ￥{{$Util.countFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <div class="status status-bg status-tag" :class="$Util.puechaseStatusFilter(text,'color')">
                            {{$Util.puechaseStatusFilter(text)}}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'purchase_method'">
                        {{$Util.purchaseMethodFilter(text)}}
                    </template>
                    <template v-if="column.dataIndex === 'item_type'">
                        {{$Util.itemTypeFilter(text)}}
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="routerChange('edit', record)"> <i class="icon i_edit"/> 再次购买</a-button>
                        <a-button type='link' @click="routerChange('detail', record)"> <i class="icon i_detail"/> 订单详情</a-button>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paging-container">
            <a-pagination
                v-model:current="currPage"
                :page-size='pageSize'
                :total="total"
                show-quick-jumper
                show-size-changer
                show-less-items
                :show-total="total => `共${total}条`"
                :hide-on-single-page='false'
                :pageSizeOptions="['10', '20', '30', '40']"
                @change="pageChange"
                @showSizeChange="pageSizeChange"
            />
        </div>
    </div>
</div>
</template>

<script>
import Core from '../core';
export default {
    name: 'PurchaseList',
    components: {},
    props: {
        orgId: {
            type: Number,
        },
        agentId: {
            type: Number,
        },
        storeId: {
            type: Number,
        }
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            searchForm: {
                sn: '',
                status: undefined,
                item_type: 0,
                type: 0,
                subject: 0,
            },

            tableColumns: [
                { title: '订单编号', dataIndex: 'sn', },
                { title: '价格', dataIndex: 'price'  },
                { title: '订单状态', dataIndex: 'status' },
                { title: '下单时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right'}
            ],
            tableData: [],
        };
    },
    watch: {},
    computed: {
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item)
            let routeUrl = ''
            switch (type) {
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/purchase/purchase-order-detail",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            Core.Api.Purchase.list({
                org_id: this.orgId,
                page: this.currPage,
                page_size: this.pageSize
            }).then(res => {
                console.log("getTableData res:", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err:', err)
            }).finally(() => {
                this.loading = false;
            });
        },
    }
};
</script>

<style lang="less" scoped>
#PurchaseList {
    .status-tag {
        width: 50px;
        height: 22px;
        line-height: 22px;
        border-radius: 12px;
        font-size: @fz_sm;
        text-align: center;
    }
}
.btn-area{
        white-space: nowrap;
        min-width: 210px;
        display: flex;
        justify-content: flex-end;
        // padding-bottom: 50px;
    }
</style>