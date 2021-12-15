<template>
<div class="StoreList gray-panel no-margin">
    <div class="panel-title">
        <div class="title">门店列表</div>
    </div>
    <div class="list-container">
        <div class="table-container">
            <a-button type="primary" ghost @click="routerChange('edit')" style="margin-bottom: 10px;"><i class="icon i_add"/>新增门店</a-button>
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
                    <template v-if="column.key === 'operation'">
                        <a-button type='link' @click="routerChange('detail', record)"><i class="icon i_detail"/> 详情</a-button>
                        <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/> 修改</a-button>
                        <a-button type="link" @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除</a-button>
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
    name: 'UserList',
    components: {},
    props: {
        orgId: {
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

            tableColumns: [
                {title: '门店名称', dataIndex: 'name', key:'detail'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ],

            tableData: [],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/store/store-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/store/store-detail",
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
            Core.Api.Store.list({
                org_id: this.orgId,
                type: this.type,
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
                title: '确定要删除该门店吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Store.delete({id}).then(() => {
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
.StoreList {
    .table-container {
        margin-top: 10px;
    }
}
</style>