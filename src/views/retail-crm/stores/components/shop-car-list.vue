<template>
    <div>
        <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: true }"
            :row-key="record => record.id"
            :pagination="false"
            @change="getTableDataSorter"
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
                <template v-if="column.key === 'money'">
                    {{ text / 100 || '-' }}
                </template>
                <template v-if="column.key === 'item'">
                    {{ text || '-' }}
                </template>
                <template v-if="column.key === 'status'">
                    {{
                        groupStatusTableData[text] !== undefined
                            ? lang === 'zh'
                                ? groupStatusTableData[text].zh
                                : groupStatusTableData[text].en
                            : ''
                    }}
                </template>
                <template v-if="column.key === 'time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <template v-if="column.key === 'estimated_deal_time'">
                    {{ $Util.timeFilter(text, 3) }}
                </template>

                <template v-if="column.key === 'operation'">
                    <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('customer.detail')"
                        ><i class="icon i_detail" />{{ $t('def.detail') }}</a-button
                    >
                    <!--                        <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('customer.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>-->
                    <!--                        <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('customer.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>-->
                </template>
            </template>
        </a-table>
    </div>
</template>

<script>
export default {
    name: 'StoreList',
    data() {
        return {};
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'retail.series', dataIndex: 'uid', key: 'detail' },
                { title: 'retail.model', dataIndex: 'own_user_name', key: 'own_user_name' },
                { title: 'retail.color', dataIndex: 'money', key: 'money' },
                { title: 'retail.vehicle_usage', dataIndex: 'customer_name', key: 'customer_name' },
                { title: 'retail.use_status', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time' },
                { title: 'retail.warehousing_time', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time' },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ];
            return columns;
        },
        lang() {
            return this.$store.state.lang;
        },
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="less" scoped>
// :deep(.th-text) {
//     color: #1D2129;
//     font-family: PingFang SC;
//     font-size: 14px;
//     font-style: normal;
//     font-weight: 800;
//     line-height: 22px;
// }
</style>
