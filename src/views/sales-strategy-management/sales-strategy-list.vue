<template>
    <div class="sales-strategy-list">
        <div class="list-container">
            <div class="title-container">
                <div class="title-area">销售策略</div>
            </div>
            <div class="search-container">
                <SearchAll
                    :options="searchList"
                    @search="getSearchFrom"
                    @reset="handleSearchReset"
                    :isShowMore="false" />
            </div>
            <div class="operate-container">
                <a-button type="primary" @click="addStrategy">
                    <template #icon>
                        <plus-outlined />
                    </template>
                    新增策略
                </a-button>
            </div>
            <div class="table-container">
                <a-table
                    :columns="tableColumns"
                    :data-source="tableData"
                    :scroll="{ x: true }"
                    :loading="loading"
                    :row-key="(record) => record.id"
                    :pagination="false">
                    <template #bodyCell="{ column, text, record, index }">
                        <!-- 
                            序号的计算方式:当前的页数-1*每页的条数+当前的索引+1
                         -->
                        <template v-if="column.dataIndex === 'serial_number'">
                            {{
                                (pagination.current - 1) * pagination.size +
                                index +
                                1
                            }}
                        </template>
                        <!-- 策略名称 -->
                        <template v-if="column.dataIndex === 'strategy_name'">
                            <!-- 超过5个字符 -->
                            <div
                                class="strategy_name-cell"
                                v-if="text.length > 5">
                                <a-tooltip placement="topLeft" :title="text">
                                    {{ text }}
                                </a-tooltip>
                            </div>
                            <div class="strategy_name-cell-common" v-else>
                                {{ text }}
                            </div>
                        </template>
                        <!-- 地区赠品 -->
                        <template v-if="column.dataIndex === 'area_and_gift'">
                            <!-- 超过5个字符 -->
                            <div
                                class="strategy_name-cell-wrap"
                                v-if="text.length > 20">
                                <a-tooltip placement="topLeft" :title="text">
                                    {{ text }}
                                </a-tooltip>
                            </div>
                            <div class="strategy_name-cell-common" v-else>
                                {{ text }}
                            </div>
                        </template>
                        <!-- 操作 -->
                        <template v-if="column.dataIndex === 'operation'">
                            <!-- 启用 -->
                            <a-button type="link">{{
                                $t("sales-strategy-management.enable")
                            }}</a-button>
                            <!-- 删除 -->
                            <a-button type="link">{{
                                $t("sales-strategy-management.delete")
                            }}</a-button>
                            <!-- 查看编辑 -->
                            <a-button type="link">{{
                                $t("sales-strategy-management.view_and_edit")
                            }}</a-button>
                        </template>
                    </template>
                </a-table>
            </div>
            <div class="paging-container">
                <a-pagination
                    v-model:current="pagination.current"
                    :page-size="pagination.size"
                    :total="pagination.total"
                    show-quick-jumper
                    show-size-changer
                    show-less-items
                    :show-total="
                        (total) =>
                            $t('n.all_total') +
                            ` ${pagination.total} ` +
                            $t('in.total')
                    "
                    :hide-on-single-page="false"
                    :pageSizeOptions="['10', '20', '30', '40']"
                    @change="onPageChange"
                    @showSizeChange="onSizeChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import SearchAll from "@/components/common/SearchAll.vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import Core from "../../core";
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
// 使用useTable
import { useTable } from "@/hooks/useTable";
import { useI18n } from "vue-i18n";
const $t = useI18n().t;
const $i18n = useI18n();
const request = () =>
    new Promise((resolve, reject) => {
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push({
                id: 1,
                serial_number: 1,
                strategy_name:
                    "测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1测试1",
                type: "整车",
                gift_rule: "测试1",
                area_and_gift:
                    "【美国】说明书（45435435454）、充电线（werwerwer）、充电器（werwerwer）、充电头（werwerwer）",
                creation_time: "2021-08-09 10:00:00",
                effective_status: "有效",
            });
        }
        setTimeout(() => {
            resolve({
                count: 10,
                list: arr,
            });
        }, 1000);
    });

const {
    loading,
    tableData,
    pagination,
    search,
    onSizeChange,
    refreshTable,
    onPageChange,
    searchParam,
} = useTable({ request });

const tableColumns = computed(() => {
    let columns = [
        {
            title: $t("sales-strategy-management.serial_number"),
            dataIndex: "serial_number",
            width: 80,
            fixed: "left",
            align: "center",
        },
        {
            title: $t("sales-strategy-management.strategy_name"),
            dataIndex: "strategy_name",
            key: "strategy_name",
        },
        {
            title: $t("sales-strategy-management.type"),
            dataIndex: "type",
            key: "type",
        },
        {
            title: $t("sales-strategy-management.gift_rule"),
            dataIndex: "gift_rule",
            key: "gift_rule",
        },
        {
            title: $t("sales-strategy-management.area_and_gift"),
            dataIndex: "area_and_gift",
            key: "area_and_gift",
        },
        {
            title: $t("sales-strategy-management.creation_time"),
            dataIndex: "creation_time",
            key: "creation_time",
        },
        {
            title: $t("sales-strategy-management.area_and_gift"),
            dataIndex: "effective_status",
            key: "effective_status",
        },
        {
            title: $t("sales-strategy-management.operation"),
            dataIndex: "operation",
            key: "operation",
            fixed: "right",
            width: 200,
        },
    ];
    return columns;
});

const searchList = ref([
    {
        id: 0,
        type: "input",
        value: "",
        searchParmas: "strategy_name",
        key: "sales-strategy.strategy_name",
    }, // 名称
    {
        id: 2, // 随意
        type: "select-search-multiple", // 类型
        key: "sales-strategy.area", // 名称
        value: undefined, // 绑定值
        searchParmas: "area", // 返回的搜索名称
        multiple:true, // 是否多选
        selectMap: [
            {
                label: $i18n.locale.value == "zh" ? "美国" : "US",
                value: 1, // a-select-option 中的 :value="item.value"  // 固定的
            },
            {
                label: $i18n.locale.value == "zh" ? "英国" : "UK",
                value: 2, // a-select-option 中的 :value="item.value"  // 固定的
            },
            {
                label: $i18n.locale.value == "zh" ? "中国" : "China",
                value: 3, // a-select-option 中的 :value="item.value"  // 固定的
            },
            {
                label: $i18n.locale.value == "zh" ? "俄罗斯" : "Russia",
                value: 4, // a-select-option 中的 :value="item.value"  // 固定的
            },
        ],
        placeholder: "def.select",
    },
]);
const getSearchFrom = (data) => {
    console.log(data);
};
const addStrategy = () => {
    console.log("新增策略");
};
</script>

<style lang="less" scoped>
.sales-strategy-list {
    .search-container {
        padding: 0;
    }
}
:deep(.ant-table-cell) {
    .strategy_name-cell {
        width: 100px;
        // 超出隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    }
    .strategy_name-cell-wrap {
        width: 150px;
        cursor: pointer;
        // 超过两行隐藏并显示省略号
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: normal;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
</style>
