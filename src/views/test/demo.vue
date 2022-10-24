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
                        <div class="value"><TimeSearch @search="handleOtherSearch" ref='TimeSearch'/></div>
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
                        <Card />
                    </a-col>
                    <a-col :span="24">
                        <Card :type="2" :info="{}"/>
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs='24' :sm='24' :xl="12" :xxl='10'>
                <a-row :gutter="[8,0]">
                    <a-col :span="24">
                        <Card :type="3"/>
                    </a-col>
                    <a-col :span="24">
                        <!-- <Card :type="3"/> -->
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import Core from '../../core';
import Card from './card.vue';
import TimeSearch from '@/components/common/TimeSearch.vue'

export default {
    name: 'Demo',
    components: {
        Card,
        TimeSearch
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
        getTableData() {  // 获取 表格 数据
            // this.loading = true;
            // let flag_spread = 0
            // if (this.searchForm.name !== '' || this.searchForm.code !== '') {
            //     flag_spread = 1
            // }
            // Core.Api.Item.list({
            //     ...this.searchForm,
            //     flag_spread,
            //     page: this.currPage,
            //     page_size: this.pageSize
            // }).then(res => {
            //     console.log("getTableData res:", res)
            //     this.expandIconColumnIndex = flag_spread == 1 ? -1 : 0
            //     this.total = res.count;
            //     this.tableData = res.list;
            // }).catch(err => {
            //     console.log('getTableData err:', err)
            // }).finally(() => {
            //     this.loading = false;
            //     this.expandedRowKeys = []
            // });
        },
    }
};
</script>

<style lang="less" scoped>
.list-container {
    margin-bottom: 16px;
}
</style>
