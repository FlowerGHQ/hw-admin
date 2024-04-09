<template>
    <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
        <template #expandIcon><i class="icon i_expan_l" /> </template>
        <a-collapse-panel key="ActionLog" :header="$t('fe.feedback_list')" class="gray-collapse-panel">
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
                        <template v-if="column.dataIndex === 'uid'">
                            <a-tooltip placement="top" :title="text">
                                <a-button type="link" @click="routerChange('detail', record)">{{
                                    text || '-'
                                }}</a-button>
                            </a-tooltip>
                        </template>
                        <template v-if="column.dataIndex === 'status'">
                            {{ $Util.feedbackStatusFilter(text, $i18n.locale) }}
                        </template>

                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
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
import Core from '../../../core';
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
        sourceType: {
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
            contentList: [],

            tableData: [],
            tableColumns: [
                { title: 'fe.feedback_uid', dataIndex: 'uid' },
                { title: 'fe.feedback_title', dataIndex: 'title' },
                { title: 'fe.feedback_desc', dataIndex: 'desc' },
                { title: 'fe.status', dataIndex: 'status' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
            ],
            contentColumns: [
                { title: '商品名称', dataIndex: ['item', 'name'], key: 'detail' },
                { title: '商品编码', dataIndex: ['item', 'code'], key: 'detail' },
                { title: '数量', dataIndex: 'amount' },
            ],
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        routerChange(type, item = {}) {
            console.log(item);
            let routeUrl = '';
            switch (type) {
                case 'detail': // 详情
                    routeUrl = this.$router.resolve({
                        path: '/feedback/feedback-detail',
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
            Core.Api.Feedback.list({
                source_id: this.id,
                source_type: this.sourceType,
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
