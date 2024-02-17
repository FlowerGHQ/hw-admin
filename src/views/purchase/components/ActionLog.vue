<template>
    <div class="panel-content">
        <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: true }"
            :row-key="record => record.id"
            :loading="loading"
            :pagination="channelPagination"
            @change="handleTableChange"
        >
            <template #headerCell="{ title }">
                {{ $t(title) }}
            </template>
            <template #bodyCell="{ record, column, text }">
                <template v-if="column.dataIndex === 'type'">
                    {{ $Util.actionLogTypeFilter(text, $i18n.locale) }}
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
                <template v-if="column.key === 'content'">
                    <template v-if="record.source_type === Core.Const.ACTION_LOG.SOURCE_TYPE.PURCHASE_ORDER">
                        <a-button type="link" @click="getContent(record.id)"> 查看详情 </a-button>
                    </template>
                    <template v-else>
                        {{ text || '-' }}
                    </template>
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
    </div>
    <a-modal v-model:visible="visible" title="详情" class="field-select-modal" :width="630" :after-close="handleClose">
        <a-table
            :columns="contentColumns"
            :data-source="contentList"
            :scroll="{ x: true }"
            :row-key="record => record.id"
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'item'">
                    {{ text || '-' }}
                </template>
            </template>
        </a-table>
        <template #footer>
            <a-button @click="handleClose">{{ $t('def.cancel') }}</a-button>
        </template>
    </a-modal>
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
            visible: false,
            contentList: [],

            tableData: [],
            tableColumns: [
                { title: 'n.operation', dataIndex: 'type' },
                { title: 'n.operator', dataIndex: ['user', 'account', 'name'], key: 'item' },
                { title: 'n.organization', dataIndex: 'user', key: 'org' },
                { title: 'n.content', dataIndex: 'content', key: 'content' },
                { title: 'd.create_time', dataIndex: 'create_time', key: 'time' },
                { title: 'r.remark', dataIndex: 'remark', key: 'tip_item' },
            ],
            contentColumns: [
                { title: '商品名称', dataIndex: ['item', 'name'], key: 'detail' },
                { title: '商品编码', dataIndex: ['item', 'code'], key: 'detail' },
                { title: '数量', dataIndex: 'amount' },
            ],
            channelPagination: {
                current: 1,
                pageSizeOptions: ['20', '40', '60', '80', '100'],
                pageSize: 20,
                showQuickJumper: true, // 是否可以快速跳转至某页
                showSizeChanger: true, // 是否可以改变 pageSize
                total: 0,
                showTotal: total => `${this.$t('n.all_total')} ${total} ${this.$t('in.total')}`,
            }, // 分页数据
        };
    },
    watch: {},
    computed: {},
    mounted() {
        this.getTableData();
    },
    methods: {
        getTableData(params = {}) {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.ActionLog.list({
                source_id: this.id,
                source_type: this.sourceType,
                page: this.channelPagination.current,
                page_size: this.channelPagination.pageSize,
                ...params,
            })
                .then(res => {
                    // console.log("ActionLog res", res)
                    this.channelPagination.total = res.count;
                    this.tableData = res.list;
                })
                .catch(err => {
                    console.log('ActionLog err', err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getContent(id) {
            Core.Api.ActionLog.content({
                id: id,
            }).then(res => {
                this.contentList = res.list;
            });
            this.visible = true;
        },
        handleClose() {
            this.contentList = [];
            this.visible = false;
        },
        // 分页事件
        handleTableChange(pagination, filters, sorter) {
            const pager = { ...this.channelPagination };
            pager.current = pagination.current;
            if (pagination.pageSize !== this.channelPagination.pageSize) {
                pager.current = 1;
                pager.pageSize = pagination.pageSize;
            }
            this.channelPagination = pager;
            this.getTableData({
                page_size: this.channelPagination.pageSize,
                page: this.channelPagination.current,
            });
        },
    },
};
</script>

<style lang="less" scoped>
// #ActionLog {}
</style>
