<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('crm_c.summary_information') }}</div>
        </div>
        <div class="panel-content">
            <a-descriptions :title="$t('n.information')" bordered :column="2" size="small" class="pannel">
                <a-descriptions-item :label="$t('n.name')" class="label">{{ detail.name }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.level')" class="label">{{
                    $Util.CRMCustomerLevelFilter(detail.level, $i18n.locale)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_t.intent')" class="label">{{
                    $Util.CRMTrackRecordIntentFilter(
                        detail.purchase_intent,
                        lang,
                        Core.Const.CRM_TRACK_RECORD.DEGREE_INTENT,
                    )
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.test_drive_intent')" class="label">{{
                    $Util.CRMCustomerTestDriveIntentFilter(detail.test_drive_intent, $i18n.locale)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('n.source')" class="label">{{
                    $i18n.locale === 'zh' ? detail.source : detail.source_en
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.industry')" class="label">{{
                    $Util.CRMCustomerIndustryFilter(detail.industry, $i18n.locale)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.source_type')" class="label">{{
                    $Util.CRMCustomerSourceTypeFilter(detail.source_type, $i18n.locale)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.remark')" class="label">{{ detail.remark }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions
                :title="$t('crm_c.client_information')"
                bordered
                :column="2"
                size="small"
                class="pannel"
                v-if="detail.type === Core.Const.CRM_CUSTOMER.TYPE.INDIVIDUAL"
            >
                <a-descriptions-item :label="$t('crm_c.gender')" class="label">{{
                    $Util.CRMCustomerGenderFilter(detail.gender, $i18n.locale)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.birthday')" class="label">{{
                    detail.birthday
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.hobby')" class="label">{{ detail.hobby }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.marital_status')" class="label">{{
                    $Util.CRMCustomerMaritalStatusFilter(detail.marital_status, $i18n.locale)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.income')" class="label">{{ detail.income }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.nationality')" class="label">{{
                    detail.country
                }}</a-descriptions-item>
            </a-descriptions>

            <a-descriptions
                :title="$t('n.client_information')"
                bordered
                :column="2"
                size="small"
                class="pannel"
                v-if="detail.type === Core.Const.CRM_CUSTOMER.TYPE.UNIT"
            >
                <a-descriptions-item :label="$t('crm_c.company_size')" class="label">{{
                    $Util.CRMCompanySizeMapMapFilter(detail.company_size)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.company_license_id')" class="label">{{
                    detail.company_license_id
                }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions :title="$t('crm_d.user_portrait')" bordered :column="2" size="small" class="pannel">
                <a-descriptions-item :label="$t('crm_c_p.buy_type')" class="label">{{
                    $Util.CRMTestDriveBuyTypeMapFilter(customerPortrait.buy_type)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.rental_demand')" class="label">{{
                    $Util.CRMTestDriveRentalDemandMapFilter(customerPortrait.rental_demand)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.city')" class="label">{{
                    customerPortrait.city
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.travel_range')" class="label">{{
                    $Util.CRMTestDriveTravelRangeMapFilter(customerPortrait.travel_range)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.other_brand_model')" class="label">{{
                    customerPortrait.other_brand_model
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.park_and_charging_pile')" class="label">{{
                    customerPortrait.park_and_charging_pile
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.family_member')" class="label">{{
                    customerPortrait.family_member
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.green_car_owner')" class="label">{{
                    $Util.CRMTestDriveGreenCarOwnerMapFilter(customerPortrait.green_car_owner)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.driver_license')" class="label">{{
                    $Util.CRMTestDriveDriverLicenseMapFilter(customerPortrait.driver_license)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.ride_exp')" class="label">{{
                    $Util.CRMTestDriveRideExpMapFilter(customerPortrait.ride_exp)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.moto_exp')" class="label">{{
                    $Util.CRMTestDriveMotoExpMapFilter(customerPortrait.moto_exp)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.moto_tour_intention')" class="label">{{
                    $Util.CRMTestDriveMotoTourIntentionMapFilter(customerPortrait.moto_tour_intention)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.pay_attention_to')" class="label">{{
                    $Util.CRMTestDrivePayAttentionToMapFilter(customerPortrait.pay_attention_to)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.green_energy_understand')" class="label">{{
                    $Util.CRMTestDriveGreenEnergyUnderstandMapFilter(customerPortrait.green_energy_understand)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.electric_two_wheeler_understand')" class="label">{{
                    $Util.CRMTestDriveElectricTwoWheelerUnderstandMapFilter(
                        customerPortrait.electric_two_wheeler_understand,
                    )
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.pre_order_car_type')" class="label">{{
                    $Util.CRMPreOrderCarTypeMapFilter(customerPortrait.pre_order_car_type)
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.pre_order_city')" class="label">{{
                    customerPortrait.pre_order_city
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c_p.pre_order_time')" class="label">{{
                    $Util.timeFilter(customerPortrait.pre_order_time)
                }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions :title="$t('crm_c.business_information')" bordered :column="2" size="small" class="pannel">
                <a-descriptions-item :label="$t('crm_c.order_success_count')" class="label">{{
                    detail.order_count
                }}</a-descriptions-item>
                <a-descriptions-item :label="$t('crm_c.order_success_price')" class="label">{{
                    detail.order_price
                }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions :title="$t('crm_c.data_access')" bordered :column="2" size="small" class="pannel">
                <a-descriptions-item :label="$t('crm_c.create_user')" class="label">{{
                    detail.create_user != null ? detail.create_user.name : '-'
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
            Core,
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
            customerPortrait: {},
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
            if (this.$auth('user.set-admin')) {
                // 维修工不显示管理员
                columns.splice(5, 0, { title: this.$t('e.administrator'), dataIndex: 'flag_admin' });
            }
            return columns;
        },
    },
    mounted() {
        this.getTableData();
        this.getCustomerPortraitDetail();
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
        getCustomerPortraitDetail() {
            this.loading = true;
            Core.Api.CRMCustomerPortrait.detailCustomerId({
                customer_id: this.detail.id,
            })
                .then(res => {
                    console.log('getCustomerDetail res', res);
                    this.customerPortrait = res.detail;
                })
                .catch(err => {
                    console.log('getCustomerDetail err', err);
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
<style lang="less">
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
