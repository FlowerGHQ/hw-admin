<template>
    <div id="DemoPage">
        <div class="SearchRangePicker">
            <a-tree-select
                class="CategoryTreeSelect"
                v-model:value="searchForm.group_id"
                :placeholder="$t('def.select') + $t('crm_c.group')"
                :dropdown-style="{ maxHeight: '412px', overflow: 'auto' }"
                :tree-data="groupOptions"
                tree-default-expand-all
            />
            <a-range-picker v-model:value="time" @change="handleChange()" :allowClear="false" />
        </div>
        <div></div>
        <a-row :gutter="[8, 0]">
            <a-col :xs="24" :sm="24" :xl="12" :xxl="14">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24"> </a-col>
                    <a-col :span="24">
                        <Card :searchForm="searchForm" type="4" />
                    </a-col>
                    <a-col :span="24">
                        <TrackStatistics :searchForm="searchForm" />
                    </a-col>
                    <a-col :span="24">
                        <BoStatistics :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :xl="12" :xxl="10">
                <a-row :gutter="[8, 0]">
                    <a-col :span="24">
                        <PerformanceList :searchForm="searchForm" />
                    </a-col>
                    <a-col :span="24"> </a-col>
                    <a-col :span="24">
                        <PurchaseIntentIntention :searchForm="searchForm" />
                    </a-col>
                    <a-col :span="24">
                        <TestDriveIntention :searchForm="searchForm" />
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import Card from './card.vue';
import SalesStatistics from './components/SalesStatistics.vue';
import TrackStatistics from './components/TrackStatistics.vue';
import PerformanceList from './components/PerformanceList.vue';
import BoStatistics from './components/BoStatistics.vue';
import PurchaseIntentIntention from './components/PurchaseIntentIntention.vue';
import TestDriveIntention from './components/TestDriveIntention.vue';

import TimeSearch from '@/components/common/TimeSearch.vue';
import Core from '../../core';
import dayjs from 'dayjs';

export default {
    name: 'Demo',
    components: {
        Card,
        TimeSearch,
        SalesStatistics,
        TrackStatistics,
        PerformanceList,
        BoStatistics,
        PurchaseIntentIntention,
        TestDriveIntention,
    },
    props: {},
    data() {
        return {
            searchForm: {
                group_id: undefined,
                begin_time: '',
                end_time: '',
            },
            time: [],
            groupOptions: [],
        };
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.handleGroupTree();
    },
    methods: {
        handleSearch() {
            // 搜索
            // this.getTableData();
        },
        handleSearchReset() {
            // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm);
            this.$refs.TimeSearch.handleReset();
            // this.getTableData();
        },
        handleGroupTree() {
            Core.Api.CRMGroupMember.structureByUser().then(res => {
                this.groupOptions = res.list;
                console.log(res);
            });
        },
        handleChange() {
            let begin_time = dayjs(this.time[0]);
            let end_time = dayjs(this.time[1]);
            // let data = {
            //     org_type: this.org_type,
            //     begin_time: begin_time.startOf('day').unix(),
            //     end_time: end_time.endOf('day').unix(),
            // }
            // let diff = end_time.diff(begin_time, 'days')
            //
            // let dateList = [begin_time.format('YYYY-MM-DD')]
            // for (let i = 1; i <= diff; i++) {
            //     dateList.push(dayjs(begin_time).add(i, 'days').format('YYYY-MM-DD'))
            // }
            // console.log('handleChange data:', data, 'dateList', dateList)
            let searchForm = this.$Util.deepCopy(this.searchForm);
            searchForm.begin_time = begin_time.startOf('day').unix();
            searchForm.end_time = end_time.endOf('day').unix();
            this.searchForm = searchForm;
            // this.$emit('search', data, dateList)
        },
    },
};
</script>

<style lang="less" scoped>
.list-container {
    margin-bottom: 16px;
}
.SearchRangePicker {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    .org-type {
        margin-right: 20px;
        .type-item {
            width: 88px;
            text-align: center;
            border-color: #eaecf2;
            box-shadow: 0 0 0 0;
            &::after,
            &::before {
                background-color: #eaecf2;
            }
            &:hover {
                color: @TC_P;
            }
            &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
                color: @TC_P;
                background: @BG_N;
                border-color: @BC_P;
                box-shadow: 0;
                &::after,
                &::before {
                    background-color: @BC_P;
                }
            }
        }
    }
    .time-type {
        margin-left: 20px;
        .fac();
        .type-item {
            padding: 0;
            + .type-item {
                margin-left: 24px;
            }
            color: @TC_link;
            cursor: pointer;
            &:hover,
            &.active {
                color: @TC_P;
            }
        }
    }
    .CategoryTreeSelect {
        width: 200px;
        margin-right: 20px;
    }
}
</style>
