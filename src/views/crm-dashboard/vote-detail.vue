<template>
    <div id="VoteDetail">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ title }}详情</div>
                <div class="btns-area">
                    <a-range-picker
                        style="width: 400px"
                        v-model:value="time"
                        @change="handleChange()"
                        :allowClear="false"
                        :placeholder="['开始时间', '结束时间']"
                        ref="TimeSearch"
                    />
                </div>
            </div>
            <div class="table-container">
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
                        <template v-if="column.key === 'color'">
                            {{ $Util.voteResultFilter(text) || '-' }}
                        </template>
                        <template v-if="column.key === 'time'">
                            {{ $Util.timeFilter(text) }}
                        </template>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script>
import { Result } from 'ant-design-vue';
import Core from '../../core';
import dayjs from 'dayjs';
export default {
    name: 'Demo',
    components: {},
    props: {},
    data() {
        return {
            title: '详情',
            api_name: '',
            time: [null, null],
            searchForm: {
                begin_time: '',
                end_time: '',
            },
            column_type: 1,
            tableData: [],
        };
    },
    watch: {},
    computed: {
        tableColumns() {
            const columnMap = {
                [Core.Const.VOTE.TYPE.DAILYVOTE]: [
                    { title: '日期', dataIndex: 'date', key: 'time' },
                    { title: '访客人数', dataIndex: 'visitors', key: 'item' },
                    { title: '投票人数', dataIndex: 'vote_count', key: 'item' },
                    { title: '投票率', dataIndex: 'turnout_rate', key: 'item' },
                    { title: '已支付用户', dataIndex: 'paid_user', key: 'item' },
                    { title: '未支付用户', dataIndex: 'unpaid_user', key: 'item' },
                ],
                [Core.Const.VOTE.TYPE.SOURCE]: [
                    { title: '日期', dataIndex: 'date', key: 'time' },
                    { title: '访客人数', dataIndex: 'visitors', key: 'item' },
                    { title: '投票人数', dataIndex: 'vote_count', key: 'item' },
                    { title: '官网', dataIndex: 'official_push', key: 'item' },
                    { title: '公众号二维码', dataIndex: 'qrcode_push', key: 'item' },
                    { title: '微博跳转', dataIndex: 'weibo_push', key: 'item' },
                    { title: '好友分享', dataIndex: 'user_share', key: 'item' },
                ],
                [Core.Const.VOTE.TYPE.PAID]: [
                    { title: '日期', dataIndex: 'date', key: 'time' },
                    { title: '访客人数', dataIndex: 'visitors', key: 'item' },
                    { title: '投票人数', dataIndex: 'vote_count', key: 'item' },
                    { title: '投票率', dataIndex: 'turnout_rate', key: 'item' },
                    { title: '已支付用户', dataIndex: 'paid_user', key: 'item' },
                    { title: '未支付用户', dataIndex: 'unpaid_user', key: 'item' },
                ],
                [Core.Const.VOTE.TYPE.COLOR]: [
                    { title: '日期', dataIndex: 'date', key: 'time' },
                    { title: '总投票数', dataIndex: 'total', key: 'item' },
                    { title: '颜色', dataIndex: 'color', key: 'color' },
                ],
                [Core.Const.VOTE.TYPE.AREA]: [
                    { title: '日期', dataIndex: 'date', key: 'time' },
                    { title: '总投票数', dataIndex: 'total', key: 'item' },
                    { title: '城市', dataIndex: 'city', key: 'item' },
                ],
                [Core.Const.VOTE.TYPE.SHARE]: [
                    { title: '日期', dataIndex: 'date', key: 'time' },
                    { title: '好友访问人数', dataIndex: 'visitors', key: 'item' },
                    { title: '好友投票人数', dataIndex: 'vote_count', key: 'item' },
                    { title: '好友投票率', dataIndex: 'turnout_rate', key: 'item' },
                    { title: '公众号二维码访问人数', dataIndex: 'qrcode_visitors', key: 'item' },
                    { title: '公众号二维码投票人数', dataIndex: 'qrcode_vote_count', key: 'item' },
                    { title: '公众号二维码投票率', dataIndex: 'qrcode_rate', key: 'item' },
                    { title: '微博跳转访问人数', dataIndex: 'weibo_visitors', key: 'item' },
                    { title: '微博跳转投票人数', dataIndex: 'weibo_vote_count', key: 'item' },
                    { title: '微博跳转投票率', dataIndex: 'weibo_rate', key: 'item' },
                ],
            };

            return columnMap[this.column_type] || [];
        },
    },
    created() {},
    mounted() {
        this.title = this.$route.query.title || '';
        this.api_name = this.$route.query.api_name || '';
        this.column_type = parseInt(this.$route.query.column_type) || 1;
        this.searchForm.begin_time = this.$route.query.begin_time || 0;
        this.searchForm.end_time = this.$route.query.end_time || 0;
        this.getTableData();
        this.getQueryTime();
    },
    methods: {
        // 时间选择器change
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = begin_time.startOf('day').unix();
            searchForm.end_time = end_time.endOf('day').unix();
            this.searchForm = searchForm;
            this.getTableData();
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
                let res = await Core.Api.VoteData[this.api_name]({ ...this.searchForm, activity_id: 1 });
                console.log('getTableData res', res);
                if (this.column_type === Core.Const.VOTE.TYPE.DAILYVOTE) {
                    const targetData = res;
                    this.tableData = targetData.map(item => {
                        return {
                            date: item.date,
                            visitors: item.uv,
                            vote_count: item.vote_count,
                            turnout_rate: item.uv ? ((item.vote_count / item.uv) * 100).toFixed(1) + '%' : '0.00%',
                            paid_user: item.pay_num,
                            unpaid_user: item.uv - item.pay_num,
                        };
                    });
                } else if (this.column_type === Core.Const.VOTE.TYPE.SOURCE) {
                    const targetData = res;
                    this.tableData = targetData.map(item => {
                        const targetItem = {
                            date: item.date,
                            visitors: 0,
                            vote_count: 0,
                            program_push: 0,
                            qrcode_push: 0,
                            weibo_push: 0,
                            user_share: 0,
                        };

                        item.source_list.forEach(source => {
                            const type = source.type;
                            switch (type) {
                                case 1: // 好友分享
                                    targetItem.user_share += source.count;
                                    break;
                                case 2: // 官网
                                    targetItem.official_push += source.count;
                                    break;
                                case 3: // 公众号二维码
                                    targetItem.qrcode_push += source.count;
                                    break;
                                case 4: // 微博链接
                                    targetItem.weibo_push += source.count;
                                    break;
                                default:
                                    break;
                            }

                            targetItem.visitors += source.count;
                            targetItem.vote_count += source.vote_count;
                        });

                        return targetItem;
                    });
                } else if (this.column_type === Core.Const.VOTE.TYPE.PAID) {
                    const targetData = res;
                    this.tableData = targetData.map(item => {
                        return {
                            date: item.date,
                            visitors: item.uv,
                            vote_count: item.vote_count,
                            turnout_rate: item.uv ? ((item.vote_count / item.uv) * 100).toFixed(1) + '%' : '0.00%',
                            paid_user: item.pay_num,
                            unpaid_user: item.uv - item.pay_num,
                        };
                    });
                } else if (this.column_type === Core.Const.VOTE.TYPE.COLOR) {
                    const targetData = res;
                    this.tableData = targetData.flatMap(item => {
                        const targetItems = item.source_list.map(source => {
                            return {
                                date: item.date,
                                total: source.vote_count,
                                color: source.code,
                            };
                        });

                        return targetItems;
                    });
                } else if (this.column_type === Core.Const.VOTE.TYPE.AREA) {
                    const targetData = res;
                    this.tableData = targetData.flatMap(item => {
                        const targetItems = item.source_list.map(source => {
                            return {
                                date: item.date,
                                total: source.vote_count,
                                city: source.code,
                            };
                        });
                        return targetItems;
                    });
                } else if (this.column_type === Core.Const.VOTE.TYPE.SHARE) {
                    const targetData = res;
                    this.tableData = targetData.map(item => {
                        const targetItem = {
                            date: item.date,
                            visitors: 0,
                            vote_count: 0,
                            qrcode_visitors: 0,
                            qrcode_vote_count: 0,
                            weibo_visitors: 0,
                            weibo_vote_count: 0,
                        };

                        item.source_list.forEach(source => {
                            const type = source.type;
                            switch (type) {
                                case 1: // 好友分享
                                    targetItem.visitors += source.count;
                                    targetItem.vote_count += source.vote_count;
                                    break;
                                case 3: // 公众号
                                    targetItem.qrcode_visitors += source.count;
                                    targetItem.qrcode_vote_count += source.vote_count;
                                    break;
                                case 4: // 微博
                                    targetItem.weibo_visitors += source.count;
                                    targetItem.weibo_vote_count += source.vote_count;
                                    break;
                                default:
                                    break;
                            }
                        });
                        return targetItem;
                    });
                }
            } catch (error) {
                console.log('Error in getTableData', error);
                this.$message.warning('数据无法加载，请稍后重试！');
            }
        },
    },
};
</script>

<style lang="less" scoped>
#VoteDetail {
}

:deep(.ant-col-24) {
    padding-right: 12px;
}
</style>
