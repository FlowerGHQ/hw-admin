<template>
    <div class="WarehouseStockAdd gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id"  :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'detail'">
                            <div class="table-img">
                                <a-image :width="30" :height="30" :src="$Util.imageFilter(record.logo)" fallback='无'/>
                                <a-tooltip placement="top" :title='text'>
                                    <a-button type="link" @click="routerChange('detail', record)" style="margin-left: 6px;">{{text || '-'}}</a-button>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="text ? 'green' : 'red'">
                                {{ text ? '启用中' : '已禁用' }}
                            </div>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                            <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改</a-button>
                            <!-- <a-button type="link" @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除</a-button> -->
                            <a-button type='link' @click="handleStatusChange(record)" :class="record.status ? 'danger' : ''">
                                <template v-if="record.status"><i class="icon i_forbidden"/>禁用</template>
                                <template v-else><i class="icon i_enable"/>启用</template>
                            </a-button>
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
import Core from '../../../core';

export default {
    name: 'WarehouseStockAdd',
    components: {},
    props: {
        agentId: {
            type: Number,
        },
        distributorId: {
            type: Number,
        },
        type: {
            type: Number,
        },
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

        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: '商品名称', dataIndex: 'name', key: 'item'},
                {title: '商品编码', dataIndex: 'target_code', key:'item'},
                {title: '商品数量', dataIndex: 'number',key:'item'},
                { title: '创建人',   dataIndex: 'user_name', key: 'item' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
            ]
            return tableColumns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        // routerChange(type, item = {}) {
        //     let routeUrl = ''
        //     switch (type) {
        //         case 'edit':    // 编辑
        //             routeUrl = this.$router.resolve({
        //                 path: "/warehouse-item/store-edit",
        //                 query: {id: item.id, agent_id: this.agentId, distributor_id: this.distributorId}
        //             })
        //             window.open(routeUrl.href, '_self')
        //             break;
        //         case 'detail':    // 详情
        //             routeUrl = this.$router.resolve({
        //                 path: "/store/store-detail",
        //                 query: { id: item.id }
        //             })
        //             window.open(routeUrl.href, '_self')
        //             break;
        //     }
        // },
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
            Core.Api.Stock.list({
                page: this.currPage,
                page_size: this.pageSize,
                status: 1,
            }).then(res => {
                console.log("getTableData res", res)
                this.total = res.count;
                this.tableData = res.list;
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },


    }
};
</script>

<style lang="less" scoped>
//#WarehouseStockAdd {}
</style>