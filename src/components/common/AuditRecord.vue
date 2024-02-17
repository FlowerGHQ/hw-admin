<template>
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l" /> </template>
        <a-collapse-panel key="ActionLog" :header="$t('n.audit_records')" class="gray-collapse-panel">
            <div class="panel-content">
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
                        <template v-if="column.key === 'org'">
                            {{
                                $Util.userTypeFilter(text.org_type, $i18n.locale) +
                                (text.org_name === '' ? '' : '·') +
                                text.org_name
                            }}
                        </template>
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'tip_item'">
                            <a-tooltip placement="top" :title="text">
                                <div class="ell" style="max-width: 160px">{{ text || '-' }}</div>
                            </a-tooltip>
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
                <div class="paging-container afe">
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
        </a-collapse-panel>
    </a-collapse>
</template>

<script>
import Core from '../../core';

export default {
    name: 'ActionLog',
    components: {},
    props: {
        id: {
            type: Number,
        },
        detail: {
            type: Object,
        },
        targetType: {
            type: Number,
        },
    },
    data() {
        return {
            Core,
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            activeKey: 'ActionLog',
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            visible: false,

            tableData: [],
            tableColumns: [
                { title: 'audit.old_status', dataIndex: 'old_status', key: 'status' },
                { title: 'audit.new_status', dataIndex: 'status', key: 'status' },
                { title: 'n.operator', dataIndex: ['user', 'account', 'name'], key: 'item' },
                { title: 'n.organization', dataIndex: 'user', key: 'org' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'audit.remark', dataIndex: 'remark', key: 'tip_item' },
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
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
            Core.Api.AuditRecord.list({
                target_id: this.id,
                target_type: this.targetType,
                page: this.currPage,
                page_size: this.pageSize,
            })
                .then(res => {
                    console.log('ActionLog res', res);
                    this.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('ActionLog err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less" scoped>
// #ActionLog {}
</style>
