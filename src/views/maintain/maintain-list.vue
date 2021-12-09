<template>
<div id="MaintainList">
    <div class="list-container">
        <div class="title-container">
            <div class="title-area">维修工单</div>
            <div class="btns-area">
                <a-button type="primary" @click="routerChange('edit')"><i class="icon i_add"/>新增商品</a-button>
            </div>
        </div>
        <div class="tabs-container colorful">
            <a-tabs v-model:activeKey="searchForm.status" @change='handleSearch'>
                <a-tab-pane :key="item.key" v-for="item of statusList">
                    <template #tab>
                        <div class="tabs-title">{{item.text}}<span :class="item.color">{{item.value}}</span></div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="search-container">
            <a-row class="search-area">
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">工单编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入工单编号" v-model:value="searchForm.sn" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">零部件编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入零部件编号" v-model:value="searchForm.part_code" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="8" :xxl='6' class="search-item">
                    <div class="key">车架编号:</div>
                    <div class="value">
                        <a-input placeholder="请输入车架编号" v-model:value="searchForm.car_code" @keydown.enter='handleSearch'/>
                    </div>
                </a-col>
                <a-col :xs='24' :sm='24' :xl="16" :xxl='12' class="search-item">
                    <div class="key">创建时间:</div>
                    <div class="value">
                        <a-range-picker v-model:value="create_time" valueFormat='X' @change="handleSearch" :show-time="defaultTime">
                            <template #suffixIcon><i class="icon i_calendar"></i> </template>
                        </a-range-picker>
                    </div>
                </a-col>
            </a-row>
            <div class="btn-area">
                <a-button @click="handleSearch" type="primary">查询</a-button>
                <a-button @click="handleSearchReset">重置</a-button>
            </div>
        </div>
        <div class="table-container">
            <MyFieldSelect table-key='MaintainList' :necessary-key='["sn", "status"]' :table-columns="tableColumnsTemp" @change='(columns) => tableColumns = columns'/>
            <a-table :columns="$Util.tableFieldsFilter(tableColumns, loginType)" :data-source="tableData" :scroll="{ x: true }"
                :row-key="record => record.id" :loading='loading' :pagination='false' @change="handleTableChange">
                <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'sn'">
                        <a-tooltip placement="top" :title='text'>
                            <a-button type="link" @click="routerChange('detail', record)">{{text}}</a-button>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'item'">
                        {{ text || '-'}}
                    </template>
                    <template v-if="column.key === 'tip_item'">
                        <a-tooltip placement="top" :title='text'>
                            <div class="ell" style="max-width: 160px">{{text || '-'}}</div>
                        </a-tooltip>
                    </template>
                    <template v-if="column.key === 'time'">
                        {{ $Util.timeFilter(text) }}
                    </template>
                </template>
            </a-table>
        </div>
        <!-- <div class="paging-container"></div> -->
    </div>
</div>
</template>

<script>
import Core from '../../core';
export default {
    name: 'MaintainList',
    components: {},
    props: {},
    data() {
        return {};
    },
    watch: {},
    computed: {},
    mounted() {},
    methods: {}
};
</script>

<style lang="less" scoped>
// #MaintainList {}
</style>