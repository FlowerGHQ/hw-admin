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
import dayjs from "dayjs";
export default {
    name: "Demo",
    components: {

    },
    props: {},
    data() {
        return {
            title: '详情',
            apiName: '',
            time: [null, null],
            searchForm: {
                begin_time: "",
                end_time: "",
            },
            columnType: 1,
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
            ]
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            const columnMap = {
                [Core.Const.VOTE.TYPE.DAILYVOTE]: [
                    { title: '日期', dataIndex: 'date', key: 'item' },
                    { title: '访客人数', dataIndex: 'visitors', key: 'item' },
                    { title: '投票人数', dataIndex: 'votes', key: 'item' },
                    { title: '投票率', dataIndex: 'turnout_rate', key: 'item' },
                    { title: '已支付用户', dataIndex: 'paid_user', key: 'item' },
                    { title: '未支付用户', dataIndex: 'unpaid_user', key: 'item' },
                    { title: '汇总', dataIndex: 'total', key: 'total' },
                ],
                [Core.Const.VOTE.TYPE.SOURCE]: [
                    { title: '日期', dataIndex: 'date', key: 'item' },
                    { title: '访客人数', dataIndex: 'visitors', key: 'item' },
                    { title: '投票人数', dataIndex: 'votes', key: 'item' },
                    { title: '小程序推送', dataIndex: 'total', key: 'item' },
                    { title: '公众号二维码', dataIndex: 'turnout_rate', key: 'item' },
                    { title: '微博跳转', dataIndex: 'paid_user', key: 'item' },
                    { title: '好友分享', dataIndex: 'unpaid_user', key: 'item' },
                    { title: '汇总', dataIndex: 'total', key: 'total' },
                ],
                [Core.Const.VOTE.TYPE.PAID]: [
                    { title: '日期', dataIndex: 'date', key: 'item' },
                    { title: '访客人数', dataIndex: 'visitors', key: 'item' },
                    { title: '投票人数', dataIndex: 'votes', key: 'item' },
                    { title: '投票率', dataIndex: 'turnout_rate', key: 'item' },
                    { title: '已支付用户', dataIndex: 'paid_user', key: 'item' },
                    { title: '未支付用户', dataIndex: 'unpaid_user', key: 'item' },
                    { title: '汇总', dataIndex: 'total', key: 'total' },
                ],
                [Core.Const.VOTE.TYPE.COLOR]: [
                    { title: '日期', dataIndex: 'date', key: 'item' },
                    { title: '总投票数', dataIndex: 'total', key: 'item' },
                    { title: '颜色', dataIndex: 'color', key: 'item' },
                    { title: '汇总', dataIndex: 'total', key: 'total' },
                ],
                [Core.Const.VOTE.TYPE.AREA]: [
                    { title: '日期', dataIndex: 'date', key: 'item' },
                    { title: '总投票数', dataIndex: 'total', key: 'item' },
                    { title: '城市', dataIndex: 'city', key: 'item' },
                    { title: '汇总', dataIndex: 'total', key: 'total' },
                ],
                [Core.Const.VOTE.TYPE.FRIEND]: [
                    { title: '日期', dataIndex: 'date', key: 'item' },
                    { title: '好友访问人数', dataIndex: 'date', key: 'item' },
                    { title: '好友投票人数', dataIndex: 'date', key: 'item' },
                    { title: '好友投票率', dataIndex: 'date', key: 'item' },
                    { title: '公众号二维码访问人数', dataIndex: 'date', key: 'item' },
                    { title: '公众号二维码投票人数', dataIndex: 'date', key: 'item' },
                    { title: '公众号二维码投票率', dataIndex: 'date', key: 'item' },
                    { title: '微博跳转访问人数', dataIndex: 'date', key: 'item' },
                    { title: '微博跳转投票人数', dataIndex: 'date', key: 'item' },
                    { title: '微博跳转投票率', dataIndex: 'date', key: 'item' },
                    { title: '总投票数', dataIndex: 'total', key: 'item' },
                    { title: '城市', dataIndex: 'city', key: 'item' },
                    { title: '汇总', dataIndex: 'total', key: 'total' },
                ],
            };

            return columnMap[this.columnType] || [];
        },
    },
    created() { },
    mounted() {
        this.title = this.$route.query.title || ''
        this.apiName = this.$route.query.apiName || ''
        this.columnType = this.$route.query.columnType || 1
        this.searchForm.begin_time = this.$route.query.begin_time || 0
        this.searchForm.end_time = this.$route.query.end_time || 0
        this.getTableData();
        this.getQueryTime();
    },
    methods: {
        // 时间选择器change
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = begin_time.startOf("day").unix();
            searchForm.end_time = end_time.endOf("day").unix();
            this.searchForm = searchForm;
        },
        // 获取父组件传入时间
        getQueryTime() {
            const startDate = dayjs(this.searchForm.begin_time * 1000);
            const endDate = dayjs(this.searchForm.end_time * 1000);
            this.time = [startDate, endDate];
        },
        // 获取表格数据
        async getTableData() {
            try {
                let res = await Core.Api.VoteData[this.apiName]({ ...this.searchForm });
                console.log('getTableData res', res);
            } catch (error) {
                console.log('Error in getTableData', error);
                this.$message.warning('数据无法加载，请稍后重试！')
            }
        }
    },
};
</script>
  
<style lang="less" scoped>
#VoteDetail {}

:deep(.ant-col-24) {
    padding-right: 12px;
}
</style>
  