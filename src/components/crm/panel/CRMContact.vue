<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('crm_t.contact_customer') }}</div>
            <slot></slot>
        </div>
        <div class="panel-content">
            <div>
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :loading="loading"
                    :pagination="false"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ record, column, text }">
                        <template v-if="column.key === 'status'">
                            <template
                                v-if="record.target_type === Core.Const.AUDIT_RECORD.TARGET_TYPE.QUALITY_FEEDBACK"
                            >
                                {{ $Util.feedbackStatusFilter(text, $i18n.locale) }}
                            </template>
                        </template>
                        <template v-if="column.key === 'operation'">
                            <template v-if="$auth('ADMIN')">
                                <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="flagOWN">
                                    <i class="icon i_delete" />
                                    {{ $t('def.delete') }}
                                </a-button>
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
                        :show-total="total => $t('n.all_total') + ` ${total} ` + $t('in.total')"
                        :hide-on-single-page="false"
                        :pageSizeOptions="['10', '20', '30', '40']"
                        @change="pageChange"
                        @showSizeChange="pageSizeChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail: {
            type: Object,
        },
        targetId: {
            type: Number,
            default: 0,
        },
        targetType: {
            type: Number,
            default: 0,
        },
        flagOWN: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            Core,
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
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('crm_c.name'), dataIndex: ['contact', 'name'], key: 'item' },
                { title: this.$t('crm_c.phone'), dataIndex: ['contact', 'phone'], key: 'time' },
                { title: this.$t('def.operate'), key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        if (this.targetId !== 0) {
            this.getTableData();
        }
    },
    methods: {
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
            console.log('targetId', this.targetId);
            this.loading = true;
            Core.Api.CrmContactBind.list({
                target_id: this.targetId,
                target_type: this.targetType,
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
                    Core.Api.CrmContactBind.delete({ id })
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
    },
};
</script>

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
