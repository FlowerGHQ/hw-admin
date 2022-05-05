<template>
    <div class="ImperfectList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, record, text}">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title='text' >
                                <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'org_type'">
                            {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'service_type'">
                            {{ $Util.repairServiceFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'operation'">
                            <a-button type="link" @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/>删除</a-button>
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
const TYPE = Core.Const.STOCK_RECORD.TYPE
export default {
    name: 'ImperfectList',
    components: {},
    props: {
        warehouseId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        },
        type: {
            type: Number,
        },
    },
    data() {
        return {
            TYPE,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            tableColumns: [
                {title: '故障件编号', dataIndex: 'uid'},
                {title: '车架号', dataIndex: 'vehicle_no', key: 'item'},
                {title: '维修单号', dataIndex: 'source_uid', key: 'detail'},
                {title: '工单帐类', dataIndex: 'service_type'},
                {title: '所属单位', dataIndex: 'source_org_name'},
                // {title: '所属仓库', dataIndex: 'warehouse_name', key: 'item'},
                {title: '更换商品', dataIndex: ['item','name'], key: 'item'},
                {title: '商品编码', dataIndex: ['item','code'], key: 'item'},
                {title: '故障原因', dataIndex: 'item_fault_name', key: 'item'},
                // {title: '故障件实例', dataIndex: 'entity_uid', key: 'item'},
                // {title: '审核人', dataIndex: 'audit_user_name', key: 'item'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', dataIndex: 'operation'},
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('item',item)
            let routeUrl = ''
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: {id: item.source_id}
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
            Core.Api.FaultEntity.list({
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
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要删除该故障件吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.FaultEntity.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
    }
};
</script>


<style lang="less" scoped>
.StockList {
    .table-container {
        margin-top: -10px;
    }
}
</style>

<style lang="less">
.stock-change-modal {
    .form-item-value {
        .fac();

        .code-input {
            width: calc(~'100% - 24px');
        }

        i.icon {
            display: inline-block;
            width: 24px;
            text-align: right;
        }

        .i_confirm {
            color: @green;
            font-size: 18px;
        }

        .i_close_c {
            color: @red;
            font-size: 18px;
        }

        .ant-input-number {
            margin-right: 10px;
        }

        .item-number {
            font-size: 12px;
            line-height: 16px;
            color: #363D42;
        }
    }
}
</style>