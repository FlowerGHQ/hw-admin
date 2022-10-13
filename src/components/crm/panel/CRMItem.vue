<template>
<div class="InformationInfo gray-panel no-margin">
    <div class="panel-title">
        <div class="title">{{ $t('crm_b.bo') }}</div>
    </div>
    <div class="panel-content">
        <div>
            <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id" :pagination='false' @change="getTableDataSorter">
                <template #headerCell="{title}">
                    {{ $t(title) }}
                </template>
                <template #bodyCell="{ column, text , record }">
                    <!--                        <template v-if="column.key === 'detail'">
                                                <a-tooltip placement="top" :title='text'>
                                                    <a-button type="link" @click="routerChange('detail', record)">{{text || '-'}}</a-button>
                                                </a-tooltip>
                                            </template>-->
                    <template v-if="column.key === 'item'">
                        {{ text || '-' }}
                    </template>
                    <template v-if="column.key === 'status'">
                        {{ groupStatusTableData[text] !== undefined ? lang === 'zh' ? groupStatusTableData[text].zh : groupStatusTableData[text].en : "" }}
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                    <template v-if="column.key === 'estimated_deal_time'">
                        {{ $Util.timeFilter(text, 3) }}
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

    </div>
</div>
</template>

<script>
import Core from '../../../core';

export default {
    name: 'InformationInfo',
    components: {},
    props: {
        detail:{
            type: Object,
        },
        sourceId: {
            type: Number,
            default: 0
        },
        sourceType: {
            type: Number,
            default: 0
        },


    },
    data() {
        return {

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
            groupStatusTableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                {title: 'crm_b.name', dataIndex: 'name', key:'detail', sorter: true},
                // {title: 'crm_b.customer_name', dataIndex: 'customer_name', key:'customer_name', sorter: true},
                {title: 'crm_b.own_user_name', dataIndex: 'own_user_name', key:'own_user_name', sorter: true},
                {title: 'crm_b.status', dataIndex: 'status', key:'status', sorter: true},
                {title: 'def.operate', key: 'operation', fixed: 'right'},
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
        routerChange(type, item = {}) {
            let routeUrl = ''
            switch (type) {
                case 'detail':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-detail",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
                    break;
                case 'edit':    // 编辑
                    routeUrl = this.$router.resolve({
                        path: "/crm-bo/bo-edit",
                        query: {id: item.id}
                    })
                    window.open(routeUrl.href, '_self')
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
        getTableData(){
            this.loading = true;
            Core.Api.CRMItemBind.list({
                source_id: this.sourceId,
                source_type: this.sourceType,
            }).then(res => {
                res.list.forEach(it => {
                    it.discount_price = it.price * it.discount / 100
                })
                this.tableData = res.list

            }).catch(err => {
                console.log('getCustomerDetail err', err)
            }).finally(() => {
                this.loading = false;
            });

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
