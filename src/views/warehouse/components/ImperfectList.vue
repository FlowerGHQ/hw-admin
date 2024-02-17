<template>
    <div class="ImperfectList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, record, text }">
                        <template v-if="column.key === 'detail' && $auth('repair-order.detail')">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'org_type'">
                            {{ $Util.userTypeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'service_type'">
                            {{ $Util.repairServiceFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'name'">
                            {{ $i18n.locale == 'zh' ? record.item.name : record.item.name_en }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'operation'">
                            <a-button
                                type="link"
                                @click="handleDelete(record.id)"
                                v-if="$auth('warehouse.save')"
                                class="danger"
                                ><i class="icon i_delete" />删除</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
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
const TYPE = Core.Const.STOCK_RECORD.TYPE;
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
                return {};
            },
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
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('n.fault'), dataIndex: 'uid' },
                { title: this.$t('search.vehicle_no'), dataIndex: 'vehicle_no', key: 'item' },
                { title: this.$t('r.sn'), dataIndex: 'source_uid', key: 'detail' },
                { title: this.$t('r.warranty'), dataIndex: 'service_type' },
                { title: this.$t('r.unit'), dataIndex: 'source_org_name' },
                { title: this.$t('r.item'), dataIndex: 'name', key: 'name' },
                { title: this.$t('i.code'), dataIndex: ['item', 'code'], key: 'item' },
                { title: this.$t('r.fault_cause'), dataIndex: 'item_fault_name', key: 'item' },
                // {title: '故障件实例', dataIndex: 'entity_uid', key: 'item'},
                { title: this.$t('n.operator'), dataIndex: 'operator_name', key: 'item' },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), dataIndex: 'operation' },
            ];
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('item', item);
            let routeUrl = '';
            switch (type) {
                case 'detail':
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-detail',
                        query: { id: item.source_id },
                    });
                    window.open(routeUrl.href, '_blank');
                    break;
            }
        },
        pageChange(curr) {
            // 页码改变
            this.currPage = curr;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            console.log('pageSizeChange size:', size);
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.FaultEntity.list({
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res:', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.FaultEntity.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete err', err);
                        });
                },
            });
        },
    },
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
            color: #363d42;
        }
    }
}
</style>
