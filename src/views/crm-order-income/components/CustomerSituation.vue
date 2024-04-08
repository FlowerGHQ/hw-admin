<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('crm_c.summary_information') }}</div>
        </div>
        <div class="panel-content">
            <a-descriptions :title="$t('crm_c.information')" bordered :column="2" size="small" class="pannel">
                <a-descriptions-item :label="$t('crm_o.name')" class="label">{{
                    detail.order ? detail.order.name || '-' : '-'
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_oi.uid')" class="label">{{ detail.uid }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_oi.date')" class="label">{{
                    $Util.timeFilter(detail.date, 3) || '-'
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_oi.money')" class="label">{{
                    $Util.countFilter(detail.money) + '元'
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_oi.type')" class="label">{{
                    $Util.CRMOrderIncomeTypeFilter(detail.type) || '-'
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_oi.payment_type')" class="label">{{
                    $Util.CRMOrderIncomePaymentTypeFilter(detail.payment_type) || '-'
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_oi.status')" class="label">{{
                    $Util.CRMOrderIncomeStatusFilter(detail.status) || '-'
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_refund.refunded')" class="label">{{
                    $Util.countFilter(detail.refunded) + '元'
                }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions :title="$t('crm_c.data_access')" bordered :column="2" size="small" class="pannel">
                <a-descriptions-item :label="$t('crm_c.create_user')" class="label">{{
                    detail.create_user_name
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.create_time')" class="label">{{
                    $Util.timeFilter(detail.create_time) || '-'
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.update_user')" class="label">{{
                    detail.update_user_name
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.update_time')" class="label">{{
                    $Util.timeFilter(detail.update_time) || '-'
                }}</a-descriptions-item>
            </a-descriptions>
            <a-modal v-model:visible="userRoleShow" :title="$t('p.confirm_payment')" :after-close="handleRoleClose">
                <template #footer>
                    <a-button @click="handleRoleClose">{{ $t('def.cancel') }}</a-button>
                </template>
            </a-modal>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';
const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail: {
            type: Object,
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
            userRoleShow: false,

            userId: '',
            userDetail: '',
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('e.name'), dataIndex: ['account', 'name'], key: 'item' },
                { title: this.$t('e.account'), dataIndex: ['account', 'username'], key: 'item' },
                { title: this.$t('n.phone'), dataIndex: ['account', 'phone'] },
                { title: this.$t('n.email'), dataIndex: ['account', 'email'] },
                { title: this.$t('n.type'), dataIndex: 'type' },
                { title: this.$t('e.login_time'), dataIndex: ['account', 'last_login_time'], key: 'time' },
                { title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            if (this.$auth('sys.sys.user.set-admin')) {
                // 维修工不显示管理员
                columns.splice(5, 0, { title: this.$t('e.administrator'), dataIndex: 'flag_admin' });
            }
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        handleManagerChange(record) {
            this.loading = true;
            Core.Api.User.setAdmin({
                id: record.id,
                flag_admin: record.flag_admin ? 0 : 1,
            })
                .then(() => {
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleManagerChange err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'edit': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/system/user-edit',
                        query: {
                            id: item.id,
                            org_id: this.orgId,
                            org_type: this.orgType,
                            type: this.type,
                        },
                    });
                    window.open(routeUrl.href, '_self');
                    break;
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/system/user-detail',
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
            Core.Api.User.list({
                org_id: this.orgId,
                org_type: this.orgType,
                type: this.type,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('getTableData res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('getTableData err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.User.delete({ id })
                        .then(() => {
                            _this.$message.success(_this.$t('pop_up.delete_success'));
                            _this.getTableData();
                        })
                        .catch(err => {
                            console.log('handleDelete -> err', err);
                        });
                },
            });
        },
        handleUserRole(item) {
            console.log(item);
            this.userId = item.id;
            this.userDetail = item;
            this.userRoleShow = true;
        },
        handleRoleClose() {
            this.userId = '';
            this.userDetail = '';
            this.userRoleShow = false;
        },
    },
};
</script>

<style lang="less">
.panel-content {
    .pannel {
        margin-bottom: 40px;
    }
    .label {
        width: 10%;
    }
}
</style>
<style lang="less" scoped>
.InformationInfo {
    .table-container {
        margin-top: -10px;
    }
}
.ant-descriptions-view {
    th.ant-descriptions-item-label {
        width: 25%;
    }
    td.ant-descriptions-item-content {
        width: 25%;
    }
}
</style>
