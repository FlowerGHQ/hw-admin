<template>
    <div class="ReceiverAddressList gray-panel no-margin">
        <div class="panel-title">
            <div class="title">收货地址</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
               <ReceiverAddress btnType="primary" :ghost="true" v-if="!$auth('ADMIN')"><i class="icon i_add"/>新增收货地址</ReceiverAddress>
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'address'">
                            {{$Util.addressFilter(record)}}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <ReceiverAddress :detail="record" :orgId = "orgId" :orgType = "orgType" :btnText="'修改收货地址'" btnType="link"><i class="icon i_edit"/>编辑</ReceiverAddress>
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
import Core from '../../core';
import ReceiverAddress from '@/components/popup-btn/ReceiverAddress.vue';
const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'ReceiverAddressList',
    components: { ReceiverAddress, },
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
        type: {
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
            detail: {},
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: '姓名', dataIndex: 'name', key: 'item'},
                {title: '联系电话', dataIndex: 'phone',key: 'item'},
                {title: '国家', dataIndex: 'country',key: 'item'},
                {title: '地址', dataIndex: 'address', key: 'address'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        pageChange(curr) {    // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {    // 页码尺寸改变
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.ReceiveAddress.list({
                org_id: this.orgId,
                org_type: this.orgType,
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
                title: '确定要删除该收货地址吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.ReceiveAddress.delete({id}).then(() => {
                        _this.$message.success('删除成功');
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
    }
};
</script>

<style lang="less" scoped>
//.ReceiverAddressList {}
</style>