<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_s.business_opportunities_phase') }}</div>
                <div class="btns-area">
                    <a-button type="primary" @click="addBoStatusGroup" ><i class="icon i_add"/>{{ $t('crm_b.save') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' @change="getTableDataSorter">
                    <template #headerCell="{title}">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text , record }">
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button type="link" @click="routerChange('detail',record)" ><i class="icon i_detail"/>{{ $t('def.detail') }}</a-button>
                            <a-button type="link" @click="routerChange('edit',record)" ><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>
                            <a-button type="link" @click="handleDelete(record.id)" class="danger" ><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <a-modal :title="$t('ad.add')" v-model:visible="modalShow" :after-close='handleClose' :maskClosable="false" class="receiver-address-edit-modal">
                <div class="modal-content">
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_s.sales_stage') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                    <div class="form-item required">
                        <div class="key">{{ $t('crm_s.phase_type') }}:</div>
                        <div class="value">
                            <a-input v-model:value="form.status" :placeholder="$t('def.input')"/>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <a-button @click="handleClose">{{ $t('def.cancel') }}</a-button>
                    <a-button @click="handleConfirm" type="primary">{{ $t('def.sure') }}</a-button>
                </template>
            </a-modal>

        </div>
    </div>
</template>

<script>
import Core from '../../core';
import TimeSearch from '../../components/common/TimeSearch.vue'

export default {
    name: 'CustomerList',
    components: {
        TimeSearch
    },
    props: {},
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            modalShow: false,
            // 搜索
            searchForm: {
                name: '',
                phone:'',
                begin_time: '',
                end_time: '',
                type: '',
            },
            form:{
                name: '',
                status: '',
            },
            // 表格
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: 'crm_s.sales_stage', dataIndex: 'name', key:'name'},
                {title: 'crm_s.phase_type', dataIndex: 'status', key:'status'},
                {title: 'def.operate', key: 'operation', fixed: 'right'},
            ]
            return columns
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
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
        handleOtherSearch(params) { // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key]
            }
            this.pageChange(1);
        },
        handleSearchReset() {    // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            this.orderByFields = {}
            this.pageChange(1);
        },
        getTableData() {    // 获取 表格 数据
            this.loading = true;
            Core.Api.CRMBo.list({
                ...this.searchForm,
                order_by_fields: this.orderByFields,
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
        getTableDataSorter( paginate, sort, filter){
            this.orderByFields = {}
            switch (filter.order){
                case "ascend":
                    this.orderByFields[filter.field] =  0
            }
            switch (filter.order){
                case "descend":
                    this.orderByFields[filter.field] =  1
            }
            this.getTableData()
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: this.$t('pop_up.sure_delete'),
                okText: this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMBo.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success')),
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete err", err);
                    })
                },
            });
        },
        addBoStatusGroup(){
            this.modalShow = true
        },
        handleClose() {
            Object.assign(this.form, this.$options.data().form)
            this.modalShow = false
        },
        handleConfirm() {
            let form = Core.Util.deepCopy(this.form)
            this.tableData.push(form)
            this.handleClose()
        },
    }
};
</script>

<style lang="less" scoped>
// #CustomerList {}
</style>
