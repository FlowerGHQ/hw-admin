<template>
    <div id="UserList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">员工列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增员工</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id"  :pagination='false' @change="handleTableChange">
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.dataIndex === 'sn'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link" @click="routerChange('detail', record)">{{text}}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'type'">
                            <div class="status status-bg status-tag" :class="$Util.UserTypeFilter(text,'color')">
                                {{$Util.UserTypeFilter(text)}}
                            </div>
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
                            <a-button type='link' @click="routerChange('edit', record)"> <i class="icon i_edit"/> 编辑</a-button>
                            <a-button type='link' @click="handleDelete(record.id)"> <i class="icon i_delete"/> 删除</a-button>
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
    name: 'UserList',
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
        },
        type:{
          type:Number,
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
            
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '姓名', dataIndex: ['account', 'name'], key: 'item' },
                { title: '账号', dataIndex: ['account', 'username'], key: 'item' },
                { title: '手机号', dataIndex: ['account', 'phone'] },
                { title: '邮箱', dataIndex: ['account', 'email'] },
                { title: '类型', dataIndex: 'type' },
                { title: '是否为管理员', dataIndex: 'flag_admin' },
                { title: '最近登录', dataIndex: ['account', 'last_login_time'], key: 'time' },
                { title: '创建时间', dataIndex: 'create_time', key: 'time' },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, },
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        handleDelete(id){
            Core.Api.User.delete({
                id: id,
            }).then(res => {
                console.log("delete -> res", res)
            }).catch(err => {
                console.log('delete -> err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':  // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/user/user-edit",
                        query: { id: item.id }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':  // 详情
                    routeUrl = this.$router.resolve({
                        path: "/user/user-detail",
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
            Core.Api.User.list({
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
    }
};
</script>

<style lang="less" scoped>
#UserList {
    .status-tag {
        width: 50px;
        height: 22px;
        line-height: 22px;
        border-radius: 12px;
        font-size: @fz_sm;
        text-align: center;
    }
}
</style>