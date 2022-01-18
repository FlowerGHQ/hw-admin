<template>
<div class="PricingStructure gray-panel no-margin">
    <div class="panel-title">
        <div class="title">商品价格管理</div>
    </div>
    <div class="panel-content">
        <div class="table-container">
            <ItemSelect :disabled-checked='tableData.map(i => i.id)' @select="handleAddItem" ghost btn-class="panel-btn">
                <i class="icon i_add"/> 添加商品
            </ItemSelect>
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                <template #bodyCell="{ column, text , record }">
                    <template v-if="column.dataIndex === 'type'">
                        {{ $Util.userTypeFilter(text) }}
                    </template>
                    <template v-if="column.dataIndex === 'flag_admin'">
                        <template v-if="loginType < type">
                            <a-switch :checked="!!record.flag_admin" checked-children="是" un-checked-children="否" @click="handleManagerChange(record)"/>
                        </template>
                        <template v-else>{{ text ? "是" : "否" }}</template>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="routerChange('edit', record)"><i class="icon i_edit"/> 编辑</a-button>
                        <a-button type='link' class="danger" @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除</a-button>
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
const USER_TYPE = Core.Const.USER.TYPE
import ItemSelect from '@/components/popup-btn/ItemSelect.vue';

export default {
    name: 'PricingStructure',
    components: { ItemSelect },
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
        title: {
            type: Number,
        },
    },
    data() {
        return {
            USER_TYPE,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格数据
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '商品名称', dataIndex: 'name', key: 'detail'},
                { title: '商品型号', dataIndex: 'model', key: 'item' },
                { title: '商品编码', dataIndex: 'code',  key: 'item' },
                { title: '供货价',  dataIndex: 'price', key: 'supply', },
                { title: '标准售价', dataIndex: 'price', key: 'money', },
                { title: '操作', key: 'operation', fixed: 'right'},
            ]
            if (this.$auth('ADMIN')) {
            }
            return columns
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
                        path: this.$auth('ADMIN') ? "/item/item-detail" : '/purchase/item-display',
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_blank')
                    break;
            }
        },
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.ItemPrice.list({
                org_id: this.orgId,
                org_type: this.orgType,
                page: this.currPage,
                page_size: this.pageSize
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
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: '确定要移出该商品吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.ItemPrice.delete({id}).then(() => {
                        _this.$message.success('移出成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },

        handleAddItem() {
        },
    }
};
</script>

<style lang="less" scoped>
.PricingStructure {
    .table-container {
        margin-top: -10px;
    }
}
</style>