<template>
    <div class="BalanceList gray-panel no-margin">
        <div class="panel-content">
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                         :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text}">
                        <template v-if="column.dataIndex === 'type'">
                            {{ $Util.walletTypeFilter(text) }}
                        </template>
                        <template v-if="column.key === 'money'">
                            {{ walletMap[detail.type] + ( text /100)}}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="currPage"
                    :page-size='pageSize'
                    :total="total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="total => `共${total}条`"
                    :hide-on-single-page='false'
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
    name: 'BalanceList',
    components: {},
    props: {
        walletId: {
            type: Number,
        },
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        },
    },
    data() {
        return {
            // 加载
            loading: false,
            // 分页
            currPage: 1,
            pageSize: 20,
            total: 0,
            tableData: [],
            walletMap: {
                1: '¥',
                2: '€',
                3: '$',
                4: '£'
            },
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                {title: '变动类型', dataIndex: 'type'},
                {title: '变动金额', dataIndex: 'money', key: 'money'},
                {title: '变动后余额', dataIndex: 'balance', key: 'money'},
                {title: '操作时间', dataIndex: 'create_time', key: 'time'},
            ]
            return tableColumns
        },
    },
    mounted() {
        this.getTableData();
        console.log('getWalletDetail')
    },
    methods: {
      /*  routerChange(type, item) {
            switch (type) {
                case 'back':
                    this.$router.go(-1)
                    break;
            }
        },*/
        pageChange(curr) {  // 页码改变
            this.currPage = curr
            this.getTableData()
        },
        pageSizeChange(current, size) {  // 页码尺寸改变
            console.log('pageSizeChange size:', size)
            this.pageSize = size
            this.getTableData()
        },
        getTableData() {  // 获取 表格 数据
            this.loading = true;
            Core.Api.Wallet.walletList({
                wallet_id: this.walletId,
                page: this.currPage,
                page_size: this.pageSize,
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
    }
};
</script>

<style lang="less">
//.BalanceList{}
</style>