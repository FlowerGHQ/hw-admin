<template>
    <div class="RepairOrderList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">维修单列表</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="addData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false' :loading='loading'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail' && $auth('repairOrder.list')">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{ text || '-' }}
                                </a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'gross_weight'">
                            {{ $Util.countFilter(text) }}
                        </template>
                        <template v-if="column.key === 'price'">
                            <template v-if="addMode || record.editMode">
                               ￥<a-input-number v-model:value="record.price" placeholder="请输入"
                                                :min="0.00" :precision="2"/>
                            </template>
                            <template v-else>￥{{ text }}</template>
                        </template>
                        <template v-if="column.dataIndex === 'operation'" >
                            <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/>详情</a-button>
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
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';
const REPAIR = Core.Const.REPAIR

export default {
    name: 'BomItems',
    components: {
        ItemSelect,
    },
    props: {
        itemId: {
            type: Number,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
            addMode: false,
            details: {
                items: [],
                repair_orders: [],
            },
            addData: [],
            repair_order: {},
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: this.$t('r.repair_sn'), dataIndex: 'uid', key: 'detail' },
                { title: this.$t('search.vehicle_no'), dataIndex: 'vehicle_no',key: 'item'},
                { title: this.$t('r.repair_name'), dataIndex: 'name', key: 'tip_item' },
                { title: this.$t('r.urgency'), dataIndex: 'priority' },
                { title: this.$t('r.repair_status'), dataIndex: 'status'},
                { title: this.$t('r.warranty'), dataIndex: 'service_type',
                    filters: REPAIR.SERVICE_TYPE_LIST, filterMultiple: false, filteredValue: filteredInfo.service_type || null },
                { title: this.$t('r.repair_way'), dataIndex: 'channel',
                    filters: REPAIR.CHANNEL_LIST, filterMultiple: false, filteredValue: filteredInfo.channel || null },
                { title: this.$t('r.repair_category'), dataIndex: 'repair_method',
                    filters: REPAIR.METHOD_LIST, filterMultiple: false, filteredValue: filteredInfo.repair_method || null },
                { title: this.$t('r.repair_unit'), dataIndex: 'repair_name', key: 'item' },
                { title: this.$t('r.repair_phone'), dataIndex: 'repair_phone', key: 'item' },
                { title: this.$t('r.creator_name'),   dataIndex: 'user_name', key: 'item' },
                { title: this.$t('r.associated_customers'), dataIndex: 'customer_name', key: 'item' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: "操作", dataIndex: 'operation' },
                // { title: '完成时间', dataIndex: 'finish_time', key: 'time' },
            ]
            if (this.operMode === 'audit' && this.$auth('ADMIN', 'DISTRIBUTOR')) {
                columns.push({ title: this.$t('def.operate'), key: 'operation', fixed: 'right'},)
            }
            if (this.operMode === 'redit' && !this.$auth('ADMIN')) {
                columns.push({ title: this.$t('def.operate'), key: 'operate', fixed: 'right'},)
            }
            if (this.operMode === 'invoice' && this.$auth('ADMIN')) {
                columns.push({ title: this.$t('def.operate'), key: 'handle', fixed: 'right'},)
            }
            return columns
        },
        // 已经添加到维修表中的ids
        checkedIds() {
            let checkedIds = this.addData.map(i => i.id)
            console.log('checkedIds:', checkedIds)
            console.log('addData', this.addData)
            return checkedIds
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/repair/repair-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        pageChange(curr) { // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) { // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() { // 获取 表格 数据
            this.loading = true;
            Core.Api.Repair.list({
                page: this.currPage,
                pageSize: this.pageSize,
                item_id: this.itemId,
            }).then(res => {
                console.log("getTableData res", res);
                this.total = res.count;
                this.addData = res.list
                console.log('this.addData:', this.addData)
            }).catch(err => {
                console.log('getTableData err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        handleRowChange(item) {
            item.editMode = true
        },
        handleRowSubmit(item) {
            Core.Api.RepairOrder.price({
                repair_order_id: item.item.id,
                price: Math.round(item.price * 100),
                supplier_id: this.supplierId
            }).then(() => {
                this.$message.success('保存成功')
                this.getTableData()
            })
        },

    }

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