<template>
    <div id="CustomerList" class="UserRole gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'detail'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'phone'">
                            <div v-if="text !== ''" class="phone-hover">
                                {{ record.phone_country_code }} {{ text || '-' }}
                                <a-button
                                    type="link"
                                    v-if="!record.flag_eyes"
                                    class="switch"
                                    @click="handleChecking(record)"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </div>
                            <template v-else>
                                {{ text || '-' }}
                            </template>
                        </template>
                        <template v-if="column.key === 'email'">
                            <div v-if="text !== ''" class="phone-hover">
                                {{ text || '-' }}
                                <a-button
                                    type="link"
                                    v-if="!record.flag_eyes"
                                    class="switch"
                                    @click="handleChecking(record)"
                                    ><i class="icon i_eyes"
                                /></a-button>
                            </div>
                            <template v-else>
                                {{ text || '-' }}
                            </template>
                        </template>
                        <template v-if="column.key === 'type'">
                            {{ $Util.CRMCustomerTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'level'">
                            {{ $Util.CRMCustomerLevelFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'address'">
                            {{ $Util.addressFilter(record, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'creator_name'">
                            {{ record.create_user ? record.create_user.name || '-' : '-' }}
                        </template>
                        <template v-if="column.key === 'own_user_name'">
                            {{ record.own_user ? record.own_user.name || '-' : '-' }}
                        </template>

                        <template v-if="column.key === 'source_type'">
                            {{ $Util.CRMCustomerSourceTypeFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.dataIndex === 'label_list'">
                            <a-tag v-for="item in record.label_list" color="blue" class="customer-tag">{{
                                lang === 'zh' ? item.label : item.label_en
                            }}</a-tag>
                        </template>

                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <a-button
                                type="link"
                                @click="routerChange('detail', record)"
                                v-if="$auth('crm-customer.detail')"
                                ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                            >
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container with-operate">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
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
    name: 'CustomerList',
    components: {},
    props: {
        userId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {};
            },
        },
        type: {
            type: String,
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            CRM_STATUS: Core.Const.CRM_CUSTOMER.STATUS,
            SEARCH_TYPE: Core.Const.CRM_CUSTOMER.SEARCH_TYPE,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 表格
            tableData: [],
            // 弹框
            roleShow: false,
            roleList: [],
            form: {
                role_id: '',
                user_id: '',
            },
            // 搜索
            searchForm: {
                name: undefined,
                phone: undefined,
                level: undefined,
                begin_time: undefined,
                end_time: undefined,
                type: undefined,
                status: undefined,
                search_type: undefined,
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'name', key: 'detail', sorter: true },
                { title: 'n.phone', dataIndex: 'phone', key: 'phone', sorter: true },
                { title: 'n.email', dataIndex: 'email', key: 'email', sorter: true },
                { title: 'sl.label', dataIndex: 'label_list', key: 'label_list' },

                // {title: 'n.continent', dataIndex: 'continent', key:'item'},
                { title: 'crm_c.level', dataIndex: 'level', key: 'level', sorter: true },
                { title: 'crm_c.type', dataIndex: 'type', key: 'type', sorter: true },
                { title: 'r.creator_name', dataIndex: 'create_user_id', key: 'creator_name', sorter: true },
                { title: 'crm_c.group', dataIndex: 'group_name', key: 'group_name' },
                { title: 'crm_c.order_success_count', dataIndex: 'order_count', key: 'order_count' },
                { title: 'ad.specific_address', dataIndex: 'address', sorter: true },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time', sorter: true },
                { title: 'crm_c.source_type', dataIndex: 'source_type', key: 'source_type', sorter: true },
                { title: 'd.update_time', dataIndex: 'update_time', key: 'time', sorter: true },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            if (this.operMode === 'private' || this.operMode === 'region') {
                columns.splice(5, 0, {
                    title: 'crm_b.own_user_name',
                    dataIndex: 'own_user_id',
                    key: 'own_user_name',
                    sorter: true,
                });
            }
            return columns;
        },
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
                case 'detail': // 编辑
                    routeUrl = this.$router.resolve({
                        path: '/crm-customer/customer-detail',
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
        getTableData() {
            // 获取 表格 数据
            this.loading = true;

            this.searchForm.status = this.CRM_STATUS.CUSTOMER;
            this.searchForm.search_type = this.SEARCH_TYPE.PRIVATE_CUSTOMER_BY_OTHER_USER;

            Core.Api.CRMCustomer.list({
                ...this.searchForm,
                user_id: this.userId,
                order_by_fields: this.orderByFields,
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
                });
        },
        getRoleList() {
            console.log(this.detail);
            Core.Api.Authority.roleList({
                org_id: this.detail.org_id,
                org_type: this.detail.org_type,
            }).then(res => {
                res.list.forEach(role => {
                    this.tableData.forEach(it => {
                        if (role.id == it.role_id) {
                            role.disabled = true;
                        }
                    });
                });
                this.roleList = res.list;
            });
        },
        handleRoleShow() {
            this.roleShow = true;
            this.getRoleList();
            /*if (item) {
                this.form.resource_type = item.resource_type
                this.form.resource_id = item.resource_id
            }*/
        },
        handleRoleClose() {
            this.roleShow = false;
            Object.assign(this.form, this.$options.data().form);
        },
        handleRoleSubmit() {
            let form = Core.Util.deepCopy(this.form);
            form.user_id = this.detail.id;
            if (!form.role_id) {
                return this.$message.warning(this.$t('u.choose_role'));
            }

            Core.Api.Authority.allotRole(form)
                .then(() => {
                    this.$message.success(this.$t('pop_up.save_success'));
                    this.handleRoleClose();
                    this.getTableData();
                })
                .catch(err => {
                    console.log('handleStockAddSubmit err:', err);
                });
        },
        handleDelete(item) {
            let _this = this;
            this.$confirm({
                title: _this.$t('u.sure_delete_role'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.Authority.deleteUserRole({
                        id: item.id,
                    })
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
        handleChecking(item) {
            Core.Api.CRMCustomer.checking({
                id: item.id,
            }).then(res => {
                item.phone = res.detail.phone;
                item.email = res.detail.email;
                item.flag_eyes = true;
                console.log(res);
            });
        },
    },
};
</script>
<style lang="less"></style>
