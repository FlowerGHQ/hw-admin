<template>
    <a-select
        v-model:value="value"
        show-search
        placeholder="Select a person"
        style="width: 200px"
        :options="options"
        option-filter-prop="label"
        :filter-option="filterOption"
        @change="handleChange"
    ></a-select>
</template>
<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
    setup() {        
        const options = ref([
            { value: '1', label: 'Jack' },
            { value: '2', label: 'Lucy' },
            { value: '3', label: 'Tom' },
            { value: '4', label: 'llll' },
            { value: '5', label: 'cll' },
        ]);
        const handleChange = value => {
            console.log(`selected ${value}`);
        };
        const handleBlur = () => {
            console.log('blur');
        };
        const handleFocus = () => {
            console.log('focus');
        };
        const filterOption = (input, option) => {
            console.log("input", input);
            console.log("option", option);
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        return {                       
            filterOption,
            handleBlur,
            handleFocus,
            handleChange,
            options,
        };
    },
    watch: {
        $route: {
            deep: true,
            immediate: true,
            handler(newRoute) {
                let type = newRoute.meta ? newRoute.meta.type : '';
                this.operMode = type;
                this.handleSearchReset(false);
            },
        },
        'searchForm.distributor_id': function () {
            this.getAgentListAll();
            this.searchForm.agent_id = undefined;
            this.searchForm.store_id = undefined;
        },
        'searchForm.agent_id': function () {
            this.getStoreListAll();
            this.searchForm.store_id = undefined;
        },
    },
    computed: {
        tableColumns() {
            let { filteredInfo } = this;
            filteredInfo = filteredInfo || {};
            let columns = [
                { title: this.$t('fe.feedback_uid'), dataIndex: 'uid', key: 'detail' },
                { title: this.$t('search.vehicle_no'), dataIndex: 'entity_uid', key: 'item' },
                { title: this.$t('fe.feedback_title'), dataIndex: 'title', key: 'tip_item' },
                { title: this.$t('fe.status'), dataIndex: 'status' },
                { title: this.$t('fe.feedback_company'), dataIndex: 'feedback_name' },
                { title: this.$t('fe.feedback_user'), dataIndex: 'feedback_user_name', key: 'item' },
                { title: this.$t('fe.feedback_phone'), dataIndex: 'feedback_user_phone', key: 'item' },
                { title: this.$t('r.associated_customer'), dataIndex: 'customer_name', key: 'item' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
            ];
            return columns;
        },
        statusList() {
            let columns = [
                { zh: '全  部', en: 'All', value: '0', color: 'primary', key: '-20' },
                { zh: '待提交', en: 'Pending submission', value: '0', color: 'yellow', key: STATUS.INIT },
                {
                    zh: '等待平台售后审核',
                    en: 'Awaiting after-sales audit',
                    value: '0',
                    color: 'blue',
                    key: STATUS.WAIT_AFTER_SALES_AUDIT,
                },
                {
                    zh: '待修改',
                    en: 'Pending modification',
                    value: '0',
                    color: 'orange',
                    key: STATUS.AFTER_SALES_AUDIT_FAIL,
                },
                {
                    zh: '等待售后填写故障信息',
                    en: 'Waiting for after-sale filling',
                    value: '0',
                    color: 'orange',
                    key: STATUS.WAIT_AFTER_SALES_DESC,
                },
                {
                    zh: '等待质量反馈',
                    en: 'Waiting for quality feedback',
                    value: '0',
                    color: 'purple',
                    key: STATUS.WAIT_FEEDBACK,
                },
                {
                    zh: '反馈待修改',
                    en: 'Feedback to be modified',
                    value: '0',
                    color: 'purple',
                    key: STATUS.QUALITY_AUDIT_FAIL,
                },
                {
                    zh: '等待审核反馈',
                    en: 'Waiting for review feedback',
                    value: '0',
                    color: 'green',
                    key: STATUS.WAIT_QUALITY_AUDIT,
                },
                {
                    zh: '等待售后反馈',
                    en: 'Waiting for after-sales feedback',
                    value: '0',
                    color: 'red',
                    key: STATUS.WAIT_AFTER_FEEDBACK,
                },
                { zh: '已完成', en: 'Finished', value: '0', color: 'blue', key: STATUS.CLOSE },
                { zh: '审核失败', en: 'Audit failed', value: '0', color: 'gray', key: STATUS.AUDIT_FAIL },
                { zh: '已取消', en: 'Canceled', value: '0', color: 'gray', key: STATUS.CANCEL },
            ];
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log('routerChange item:', item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/feedback/feedback-edit',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/feedback/feedback-detail',
                        query: { id: item.id },
                    });
                    window.open(routeUrl.href, '_self');
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
        handleTableChange(page, filters, sorter) {
            // 表格搜索
            console.log('handleTableChange filters:', filters);
            this.filteredInfo = filters;
            for (const key in filters) {
                this.searchForm[key] = filters[key] ? filters[key][0] : '';
            }
            this.pageChange(1);
        },
        handleSearch() {
            // 搜索
            this.pageChange(1);
        },
        handleOtherSearch(params) {
            // 时间等组件化的搜索
            for (const key in params) {
                this.searchForm[key] = params[key];
            }
            this.pageChange(1);
        },
        handleSearchReset(flag = true) {
            // 重置搜索
            let search = Object.assign(this.searchForm, this.$options.data().searchForm);
            if (flag) {
                this.$refs.TimeSearch.handleReset();
            }
            if (this.operMode == 'audit' && this.$auth('DISTRIBUTOR')) {
                search.status = STATUS.SETTLEMENT;
            } else if (this.operMode == 'audit' && this.$auth('ADMIN')) {
                search.status = 75;
            } else if (this.operMode == 'redit') {
                search.status = STATUS.AUDIT_FAIL;
            } else if (this.operMode == 'invoice') {
                search.status = STATUS.DISTRIBUTOR_WAREHOUSE;
            } else if (this.operMode == 'fault' && this.$auth('ADMIN')) {
                search.status = STATUS.FAULT_ENTITY_AUDIT;
            } else if (this.operMode == 'fault' && this.$auth('DISTRIBUTOR')) {
                search.status = STATUS.AUDIT_SUCCESS;
            }
            if (this.$auth('ADMIN')) {
                this.getDistributorListAll();
            } else if (this.$auth('DISTRIBUTOR')) {
                this.searchForm.distributor_id = Core.Data.getOrgId();
                this.getAgentListAll();
            } else if (this.$auth('AGENT')) {
                this.getStoreListAll();
            } else if (this.$auth('STORE')) {
                this.searchForm.store_id = Core.Data.getOrgId();
            }
            this.filteredInfo = null;
            this.pageChange(1);
        },

        getDistributorListAll() {
            // 获取所有分销商
            Core.Api.Distributor.listAll().then(res => {
                this.distributorList = res.list;
            });
        },
        getAgentListAll() {
            // 通过分销商Id 获取所有零售商
            if (this.searchForm.distributor_id) {
                Core.Api.Agent.listAll({ distributor_id: this.searchForm.distributor_id }).then(res => {
                    this.agentList = res.list;
                });
            } else {
                this.agentList = [];
            }
        },
        getStoreListAll() {
            // 通过零售商Id 获取所有门店
            if (this.searchForm.agent_id) {
                Core.Api.Store.listAll({ agent_id: this.searchForm.agent_id }).then(res => {
                    this.storeList = res.list;
                });
            } else {
                this.storeList = [];
            }
        },
        getTableData() {
            // 获取 表格 数据
            console.log('this.operMode', this.operMode);
            this.loading = true;
            console.log('this.searchForm:', this.searchForm);
            Core.Api.Feedback.list({
                ...this.searchForm,
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
                    this.getStatusStat();
                });
        },
        getStatusStat() {
            // 获取 状态数量
            this.loading = true;
            Core.Api.Feedback.statusList({
                ...this.searchForm,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getStatusStat res:', res);
                    let total = 0;
                    this.statusList.forEach(statusItem => {
                        res.status_list.forEach(item => {
                            if (statusItem.key == item.status) {
                                statusItem.value = item.amount;
                            }
                        });
                    });
                    res.status_list.forEach(item => {
                        total += item.amount;
                    });
                    this.statusList[0].value = total;
                })
                .catch(err => {
                    console.log('getStatusStat err:', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        handleModalShow(id, type) {
            // 显示弹框
            this.modalShow = true;
            this.modalType = type;
            this.editForm.id = id;
            this.faultForm.id = id;
        },
        handleModalClose() {
            // 关闭弹框
            this.modalShow = false;
            Object.assign(this.editForm, this.$options.data().editForm);
            Object.assign(this.faultForm, this.$options.data().faultForm);
        },
        handleModalSubmit() {
            // 审核提交
            this.loading = true;
            Core.Api.Feedback[this.modalType](this.editForm)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleModalClose();
                    this.getTableData();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>
