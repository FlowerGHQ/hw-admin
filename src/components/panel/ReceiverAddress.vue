<template>
    <div class="ReceiverAddress gray-panel no-margin">
        <div class="panel-title">
            <div class="title">{{ $t('ad.address') }}</div>
        </div>
        <div class="panel-content">
            <div class="table-container">
                <AddressEdit
                    btnType="primary"
                    :ghost="true"
                    :orgId="orgId"
                    :orgType="orgType"
                    v-if="!$auth('ADMIN')"
                    @submit="getTableData"
                    ><i class="icon i_add" />{{ $t('ad.add') }}</AddressEdit
                >
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :row-key="record => record.id"
                    :pagination="false"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                        <template v-if="column.key === 'address'">
                            {{ $Util.addressFilter(record, $i18n.locale) }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                        <!--                        <template v-if="column.key === 'operation'">
                            <AddressEdit :detail="record" :orgId="orgId" :orgType="orgType" btnType="link" @submit='getTableData'><i class="icon i_edit"/>{{ $t('def.edit') }}</AddressEdit>
                            <a-button type='link' class="danger" @click="handleDelete(record.id)"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>
                        </template>-->
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
import AddressEdit from '@/components/popup-btn/ReceiverAddressEdit.vue';
const USER_TYPE = Core.Const.USER.TYPE;

export default {
    name: 'ReceiverAddress',
    components: { AddressEdit },
    props: {
        orgId: {
            type: Number,
        },
        orgType: {
            type: Number,
        },
        type: {
            type: Number,
        },
        title: {
            type: Number,
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
            detail: {},
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: this.$t('e.name'), dataIndex: 'name', key: 'item' },
                { title: this.$t('n.phone'), dataIndex: 'phone', key: 'item' },
                { title: this.$t('n.country'), dataIndex: 'country', key: 'item' },
                { title: this.$t('ad.specific_address'), dataIndex: 'address', key: 'address' },
                { title: this.$t('def.create_time'), dataIndex: 'create_time', key: 'time' },
                // {title: this.$t('def.operate'), key: 'operation', fixed: 'right'},
            ];
            if (this.$i18n.locale === 'en') {
                columns.splice(2, 1, { title: this.$t('n.country'), dataIndex: 'country_en', key: 'item' });
            }
            return columns;
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
            this.pageSize = size;
            this.getTableData();
        },
        getTableData() {
            // 获取 表格 数据
            this.loading = true;
            Core.Api.ReceiveAddress.list({
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
                    Core.Api.ReceiveAddress.delete({ id })
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
//.ReceiverAddress {}
</style>
