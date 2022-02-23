<template>
    <div id="FaultList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">故障列表</div>
                <div class="btns-area">
                    <a-button type="primary" @click="handleFaultShow()"><i class="icon i_add"/>新增故障
                    </a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text , record}">
                        <template v-if="column.dataIndex === 'name'">
                            <a-tooltip placement="top" :title='text'>
                                <a-button type="link">{{ text }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="handleDelete(record.id)"><i class="icon i_delete"/> 删除
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
        <template class="modal-container">
            <a-modal v-model:visible="faultShow" title="新增故障" class="fault-modal"
                     :after-close='handleFaultClose'>
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">原因:</div>
                        <div class="value">
                            <a-input v-model:value="editForm.name" placeholder="请输入故障名称"/>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="faultShow = false">取消</a-button>
                    <a-button @click="handleFaultSubmit" type="primary">确定</a-button>
                </template>
            </a-modal>
        </template>
    </div>
</template>
<script>
import Core from '../../core';

export default {
    name: 'FaultList',
    components: {},
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.B_TO_B,
            create_time: [],
            form: {
                id: '',
            },

            tableColumns: [
                {title: '名称', dataIndex: 'name'},
                {title: '创建时间', dataIndex: 'create_time', key: 'time'},
                {title: '操作', key: 'operation', fixed: 'right'},
            ],
            tableData: [],
            faultShow: false,
            editForm: {
                id: '',
                name: '',
            },
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
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
        handleSearch() {    // 搜索
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            console.log('this.searchForm:', this.searchForm)
            this.create_time = []
            this.pageChange(1);
        },
        handleFaultShow(id) { // 显示弹框
            this.faultShow = true
            this.editForm.id = id
        },
        handleFaultClose() { // 关闭弹框
            this.faultShow = false;
            this.editForm = {
                id: '',
                name: '',
            }
        },
        handleFaultSubmit() { // 审核提交
            this.loading = true;
            Core.Api.Fault.save({
                ...this.editForm
            }).then(res => {
                this.$message.success('添加成功')
                this.handleFaultClose()
                this.getTableData()
            }).catch(err => {
                console.log('handleTransferAuditSubmit err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            this.loading = false;
            // return
            Core.Api.Fault.list({
                ...this.form,
                begin_time: this.create_time[0] || '',
                end_time: this.create_time[1] || '',
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
                title: '确定要删除该区域吗？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    Core.Api.Fault.delete({id}).then(() => {
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
// #FaultList {}
</style>
