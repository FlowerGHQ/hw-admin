<template>
    <div id="VoteDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ title }}详情</div>
                <div class="btns-area">
                    <a-range-picker style="width: 400px;" v-model:value="time" @change="handleChange()" :allowClear="false"
                        :placeholder="[$t('crm_def.start_time'), $t('crm_def.end_time')]" ref="TimeSearch" />
                </div>
            </div>
            <div class="table-container">
                <a-table :columns="tableColumns" :data-source="tableData" :scroll="{ x: true }"
                    :row-key="record => record.id" :pagination='false'>
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.key === 'item'">
                            {{ text || '-' }}
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>
  
<script>
import Core from "../../core";

export default {
    name: "Demo",
    components: {

    },
    props: {},
    data() {
        return {
            searchForm: {
                begin_time: (Date.now() - 1 * 24 * 60 * 60 * 1000) / 1000,
                end_time: Date.now() / 1000,
            },
            title: '详情',
            time: [],
            searchForm: {
                begin_time: "",
                end_time: "",
            },
            tableData: [
                {
                    id: 1,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 2,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 3,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 4,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 5,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 6,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 7,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 8,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 9,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 10,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 11,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 12,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
                {
                    id: 13,
                    date: '12-01',
                    visitors: 100,
                    votes: 30,
                    total: 30,
                    turnout_rate: '80%',
                    paid_user: 10,
                    unpaid_user: 10
                },
            ]
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let columns = [
                { title: '日期', dataIndex: 'date', key: 'item' },
                { title: '访客人数', dataIndex: 'visitors', key: 'item' },
                { title: '投票人数', dataIndex: 'votes', key: 'item' },
                { title: '总投票数', dataIndex: 'total', key: 'item' },
                { title: '投票率', dataIndex: 'turnout_rate', key: 'item' },
                { title: '已支付用户', dataIndex: 'paid_user', key: 'item' },
                { title: '未支付用户', dataIndex: 'unpaid_user', key: 'item' },
            ]
            return columns
        },
    },
    created() { },
    mounted() {
        this.title = this.$route.query.title || ''
    },
    methods: {
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = begin_time.startOf("day").unix();
            searchForm.end_time = end_time.endOf("day").unix();
            this.searchForm = searchForm;
            console.log('this.searchForm', this.searchForm);
        },
    },
};
</script>
  
<style lang="less" scoped>
#VoteDetail {}

:deep(.ant-col-24) {
    padding-right: 12px;
}
</style>
  