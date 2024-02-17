<template>
    <div class="RepairOrderList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="addData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    :loading="loading"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)"
                                    >{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.dataIndex === 'channel'">
                            {{ $Util.repairChannelFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'repair_method'">
                            {{ $Util.repairMethodFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'service_type'">
                            {{ $Util.repairServiceFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            <div class="status status-bg status-tag" :class="$Util.repairStatusFilter(text, 'color')">
                                <a-tooltip :title="record.audit_message" placement="topRight" destroyTooltipOnHide>
                                    {{ $Util.repairStatusFilter(text, $i18n.locale) }}
                                    <template v-if="[STATUS.AUDIT_FAIL].includes(record.status)">
                                        <i class="icon i_hint" style="font-size: 12px; padding-left: 6px" />
                                    </template>
                                </a-tooltip>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'operation'">
                            <a-button type="link" @click="routerChange('detail', record)"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
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
const STATUS = Core.Const.REPAIR.STATUS;

export default {
    name: 'RepairOrderList',
    components: {},
    props: {
        itemId: {
            type: Number,
        },
    },
    data() {
        return {
            STATUS,
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            addData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('r.repair_sn'), dataIndex: 'uid', key: 'detail' },
                { title: this.$t('r.repair_name'), dataIndex: 'name', key: 'tip_item' },
                { title: this.$t('r.warranty'), dataIndex: 'service_type' },
                { title: this.$t('r.repair_status'), dataIndex: 'status' },
                { title: this.$t('r.repair_way'), dataIndex: 'channel' },
                { title: this.$t('r.repair_category'), dataIndex: 'repair_method' },
                { title: this.$t('r.repair_unit'), dataIndex: 'repair_name', key: 'item' },
                { title: this.$t('r.repair_phone'), dataIndex: 'repair_phone', key: 'item' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
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
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/repair/repair-detail',
                        query: { id: item.id },
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
            Core.Api.Repair.list({
                page: this.currPage,
                page_size: this.pageSize,
                item_id: this.itemId,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    this.addData = res.list;
                    console.log('this.addData:', this.addData);
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
.RepairOrderList {
    .table-container {
        margin-top: -10px;

        .value-price {
            margin-right: 5px;
            width: 60px;
        }
    }

    .panel-title .btn-area {
        .panel-btn {
            margin-bottom: 0;
        }
    }
}
</style>
