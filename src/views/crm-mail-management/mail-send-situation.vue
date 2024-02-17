<template>
    <div id="CustomerList">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('crm_b.mail_title') }}</div>
            </div>
            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <a-input-group compact>
                            <a-button>{{ $t('wb.receiver') }}</a-button>
                            <a-input
                                :placeholder="$t('def.input')"
                                v-model:value="searchForm.receiver_name"
                                @keydown.enter="handleSearch"
                            />
                        </a-input-group>
                    </a-col>
                    <a-col :xs="24" :sm="24" :xl="8" :xxl="6" class="search-item">
                        <a-input-group compact>
                            <a-button>{{ $t('crm_b.send_status') }}</a-button>
                            <a-select
                                v-model:value="searchForm.send_status"
                                style="width: 148px"
                                :placeholder="$t('n.choose')"
                                @change="handleChange"
                            >
                                <a-select-option :value="-1">{{ $t('crm_b.fail') }}</a-select-option>
                                <a-select-option :value="1">{{ $t('crm_b.success') }}</a-select-option>
                            </a-select>
                        </a-input-group>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                </div>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                    @change="getTableData"
                >
                    <template #headerCell="{ title }">
                        {{ $t(title) }}
                    </template>
                    <template #bodyCell="{ column, text, record, index }">
                        <!-- <template v-if="column.key === 'xh'">
                            {{ index + (currPage - 1) * pageSize + 1 }}
                        </template> -->
                        <template v-if="column.key === 'receiver_name'">
                            <p class="ell" style="width: 200px" :title="text">{{ text || '-' }}</p>
                        </template>
                        <template v-if="column.key === 'receiver_email'">
                            {{ text }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'send_status'">
                            <span v-if="text === -1" :style="{ color: '#F53F3F' }">{{ $t('crm_b.fail') }}</span>
                            <span v-else-if="text === 1" :style="{ color: '#26AB54' }">{{ $t('crm_b.success') }}</span>
                        </template>
                        <template v-if="column.key === 'fail_reason'">
                            {{ text || '-' }}
                        </template>
                    </template>
                </a-table>
            </div>
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
</template>

<script>
import Core from '../../core';
export default {
    name: 'mailSendSituation',
    components: {},
    props: {},
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索
            searchForm: {
                receiver_name: '',
                send_status: undefined,
            },
            // 表格
            tableData: [],
            email_task_id: '',
        };
    },
    watch: {
        searchForm: {
            deep: true,
            handler(oldValue, newValue) {
                if (oldValue === newValue) {
                    this.currPage = 1;
                    this.pageSize = 20;
                }
            },
        },
    },
    computed: {
        tableColumns() {
            let columns = [
                // {title: 'n.index', dataIndex: 'xh', key:'xh'},
                { title: 'wb.receiver', dataIndex: 'receiver_name', key: 'receiver_name' },
                { title: 'crm_b.receiver_email', dataIndex: 'receiver_email', key: 'receiver_email' },
                { title: 'crm_b.send_time', dataIndex: 'create_time', key: 'time' },
                { title: 'crm_b.send_status', dataIndex: 'send_status', key: 'send_status' },
                { title: 'crm_b.fail_reason', dataIndex: 'fail_reason', key: 'fail_reason' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {
        this.email_task_id = this.$route.query?.id ? parseInt(this.$route.query?.id) : '';
        this.getTableData();
    },
    methods: {
        /* 接口 start */
        // 获取 表格 数据
        getTableData(id) {
            this.loading = true;
            Core.Api.MAIL_MANAGEMENT.memberList({
                email_task_id: this.email_task_id,
                ...this.searchForm,
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
        /* 接口 end */
        routerChange(type, item = {}) {
            let routeUrl = '';
            switch (type) {
            }
        },
        pageChange(page) {
            // 页码改变
            this.currPage = page;
            this.getTableData();
        },
        pageSizeChange(current, size) {
            // 页码尺寸改变
            this.pageSize = size;
            this.getTableData();
        },
        handleSearch() {
            // 搜索
            this.pageChange(this.currPage);
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.pageChange(1);
        },
        handleChange() {
            this.getTableData();
        },
    },
};
</script>

<style lang="less" scoped>
// #CustomerList {}
.search-text {
    margin-left: 30px;
    color: #006ef9;
    cursor: pointer;
}
.nameStyle {
    color: #9000f0;
}
.search-item {
    .ant-btn {
        border-color: #eaecf2;
        pointer-events: none;
    }
    .ant-input {
        text-align: left;
    }
}
.ell {
    .ell();
}
:deep(
        .ant-table
            .ant-table-container
            .ant-table-content
            table
            tbody.ant-table-tbody
            tr.ant-table-row
            td.ant-table-cell
    ) {
    padding: 10px 16px;
    font-size: 14px;
    color: #1d2129;
}
:deep(.ant-table .ant-table-container .ant-table-content table thead.ant-table-thead tr th.ant-table-cell) {
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #1d2129;
}
.ant-table
    .ant-table-container
    .ant-table-content
    table
    tbody.ant-table-tbody
    tr.ant-table-row
    td.ant-table-cell
    .ant-btn {
    font-size: 14px;
}
</style>
