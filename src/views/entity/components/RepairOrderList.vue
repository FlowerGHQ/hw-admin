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
                        <template v-if="column.key === 'operation'" >
                            <template v-if="!this.addMode">
                                <a-button type="link" @click="routerChange('detail')" class="danger && $auth('supplier.save')"><i class="icon i_detail"/>详情</a-button>
                            </template>
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
            repair_order_id: '',
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
            let columns = [
                {title: '维修名称', dataIndex: ['item','name'], key: 'detail'},
                {title: '维修分类', dataIndex: ['item','category', 'name'], key: 'item'},
                {title: '维修编码', dataIndex: ['item','code'], key: 'item'},
                {title: '单位', dataIndex: ['item','unit'], key: 'item'},
                {title: '单价', dataIndex:  'price',key: 'price'},
                {title: '规格', dataIndex: ['item','spec'], key: 'item'},
                { title: '维修包装', dataIndex: ['item','encapsulation'], key: 'item' },
                { title: '包装尺寸', dataIndex: ['item','encapsulation_size'], key: 'item' },
                { title: '毛重(kg)', dataIndex: ['item','gross_weight'], key: 'gross_weight' },
                {title: '创建时间', dataIndex: ['item','create_time'], key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
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
            Core.Api.RepairItem.list({
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