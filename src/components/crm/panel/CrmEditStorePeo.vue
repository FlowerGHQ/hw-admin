<template>
    <div>
        <div class="form-item ">
            <!-- <div class="key">{{ $t('crm_st.manager') }}：</div> -->
            <div class="value">
                <a-button type="primary" v-if="$auth('customer.detail')">{{ $t('crm_st.add_man') }}</a-button>
            </div>
        </div>
        <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }" :row-key="record => record.id"
            :pagination='false' @change="getTableDataSorter">
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
                    {{ groupStatusTableData[text] !== undefined ? lang === 'zh' ? groupStatusTableData[text].zh :
                        groupStatusTableData[text].en : "" }}
                </template>
                <template v-if="column.key === 'time'">
                    {{ $Util.timeFilter(text) }}
                </template>
                <template v-if="column.key === 'estimated_deal_time'">
                    {{ $Util.timeFilter(text, 3) }}
                </template>

                <template v-if="column.key === 'operation'">
                    <a-button type="link" @click="routerChange('detail', record)" v-if="$auth('customer.detail')"><i
                            class="icon i_detail" />{{ $t('def.detail') }}</a-button>
                    <!--                        <a-button type="link" @click="routerChange('edit',record)" v-if="$auth('customer.save')"><i class="icon i_edit"/>{{ $t('def.edit') }}</a-button>-->
                    <!--                        <a-button type="link" @click="handleDelete(record.id)" class="danger" v-if="$auth('customer.delete')"><i class="icon i_delete"/> {{ $t('def.delete') }}</a-button>-->
                </template>
            </template>
        </a-table>
        <addStorePeo :isShow="isShow"></addStorePeo>

    </div>
</template>
<script>
import Core from '../../../core';
import addStorePeo from "./addStorePeo.vue"

export default {

    name: 'CrmEditStorePeo',
    components: {
        addStorePeo
    },
    props: {
        detail: {
            type: Object,
        },
        orderId: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            isShow:false,
        }
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: 'n.name', dataIndex: 'uid', key: 'detail' },
                { title: 'crm_st.Work_status', dataIndex: 'own_user_name', key: 'own_user_name' },
                { title: 'n.phone', dataIndex: 'money', key: 'money' },
                { title: 'crm_st.office', dataIndex: 'customer_name', key: 'customer_name' },
                { title: 'crm_st.bound_thread', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time', sorter: true },
                { title: 'crm_st.job_time', dataIndex: 'estimated_deal_time', key: 'estimated_deal_time', sorter: true },
                { title: 'def.operate', key: 'operation', fixed: 'right' },
            ]
            return columns
        },
        lang() {
            return this.$store.state.lang
        }
    },
    mounted() {

    },
    methods: {

    }

}

</script>

<style lang="less" scoped></style>

