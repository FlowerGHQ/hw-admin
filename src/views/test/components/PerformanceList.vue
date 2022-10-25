<template>
    <div class="list-container">
        <div class="title">
            <span>业绩榜单</span>
            <div>
                <div
                    class="tab-item"
                    :class="{'tab-current': currentTab === item.key}"
                    v-for="(item, index) in titleTabs"
                    :key="index"
                    @click="clickTab(item.key)">
                    {{ item.label }}
                </div>
            </div>
        </div>
        <!-- <div class="contain"> -->
            <!-- table -->
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :pagination='false'
                    :row-key="record => record.id"
                    :indentSize='0'
                >
                    <template #bodyCell="{ column, text , index, record }">
                        <template v-if="column.key === 'index'">
                            <span>{{index + 1}}</span>
                        </template>
                        <template v-if="column.key === 'name'">
                            <span>{{ text }}</span>
                        </template>
                        <template v-if="column.key === 'winNum'">
                            <span>{{ text }}</span>
                        </template>
                        <template v-if="column.key === 'myGap'">
                            <span>{{ text }}</span>
                        </template>
                    </template>
                </a-table>
            </div>

        <!-- </div> -->
    </div>
</template>

<script>
import Core from '../../../core';
import { Chart } from '@antv/g2'

export default {
    name: 'Card',
    components: {
    },
    props: {
        info: {
            type: Object,
            default: ()=> {}
        },
        tableData: {
            type: Object,
            default: ()=> [{ name: '1', winNum: '2', myGap: '3' }]
        },
        type: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            titleTabs: [
                { label: '本月', key: '1' },
                { label: '本年', key: '2' },
            ],
            currentTab: '1',


            searchForm: {
                search_type: 1,
            },
            tableData: [],

        };
    },
    watch: {},
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: '排名', dataIndex: 'index', key: 'index' },
                { title: '人员名字', dataIndex: 'user_name', key: 'name' },
                { title: '赢单数量', dataIndex: 'count', key: 'winNum' },
                { title: '合同总金额', dataIndex: 'money', key: 'myGap' },
            ]
            return tableColumns
        },
    },
    created() {
    },
    mounted() {
        this.performanceList()
    },
    methods: {
        // 点击tab
        clickTab(key) {
            this.currentTab = key;
            this.searchForm.search_type = key
            this.performanceList()
            console.log('切换tab >>', key);
        },
        performanceList() {
            Core.Api.CRMDashboard.performanceList({
                ...this.searchForm
            }).then(res => {
                this.tableData = res.list
            })
        }
    }
};
</script>

<style lang="less" scoped>
.title {
    padding: 12px 16px;
    border-bottom: 2px solid #f0f2f5;
    font-size: 16px;
    font-weight: bold;
    .flex(space-between, center, row);
    .tab-item {
        display: inline-block;
        padding: 4px 8px;
        border: 1px solid grey;
        margin-right: 2px;
        font-size: 12px;
        user-select: none;
        cursor: pointer;
        &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            margin-right: 0;
        }
    }
    .tab-current {
        border: 1px solid #006EF9;
        color: #006EF9;
    }
}
.contain {
    padding: 16px;
}
.form-item {
    // border: 1px solid red;
    border-bottom: 1px solid #f0f2f5;
    padding: 16px 0;
    .flex(space-between, center, row);
    .form-label {
        font-size: 14px;
    }
    .form-value {
        color: #006EF9;
        font-size: 20px;
    }
}
.chart {
    width: 100%;
    height: auto;
}
.data-body {
    .flex(flex-start, center, row);
    .icon {
        text-align: center;
    }
}
.data-contain {
    flex-grow: 1;
    width: auto;
    .flex(space-between, center, row);
    .info-item {
        .flex(space-between, center);
        .label {
            font-size: 12px;
            color: grey;
        }
        .value {
            font-size: 24px;
            font-weight: bold;
            color: black;
        }
    }
}
</style>
