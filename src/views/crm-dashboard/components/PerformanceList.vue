<template>
    <div class="list-container">
        <div class="title">
            <span>{{ $t('crm_dash.results_list') }}</span>
            <div>
                <div class="select-item">
                    <a-select default-value="1" style="width: 80px" @change="handleChange">
                        <a-select-option value="1">
                            {{ $t('crm_def.month') }}
                        </a-select-option>
                        <a-select-option value="2">
                            {{ $t('crm_def.year') }}
                        </a-select-option>
                    </a-select>
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
                :pagination="false"
                :row-key="record => record.id"
                :indentSize="0"
            >
                <template #headerCell="{ title }">
                    {{ $t(title) }}
                </template>
                <template #bodyCell="{ column, text, index, record }">
                    <template v-if="column.key === 'index'">
                        <span>{{ index + 1 }}</span>
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
import { Chart } from '@antv/g2';

export default {
    name: 'Card',
    components: {},
    props: {
        searchForm: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            search_type: 1,
            tableData: [],
        };
    },
    watch: {
        searchForm: {
            deep: true,
            immediate: true,
            handler(n) {
                this.performanceList();
            },
        },
    },
    computed: {
        tableColumns() {
            let tableColumns = [
                { title: 'crm_def.ranking', dataIndex: 'index', key: 'index' },
                { title: 'crm_def.staff_name', dataIndex: 'user_name', key: 'name' },
                { title: 'crm_def.win_number', dataIndex: 'count', key: 'winNum' },
                { title: 'crm_def.total_contract_amount', dataIndex: 'money', key: 'myGap' },
            ];
            return tableColumns;
        },
    },
    created() {},
    mounted() {
        this.performanceList();
    },
    methods: {
        handleChange(value) {
            this.search_type = value;
            this.performanceList();
        },
        // 点击tab
        clickTab(key) {
            this.currentTab = key;
            this.search_type = key;
            this.performanceList();
            console.log('切换tab >>', key);
        },
        performanceList() {
            Core.Api.CRMDashboard.performanceList({
                ...this.searchForm,
                search_type: this.search_type,
            }).then(res => {
                this.tableData = res.list;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.title {
    padding: 12px 16px;
    border-bottom: 2px solid #f0f2f5;
    font-size: 16px;
    font-weight: bold;
    .flex(space-between, center, row);

    // .tab-item {
    //     display: inline-block;
    //     padding: 4px 8px;
    //     border: 1px solid grey;
    //     margin-right: 2px;
    //     font-size: 12px;
    //     user-select: none;
    //     cursor: pointer;

    //     &:first-child {
    //         border-top-left-radius: 4px;
    //         border-bottom-left-radius: 4px;
    //     }

    //     &:last-child {
    //         border-top-right-radius: 4px;
    //         border-bottom-right-radius: 4px;
    //         margin-right: 0;
    //     }
    // }

    //     .tab-current {
    //         border: 1px solid #006EF9;
    //         color: #006EF9;
    //     }
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
        color: #006ef9;
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
