<template>
<div class="InformationInfo gray-panel no-margin">
    <div class="panel-title">
        <div class="title">{{ $t('n.information') }}</div>
    </div>
    <div class="panel-content">
        <div>
            <a-button @click="trackMemberShow = true">新建联系人</a-button>
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                     :row-key="record => record.id" :loading='loading' :pagination='false'>
                <template #headerCell="{title}">
                    {{ $t(title) }}
                </template>
                <template #bodyCell="{record, column, text }">
                    <template v-if="column.key === 'status'">
                        <template v-if="record.target_type === Core.Const.AUDIT_RECORD.TARGET_TYPE.QUALITY_FEEDBACK ">
                            {{ $Util.feedbackStatusFilter(text, $i18n.locale) }}
                        </template>
                    </template>
                </template>
            </a-table>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size="pageSize"
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="(total) => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="pageChange"
                    @showSizeChange="pageSizeChange"
                />
            </div>
        </div>

        <a-modal v-model:visible="trackMemberShow" :title="$t('p.confirm_payment')" :after-close='handleRoleClose'>
            <div class="form-item required">
                <div class="key">{{ $t('n.name') }}：</div>
                <div class="value">
                    <a-input v-model:value="form.name" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item required">
                <div class="key">{{ $t('n.phone') }}：</div>
                <div class="value">
                    <a-input v-model:value="form.phone" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item" >
                <div class="key">{{ $t('crm_c.gender') }}：</div>
                <div class="value">
                    <a-radio-group v-model:value="form.gender">
                        <a-radio v-for="item in CRM_GENDER_MAP" :value="item.value">
                            {{lang === 'zh' ? item.zh: item.en}}
                        </a-radio>
                    </a-radio-group>
                </div>
            </div>
            <div class="form-item">
                <div class="key">{{ $t('crm_c.birthday') }}：</div>
                <div class="value">
                    <a-date-picker v-model:value="form.birthday" valueFormat='YYYY-MM-DD' :placeholder="$t('def.input')"/>
                    <!--                        <a-input v-model:value="form.birthday" :placeholder="$t('def.input')"/>-->
                </div>
            </div>

            <div class="form-item">
                <div class="key">{{ $t('crm_c.industry') }}:</div>
                <div class="value">
                    <a-select v-model:value="form.industry" :placeholder="$t('def.input')" >
                        <a-select-option v-for="item of CRM_INDUSTRY_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item" >
                <div class="key">{{ $t('crm_c.nationality') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.nationality" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item" >
                <div class="key">{{ $t('crm_c.hobby') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.hobby" :placeholder="$t('def.input')"/>
                </div>
            </div>
            <div class="form-item" >
                <div class="key">{{ $t('crm_c.marital_status') }}:</div>
                <div class="value">
                    <a-select v-model:value="form.marital_status" :placeholder="$t('def.input')" >
                        <a-select-option v-for="item of CRM_MARITAL_STATUS_MAP" :key="item.value" :value="item.value">{{lang === 'zh' ? item.zh: item.en}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="form-item" >
                <div class="key">{{ $t('crm_c.income') }}:</div>
                <div class="value">
                    <a-input v-model:value="form.income" :placeholder="$t('def.input')"/>
                </div>
            </div>

            <div class="form-item textarea">
                <div class="key">{{ $t('r.remark') }}</div>
                <div class="value">
                    <a-textarea v-model:value="form.remark" :placeholder="$t('r.enter_remark')"
                                :auto-size="{ minRows: 2, maxRows: 6 }" :maxlength='500'/>
                    <span class="content-length">{{ form.remark }}/500</span>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleRoleClose">{{ $t('def.cancel') }}</a-button>
            </template>
        </a-modal>
    </div>
</div>
</template>

<script>
import Core from '../../../core';
const USER_TYPE = Core.Const.USER.TYPE

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail:{
            type: Object,
        }

    },
    data() {
        return {
            CRM_TYPE_MAP: Core.Const.CRM_CUSTOMER.TYPE_MAP,
            CRM_LEVEL_MAP: Core.Const.CRM_CUSTOMER.LEVEL_MAP,
            CRM_SOURCE_MAP: Core.Const.CRM_CUSTOMER.SOURCE_MAP,
            CRM_INDUSTRY_MAP: Core.Const.CRM_CUSTOMER.INDUSTRY_MAP,
            CRM_GENDER_MAP: Core.Const.CRM_CUSTOMER.GENDER_MAP,
            CRM_MARITAL_STATUS_MAP: Core.Const.CRM_CUSTOMER.MARITAL_STATUS_MAP,
            CRM_TYPE: Core.Const.CRM_CUSTOMER.TYPE,
            defaultTime: Core.Const.TIME_PICKER_DEFAULT_VALUE.BEGIN,
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
            trackMemberShow: false,

            userId: '',
            userDetail: '',
            form: {
                id: '',
                type: '',
                name: '',
                phone: '',
                level: '',
                source: '',
                company_size: '',
                company_license_id:'',
                gender: '',
                birthday: '',
                industry: '',
                nationality: '',
                hobby: '',
                marital_status: '',
                income: '',
                remark: '',

                address: '',
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: this.$t('e.name'), dataIndex: ['account', 'name'], key: 'item'},
                {title: this.$t('e.account'), dataIndex: ['account', 'username'], key: 'item'},
                {title: this.$t('n.phone'), dataIndex: ['account', 'phone']},
                {title: this.$t('n.email'), dataIndex: ['account', 'email']},
                {title: this.$t('n.type'), dataIndex: 'type'},
                {title: this.$t('e.login_time'), dataIndex: ['account', 'last_login_time'], key: 'time'},
                {title: this.$t('d.create_time'), dataIndex: 'create_time', key: 'time'},
                {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ]
            return columns
        },
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        handleManagerChange(record){
            this.loading = true;
            Core.Api.User.setAdmin({
                id: record.id,
                flag_admin: record.flag_admin ? 0 : 1
            }).then(() => {
                this.getTableData();
            }).catch(err => {
                console.log('handleManagerChange err', err)
            }).finally(() => {
                this.loading = false;
            });
        },
        routerChange(type, item = {}) {
            console.log(item)
            let routeUrl = ''
            switch (type) {
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/system/user-edit",
                        query: {
                            id: item.id,
                            org_id: this.orgId,
                            org_type: this.orgType,
                            type: this.type,
                        }
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'detail':    // 详情
                    routeUrl = this.$router.resolve({
                        path: "/system/user-detail",
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
            Core.Api.CRMCustomer.list({
                target_id: this.targetId,
                target_type: this.targetType,
                user_id: this.userId,
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
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.delete({id}).then(() => {
                        _this.$message.success(_this.$t('pop_up.delete_success'));
                        _this.getTableData();
                    }).catch(err => {
                        console.log("handleDelete -> err", err);
                    })
                },
            });
        },
        handleUserRole(item) {
            console.log(item)
            this.userId = item.id;
            this.userDetail = item;
            this.userRoleShow = true;
        },
        handleRoleClose() {
            this.userId = '';
            this.userDetail = '';
            this.userRoleShow = false;
        },
    }
};
</script>

<style lang="less" scoped>
.InformationInfo {
    .table-container {
        margin-top: -10px;
    }

}
.ant-descriptions-view{
    th.ant-descriptions-item-label {
        width: 25%;
    }
    td.ant-descriptions-item-content {
        width: 25%;
    }

}
</style>
