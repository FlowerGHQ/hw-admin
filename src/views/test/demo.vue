<template>
    <div id="DemoPage">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">{{ $t('i.item_list') }}</div>
            </div>

            <div class="search-container">
                <a-row class="search-area">
                    <a-col :xs='24' :sm='24' :xl="12" :xxl='6' class="search-item">
                        <div class="key">部门:</div>
                        <div class="value">
                            <a-input :placeholder="'请选择部门'" v-model:value="searchForm.name" @keydown.enter='handleSearch'/>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="12" :xxl='6' class="search-item">
                        <div class="key">员工:</div>
                        <div class="value">
                            <a-select v-model:value="searchForm.type" :placeholder="'请选择员工'">
                                <a-select-option v-for="(val, key) in itemTypeMap" :key="key" :value="key">{{ val[$i18n.locale]  }}</a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :xs='24' :sm='24' :xl="24" :xxl='12' class="search-item">
                        <div class="key">{{ '周期' }}:</div>
                        <div class="value"><TimeSearch @search="handleSearch" ref='TimeSearch'/></div>
                    </a-col>
                </a-row>
                <div class="btn-area">
                    <a-button @click="handleSearch" type="primary">{{ $t('def.search') }}</a-button>
                    <a-button @click="handleSearchReset">{{ $t('def.reset') }}</a-button>
                </div>
            </div>
        </div>
        <div></div>
        <a-row :gutter="[8,0]">
            <a-col :xs='24' :sm='24' :xl="12" :xxl='14'>
                <a-row :gutter="[8,0]">
                    <a-col :span="24">
                    </a-col>
                    <a-col :span="24">
                        <SalesStatistics/>
                    </a-col>
                    <a-col :span="24">
                        <TrackStatistics/>
                    </a-col>
                    <a-col :span="24">
                        <BoStatistics/>
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs='24' :sm='24' :xl="12" :xxl='10'>
                <a-row :gutter="[8,0]">
                    <a-col :span="24">
                        <PerformanceList/>
                    </a-col>
                    <a-col :span="24">
                    </a-col>
                    <a-col :span="24">
                        <PurchaseIntentIntention/>
                    </a-col>
                    <a-col :span="24">
                        <TestDriveIntention/>
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


import TimeSearch from '@/components/common/TimeSearch.vue'
import Core from "../../core";


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
        TestDriveIntention
    },
    props: {},
    data() {
        return {
            searchForm: {
                name: '',
                code: '',
                category_id: undefined,
                begin_time: '',
                end_time: '',
                type: undefined,
            },
        };
    },
    watch: {},
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
        handleSearch() {  // 搜索
            // this.getTableData();
        },
        handleSearchReset() {  // 重置搜索
            Object.assign(this.searchForm, this.$options.data().searchForm)
            this.$refs.TimeSearch.handleReset()
            // this.getTableData();
        },
    }
};
</script>

<style lang="less" scoped>
.list-container {
    margin-bottom: 16px;
}
</style>
