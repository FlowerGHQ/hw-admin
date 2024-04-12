<template>
    <div class="InformationInfo gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('crm_d.list') }}</div>
            <slot></slot>
        </div>
        <div class="panel-content">
            <div>
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
                        <!--                        <template v-if="column.key === 'detail'">
                                                <a-tooltip placement="top" :title='text'>
                                                    <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                                                </a-tooltip>
                                            </template>-->
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'phone'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'status'">
                            {{ $Util.CRMTestDriveStatusMapFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'channel'">
                            {{ $Util.CRMTestDriveChannelMapFilter(text, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'creator_name'">
                            {{ record.create_user_name || '-' }}
                        </template>
                        <template v-if="column.key === 'customer'">
                            {{ record.customer ? record.customer.name || '-' : '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'operation'">
                            <!-- <a-button type="link" @click="routerChange('edit',record)"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>-->
                            <!-- <a-button type="link" @click="handleDelete(record.id)" class="danger"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>-->
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
import dayjs from 'dayjs';

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail: {
            type: Object,
        },
        customerId: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            loginType: Core.Data.getLoginType(),
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 10,
            total: 0,
            // 表格数据
            tableData: [],
            trackMemberShow: false,

            userId: '',
            userDetail: '',
            groupStatusTableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'customer_id', key: 'customer', sorter: true },
                { title: 'n.phone', dataIndex: ['customer', 'phone'], key: 'phone' },
                { title: 'crm_d.test_drive_time', dataIndex: 'test_drive_time', key: 'time' },
                { title: 'crm_d.crm_dict_id', dataIndex: ['crm_dict', 'name'], key: 'item' },
                { title: 'crm_d.channel', dataIndex: 'channel', key: 'channel', sorter: true },
                { title: 'crm_d.status', dataIndex: 'status', key: 'status', sorter: true },
                { title: 'r.creator_name', dataIndex: 'create_user_id', key: 'creator_name', sorter: true },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
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
            if (this.customerId === 0) {
                return;
            }
            Core.Api.CRMTestDriveOrder.list({
                customer_id: this.customerId,
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
        handleDelete(id) {
            let _this = this;
            this.$confirm({
                title: _this.$t('pop_up.sure_delete'),
                okText: _this.$t('def.sure'),
                okType: 'danger',
                cancelText: this.$t('def.cancel'),
                onOk() {
                    Core.Api.CRMCustomer.delete({ id })
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
